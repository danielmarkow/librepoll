import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const fieldRouter = createTRPCRouter({
  createField: protectedProcedure
    .input(
      z.object({
        formId: z.string().cuid(),
        fieldName: z.string(),
        fieldLabel: z.string(),
        fieldType: z.string(),
        fieldRequired: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      const { formId, fieldName, fieldLabel, fieldType, fieldRequired } = input;
      return ctx.prisma.field.create({
        data: {
          form: { connect: { id: formId } },
          user: { connect: { id: userId } },
          name: fieldName,
          label: fieldLabel,
          type: fieldType,
          required: fieldRequired === "yes" ? true : false,
        },
      });
    }),
  // to create radios
  createMultipleFields: protectedProcedure
    .input(
      z.array(
        z.object({
          formId: z.string().cuid(),
          fieldName: z.string(),
          fieldLabel: z.string(),
          fieldType: z.string(),
          fieldRequired: z.string(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const fieldsToCreate = input.map((inp) =>
        ctx.prisma.field.create({
          data: {
            form: { connect: { id: inp.formId } },
            user: { connect: { id: userId } },
            name: inp.fieldName,
            label: inp.fieldLabel,
            type: inp.fieldType,
            required: inp.fieldRequired === "yes" ? true : false,
          },
        })
      );

      return ctx.prisma.$transaction(fieldsToCreate);
    }),
  deleteField: protectedProcedure
    .input(z.object({ fieldId: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.field.delete({
        where: { id: input.fieldId },
      });
    }),
  getField: protectedProcedure
    .input(z.object({ fieldId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      // TODO check if user owns it
      const userId = ctx.session?.user?.id;
      return ctx.prisma.field.findFirst({
        where: { id: input.fieldId },
      });
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().cuid(),
        fieldName: z.string(),
        fieldLabel: z.string(),
        fieldType: z.string(),
        fieldRequired: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // const userId = ctx.session?.user?.id;
      const { fieldId, fieldName, fieldLabel, fieldType, fieldRequired } =
        input;
      // TODO verify that user owns it
      return ctx.prisma.field.update({
        where: { id: fieldId },
        data: {
          name: fieldName,
          label: fieldLabel,
          type: fieldType,
          required: fieldRequired === "yes" ? true : false,
        },
      });
    }),
});
