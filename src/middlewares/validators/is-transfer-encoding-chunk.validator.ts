export function isTransferEncodingChunk(request: Request) {
  const transferEncoding = request.headers.get("transfer-encoding");
  const isChunkedTransferEncoding = typeof transferEncoding === "string" && transferEncoding.startsWith("chunked");

  return isChunkedTransferEncoding;
}
