export const isPathActive = (currentPath, itemPath) => {
   const itemUrl = new URL(itemPath, window.location.origin);
   const itemPathname = itemUrl.pathname;

   return (
      currentPath === itemPathname || currentPath.startsWith(itemPathname + "/")
   );
};