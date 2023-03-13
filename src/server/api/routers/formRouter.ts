import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const formRouter = createTRPCRouter({
  createForm: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.form.create({
        data: {
          name: input.name,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
});