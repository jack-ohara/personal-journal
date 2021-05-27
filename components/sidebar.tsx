import styled from "styled-components";
import GoTrue from "gotrue-js";

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

interface SidebarProps {
  auth: GoTrue;
}

const Sidebar = ({ auth }: SidebarProps) => {
  const logout = async () => {
    await auth.currentUser()?.logout();

    window.location.reload();
  };

  return (
    <Container>
      <NavContainer>
        Hi, {auth.currentUser()?.user_metadata.full_name}
      </NavContainer>
      <Button onClick={() => logout()}>Logout</Button>
    </Container>
  );
};

export default Sidebar;
