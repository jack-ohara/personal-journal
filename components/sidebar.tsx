import styled from "styled-components";
import * as NetlifyIdentity from "netlify-identity-widget";

const Container = styled.div`
  min-width: 400px;
  min-height: 100%;
  background-color: var(--bg-colour-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NavContainer = styled.nav`
  flex-grow: 1;
`;

const Button = styled.button`
  padding: 1em;
  font-size: 1.3em;
`;

const Sidebar = () => {
  return (
    <Container>
      <NavContainer>
        Hi, {NetlifyIdentity.currentUser()?.user_metadata.full_name}
      </NavContainer>
      <Button onClick={() => NetlifyIdentity.logout()}>Logout</Button>
    </Container>
  );
};

export default Sidebar;
