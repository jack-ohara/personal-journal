import styled from "styled-components";
import Sidebar from "../components/sidebar";
import Layout from "../components/layout";
import JournalEditor from "../components/journal-editor";
import useSWR from "swr";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import fetcher from "../utils/fetch";

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

const HomePage = () => {
  const { data } = useSWR<EntryResponse>(
    `/api/entries/${encodeURIComponent(generateTodaysEntryFileName())}`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <Layout>
      <aside>
        <Sidebar />
      </aside>

      <ContentContainer>
        <Title>Jack's Journal</Title>

        {data ? (
          <JournalEditor
            editorStartValue={data.entry ? atob(data.entry) : ""}
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
