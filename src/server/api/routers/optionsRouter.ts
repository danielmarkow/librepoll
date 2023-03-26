import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
// import { TRPCError } from "@trpc/server";

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
        select: {
          id: true,
          value: true,
        },
      });
    }),
  updateOptionState: protectedProcedure
    .input(
      z.object({
        options: z.array(
          z.object({ id: z.string().cuid().optional(), value: z.string() })
        ),
        fieldId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const newOptionState = input.options;
      const currentOptionState = await ctx.prisma.option.findMany({
        where: { fieldId: input.fieldId },
      });

      const optionsToDelete = currentOptionState.map((opt) => {
        return ctx.prisma.option.delete({
          where: { id: opt.id },
          select: {
            id: true,
          },
        });
      });

      const optionsToCreate = newOptionState.map((opt) => {
        return ctx.prisma.option.create({
          data: {
            value: opt.value,
            user: { connect: { id: userId } },
            field: { connect: { id: input.fieldId } },
          },
          select: {
            id: true,
          },
        });
      });

      const deletedOptions = await ctx.prisma.$transaction(optionsToDelete);
      const createdOptions = await ctx.prisma.$transaction(optionsToCreate);

      return { created: createdOptions, deleted: deletedOptions };
    }),
});
