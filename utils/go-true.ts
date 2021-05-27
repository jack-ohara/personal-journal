import GoTrue, { GoTrueInit } from "gotrue-js";

export function getGoTrue() {
  const goTrueConfig: GoTrueInit = {
    APIUrl: "https://www.journal.jackohara.io/.netlify/identity",
  };

  return new GoTrue(goTrueConfig);
}
