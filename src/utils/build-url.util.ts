export interface GetFullUrlParam {
  host: string;
  path?: string;
  query?: ConstructorParameters<typeof URLSearchParams>[0];
  port?: number;
  https?: boolean;
}

/**
 * Builds a full URL given a param object.
 *
 * @param param - The param object
 * @returns The full URL
 * @example
 * const param = {
 *   host: "example.com",
 *   path: "/path",
 *   query: { foo: "bar" },
 *   https: true,
 * };
 * const url = buildUrl(param);
 * // "https://example.com/path?foo=bar"
 */
export function buildUrl(param: GetFullUrlParam): string {
  const { host, port, path, query, https } = param;
  const protocol = https ? "https://" : "http://";
  const fixedHost = host.startsWith("http://") || host.startsWith("https://") ? host : `${protocol}${host}`;
  const fixedPort = port ? `:${port}` : "";
  const fixedQueryParams = new URLSearchParams(query).toString();
  const fixedQuery = fixedQueryParams ? `?${fixedQueryParams}` : "";
  const fixedPath = !path ? "" : path.startsWith("/") ? path : `/${path}`;

  return `${fixedHost}${fixedPort}${fixedPath}${fixedQuery}`;
}
