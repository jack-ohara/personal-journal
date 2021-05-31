import Layout from "../components/layout";
import AuthorisedHomePage from "../components/authorised-home-page";
import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useAppContext } from "../utils/state";

const HomePage = () => {
  const { user } = useAppContext();
  const router = useRouter();

  const [isAuthorised, setIsAuthorised] = useState(false);

  useEffect(() => {
    router.prefetch("/login");

    if (!user) {
      router.push("/login");
    }

    setIsAuthorised(true);
  }, []);

  return <Layout>{isAuthorised && <AuthorisedHomePage />}</Layout>;
};

export default HomePage;
