import { randomBytes } from "crypto";

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import {
  GetObjectCommand,
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const createPresignedUrlWithClient = async ({
  region,
  bucket,
  key,
}: {
  region: string;
  bucket: string;
  key: string;
}) => {
  const client = new S3Client({ region, credentials: fromEnv() });
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

const uploadFileToS3 = async ({
  region,
  bucket,
  key,
  fileBody,
}: {
  region: string;
  bucket: string;
  key: string;
  fileBody: string;
}) => {
  const client = new S3Client({ region, credentials: fromEnv() });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBody,
  });
  try {
    return await client.send(command);
  } catch (err) {
    console.error(err);
  }
};

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
  createDownloadLink: protectedProcedure
    .input(z.object({ formId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // check if it is the users form first
      const userForm = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });

      // check if sufficient time has passed since
      // the last request
      const lastRun = await ctx.prisma.lastExtracted.findFirst({
        where: {
          formId: input.formId,
        },
      });

      if (lastRun?.lastExtracted !== undefined) {
        if (Date.now() - lastRun?.lastExtracted.getTime() < 300000) {
          return { downloadLink: "" };
        }
      }

      if (userForm) {
        // TODO select only latest version
        const fileBody = await ctx.prisma.publicFormData.findMany({
          where: { formId: input.formId },
        });

        // construct unique file name
        const key =
          input.formId.slice(0, 5).toString() +
          "-" +
          randomBytes(5).toString("hex") +
          ".json";

        const response = await uploadFileToS3({
          region: "eu-central-1",
          bucket: "librepoll",
          key,
          fileBody: JSON.stringify(fileBody),
        });
        if (response?.$metadata.httpStatusCode === 200) {
          const clientUrl = await createPresignedUrlWithClient({
            region: "eu-central-1",
            bucket: "librepoll",
            key,
          });

          // write extraction timestamp to prevent misuse
          if (lastRun?.lastExtracted === undefined) {
            await ctx.prisma.lastExtracted.create({
              data: {
                formId: input.formId,
                lastExtracted: new Date(),
              },
            });
          } else {
            await ctx.prisma.lastExtracted.update({
              where: { formId: input.formId },
              data: {
                lastExtracted: new Date(),
              },
            });
          }

          return { downloadLink: clientUrl };
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }),
});
