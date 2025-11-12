export function routerPush(
  redirectUrl: string,
  originalUrl: string,
  params?: any
) {
  // Ensure both URLs start with '/'
  if (originalUrl.includes("isShopify~true")) {
    // if there exists the integration id then remove that from the url
    if (params?.integrationId) {
      originalUrl = originalUrl.substring(0, originalUrl.lastIndexOf("/"));
    }

    // Split the originalPath to get the part before "/main" or the last section
    const pathParts = originalUrl.split("/");
    // Replace the last segment with the new navigationPath
    pathParts[pathParts.length - 1] = redirectUrl.replace(/^\//, "");
    // Join the segments back together to form the new URL
    const parts = pathParts
      .join("/")
      .split("/")
      .filter((_, i) => i !== 2);
    return parts.join("/") ? parts.join("/") : "/";
  }
  // Return the originalPath if 'isShopify~true' is not present
  return redirectUrl ?? "/";
}
