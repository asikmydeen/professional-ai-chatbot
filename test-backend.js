const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock responses for testing without API keys
const mockResponses = [
  "Hello! I'm your AI assistant. How can I help you today?",
  "That's an interesting question. Let me think about that...",
  "I understand. Could you tell me more about what you're looking for?",
  "Based on what you've told me, here's what I suggest...",
  "Is there anything else you'd like to know?",
];

app.post('/api/chat', async (req, res) => {
  const { messages, stream = true } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: {
        message: 'Messages array is required',
        code: 'INVALID_REQUEST'
      }
    });
  }

  // Pick a random mock response
  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  if (stream) {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Simulate streaming by sending the response word by word
    const words = response.split(' ');
    let index = 0;
    
    const sendWord = () => {
      if (index < words.length) {
        const word = words[index] + (index < words.length - 1 ? ' ' : '');
        res.write(`data: ${JSON.stringify({ content: word, done: false })}\n\n`);
        index++;
        setTimeout(sendWord, 100); // Send next word after 100ms
      } else {
        res.write('data: {"content": "", "done": true}\n\n');
        res.end();
      }
    };
    
    sendWord();
    
    // Handle client disconnect
    req.on('close', () => {
      clearTimeout(sendWord);
    });
    
  } else {
    // Non-streaming response
    res.json({
      content: response,
      done: true
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'mock', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock chat backend running on port ${PORT}`);
  console.log(`This is a TEST backend that returns mock responses`);
  console.log(`For production, use backend-example.js with your actual API keys`);
});