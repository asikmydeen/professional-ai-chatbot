const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Mock chat endpoint
app.post('/api/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send a simple response
    const response = "Hello! I'm a mock AI assistant. This is a test response to verify the chatbot is working correctly.";
    const words = response.split(' ');
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < words.length) {
            res.write(`data: ${JSON.stringify({ content: words[index] + ' ' })}\n\n`);
            index++;
        } else {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            clearInterval(interval);
            res.end();
        }
    }, 100);
});

const PORT = 8082;
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/test-optimized-chatbot.html in your browser`);
});