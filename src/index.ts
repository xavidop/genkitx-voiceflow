import { genkitPluginV2, ResolvableAction } from "genkit/plugin";
import { voiceflowRetriever, voiceflowRetrieverRef } from "./retriever";
import { VoiceflowClient, VoiceflowClientParams } from "./client";
import { voiceflowIndexer, voiceflowIndexerRef } from "./indexer";
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
export function voiceflow(params: VoiceflowPluginParams[]) {
  return genkitPluginV2({
    name: "voiceflow",
    init: async () => {
      const actions: ResolvableAction[] = [];

      params.forEach((i) => {
        const client = new VoiceflowClient(i.clientParams);
        actions.push(voiceflowRetriever(i.name, client));
        actions.push(voiceflowIndexer(i.name, client));
      });

      return actions;
    },
  });
}

export {
  voiceflowRetriever,
  voiceflowRetrieverRef,
  voiceflowIndexer,
  voiceflowIndexerRef,
};

export default voiceflow;
