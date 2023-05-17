import { type NextPage } from "next";
import Head from "next/head";
import HeaderComponent from "~/components/HeaderComponent";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>DigitalPass</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderComponent></HeaderComponent>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#4800ff] to-[#00000]">
        <div>Test</div>
      </main>
    </>
  );
};

export default Home;
