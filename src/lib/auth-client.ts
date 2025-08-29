import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // You can configure baseURL/path if you change the API route.
  // By default, it assumes /api/auth
});

