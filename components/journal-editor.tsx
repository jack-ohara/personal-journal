import React, { useEffect, useState } from "react";
import styled from "styled-components";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
import Button from "./button";
import CustomMarkdownEditor from "./custom-markdown-editor";
import JounralContainer from "./journal-container";
import LoadingSpinner from "./loading-spinner";
import { useAppContext } from "../utils/state";

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

  const todaysEntryName = generateTodaysEntryFileName();

  const { selectedEntry } = useAppContext();

  useEffect(() => {
    setValue(editorStartValue);
    setEditorIsDisabled(false);
  }, [editorStartValue]);

  useEffect(() => {}, [selectedEntry]);

  const saveEntry = async () => {
    setEditorIsDisabled(true);
    setButtonContents(<LoadingSpinner size="0.8em" />);

    const response = await fetch(
      `api/entries/${encodeURIComponent(todaysEntryName)}`,
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
      {selectedEntry && selectedEntry !== todaysEntryName ? (
        <JounralContainer entryName={selectedEntry} />
      ) : (
        <>
          <CustomMarkdownEditor
            value={value}
            setValue={setValue}
            disabled={editorIsDisabled}
          />

          <Button disabled={editorIsDisabled} onClick={() => saveEntry()}>
            {buttonContents}
          </Button>
        </>
      )}
    </EditorContainer>
  );
};

export default JournalEditor;
