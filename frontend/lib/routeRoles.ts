export const ROUTE_ROLES = {
  dashboard: ["ADMIN"],
  exhibitions: ["ADMIN", "USER"],
  visitors: ["ADMIN", "USER"],
  products: ["ADMIN"],
  users: ["ADMIN"],
} as const;
