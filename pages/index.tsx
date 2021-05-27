import Layout from "../components/layout";
import AuthorisedHomePage from "../components/authorised-home-page";
import Login from "../components/login";
import { useEffect, useState } from "react";
import { getGoTrue } from "../utils/go-true";

const HomePage = () => {
  const auth = getGoTrue();

  const [isAuthorised, setIsAuthorised] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser();

    if (!currentUser) {
      return;
    }

    setIsAuthorised(true);
  }, []);

  return (
    <Layout>
      {isAuthorised ? (
        <AuthorisedHomePage auth={auth} />
      ) : (
        <Login auth={auth} />
      )}
    </Layout>
  );
};

export default HomePage;
