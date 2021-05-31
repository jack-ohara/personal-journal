import styled from "styled-components";
import Button from "../components/button";
import Layout from "../components/layout";
import LoadingSpinner from "../components/loading-spinner";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useAppContext } from "../utils/state";

const LoginForm = styled.form`
  margin: auto auto;
  padding: 1em;
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const Heading = styled.h2`
  font-size: 2em;
  margin: 0;
`;

const HorizontalRule = styled.hr`
  margin: 0;
`;

const Input = styled.input`
  font-size: 1.2em;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid ${(props: InputStyleProps) => (props.error ? "red" : "")};
`;

const ErrorParagraph = styled.p`
  color: red;
`;

interface InputStyleProps {
  error: boolean;
}

export default function Login() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [buttonContents, setButtonContents] =
    useState<string | JSX.Element>("Login");

  const { user, login } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");

    if (user) {
      router.push("/");
    }
  });

  const doLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setButtonContents(<LoadingSpinner size="0.67em" />);
    setLoginError(false);

    try {
      if (await login(emailAddress, password)) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setLoginError(true);
      setPassword("");
    } finally {
      setButtonContents("Login");
    }
  };

  return (
    <Layout>
      <LoginForm onSubmit={(e) => doLogin(e)}>
        <Heading>Login</Heading>
        <HorizontalRule />
        <Input
          type="email"
          placeholder="Email address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
          error={loginError}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={loginError}
        />

        {loginError && (
          <ErrorParagraph>
            There was a problem loging in. Check your details and try again
          </ErrorParagraph>
        )}

        <Button type="submit" fontSize="1.3em">
          {buttonContents}
        </Button>
      </LoginForm>
    </Layout>
  );
}
