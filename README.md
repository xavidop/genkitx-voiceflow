![Firebase Genkit + Voiceflow](https://github.com/xavidop/genkitx-voiceflow/blob/main/assets/genkitx-voiceflow.png?raw=true)

<h1 align="center">
   Firebase Genkit <> Voiceflow Plugin
</h1>

<h4 align="center">Voiceflow Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="GitHub version" src="https://img.shields.io/github/v/release/xavidop/genkitx-voiceflow">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-voiceflow">
   <img alt="GitHub License" src="https://img.shields.io/github/license/xavidop/genkitx-voiceflow">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/xavidop/genkitx-voiceflow?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/xavidop/genkitx-voiceflow?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/xavidop/genkitx-voiceflow">
</div>

</br>

**`genkitx-voiceflow`** is a community plugin for using Voiceflow Knowledge base in
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Xavier Portilla Edo**](https://github.com/xavidop).

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-voiceflow`
- `pnpm add genkitx-voiceflow`

## Usage

### Configuration

To use the plugin, you need to configure it with your Voiceflow API key. You can do this by calling the `genkit` function:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-voiceflow";

const ai = genkit({
  plugins: [
    openAI({ apiKey: process.env.OPENAI_API_KEY }),
    voiceflow([
      {
        name: 'retriever',
        clientParams: {
          apiKey: process.env.VOICEFLOW_API_KEY!,
        }
      },
    ])
  ],
});
```

### Basic examples

The simplest way to call the text generation model is by using the helper function `retrieve`:

```typescript
const voiceflowRetriever = voiceflowRetrieverRef({
  name: 'retriever'
});

const docs = await ai.retrieve({ retriever: voiceflowRetriever, query: subject, 
options:{
  querySettings: { model: 'gpt-4o', temperature: 0.7 },
  limit: 5
}});
```

### Within a flow

```typescript
// ...configure Genkit (as shown above)...

export const retrieverFlow = ai.defineFlow(
  {
    name: 'retrieverFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {

   const voiceflowRetriever = voiceflowRetrieverRef({
     name: 'retriever'
   });

   const docs = await ai.retrieve({ retriever: voiceflowRetriever, query: subject, 
    options:{
     querySettings: { model: 'gpt-4o', temperature: 0.7 },
     limit: 5
   }});
   
   const llmResponse = await ai.generate({
      prompt: `What is Voiceflow?`,
      docs: docs,
    });
    return llmResponse.text;
  }
);
```


For more detailed examples and the explanation of other functionalities, refer to the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

## Feature supported from Voiceflow Knowledge Base

This plugins supports all the features supported by the Vocieflow Knowledge Base API. You can find the full list of features in the [Voiceflow Knowledge Base API Reference](https://docs.voiceflow.com/reference/post_knowledge-base-query-1).

## API Reference

You can find the full API reference in the [API Reference Documentation](https://xavidop.github.io/genkitx-voiceflow/)

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/xavidop/genkitx-voiceflow/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [GitHub Discussions](https://github.com/xavidop/genkitx-voiceflow/discussions).

## Credits

This plugin is proudly maintained by Xavier Portilla Edo [**Xavier Portilla Edo**](https://github.com/xavidop).

## License

This project is licensed under the [Apache 2.0 License](https://github.com/xavidop/genkitx-voiceflow/blob/main/LICENSE).

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/xavidop/genkitx-voiceflow/blob/main/LICENSE)
