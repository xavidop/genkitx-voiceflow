/**
 * Copyright 2024 The Fire Company
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { startFlowServer } from '@genkit-ai/express';
import dotenv from 'dotenv';
import { genkit, z } from 'genkit';
import openAI, { gpt4o } from 'genkitx-openai';
import { voiceflow, voiceflowIndexerRef, voiceflowRetrieverRef } from 'genkitx-voiceflow';

dotenv.config();

const ai = genkit({
  plugins: [
    openAI({ apiKey: process.env.OPENAI_API_KEY }),
    voiceflow([
      {
        name: 'kb',
        clientParams: {
          apiKey: process.env.VOICEFLOW_API_KEY!,
        }
      },
    ])
  ],
  model: gpt4o,
});

export const retrieverFlow = ai.defineFlow(
  {
    name: 'retrieverFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {

   const voiceflowRetriever = voiceflowRetrieverRef({
     name: 'kb'
   });

   const docs = await ai.retrieve({ retriever: voiceflowRetriever, query: subject, 
    options:{
     querySettings: { model: 'gpt-4o', temperature: 0.7 },
     k: 5
   }});
   
   const llmResponse = await ai.generate({
      prompt: `What is Voiceflow?`,
      docs: docs,
    });
    return llmResponse.text;
  }
);

export const indexerFlow = ai.defineFlow(
  {
    name: 'indexerFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async () => {

   const voiceflowIndexer = voiceflowIndexerRef({
     name: 'kb'
   });

   const documents = [{ content: [{ media: { url: 'file:///Users/xavierportillaedo/Downloads/LeadershipPrinciples.pdf' } }] }];
   await ai.index({ indexer: voiceflowIndexer, documents });

   return 'done';
   
  }
);


startFlowServer({
  flows: [retrieverFlow, indexerFlow],
});
