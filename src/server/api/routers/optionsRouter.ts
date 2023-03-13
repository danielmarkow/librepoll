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
    .mutation(({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

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
});
