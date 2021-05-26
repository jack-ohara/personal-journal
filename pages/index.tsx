import styled from "styled-components";
import Sidebar from "../components/sidebar";
import Layout from "../components/layout";
import JournalEditor from "../components/journal-editor";

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

const HomePage = () => {
  return (
    <Layout>
      <aside>
        <Sidebar />
      </aside>

      <ContentContainer>
        <Title>Jack's Journal</Title>

        <JournalEditor />
      </ContentContainer>
    </Layout>
  );
};

export default HomePage;
