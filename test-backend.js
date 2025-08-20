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

// Add multer for file upload handling
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post('/api/chat', upload.any(), async (req, res) => {
  // Handle both JSON and multipart/form-data
  let messages, stream = true;
  
  if (req.files && req.files.length > 0) {
    // Files were uploaded
    messages = JSON.parse(req.body.messages);
    stream = req.body.stream === 'true';
    
    // Log file information
    console.log('Files received:', req.files.map(f => ({
      name: f.originalname,
      size: f.size,
      type: f.mimetype
    })));
  } else {
    // Regular JSON request
    messages = req.body.messages;
    stream = req.body.stream !== undefined ? req.body.stream : true;
  }
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: {
        message: 'Messages array is required',
        code: 'INVALID_REQUEST'
      }
    });
  }

  // Pick a response based on whether files were uploaded
  let response;
  if (req.files && req.files.length > 0) {
    const fileList = req.files.map(f => `${f.originalname} (${(f.size / 1024).toFixed(2)}KB)`).join(', ');
    response = `I received your files: ${fileList}. In a real implementation, I would analyze these files and provide insights based on their content. For now, this is just a mock response demonstrating that file upload is working correctly!`;
  } else {
    response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }
  
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