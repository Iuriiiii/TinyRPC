export interface GetFullUrlParam {
  host: string;
  path?: string;
  query?: ConstructorParameters<typeof URLSearchParams>[0];
  port?: number;
  https?: boolean;
}

export function getFullUrl(param: GetFullUrlParam) {
  const { host, port, path, query, https } = param;
  const protocol = https ? "https://" : "http://";
  const fixedHost = host.startsWith("http://") || host.startsWith("https://") ? host : `${protocol}${host}`;
  const fixedPort = port ? `:${port}` : "";
  const fixedQuery = new URLSearchParams(query).toString();
  const fixedPath = !path ? "" : path.startsWith("/") ? path : `/${path}`;

  return `${fixedHost}${fixedPort}${fixedPath}?${fixedQuery}`;
}