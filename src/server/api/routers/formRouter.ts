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
  getForm: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.form.findFirst({
        where: { AND: [{ id: input.formId }, { userId }] },
        include: { fields: { include: { options: true } } },
      });
    }),
  getAllForms: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session?.user?.id;
    return ctx.prisma.form.findMany({
      where: { userId },
    });
  }),
  // TODO find better names for procedures
  getOnlyForm: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.form.findFirst({
        where: { AND: [{ id: input.formId }, { userId }] },
        select: {
          name: true,
        },
      });
    }),
  updateForm: protectedProcedure
    .input(z.object({ formId: z.string().cuid(), formName: z.string().min(5) }))
    .mutation(({ ctx, input }) => {
      // const userId = ctx.session?.user?.id;
      // TODO verify that user owns it
      return ctx.prisma.form.update({
        where: { id: input.formId },
        data: {
          name: input.formName,
        },
      });
    }),
});
