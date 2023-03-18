import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const optionsRouter = createTRPCRouter({
  createOption: protectedProcedure
    .input(
      z.object({
        fieldId: z.string().cuid(),
        options: z.array(z.object({ value: z.string() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      console.log("input: ", input.options);

      const optionsToCreate = input.options.map((opt) => {
        return ctx.prisma.option.create({
          data: {
            value: opt.value,
            user: { connect: { id: userId } },
            field: { connect: { id: input.fieldId } },
          },
        });
      });

      return ctx.prisma.$transaction(optionsToCreate);
    }),
  getOptions: protectedProcedure
    .input(z.object({ fieldId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      return ctx.prisma.option.findMany({
        where: { fieldId: input.fieldId, userId },
      });
    }),
  updateOptions: protectedProcedure
    .input(
      z.object({
        options: z.array(
          z.object({ id: z.string().cuid(), value: z.string() })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      const optionsToUpdate = input.options.map((opt) => {
        return ctx.prisma.option.update({
          where: { id: opt.id },
          data: {
            value: opt.value,
          },
        });
      });

      return ctx.prisma.$transaction(optionsToUpdate);
    }),
});
