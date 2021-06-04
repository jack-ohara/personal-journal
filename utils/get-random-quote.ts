import useSWR from "swr";
import fetcher from "./fetch";

interface SwrReponse {
  quote: StoicQuoteResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface StoicQuoteResponse {
  body: string;
  author: string;
}

export default function getRandomQuote(): SwrReponse {
  const { data, error } = useSWR<StoicQuoteResponse>(
    "https://stoicquotesapi.com/v1/api/quotes/random",
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return {
    quote: data,
    isLoading: !error && !data,
    isError: error,
  };
}
