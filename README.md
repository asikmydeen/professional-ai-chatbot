# Professional AI Chatbot

A secure, customizable, professional-looking AI chatbot web component that can be integrated into any web application. Works with any framework or vanilla JavaScript.

## 🔐 Security-First Design

This chatbot component uses a backend-centric architecture where:
- **No API keys in the frontend** - All sensitive configuration lives on your backend
- **Simple integration** - Just provide an endpoint URL
- **Full control** - Your backend manages models, parameters, and rate limiting

## Table of Contents

- [Professional AI Chatbot](#professional-ai-chatbot)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic HTML](#basic-html)
    - [React](#react)
    - [Vue.js](#vuejs)
    - [Angular](#angular)
    - [Svelte](#svelte)
  - [API Reference](#api-reference)
  - [Styling](#styling)
  - [Browser Support](#browser-support)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [License](#license)

## Quick Start

### 1. Set up your backend

First, create a backend endpoint that will handle chat requests. See `backend-example.js` for a complete example:

```javascript
// Your backend endpoint should:
// 1. Accept POST requests with { messages: [...], stream: true }
// 2. Store your API keys and configuration securely
// 3. Forward requests to your AI provider (OpenAI, Claude, etc.)
// 4. Stream or return responses in the expected format
```

### 2. Install the component

```bash
npm install professional-ai-chatbot
```

Or use via CDN:

```html
<script type="module" src="https://unpkg.com/professional-ai-chatbot@latest/dist/chatbot.js"></script>
```

### 3. Add to your HTML

```html
<chat-bot endpoint="https://your-backend.com/api/chat"></chat-bot>
```

That's it! No API keys, no configuration in the frontend.

## Usage

### Basic HTML

To use the chatbot in a basic HTML file, include the script and use the custom element:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chatbot Demo</title>
    <script type="module" src="https://unpkg.com/professional-ai-chatbot@latest/dist/chatbot.js"></script>
</head>
<body>
    <chat-bot
        endpoint="https://your-backend.com/api/chat"
        heading="AI Assistant"
        theme="dark"
    ></chat-bot>
</body>
</html>
```

### React

For React applications, create a wrapper component:

```jsx
import React, { useEffect, useRef } from 'react';
import 'professional-ai-chatbot';

const ChatBotWrapper = (props) => {
  const chatbotRef = useRef(null);

  useEffect(() => {
    if (chatbotRef.current) {
      // You can add event listeners or interact with the web component here if needed
    }
  }, []);

  return <chat-bot ref={chatbotRef} {...props} />;
};

export default ChatBotWrapper;
```

Then use it in your React components:

```jsx
import React from 'react';
import ChatBotWrapper from './ChatBotWrapper';

function App() {
  return (
    <div className="App">
      <h1>My React App with AI Chatbot</h1>
      <ChatBotWrapper
        endpoint="https://your-api-endpoint.com"
        heading="AI Assistant"
        theme="dark"
        initialModel="gpt-4o"
        initialTemperature={0.7}
        initialMaxTokens={2048}
        initialTopP={0.9}
      />
    </div>
  );
}

export default App;
```

### Vue.js

For Vue.js applications, create a wrapper component:

```vue
<!-- ChatBotWrapper.vue -->
<template>
  <chat-bot
    :endpoint="endpoint"
    :heading="heading"
    :theme="theme"
    :initial-model="initialModel"
    :initial-temperature="initialTemperature"
    :initial-max-tokens="initialMaxTokens"
    :initial-top-p="initialTopP"
  ></chat-bot>
</template>

<script>
import 'professional-ai-chatbot';

export default {
  name: 'ChatBotWrapper',
  props: {
    endpoint: String,
    heading: String,
    theme: String,
    initialModel: String,
    initialTemperature: Number,
    initialMaxTokens: Number,
    initialTopP: Number
  },
  mounted() {
    // You can add event listeners or interact with the web component here if needed
  }
}
</script>
```

Use it in your Vue components:

```vue
<template>
  <div id="app">
    <h1>My Vue App with AI Chatbot</h1>
    <ChatBotWrapper
      endpoint="https://your-api-endpoint.com"
      heading="AI Assistant"
      theme="dark"
      initialModel="gpt-4o"
      :initialTemperature="0.7"
      :initialMaxTokens="2048"
      :initialTopP="0.9"
    />
  </div>
</template>

<script>
import ChatBotWrapper from './ChatBotWrapper.vue'

export default {
  name: 'App',
  components: {
    ChatBotWrapper
  }
}
</script>
```

### Angular

For Angular applications, create a wrapper component:

```typescript
// chat-bot-wrapper.component.ts
import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import 'professional-ai-chatbot';

@Component({
  selector: 'app-chat-bot-wrapper',
  template: `
    <chat-bot
      #chatBot
      [attr.endpoint]="endpoint"
      [attr.heading]="heading"
      [attr.theme]="theme"
      [attr.initial-model]="initialModel"
      [attr.initial-temperature]="initialTemperature"
      [attr.initial-max-tokens]="initialMaxTokens"
      [attr.initial-top-p]="initialTopP"
    ></chat-bot>
  `
})
export class ChatBotWrapperComponent implements AfterViewInit {
  @ViewChild('chatBot') chatBotElement: ElementRef;

  @Input() endpoint: string;
  @Input() heading: string;
  @Input() theme: string;
  @Input() initialModel: string;
  @Input() initialTemperature: number;
  @Input() initialMaxTokens: number;
  @Input() initialTopP: number;

  ngAfterViewInit() {
    // You can add event listeners or interact with the web component here if needed
  }
}
```

Use it in your Angular components:

```html
<!-- app.component.html -->
<h1>My Angular App with AI Chatbot</h1>
<app-chat-bot-wrapper
  endpoint="https://your-api-endpoint.com"
  heading="AI Assistant"
  theme="dark"
  initialModel="gpt-4o"
  [initialTemperature]="0.7"
  [initialMaxTokens]="2048"
  [initialTopP]="0.9"
></app-chat-bot-wrapper>
```

Remember to declare the `ChatBotWrapperComponent` in your `app.module.ts` and add it to the `declarations` array.

### Svelte

For Svelte applications, create a wrapper component:

```html
<!-- ChatBotWrapper.svelte -->
<svelte:options tag="chat-bot-wrapper" />

<script>
  import 'professional-ai-chatbot';
  import { onMount } from 'svelte';

  export let endpoint;
  export let heading;
  export let theme;
  export let initialModel;
  export let initialTemperature;
  export let initialMaxTokens;
  export let initialTopP;

  let chatBotElement;

  onMount(() => {
    // You can add event listeners or interact with the web component here if needed
  });
</script>

<chat-bot
  bind:this={chatBotElement}
  {endpoint}
  {heading}
  {theme}
  initial-model={initialModel}
  initial-temperature={initialTemperature}
  initial-max-tokens={initialMaxTokens}
  initial-top-p={initialTopP}
></chat-bot>
```

Use it in your Svelte app:

```html
<!-- App.svelte -->
<script>
  import ChatBotWrapper from './ChatBotWrapper.svelte';
</script>

<h1>My Svelte App with AI Chatbot</h1>
<ChatBotWrapper
  endpoint="https://your-api-endpoint.com"
  heading="AI Assistant"
  theme="dark"
  initialModel="gpt-4o"
  initialTemperature={0.7}
  initialMaxTokens={2048}
  initialTopP={0.9}
/>
```

## API Reference

### Component Attributes

The `chat-bot` component accepts the following attributes:

- `endpoint` (required): The API endpoint for your chat backend
- `heading` (optional): The title displayed in the chat window. Default: "AI Assistant"
- `theme` (optional): The color theme of the chatbot. Can be "light" or "dark". Default: "dark"

### Backend API Specification

Your backend endpoint should:

1. **Accept POST requests** with the following JSON body:
   ```json
   {
     "messages": [
       {"role": "user", "content": "Hello"},
       {"role": "assistant", "content": "Hi there!"}
     ],
     "stream": true  // Optional, defaults to true
   }
   ```

2. **Return responses** in one of two formats:
   - **Streaming (SSE)**: Server-Sent Events with format:
     ```
     data: {"content": "Hello", "done": false}
     data: {"content": " there", "done": false}
     data: {"content": "", "done": true}
     ```
   - **Non-streaming**: JSON response:
     ```json
     {
       "content": "Complete response text",
       "done": true
     }
     ```

See `BACKEND_SPECIFICATION.md` for complete details and `backend-example.js` for a working example.

## Styling

The chatbot component comes with built-in styles that adapt to light and dark themes. If you need to customize the styles further, you can target the `chat-bot` element and its internal elements in your CSS.

For example:

```css
chat-bot {
  --chat-primary-color: #3182ce;
  --chat-bg-color: #1a202c;
  --chat-text-color: #ffffff;
}
```

## Browser Support

This web component is compatible with all modern browsers that support Custom Elements v1. This includes:

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

For older browsers, you may need to use polyfills.

## Troubleshooting

1. **The chatbot is not rendering**: Ensure that you've properly imported the component and that your browser supports Custom Elements v1.

2. **Styling conflicts**: If you're experiencing styling issues, try increasing the specificity of your custom styles or use Shadow DOM piercing combinators carefully.

3. **Console errors**: Check the browser console for any error messages. Common issues include incorrect API endpoints or CORS restrictions.

## Contributing

We welcome contributions to improve the chatbot component. Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.