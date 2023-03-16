import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import FormProvider from "~/context/FormProvider";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <FormProvider>
        <Head>
          <title>LibrePoll</title>
          <meta
            name="just polls, no tracking"
            content="poll people without tracking them"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Toaster />
          <Component {...pageProps} />
        </div>
      </FormProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
