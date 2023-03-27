import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const formRouter = createTRPCRouter({
  createForm: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const createdForm = await ctx.prisma.form.create({
        data: {
          name: input.name,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return { id: createdForm.id };
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
        // include: { fields: { include: { options: true } } },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
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
  getPublicForm: publicProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.form.findFirst({
        where: { id: input.formId, public: true },
        select: {
          id: true,
          name: true,
          description: true,
          updatedAt: true,
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
          description: true,
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
          description: true,
        },
      });
    }),
  updateForm: protectedProcedure
    .input(
      z.object({
        formId: z.string().cuid(),
        formName: z.string().min(5),
        formDescription: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const formToUpate = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });

      if (formToUpate) {
        const updatedForm = await ctx.prisma.form.update({
          where: { id: input.formId },
          data: {
            name: input.formName,
            description: input.formDescription,
          },
        });
        return { id: updatedForm.id };
      }

      throw new TRPCError({
        code: "FORBIDDEN",
        message: "you are not authorized to access",
      });
    }),
  updateFormVisibility: protectedProcedure
    .input(z.object({ formId: z.string().cuid(), public: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const formToUpdate = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });

      if (formToUpdate) {
        const updatedForm = await ctx.prisma.form.update({
          where: { id: input.formId },
          data: {
            public: input.public,
          },
        });
        return { id: updatedForm.id };
      }
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "you are not authorized to access",
      });
    }),
  deleteForm: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const formToDelete = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });
      if (formToDelete) {
        const deletedForm = await ctx.prisma.form.delete({
          where: { id: input.formId },
        });
        return { id: deletedForm.id };
      }

      throw new TRPCError({
        code: "FORBIDDEN",
        message: "you are not authorized to access",
      });
    }),
});
