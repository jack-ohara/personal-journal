import { useEffect, useState } from "react";
import styled from "styled-components";
import generateTodaysEntryFileName from "../personal-journal/file-name-generator";
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

const SaveButton = styled.button`
  width: 100%;
  margin-top: 0;
  border: none;
  padding: 0.6em;
  border-radius: 0 0 3px 3px;
  background-color: var(--bg-colour-secondary);
  color: var(--text-colour-secondary);
  font-size: 1.9em;
  transition: all 0.15s ease-in-out;
  transition: transform 0.07s ease-in-out;

  &:hover,
  &:active,
  &:focus {
    background-color: #00515d;
  }

  &:active {
    transform: translateY(2px);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.7;
  }
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

      <SaveButton disabled={editorIsDisabled} onClick={() => saveEntry()}>
        {buttonContents}
      </SaveButton>
    </EditorContainer>
  );
};

export default JournalEditor;
