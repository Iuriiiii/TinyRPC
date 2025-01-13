export function isRawRequest(request: Request) {
  const contentType = request.headers.get("content-type");
  const isApplicationRaw = typeof contentType === "string" && contentType.startsWith("application/raw");

  return isApplicationRaw;
}
