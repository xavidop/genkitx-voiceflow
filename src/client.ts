import { QuerySettings } from "./retriever";

/**
 * Configures a Voiceflow vector store retriever.
 */
export interface VoiceflowClientParams {
  apiKey: string;
}

/**
 * Type for the search function's return value.
 */
export interface SearchResult {
  output: string;
  chunks: Array<{
    score: number;
    chunkID: string;
    documentID: string;
    content: string;
    source: {
      type: string;
      name: string;
      url: string;
      tags: string[];
    };
  }>;
  queryTokens: number;
  answerTokens: number;
  totalTokens: number;
}

export class VoiceflowClient {
  private clientParams: VoiceflowClientParams;

  constructor(clientParams: VoiceflowClientParams) {
    this.clientParams = clientParams;
  }

  async search(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: { limit: number; filters?: any },
    querySettings: QuerySettings,
    question: string,
  ): Promise<SearchResult> {
    const url = "https://general-runtime.voiceflow.com/knowledge-base/query";
    const fetchOptions = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `${this.clientParams.apiKey}`,
      },
      body: JSON.stringify({
        chunkLimit: options.limit,
        synthesis: false,
        settings: querySettings,
        filters: options.filters,
        question: question,
      }),
    };

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`VoiceflowClient search failed: ${response.statusText}`);
    }
    const json = await response.json();
    return json as SearchResult;
  }
}
