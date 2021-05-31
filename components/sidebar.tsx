import styled from "styled-components";
import React from "react";
import LoadingSpinner from "./loading-spinner";
import NavItem from "./nav-item";
import { useEntries } from "../backblaze-b2/get-entries";
import { useAppContext } from "../utils/state";

const Container = styled.div`
  min-width: 305px;
  min-height: 100%;
  background-color: var(--bg-colour-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
`;

const NavContainer = styled.nav`
  flex-grow: 1;
  position: relative;
  padding: 30px;
  overflow: auto;

  ul {
    padding-left: 5px;
    list-style: none;
  }
`;

const Button = styled.button`
  font-size: 1.3em;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const AuthContainer = styled.div`
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Sidebar = () => {
  const { entries: childItems, isLoading } = useEntries("", "/");
  const { user, logout } = useAppContext();

  const doLogout = async () => {
    await logout();

    window.location.reload();
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingSpinner size="2em" />
      ) : (
        childItems && (
          <NavContainer>
            <ul>
              {childItems.map((e) => (
                <NavItem key={`year-${e}`} name={e} />
              ))}
            </ul>
          </NavContainer>
        )
      )}
      <AuthContainer>
        👋 Hi, {user?.user_metadata.full_name}
        <Button onClick={() => doLogout()}>Logout</Button>
      </AuthContainer>
    </Container>
  );
};

export default Sidebar;
