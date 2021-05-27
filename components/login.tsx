import GoTrue from "gotrue-js";
import styled from "styled-components";
import Button from "./button";
import { FormEvent, useState } from "react";

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
  border: 1px solid;
`;

interface LoginProps {
  auth: GoTrue;
}

export default function Login({ auth }: LoginProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await auth.login(emailAddress, password, true);

    window.location.reload();
  };

  return (
    <LoginForm onSubmit={(e) => login(e)}>
      <Heading>Login</Heading>
      <HorizontalRule />
      <Input
        type="email"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" fontSize="1.3em">
        Log in
      </Button>
    </LoginForm>
  );
}
