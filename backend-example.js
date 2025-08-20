const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Configuration - Use environment variables in production
const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  model: process.env.AI_MODEL || 'gpt-4o', // GPT-4o supports images!
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096'), // Increased for image responses
  topP: parseFloat(process.env.AI_TOP_P || '0.9')
};

app.post('/api/chat', upload.any(), async (req, res) => {
  // Handle both JSON and multipart/form-data
  let messages, stream = true;
  
  if (req.files && req.files.length > 0) {
    // Files were uploaded
    messages = JSON.parse(req.body.messages);
    stream = req.body.stream === 'true';
    
    // Process files for GPT-4o
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      // Convert message to multimodal format for GPT-4o
      const content = [{
        type: 'text',
        text: lastUserMessage.content
      }];
      
      // Add images to the message
      for (const file of req.files) {
        if (file.mimetype.startsWith('image/')) {
          // Convert image to base64
          const base64Image = file.buffer.toString('base64');
          content.push({
            type: 'image_url',
            image_url: {
              url: `data:${file.mimetype};base64,${base64Image}`,
              detail: 'high' // Can be 'low', 'high', or 'auto'
            }
          });
        } else {
          // For non-image files, just add a note
          content[0].text += `\n\n[Attached file: ${file.originalname} (${(file.size / 1024).toFixed(2)}KB) - Note: GPT-4o can only process images directly]`;
        }
      }
      
      // Update the message with multimodal content
      lastUserMessage.content = content;
    }
    
    console.log('Files processed for GPT-4o');
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

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: {
          message: error.error?.message || 'API request failed',
          code: 'API_ERROR'
        }
      });
    }

    if (stream) {
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering
      
      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.write('data: {"content": "", "done": true}\n\n');
              res.end();
              break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim());
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  res.write('data: {"content": "", "done": true}\n\n');
                  res.end();
                  return;
                }
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  if (content) {
                    res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
                  }
                } catch (e) {
                  console.error('Error parsing streaming data:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          res.write(`data: ${JSON.stringify({ error: 'Stream processing failed', done: true })}\n\n`);
          res.end();
        }
      };
      
      processStream();
      
      // Handle client disconnect
      req.on('close', () => {
        reader.cancel();
      });
      
    } else {
      // Non-streaming response
      const data = await response.json();
      res.json({
        content: data.choices[0].message.content,
        done: true
      });
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to process chat request',
        code: 'CHAT_ERROR'
      }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chat backend running on port ${PORT}`);
  console.log(`Test the chatbot at http://localhost:8080/test.html`);
  console.log(`Make sure to set your OPENAI_API_KEY environment variable`);
});