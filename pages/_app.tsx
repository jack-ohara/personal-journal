import type { AppProps } from "next/app";
import { AppWrapper } from "../utils/state";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
}
