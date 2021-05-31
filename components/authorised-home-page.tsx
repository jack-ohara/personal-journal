import styled from "styled-components";
import Sidebar from "../components/sidebar";
import JournalEditor from "../components/journal-editor";
import useSWR from "swr";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import fetcher from "../utils/fetch";
import { format } from "date-fns";
import { useEntry } from "../backblaze-b2/get-entry";
import { useAppContext } from "../utils/state";

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
  }
`;

interface StoicQuoteResponse {
  body: string;
  author: string;
}

export default function AuthorisedHomePage() {
  const { entry } = useEntry(generateTodaysEntryFileName());

  const { data: randomQuoteData } = useSWR<StoicQuoteResponse>(
    "https://stoicquotesapi.com/v1/api/quotes/random",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const getNewEntryText = () => {
    return `# ${format(new Date(), "do MMMM yyyy")}\n\n> ${
      randomQuoteData?.body
    }\n>\n> \\- ${randomQuoteData?.author}\n\n`;
  };

  const { navIsDisplayed, setNavIsDisplayed } = useAppContext();

  return (
    <>
      <Sidebar />

      <ContentContainer>
        {!navIsDisplayed && (
          <MenuButton onClick={() => setNavIsDisplayed(true)}>
            <div />
            <div />
            <div />
          </MenuButton>
        )}
        <Title>Jack's Journal</Title>

        {entry && randomQuoteData ? (
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
