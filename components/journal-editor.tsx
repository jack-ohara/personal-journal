import styled from "styled-components";
import ReactMde from "react-mde";
import { Converter } from "showdown";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";

const EditorContainer = styled.div`
  flex-grow: 1;
  margin: 0 auto;
  width: 100%;
  padding: 1em 2em;
`;

export interface JournalEditorProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const setTextAreaHeight = () => {
  const editorHeight =
    document.getElementById("editor-container")?.offsetHeight ?? 0;

  document.documentElement.style.setProperty(
    "--textarea-size",
    `${editorHeight - 100}px`
  );
};

const converter = new Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const JournalEditor = ({ value, setValue }: JournalEditorProps) => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    setTextAreaHeight();
  }, []);

  return (
    <EditorContainer id="editor-container">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown: string) =>
          Promise.resolve(converter.makeHtml(markdown))
        }
        classes={{
          textArea: "custom-text-area",
          reactMde: "text-area-container",
          toolbar: "text-area-toolbar",
          preview: "editor-preview",
        }}
      />
    </EditorContainer>
  );
};

export default JournalEditor;
