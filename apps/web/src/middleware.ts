import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Auth is temporarily disabled so the app shell can be built without a session.
  context.locals.user = null;
  context.locals.session = null;
  return next();
});
