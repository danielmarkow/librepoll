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
  const client = new S3Client({ region });
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
  const client = new S3Client({ region });
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
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // check if it is the users form first
      const userForm = await ctx.prisma.form.findFirst({
        where: { id: input.formId, userId },
      });
      // TODO select only latest version
      if (userForm) {
        const fileBody = ctx.prisma.publicFormData.findMany({
          where: { formId: input.formId },
        });

        const response = await uploadFileToS3({
          region: "eu-central-1",
          bucket: "librepoll",
          key: "test.json",
          fileBody,
        });
        if (response?.$metadata.httpStatusCode === 200) {
          const clientUrl = createPresignedUrlWithClient({
            region: "eu-central-1",
            bucket: "librepoll",
            key: "test.json",
          });

          return { downloadLink: clientUrl };
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }),
});
