import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const formDataRouter = createTRPCRouter({
  createEntry: publicProcedure
    .input(
      z.object({
        formId: z.string().cuid(),
        updatedAt: z.date(),
        submission: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createdForm = await ctx.prisma.publicFormData.create({
        data: {
          form: { connect: { id: input.formId } },
          lastUpdatedForm: input.updatedAt,
          submission: input.submission,
        },
      });

      return { id: createdForm.id };
    }),
  getFormData: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // check if it is the users form first
      const userForm = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });
      // TODO select only latest version
      if (userForm) {
        return ctx.prisma.publicFormData.findMany({
          where: { formId: input.formId },
        });
      }

      throw new TRPCError({
        code: "FORBIDDEN",
        message: "you are not authorized to access",
      });
    }),
});
