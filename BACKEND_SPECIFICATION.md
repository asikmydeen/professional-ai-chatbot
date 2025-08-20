# Backend API Specification for Professional AI Chatbot

## Overview

The backend service acts as a secure proxy between the chat component and AI providers (OpenAI, Claude, etc.). This design ensures that sensitive information like API keys and model configurations never reach the client.

## Endpoint Specification

### Chat Endpoint
**POST** `/api/chat` or `[your-configured-endpoint]`

#### Request Body
```json
{
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": "message content"
    }
  ],
  "stream": true | false  // Optional, defaults to true
}
```

#### Response

**For Streaming (stream: true)**
Returns Server-Sent Events (SSE) stream:
```
data: {"content": "Hello", "done": false}
data: {"content": " there", "done": false}
data: {"content": "!", "done": false}
data: {"content": "", "done": true}
```

**For Non-Streaming (stream: false)**
```json
{
  "content": "Complete response text",
  "done": true
}
```

#### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Backend Configuration

The backend should store and manage:

```javascript
{
  // AI Provider Settings
  "provider": "openai" | "anthropic" | "custom",
  "apiKey": "your-api-key",
  "model": "gpt-4o",
  "temperature": 0.7,
  "maxTokens": 2048,
  "topP": 0.9,
  
  // Optional: Rate Limiting
  "rateLimiting": {
    "enabled": true,
    "maxRequestsPerMinute": 60,
    "maxTokensPerDay": 100000
  },
  
  // Optional: Authentication
  "authentication": {
    "enabled": true,
    "type": "bearer" | "apiKey" | "session",
    "validateToken": async (token) => { /* validation logic */ }
  },
  
  // Optional: Custom System Prompt
  "systemPrompt": "You are a helpful assistant...",
  
  // Optional: Conversation Management
  "maxConversationLength": 50,  // Max messages to keep in context
  "conversationTimeout": 3600   // Seconds before conversation resets
}
```

## Example Backend Implementation (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuration (in production, use environment variables)
const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  model: process.env.AI_MODEL || 'gpt-4o',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048'),
  topP: parseFloat(process.env.AI_TOP_P || '0.9')
};

app.post('/api/chat', async (req, res) => {
  const { messages, stream = true } = req.body;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        stream: stream
      })
    });

    if (stream) {
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.write('data: {"content": "", "done": true}\n\n');
          res.end();
          break;
        }
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } else {
      // Non-streaming response
      const data = await response.json();
      res.json({
        content: data.choices[0].message.content,
        done: true
      });
    }
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to process chat request',
        code: 'CHAT_ERROR'
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chat backend running on port ${PORT}`);
});
```

## Security Considerations

1. **API Key Storage**: Never expose API keys in client code or version control
2. **CORS**: Configure CORS to only allow requests from your domains
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Authentication**: Add authentication if the chatbot should not be publicly accessible
5. **Input Validation**: Validate and sanitize all input from the client
6. **Error Handling**: Never expose internal error details to the client

## Component Usage

With this backend in place, the component usage becomes much simpler:

```html
<chat-bot endpoint="https://your-backend.com/api/chat"></chat-bot>
```

No auth tokens, no model configuration - just a single endpoint URL. All sensitive configuration lives securely on your backend.