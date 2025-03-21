import { Genkit } from "genkit";
import { GenkitPlugin, genkitPlugin } from "genkit/plugin";
import { voiceflowRetriever, voiceflowRetrieverRef } from "./retriever";
import { VoiceflowClient, VoiceflowClientParams } from "./client";
/**
 * Parameters for the Voiceflow plugin.
 */
export interface VoiceflowPluginParams {
  /**
   * Parameters for instantiating `VoiceflowClient`.
   */
  clientParams: VoiceflowClientParams;

  /**
   * Name of the retriever.
   */
  name: string;
}

/**
 * Voiceflow plugin that provides the Voiceflow retriever.
 */
export function voiceflow(params: VoiceflowPluginParams[]): GenkitPlugin {
  return genkitPlugin("voiceflow", async (ai: Genkit) => {
    params.map((i) => {
      const client = new VoiceflowClient(i.clientParams);
      voiceflowRetriever(i.name, client, ai);
    });
  });
}

export { voiceflowRetriever, voiceflowRetrieverRef };

export default voiceflow;
