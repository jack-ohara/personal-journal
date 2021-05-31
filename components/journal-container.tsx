import LoadingSpinner from "./loading-spinner";
import styled from "styled-components";
import { Converter } from "showdown";
import { useEntry } from "../backblaze-b2/get-entry";
import { Preview } from "react-mde";

const SpinnerContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const PreviewContainer = styled.div`
  padding: 1em 2em;
`;

interface Props {
  entryName: string;
}

export default function JounralContainer({ entryName }: Props) {
  const { entry, isLoading } = useEntry(entryName);

  const converter = new Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  });

  return (
    <>
      {isLoading ? (
        <SpinnerContainer>
          <LoadingSpinner size="3em" colour="black" />
        </SpinnerContainer>
      ) : (
        entry && (
          <PreviewContainer>
            <Preview
              markdown={converter.makeHtml(entry)}
              minHeight={200}
              heightUnits="px"
              generateMarkdownPreview={(markdown: string) =>
                Promise.resolve(converter.makeHtml(markdown))
              }
            />
          </PreviewContainer>
        )
      )}
    </>
  );
}
