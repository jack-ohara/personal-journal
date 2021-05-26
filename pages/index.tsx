import styled from "styled-components";
import Sidebar from "../components/sidebar";
import Layout from "../components/layout";
import JournalEditor from "../components/journal-editor";
import useSWR from "swr";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import fetcher from "../utils/fetch";
import { format } from "date-fns";

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

const HomePage = () => {
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

  return (
    <Layout>
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
    </Layout>
  );
};

export default HomePage;
