import { useEffect, useState } from "react";
import Layout from "../components/layout";
import * as NetlifyIdentity from "netlify-identity-widget";
import AuthorisedHomePage from "../components/authorised-home-page";
import Login from "../components/login";

const HomePage = () => {
  const [isAuthorised, setIsAuthorised] = useState(false);
  useEffect(() => {
    NetlifyIdentity.init();

    const currentUser = NetlifyIdentity.currentUser();

    if (!currentUser) {
      NetlifyIdentity.on("login", () => setIsAuthorised(true));

      return;
    }

    NetlifyIdentity.on("logout", () => setIsAuthorised(false));

    setIsAuthorised(true);
  }, []);

  return <Layout>{isAuthorised ? <AuthorisedHomePage /> : <Login />}</Layout>;
};

export default HomePage;
