import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/button";
import Layout from "../components/layout";
import LoadingSpinner from "../components/loading-spinner";
import { useRouter } from "next/dist/client/router";
import { useAppContext } from "../utils/state";

const SignupForm = styled.form`
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

export default function AcceptInvite() {
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [buttonContents, setButtonContents] =
    useState<string | JSX.Element>("Create Account");

  const { user, acceptInvite } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");

    if (user) {
      router.push("/");
    }

    if (router.asPath.includes("#invite_token")) {
      const tokenString = router.asPath.slice(
        router.asPath.indexOf("#invite_token")
      );

      setToken(tokenString.slice(tokenString.indexOf("=") + 1));
    } else {
      router.push("/");
    }
  }, []);

  const doAcceptInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setButtonContents(<LoadingSpinner size="0.67em" />);
    setLoginError(false);

    if (password !== confirmPassword) {
      setLoginError(true);
      return;
    }

    try {
      if (await acceptInvite(token, password)) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setLoginError(true);
      setPassword("");
      setConfirmPassword("");
    } finally {
      setButtonContents("Login");
    }
  };

  return (
    <Layout>
      <SignupForm onSubmit={(e) => doAcceptInvite(e)}>
        <Heading>Create Account</Heading>
        <HorizontalRule />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={loginError}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={loginError}
        />

        {loginError && (
          <ErrorParagraph>
            There was a problem loging in. Make sure your passwords match
          </ErrorParagraph>
        )}

        <Button type="submit" fontSize="1.3em">
          {buttonContents}
        </Button>
      </SignupForm>
    </Layout>
  );
}
