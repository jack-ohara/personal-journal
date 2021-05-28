import Layout from "../components/layout";
import AuthorisedHomePage from "../components/authorised-home-page";
import { useEffect, useState } from "react";
import { getGoTrue } from "../utils/go-true";
import { useRouter } from "next/dist/client/router";

const HomePage = () => {
  const auth = getGoTrue();
  const router = useRouter();

  const [isAuthorised, setIsAuthorised] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
    const currentUser = auth.currentUser();

    if (!currentUser) {
      router.push("/login");
    }

    setIsAuthorised(true);
  }, []);

  return <Layout>{isAuthorised && <AuthorisedHomePage auth={auth} />}</Layout>;
};

export default HomePage;
