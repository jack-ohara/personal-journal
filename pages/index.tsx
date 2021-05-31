import Layout from "../components/layout";
import AuthorisedHomePage from "../components/authorised-home-page";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useAppContext } from "../utils/state";

const HomePage = () => {
  const { user } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/login");

    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    user && (
      <Layout>
        <AuthorisedHomePage />
      </Layout>
    )
  );
};

export default HomePage;
