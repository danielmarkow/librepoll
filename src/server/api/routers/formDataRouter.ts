import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCClientError } from "@trpc/client";

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
  getFormData: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // check if it is the users form first
      const userForm = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });

      if (userForm) {
        return ctx.prisma.publicFormData.findMany({
          where: { formId: input.formId },
        });
      }

      throw new TRPCClientError("form does not belong to user");
    }),
});
