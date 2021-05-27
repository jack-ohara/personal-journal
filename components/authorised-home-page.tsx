import styled from "styled-components";
import Sidebar from "../components/sidebar";
import JournalEditor from "../components/journal-editor";
import useSWR from "swr";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import fetcher from "../utils/fetch";
import * as NetlifyIdentity from "netlify-identity-widget";
import { format } from "date-fns";
import { useEffect } from "react";

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

interface EntryResponse {
  entry: string;
}

interface StoicQuoteResponse {
  body: string;
  author: string;
}

export default function AuthorisedHomePage() {
  const { data } = useSWR<EntryResponse>(
    `/api/entries/${encodeURIComponent(generateTodaysEntryFileName())}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

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

  useEffect(() => {
    NetlifyIdentity.close();
  }, []);

  return (
    <>
      <aside>
        <Sidebar />
      </aside>

      <ContentContainer>
        <Title>Jack's Journal</Title>

        {data && randomQuoteData ? (
          <JournalEditor
            editorStartValue={data.entry ? atob(data.entry) : getNewEntryText()}
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
