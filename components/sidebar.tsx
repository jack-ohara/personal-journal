import styled from "styled-components";
import GoTrue from "gotrue-js";
import React from "react";
import LoadingSpinner from "./loading-spinner";
import NavItem from "./nav-item";
import { useEntries } from "../backblaze-b2/get-entries";

const Container = styled.div`
  min-width: 400px;
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

  ul {
    padding-left: 5px;
    list-style: none;

    li {
      position: relative;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 15px;
      box-sizing: border-box;

      &:before {
        position: absolute;
        top: 15px;
        left: 0;
        width: 10px;
        height: 1px;
        margin: auto;
        content: "";
        background-color: black;
      }

      &:after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 100%;
        content: "";
        background-color: black;
      }

      &:last-child:after {
        height: 15px;
      }
    }
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

interface SidebarProps {
  auth: GoTrue;
}

const Sidebar = ({ auth }: SidebarProps) => {
  const { entries: topLevelEntries, isLoading, isError } = useEntries("", "/");

  const logout = async () => {
    await auth.currentUser()?.logout();

    window.location.reload();
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingSpinner size="2em" />
      ) : (
        topLevelEntries && (
          <NavContainer>
            <ul>
              {topLevelEntries.map((e) => (
                <NavItem key={`year-${e}`} name={e} />
              ))}
            </ul>
          </NavContainer>
        )
      )}
      <AuthContainer>
        👋 Hi, {auth.currentUser()?.user_metadata.full_name}
        <Button onClick={() => logout()}>Logout</Button>
      </AuthContainer>
    </Container>
  );
};

export default Sidebar;
