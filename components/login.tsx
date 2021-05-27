import GoTrue from "gotrue-js";
import { FormEvent, useState } from "react";

interface LoginProps {
  auth: GoTrue;
}

export default function Login({ auth }: LoginProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(auth);
    await auth.login(emailAddress, password, true);
    window.location.reload();
  };

  return (
    <form onSubmit={(e) => login(e)}>
      <h2>Log in</h2>
      <hr />
      <input
        type="email"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Log in</button>
    </form>
  );
}
