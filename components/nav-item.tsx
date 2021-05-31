import styled from "styled-components";
import LoadingSpinner from "./loading-spinner";
import { useState } from "react";
import { useEntries } from "../backblaze-b2/get-entries";

const Container = styled.li`
  width: 100%;
  font-size: 1.6rem;
  font-weight: 600;
  position: relative;
  padding: ${(props: StyleProps) => (props.isFolder ? "5px 0 5px 15px" : "")};
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
`;

const NameContainer = styled.div`
  width: 100%;
  font-size: ${(props: StyleProps) => (props.isFolder ? "1.2em" : "0.9em")};

  &:hover {
    cursor: ${(props: StyleProps) => (props.isFolder ? "pointer" : "initial")};
  }
`;

const FileUnorderedList = styled.ul`
  li:first-of-type {
    padding-bottom: 0;
  }

  li:last-of-type {
    padding-top: 0;
  }

  > li:not(:first-of-type),
  > li:not(:last-of-type) {
    padding: 0 0 0 15px;
  }
`;

interface NavItemProps {
  name: string;
}

interface StyleProps {
  isFolder: boolean;
}

function getDisplayName(name: string): string {
  let displayName = name.endsWith("/") ? name.slice(0, name.length - 1) : name;

  displayName = displayName.replace(/^.*[\\\/]/, "");

  return displayName.replace(/\.[^/.]+$/, "");
}

function isFolder(name: string): boolean {
  return name.endsWith("/");
}

function getKey(name: string): string {
  return isFolder(name) ? `month-${getDisplayName(name)}` : name;
}

export default function NavItem({ name }: NavItemProps) {
  let childEntries: string[] | undefined;
  let isLoading = false;

  const entryIsFolder = isFolder(name);

  if (entryIsFolder) {
    ({ entries: childEntries, isLoading } = useEntries(name, "/"));
  }
  const [displayChildItems, setDisplayChildItems] = useState(false);

  const expandChildren = () => {
    if (!entryIsFolder) {
      return;
    }

    setDisplayChildItems((prev) => !prev);
  };

  return (
    <Container isFolder={entryIsFolder}>
      <NameContainer isFolder={entryIsFolder} onClick={() => expandChildren()}>
        {entryIsFolder ? "📁 " : ""}
        {getDisplayName(name)}
      </NameContainer>

      {displayChildItems &&
        (isLoading ? (
          <LoadingSpinner size="1em" />
        ) : (
          <FileUnorderedList>
            {childEntries &&
              childEntries.map((e) => <NavItem key={getKey(e)} name={e} />)}
          </FileUnorderedList>
        ))}
    </Container>
  );
}
