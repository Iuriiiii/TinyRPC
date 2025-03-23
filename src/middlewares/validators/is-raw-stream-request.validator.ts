export function isRawStreamRequest(request: Request) {
  const contentType = request.headers.get("content-type");
  const transferEncoding = request.headers.get("transfer-encoding");
  const isApplicationStream = contentType === "application/raw-stream" && transferEncoding === "chunked";

  return isApplicationStream;
}
