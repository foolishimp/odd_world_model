export function graphFunctionHandlePath(handle: string): string {
  return handle.replace(/^odd_world_model\./, "").replace(/\./g, "/").replace(/_/g, "-");
}

export function assetNameSlug(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
