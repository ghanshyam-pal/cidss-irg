export const findActiveParentId = (mods, pathname) => {
  for (const mod of mods) {
    if (mod.children?.some((c) => pathname.startsWith(c.path))) return mod.id;
  }
  return null;
};
