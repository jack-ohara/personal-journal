import GoTrue, { GoTrueInit } from "gotrue-js";

export function getGoTrue() {
  const goTrueConfig: GoTrueInit | undefined = process.env.NEXT_PUBLIC_PROD_URL
    ? {
        APIUrl: process.env.NEXT_PUBLIC_PROD_URL,
      }
    : undefined;

  return new GoTrue(goTrueConfig);
}
