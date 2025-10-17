import "@/styles/globals.css";
import "@fontsource/galindo";
import "@fontsource/beiruti";
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Profitly</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
