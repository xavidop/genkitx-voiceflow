import {
  CommonRetrieverOptionsSchema,
  Document,
  retrieverRef,
  retriever,
} from "@genkit-ai/ai/retriever";
import * as z from "zod";
import { VoiceflowClient } from "./client";

const VoiceflowRetrieverOptionsSchema = CommonRetrieverOptionsSchema.extend({
  querySettings: z
    .object({
      model: z.string().default("gpt-4o"),
      temperature: z.number().default(0.7),
      system: z.string().optional(),
    })
    .optional(),
  filters: z.any().optional(),
});

/**
 * Query settings type for the VoiceflowClient.
 */
export interface QuerySettings {
  model: string;
  temperature: number;
  system: string;
}

/**
 * Reference to a Voiceflow retriever.
 */
export const voiceflowRetrieverRef = (params: {
  name: string;
  displayName?: string;
}) => {
  return retrieverRef({
    name: `voiceflow/${params.name}`,
    info: {
      label: params.displayName ?? `Voiceflow - ${params.name}`,
    },
    configSchema: VoiceflowRetrieverOptionsSchema.optional(),
  });
};

export function voiceflowRetriever(
  name: string,
  client: VoiceflowClient,
) {
  return retriever(
    {
      name: `voiceflow/${name}`,
      configSchema: VoiceflowRetrieverOptionsSchema,
    },
    async (content, options) => {
      const querySettings: QuerySettings = {
        model: options.querySettings?.model ?? "gpt-4o",
        temperature: options.querySettings?.temperature ?? 0.7,
        system: options.querySettings?.system ?? "",
      };

      const question = Array.isArray(content.content)
        ? content.content.map(doc => doc.text).join(" ")
        : "";

      const results = await client.search(
        {
          limit: options.k ?? 5,
          filters: options.filters,
        },
        querySettings,
        question,
      );

      const documents = results.chunks.map((result) => {
        const content = result?.content ?? "";
        const metadata = result?.source ?? {};
        return Document.fromText(content as string, metadata).toJSON();
      });

      return {
        documents,
      };
    },
  );
}
