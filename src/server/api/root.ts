import { createTRPCRouter } from "~/server/api/trpc";
import { formRouter } from "./routers/formRouter";
import { fieldRouter } from "./routers/fieldRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form: formRouter,
  field: fieldRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
