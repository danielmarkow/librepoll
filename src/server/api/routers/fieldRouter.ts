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
});
