import * as NetlifyIdentity from "netlify-identity-widget";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    NetlifyIdentity.open("login");
  }, []);

  return <div />;
}
