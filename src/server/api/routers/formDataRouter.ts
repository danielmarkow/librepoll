import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const formDataRouter = createTRPCRouter({
  createEntry: publicProcedure
    .input(
      z.object({
        formId: z.string().cuid(),
        updatedAt: z.date(),
        submission: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.publicFormData.create({
        data: {
          form: { connect: { id: input.formId } },
          lastUpdatedForm: input.updatedAt,
          submission: input.submission,
        },
      });
    }),
});
