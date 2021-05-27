import { useEffect, useState } from "react";
import styled from "styled-components";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import Button from "./button";
import CustomMarkdownEditor from "./custom-markdown-editor";
import LoadingSpinner from "./loading-spinner";

const EditorContainer = styled.section`
  flex-grow: 1;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: white;
`;

interface JournalEditorProps {
  editorStartValue?: string;
  editingIsDisabled?: boolean;
}

const JournalEditor = ({
  editorStartValue = "",
  editingIsDisabled = false,
}: JournalEditorProps) => {
  const [value, setValue] = useState(editorStartValue);
  const [editorIsDisabled, setEditorIsDisabled] = useState(editingIsDisabled);
  const [buttonContents, setButtonContents] =
    useState<string | JSX.Element>("Save");

  useEffect(() => {
    setValue(editorStartValue);
    setEditorIsDisabled(false);
  }, [editorStartValue]);

  const saveEntry = async () => {
    setEditorIsDisabled(true);
    setButtonContents(<LoadingSpinner size="0.8em" />);

    const response = await fetch(
      `api/entries/${encodeURIComponent(generateTodaysEntryFileName())}`,
      {
        method: "POST",
        body: JSON.stringify({ file: btoa(value) }),
      }
    );

    if (!response.ok) {
      console.error(response);
      response.json().then((body) => console.log(body));
    }

    window.location.reload();
  };

  return (
    <EditorContainer>
      <CustomMarkdownEditor
        value={value}
        setValue={setValue}
        disabled={editorIsDisabled}
      />

      <Button disabled={editorIsDisabled} onClick={() => saveEntry()}>
        {buttonContents}
      </Button>
    </EditorContainer>
  );
};

export default JournalEditor;
