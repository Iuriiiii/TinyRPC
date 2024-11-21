export function isPostRequest(request: Request) {
  return request.method === "POST";
}
