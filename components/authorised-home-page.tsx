import styled from "styled-components";
import Sidebar from "../components/sidebar";
import JournalEditor from "../components/journal-editor";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import { format } from "date-fns";
import { useEntry } from "../backblaze-b2/get-entry";
import { useAppContext } from "../utils/state";
import getRandomQuote from "../utils/get-random-quote";

const Title = styled.h1`
  text-align: center;
  font-family: "Dancing Script", cursive;
  font-size: 2.5em;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  padding: 1em;
  max-height: 100vh;
  overflow: auto;
`;

const MenuButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  background-color: transparent;
  border: none;
  cursor: pointer;

  div {
    border: 2px solid black;
    min-width: 30px;
    border-radius: 6px;
    background-color: black;
  }
`;

export default function AuthorisedHomePage() {
  const { entry, isLoading: entryIsLoading } = useEntry(
    generateTodaysEntryFileName()
  );

  const { quote, isLoading: quoteIsLoading } = getRandomQuote();

  const getNewEntryText = () => {
    return `# ${format(new Date(), "do MMMM yyyy")}\n\n> ${
      quote?.body
    }\n>\n> \\- ${quote?.author}\n\n`;
  };

  const { navIsDisplayed, setNavIsDisplayed } = useAppContext();

  return (
    <>
      <Sidebar />

      <ContentContainer>
        {!navIsDisplayed && (
          <MenuButton
            onClick={() => setNavIsDisplayed(true)}
            title="Open navigation"
          >
            <div />
            <div />
            <div />
          </MenuButton>
        )}
        <Title>Jack's Journal</Title>

        {!entryIsLoading && !quoteIsLoading ? (
          <JournalEditor
            editorStartValue={entry ? entry : getNewEntryText()}
            editingIsDisabled={false}
          />
        ) : (
          <JournalEditor
            editorStartValue="Looking for today's entry..."
            editingIsDisabled
          />
        )}
      </ContentContainer>
    </>
  );
}
