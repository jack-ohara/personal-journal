import styled from "styled-components";
import LoadingSpinner from "./loading-spinner";
import { useState } from "react";
import { useEntries } from "../backblaze-b2/get-entries";
import { useAppContext } from "../utils/state";
import moment from "moment";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";

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

const NameContainer = styled.button`
  width: 100%;
  font-size: ${(props: StyleProps) => (props.isFolder ? "1.2em" : "0.9em")};
  display: flex;
  align-items: center;
  gap: 0.3em;
  color: ${(props: StyleProps) => (props.isFolder ? "#a7d3bf" : "#d7ecd5")};
  background-color: transparent;
  border: none;

  &:hover {
    cursor: pointer;
    text-decoration: ${(props: StyleProps) =>
      props.isFolder ? "initial" : "underline"};
  }

  span {
    font-size: 0.65em;
  }
`;

const FileUnorderedList = styled.ul`
  li {
    padding-left: 15px;
  }

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

  const { user, setSelectedEntry } = useAppContext();

  if (!user) {
    throw new Error("User is not logged in");
  }

  const entryIsFolder = isFolder(name);

  if (entryIsFolder) {
    let unsortedEntries: string[] | undefined;
    ({ entries: unsortedEntries, isLoading } = useEntries(name, "/"));

    if (unsortedEntries) {
      if (isFolder(unsortedEntries[0])) {
        // Assume this is a list of months

        childEntries = unsortedEntries
          .map((entryName) => {
            return {
              name: entryName,
              monthNum: moment().month(getDisplayName(entryName)).format("M"),
            };
          })
          .sort((a, b) => (a.monthNum > b.monthNum ? 1 : -1))
          .map((month) => month.name);
      } else {
        // Add an entry for today if one isn't there
        const todaysEntry = generateTodaysEntryFileName();

        if (!unsortedEntries.includes(todaysEntry)) {
          unsortedEntries.push(todaysEntry);
        }

        childEntries = unsortedEntries;
      }
    }
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
      <NameContainer
        isFolder={entryIsFolder}
        onClick={() =>
          entryIsFolder ? expandChildren() : setSelectedEntry(name)
        }
      >
        {entryIsFolder && <span>📆</span>}
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
