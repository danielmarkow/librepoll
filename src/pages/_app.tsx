import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import FormProvider from "~/context/FormProvider";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

import Navbar from "~/components/Navbar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <FormProvider>
        <Head>
          <title>LibrePoll</title>
          <meta name="simple polls" content="poll people easily and savely" />
          <link rel="icon" href="/librepoll-icon.png" />
        </Head>
        <Navbar />
        <div className="mx-auto mt-3 max-w-7xl sm:px-6 lg:px-8">
          <Toaster />
          <Component {...pageProps} />
        </div>
      </FormProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
