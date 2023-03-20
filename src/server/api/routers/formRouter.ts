import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
  checkIfPublic: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
        select: {
          id: true,
          public: true,
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
  getPublicForm: publicProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.form.findFirst({
        where: { id: input.formId, public: true },
        select: {
          id: true,
          name: true,
          fields: {
            select: {
              id: true,
              name: true,
              label: true,
              type: true,
              required: true,
              options: {
                select: {
                  id: true,
                  value: true,
                },
              },
            },
          },
        },
      });
    }),
  getAllForms: protectedProcedure
    .input(z.object({ public: z.boolean().default(false) }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.form.findMany({
        where: { userId, public: input.public },
        select: {
          id: true,
          name: true,
        },
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
  updateFormVisibility: protectedProcedure
    .input(z.object({ formId: z.string().cuid(), public: z.boolean() }))
    .mutation(({ ctx, input }) => {
      // TODO verify that user owns it
      return ctx.prisma.form.update({
        where: { id: input.formId },
        data: {
          public: input.public,
        },
      });
    }),
});
