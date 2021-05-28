import styled from "styled-components";
import { useState } from "react";
import { useEntries } from "../backblaze-b2/get-entries";
import LoadingSpinner from "./loading-spinner";

const Container = styled.li`
  padding: 0.2em 1em;
  width: 100%;
  font-size: 1.6rem;
  font-weight: 600;
`;

const NameContainer = styled.div`
  width: 100%;
  font-size: ${(props: StyleProps) => (props.isFolder ? "1.2em" : "0.9em")};

  &:hover {
    cursor: ${(props: StyleProps) => (props.isFolder ? "pointer" : "initial")};
  }
`;

interface NavItemProps {
  name: string;
}

interface StyleProps {
  isFolder: boolean;
}

function getDisplayName(name: string) {
  let displayName = name.endsWith("/") ? name.slice(0, name.length - 1) : name;

  displayName = displayName.replace(/^.*[\\\/]/, "");

  return displayName.replace(/\.[^/.]+$/, "");
}

export default function NavItem({ name }: NavItemProps) {
  const {
    entries: childFolders,
    isLoading: foldersIsLoading,
    isError: foldersIsError,
  } = useEntries(name, "/");
  const {
    entries: childEntries,
    isLoading: filesIsLoading,
    isError: filesIsError,
  } = useEntries(name, "");

  const isFolder = name.endsWith("/");
  const [displayChildItems, setDisplayChildItems] = useState(false);

  const expandChildren = () => {
    if (!isFolder) {
      return;
    }

    setDisplayChildItems((prev) => !prev);
  };

  return (
    <Container>
      <NameContainer isFolder={isFolder} onClick={() => expandChildren()}>
        {isFolder ? "📁 " : ""}
        {getDisplayName(name)}
      </NameContainer>

      {displayChildItems &&
        (foldersIsLoading || filesIsLoading ? (
          <LoadingSpinner size="1em" />
        ) : (
          <ul>
            {childFolders &&
              childFolders.map((e) => (
                <NavItem key={`month-${getDisplayName(e)}`} name={e} />
              ))}
            {childEntries &&
              childEntries.map((e) => <NavItem key={`entry-${e}`} name={e} />)}
          </ul>
        ))}
    </Container>
  );
}
