import {
  indexerRef,
  indexer,
} from "@genkit-ai/ai/retriever";
import * as z from "zod";
import { VoiceflowClient } from "./client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { basename } from "path";

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
) {

  return indexer(
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
              const filePath = fileURLToPath(mediaItem.url);
              const fileBuffer = readFileSync(filePath);
              const fileName = basename(filePath);
              
              // Determine MIME type based on file extension
              let mimeType = 'application/octet-stream';
              if (fileName.endsWith('.pdf')) {
                mimeType = 'application/pdf';
              } else if (fileName.endsWith('.txt')) {
                mimeType = 'text/plain';
              } else if (fileName.endsWith('.docx')) {
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
              }
              
              const blob = new Blob([fileBuffer], { type: mimeType });
              const file = new File([blob], fileName, { type: mimeType });
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

