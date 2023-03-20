import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const formSessionRouter = createTRPCRouter({
  createFormSession: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      // TODO check if the form is owned by user?
      return ctx.prisma.publicFormSession.create({
        data: {
          form: {
            connect: { id: input.formId },
          },
        },
      });
    }),
});
