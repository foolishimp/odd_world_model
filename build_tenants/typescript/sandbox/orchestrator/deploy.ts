import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { EXACT_PROVING_PRODUCTS, sha256Digest } from "../../code/src/index.ts";
import {
  assertDeploymentManifest,
  createDeploymentManifest,
  directoryContentDigest,
  type DeploymentDependency,
  type WorldModelDeploymentManifest
} from "../installed/protocol.ts";

const execFileAsync = promisify(execFile);
const thisFile = fileURLToPath(import.meta.url);
const tenantRoot = path.resolve(path.dirname(thisFile), "../..");
const repositoryRoot = path.resolve(tenantRoot, "../..");
const storageRoot = path.resolve(tenantRoot, "../storage/python");

interface SourceFileDigest {
  readonly path: string;
  readonly byte_length: number;
  readonly sha256: `sha256:${string}`;
}

export interface DevelopmentDeploymentOptions {
  readonly deploymentsRoot?: string;
  readonly reuse?: boolean;
  readonly createdAt?: string;
}

function digestBytes(bytes: Buffer): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

async function filesUnder(root: string, relative = ""): Promise<string[]> {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(root, child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

async function sourceInventory(): Promise<readonly SourceFileDigest[]> {
  const roots = [
    { root: path.join(tenantRoot, "code", "src"), prefix: "code/src" },
    { root: path.join(tenantRoot, "sandbox", "installed"), prefix: "sandbox/installed" },
    {
      root: path.join(storageRoot, "code", "odd_world_model_storage"),
      prefix: "storage/python/code/odd_world_model_storage"
    }
  ];
  const entries: SourceFileDigest[] = [];
  for (const source of roots) {
    for (const relative of (await filesUnder(source.root)).filter(
      (candidate) => !candidate.split(path.sep).includes("__pycache__") && !candidate.endsWith(".pyc")
    )) {
      const bytes = await readFile(path.join(source.root, relative));
      entries.push(Object.freeze({
        path: path.posix.join(source.prefix, relative.split(path.sep).join("/")),
        byte_length: bytes.byteLength,
        sha256: digestBytes(bytes)
      }));
    }
  }
  for (const relativePath of [
    "package.json",
    "package-lock.json",
    "../storage/python/pyproject.toml",
    "../storage/python/requirements.lock.txt"
  ]) {
    const absolutePath = path.resolve(tenantRoot, relativePath);
    const bytes = await readFile(absolutePath);
    const prefix = absolutePath.startsWith(storageRoot)
      ? `storage/python/${path.basename(absolutePath)}`
      : path.basename(absolutePath);
    entries.push(Object.freeze({
      path: prefix,
      byte_length: bytes.byteLength,
      sha256: digestBytes(bytes)
    }));
  }
  return Object.freeze(entries.sort((left, right) => left.path.localeCompare(right.path)));
}

async function command(command: string, args: readonly string[], cwd: string): Promise<string> {
  const result = await execFileAsync(command, [...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  return result.stdout.trim();
}

async function packageVersion(packagePath: string): Promise<string> {
  const value = JSON.parse(await readFile(packagePath, "utf8")) as { version?: unknown };
  if (typeof value.version !== "string" || value.version.length === 0) {
    throw new Error(`${packagePath} has no version`);
  }
  return value.version;
}

function dependency(
  packageName: string,
  version: string,
  artifactSha256: `sha256:${string}` | null = null
): DeploymentDependency {
  return Object.freeze({ package_name: packageName, version, artifact_sha256: artifactSha256 });
}

async function findOne(root: string, suffix: string): Promise<string> {
  const matches = (await readdir(root)).filter((name) => name.endsWith(suffix));
  if (matches.length !== 1) throw new Error(`expected one ${suffix} artifact in ${root}, found ${matches.length}`);
  return path.join(root, matches[0]!);
}

async function findPackageArtifact(root: string, prefix: string, suffix: string): Promise<string> {
  const matches = (await readdir(root)).filter(
    (name) => name.startsWith(prefix) && name.endsWith(suffix)
  );
  if (matches.length !== 1) {
    throw new Error(`expected one ${prefix}*${suffix} artifact in ${root}, found ${matches.length}`);
  }
  return path.join(root, matches[0]!);
}

async function artifact(pathname: string, relativePath: string) {
  const bytes = await readFile(pathname);
  return Object.freeze({
    relative_path: relativePath.split(path.sep).join("/"),
    sha256: digestBytes(bytes),
    byte_length: bytes.byteLength
  });
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function installedManifestIfReusable(
  deploymentRoot: string,
  sourceRef: string,
  reuse: boolean
): Promise<WorldModelDeploymentManifest | null> {
  const manifestPath = path.join(deploymentRoot, "deployment-manifest.json");
  try {
    const existing = JSON.parse(await readFile(manifestPath, "utf8")) as WorldModelDeploymentManifest;
    assertDeploymentManifest(existing);
    if (!reuse) throw new Error(`deployment already exists: ${deploymentRoot}`);
    if (existing.source_ref !== sourceRef) throw new Error(`deployment source changed at ${deploymentRoot}`);
    await access(path.join(deploymentRoot, existing.installed_entrypoint));
    await access(path.join(deploymentRoot, existing.storage_python));
    return existing;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function deployDevelopmentProduct(
  options: DevelopmentDeploymentOptions = {}
): Promise<{ readonly root: string; readonly manifest: WorldModelDeploymentManifest }> {
  const createdAt = options.createdAt ?? new Date().toISOString();
  const deploymentsRoot = path.resolve(
    options.deploymentsRoot ?? path.join(tenantRoot, "test_env", "deployments")
  );
  const [commit, dirtyOutput, inventory] = await Promise.all([
    command("git", ["rev-parse", "HEAD"], repositoryRoot),
    command("git", ["status", "--porcelain", "--untracked-files=all"], repositoryRoot),
    sourceInventory()
  ]);
  const sourceState = dirtyOutput.length === 0 ? "clean" as const : "dirty" as const;
  const inventoryDigest = sha256Digest(inventory);
  const sourceRef = `git-commit://odd_world_model/${commit}#${inventoryDigest}`;
  const shortCommit = commit.slice(0, 7);
  const shortInventory = inventoryDigest.slice("sha256:".length, "sha256:".length + 10);
  const version = `0.0.0-development.${shortCommit}.${sourceState}.${shortInventory}`;
  const deploymentRoot = path.join(deploymentsRoot, version);
  const reusable = await installedManifestIfReusable(
    deploymentRoot,
    sourceRef,
    options.reuse ?? true
  );
  if (reusable !== null) return Object.freeze({ root: deploymentRoot, manifest: reusable });

  await mkdir(deploymentsRoot, { recursive: true });
  const buildRoot = await mkdtemp(path.join(os.tmpdir(), "odd-wm-deployment-build-"));
  const temporaryDeployment = `${deploymentRoot}.building-${process.pid}`;
  await rm(temporaryDeployment, { recursive: true, force: true });
  try {
    const packageStage = path.join(buildRoot, "package");
    const artifactStage = path.join(buildRoot, "artifacts");
    await Promise.all([
      mkdir(packageStage, { recursive: true }),
      mkdir(artifactStage, { recursive: true })
    ]);
    await Promise.all([
      cp(path.join(tenantRoot, "code"), path.join(packageStage, "code"), { recursive: true }),
      cp(path.join(tenantRoot, "sandbox", "installed"), path.join(packageStage, "sandbox", "installed"), { recursive: true }),
      cp(path.join(tenantRoot, "node_modules"), path.join(packageStage, "node_modules"), { recursive: true })
    ]);
    const sourcePackage = JSON.parse(await readFile(path.join(tenantRoot, "package.json"), "utf8")) as {
      name: string;
      type: string;
      dependencies: Record<string, string>;
    };
    const dependencies = {
      ...sourcePackage.dependencies,
      [EXACT_PROVING_PRODUCTS.abiogenesis.package_name]: EXACT_PROVING_PRODUCTS.abiogenesis.package_version,
      [EXACT_PROVING_PRODUCTS.odd_glc.package_name]: EXACT_PROVING_PRODUCTS.odd_glc.package_version
    };
    await writeJson(path.join(packageStage, "package.json"), {
      name: sourcePackage.name,
      version,
      private: false,
      type: sourcePackage.type,
      files: ["code/src", "sandbox/installed"],
      bin: { "odd-world-model-sandbox-worker": "sandbox/installed/worker.ts" },
      exports: { ".": "./code/src/index.ts" },
      dependencies,
      bundledDependencies: Object.keys(dependencies).sort()
    });
    await command("npm", ["pack", "--silent", "--pack-destination", artifactStage], packageStage);
    const sourceStoragePython = path.join(storageRoot, ".venv", "bin", "python");
    const storagePackageStage = path.join(buildRoot, "storage-package");
    const pythonWheelhouse = path.join(buildRoot, "python-wheelhouse");
    await Promise.all([
      mkdir(storagePackageStage, { recursive: true }),
      mkdir(pythonWheelhouse, { recursive: true })
    ]);
    await Promise.all([
      cp(
        path.join(storageRoot, "code", "odd_world_model_storage"),
        path.join(storagePackageStage, "code", "odd_world_model_storage"),
        { recursive: true }
      ),
      cp(path.join(storageRoot, "pyproject.toml"), path.join(storagePackageStage, "pyproject.toml"))
    ]);
    await rm(path.join(storagePackageStage, "code", "odd_world_model_storage", "__pycache__"), {
      recursive: true,
      force: true
    });
    await command(sourceStoragePython, ["-m", "pip", "wheel", "--wheel-dir", pythonWheelhouse, storagePackageStage], storagePackageStage);
    const [packageArchive, storageWheel] = await Promise.all([
      findOne(artifactStage, ".tgz"),
      findPackageArtifact(pythonWheelhouse, "odd_world_model_storage-", ".whl")
    ]);

    await mkdir(path.join(temporaryDeployment, "artifacts"), { recursive: true });
    const deployedPackageArchive = path.join(temporaryDeployment, "artifacts", path.basename(packageArchive));
    const deployedStorageWheel = path.join(temporaryDeployment, "artifacts", path.basename(storageWheel));
    await Promise.all([
      cp(packageArchive, deployedPackageArchive),
      cp(storageWheel, deployedStorageWheel),
      mkdir(path.join(temporaryDeployment, "product"), { recursive: true })
    ]);
    await command("tar", ["-xzf", deployedPackageArchive, "--strip-components=1", "-C", path.join(temporaryDeployment, "product")], temporaryDeployment);

    const deployedVenv = path.join(temporaryDeployment, "storage", "venv");
    await command(sourceStoragePython, ["-m", "venv", deployedVenv], temporaryDeployment);
    const deployedPython = path.join(deployedVenv, "bin", "python");
    await command(
      deployedPython,
      ["-m", "pip", "install", "--no-index", "--find-links", pythonWheelhouse, deployedStorageWheel],
      temporaryDeployment
    );
    await command(deployedPython, ["-m", "pip", "check"], temporaryDeployment);

    const directUrlFiles = (await filesUnder(path.join(deployedVenv, "lib")))
      .filter((relative) => relative.endsWith("direct_url.json"));
    await Promise.all(directUrlFiles.map((relative) => rm(path.join(deployedVenv, "lib", relative), { force: true })));

    const installedStoragePackage = await command(
      deployedPython,
      ["-c", "import pathlib, odd_world_model_storage; print(pathlib.Path(odd_world_model_storage.__file__).resolve().parent)"],
      temporaryDeployment
    );
    const canonicalTemporaryDeployment = await realpath(temporaryDeployment);
    if (!installedStoragePackage.startsWith(`${canonicalTemporaryDeployment}${path.sep}`)) {
      throw new Error("clean storage environment resolved outside the deployment root");
    }
    const installedStoragePackagePath = path.relative(
      canonicalTemporaryDeployment,
      installedStoragePackage
    ).split(path.sep).join("/");
    const [installedProductDigest, installedStoragePackageDigest] = await Promise.all([
      directoryContentDigest(path.join(temporaryDeployment, "product")),
      directoryContentDigest(installedStoragePackage)
    ]);

    const packageRelative = path.relative(temporaryDeployment, deployedPackageArchive);
    const storageRelative = path.relative(temporaryDeployment, deployedStorageWheel);
    const [packageArtifact, storageArtifact] = await Promise.all([
      artifact(deployedPackageArchive, packageRelative),
      artifact(deployedStorageWheel, storageRelative)
    ]);
    const exactProductPackages = new Set<string>([
      EXACT_PROVING_PRODUCTS.abiogenesis.package_name,
      EXACT_PROVING_PRODUCTS.odd_glc.package_name
    ]);
    const nodeDependencyVersions = await Promise.all(
      Object.keys(dependencies)
        .filter((name) => !exactProductPackages.has(name))
        .sort()
        .map(async (name) => dependency(
          name,
          await packageVersion(path.join(packageStage, "node_modules", name, "package.json"))
        ))
    );
    const deploymentRef = `deployment://odd_world_model/${version}/${packageArtifact.sha256.slice(-16)}`;
    const manifest = createDeploymentManifest({
      schema_kind: "odd_world_model.deployment_manifest",
      schema_version: "v1",
      deployment_ref: deploymentRef,
      deployment_class: "development_cut",
      product_name: "odd_world_model",
      product_version: version,
      source_ref: sourceRef,
      source_state: sourceState,
      package_artifact: packageArtifact,
      storage_artifact: storageArtifact,
      artifact_base_locator: `deployment-cache://odd_world_model/${version}/`,
      installed_product_digest: installedProductDigest,
      installed_storage_package_digest: installedStoragePackageDigest,
      installed_entrypoint: "product/sandbox/installed/worker.ts",
      storage_python: "storage/venv/bin/python",
      installed_storage_package_path: installedStoragePackagePath,
      protocol_version: "v1",
      dependencies: Object.freeze([
        dependency(
          EXACT_PROVING_PRODUCTS.abiogenesis.package_name,
          EXACT_PROVING_PRODUCTS.abiogenesis.package_version,
          `sha256:${EXACT_PROVING_PRODUCTS.abiogenesis.tarball_sha256}`
        ),
        dependency(
          EXACT_PROVING_PRODUCTS.odd_glc.package_name,
          EXACT_PROVING_PRODUCTS.odd_glc.package_version,
          `sha256:${EXACT_PROVING_PRODUCTS.odd_glc.tarball_sha256}`
        ),
        ...nodeDependencyVersions,
        dependency("odd-world-model-storage", "0.1.0", storageArtifact.sha256),
        dependency("duckdb", "1.4.5"),
        dependency("pyiceberg", "0.11.1"),
        dependency("rfc8785", "0.1.4")
      ]),
      capabilities: Object.freeze({
        native_graph_payload_execution: false,
        calibrated_fp_authorship: false,
        replay_native_semantic_projection: false,
        reference_kernel: true
      }),
      created_at: createdAt
    });
    await writeJson(path.join(temporaryDeployment, "deployment-manifest.json"), manifest);
    await access(path.join(temporaryDeployment, manifest.installed_entrypoint));
    await mkdir(path.dirname(deploymentRoot), { recursive: true });
    await rename(temporaryDeployment, deploymentRoot);
    return Object.freeze({ root: deploymentRoot, manifest });
  } finally {
    await Promise.all([
      rm(buildRoot, { recursive: true, force: true }),
      rm(temporaryDeployment, { recursive: true, force: true })
    ]);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let deploymentsRoot: string | undefined;
  let reuse = true;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "--root") deploymentsRoot = args[++index];
    else if (arg === "--no-reuse") reuse = false;
    else throw new Error(`unknown deployment argument ${arg}`);
  }
  const result = await deployDevelopmentProduct({
    ...(deploymentsRoot === undefined ? {} : { deploymentsRoot }),
    reuse
  });
  process.stdout.write(`${JSON.stringify({ root: result.root, manifest: result.manifest }, null, 2)}\n`);
}

if (path.resolve(process.argv[1] ?? "") === thisFile) await main();
