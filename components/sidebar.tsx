import styled from "styled-components";
import React from "react";
import LoadingSpinner from "./loading-spinner";
import NavItem from "./nav-item";
import { useEntries } from "../backblaze-b2/get-entries";
import { useAppContext } from "../utils/state";

const Container = styled.aside`
  min-width: 305px;
  min-height: 100%;
  background-color: var(--bg-colour-secondary);
  display: ${(props: StyleProps) => (props.isDisplayed ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-between;
  color: white;
  position: absolute;
  z-index: 1;
  box-shadow: 0px 0px 30px 32px rgba(0, 0, 0, 0.42);
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

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const MenuTop = styled.div`
  display: flex;
  align-items: flex-start;
`;

const HideMenuButton = styled(Button)`
  font-weight: 800;
  margin-top: 1em;
  margin-right: 1em;
`;

const AuthContainer = styled.div`
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.2em;
`;

interface StyleProps {
  isDisplayed: boolean;
}

function getSortedYears(entries: string[]): string[] {
  console.table(entries);
  const result = entries.map((e) => e.slice(e.indexOf("/") + 1)).sort();
  console.table(result);
  return result;
}

const Sidebar = () => {
  const { user, logout, navIsDisplayed, setNavIsDisplayed } = useAppContext();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const { entries, isLoading } = useEntries(`${user.email}/`, "/");

  const sortedYears = entries ? getSortedYears(entries) : entries;

  const doLogout = async () => {
    await logout();

    window.location.reload();
  };

  return (
    <Container isDisplayed={navIsDisplayed}>
      <MenuTop>
        {isLoading ? (
          <LoadingSpinner size="2em" />
        ) : (
          sortedYears && (
            <NavContainer>
              <ul>
                {sortedYears.map((e) => (
                  <NavItem key={`year-${e}`} name={e} />
                ))}
              </ul>
            </NavContainer>
          )
        )}

        <HideMenuButton onClick={() => setNavIsDisplayed(false)}>
          {"<<"}
        </HideMenuButton>
      </MenuTop>

      <AuthContainer>
        👋 Hi, {user?.user_metadata.full_name}
        <Button onClick={() => doLogout()}>Logout</Button>
      </AuthContainer>
    </Container>
  );
};

export default Sidebar;
