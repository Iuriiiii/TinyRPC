export function isStreamRequest(request: Request) {
  const contentType = request.headers.get("content-type");
  const transferEncoding = request.headers.get("transfer-encoding");
  const isApplicationStream = contentType === "application/octet-stream" && transferEncoding === "chunked";

  return isApplicationStream;
}
