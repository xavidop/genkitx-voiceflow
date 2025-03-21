import {
  indexerRef,
} from "@genkit-ai/ai/retriever";
import { Genkit } from "genkit";
import * as z from "zod";
import { VoiceflowClient } from "./client";

export const VoiceflowIndexerOptionsSchema = z.null().optional();


/**
 * Reference to a Voiceflow indexer.
 */
export const voiceflowIndexerRef = (params: {
  name: string;
  displayName?: string;
}) => {
  return indexerRef({
    name: `voiceflow/${params.name}`,
    info: {
      label: params.displayName ?? `Voiceflow - ${params.name}`,
    },
    configSchema: VoiceflowIndexerOptionsSchema.optional(),
  });
};
/**
 * Configures a Voiceflow indexer.
 */
export function voiceflowIndexer(
  name: string,
  client: VoiceflowClient,
  ai: Genkit,
) {

  return ai.defineIndexer(
    {
      name: `voiceflow/${name}`,
      configSchema: VoiceflowIndexerOptionsSchema,
    },
    async (docs) => {
      // Upload each document using the VoiceflowClient
      for (const doc of docs) {
        if (doc.media) {
          for (const mediaItem of doc.media) {
            if (mediaItem.url.startsWith("file://")) {
              // Handle local file
              const response = await fetch(mediaItem.url);
              const blob = await response.blob();
              const file = new File([blob], "filename");
              await client.uploadDocument({ type: "file", file: file });
            } else {
              await client.uploadDocument({ type: "url", url: mediaItem.url });
            }
          }
        } else {
          await client.uploadDocument({ type: "url", url: doc.text });
        }
      }
    },
  );
}

