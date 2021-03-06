import Head from "next/head";
import styled from "styled-components";
import { ReactNode } from "react";

const Main = styled.main`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Jack's Journal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Main>{children}</Main>
    </>
  );
};

export default Layout;
