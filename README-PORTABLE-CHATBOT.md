# Portable AI Chatbot - Enhanced Optimized Version

A feature-rich, standalone AI chatbot that can be integrated into any web application with a single script tag. This optimized version maintains full functionality while reducing file size by 12.8%.

## 🚀 Quick Start

### Method 1: Auto-initialization with Data Attributes

```html
<script src="portable-chatbot.js"
        data-chatbot-endpoint="https://your-api.com/chat"
        data-chatbot-heading="AI Assistant"
        data-chatbot-theme="light"></script>
```

### Method 2: Manual Initialization

```html
<script src="portable-chatbot.js"></script>
<script>
    const chatbot = createChatbot({
        endpoint: 'https://your-api.com/chat',
        heading: 'Customer Support',
        theme: 'dark'
    });
</script>
```

## ✨ Features

- **🖱️ Drag & Drop**: Move the chat window anywhere on screen
- **📐 Resizable**: Adjust window size by dragging the corner
- **📎 File Upload**: Attach up to 5 files per message
- **🎨 Rich Markdown**: Full markdown support with syntax highlighting
- **🌓 Dark Mode**: Toggle between light and dark themes
- **💾 Export Chat**: Download conversation history
- **📱 Mobile Responsive**: Full-screen mode on mobile devices
- **💬 Streaming Support**: Real-time message streaming
- **🔄 State Persistence**: Remembers position and theme

## 📋 Configuration Options

```javascript
createChatbot({
    endpoint: 'https://your-api.com/chat',  // Required: Your API endpoint
    heading: 'AI Assistant',                 // Optional: Chat window title
    theme: 'light'                          // Optional: 'light' or 'dark'
});
```

## 🔌 API Requirements

Your backend endpoint should:

1. Accept POST requests with the following structure:
```json
{
    "messages": [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"}
    ],
    "stream": true
}
```

2. Return Server-Sent Events (SSE) for streaming:
```
data: {"content": "Hello "}
data: {"content": "world!"}
data: {"done": true}
```

Or return a simple JSON response for non-streaming:
```json
{
    "content": "Hello world!",
    "done": true
}
```

## 📁 File Upload Support

When files are attached, the request becomes `multipart/form-data` with:
- `messages`: JSON string of conversation history
- `file_0`, `file_1`, etc.: The attached files
- `stream`: "true" or "false"

Supported file types:
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Documents: `.pdf`, `.txt`, `.doc`, `.docx`

## 🎨 Markdown Support

The chatbot supports full markdown rendering:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold/Italic**: `**bold**`, `*italic*`, `***both***`
- **Lists**: Unordered (`* item`) and ordered (`1. item`)
- **Code**: Inline `` `code` `` and fenced code blocks
- **Links**: `[text](url)`
- **Tables**: Using pipe syntax
- **Blockquotes**: `> quote`

Code blocks include:
- Syntax highlighting
- Copy button on hover
- Language detection

## 🔧 Advanced Usage

### Programmatic Control

```javascript
const chatbot = createChatbot({...});

// Open/close the chat window
chatbot.open();
chatbot.close();
chatbot.toggle();

// Check state
if (chatbot.isOpen) {
    console.log('Chat is open');
}

// Access elements
chatbot.inputEl.value = 'Pre-filled message';
chatbot.sendMessage();

// Destroy instance
chatbot.destroy();
```

### Framework Integration

#### React
```jsx
import { useEffect, useRef } from 'react';

function App() {
    const chatbotRef = useRef(null);

    useEffect(() => {
        chatbotRef.current = window.createChatbot({
            endpoint: '/api/chat',
            heading: 'Support Bot'
        });

        return () => {
            if (chatbotRef.current) {
                chatbotRef.current.destroy();
            }
        };
    }, []);

    return <div>Your app content</div>;
}
```

#### Vue
```vue
<script>
export default {
    data() {
        return { chatbot: null }
    },
    mounted() {
        this.chatbot = window.createChatbot({
            endpoint: '/api/chat',
            heading: 'Vue Assistant'
        });
    },
    beforeUnmount() {
        if (this.chatbot) {
            this.chatbot.destroy();
        }
    }
}
</script>
```

## 💾 Local Storage

The chatbot automatically saves:
- Window position (left, top, width, height)
- Theme preference (light/dark)

Storage key: `ai-chatbot-state`

To clear saved state:
```javascript
localStorage.removeItem('ai-chatbot-state');
```

## 🎯 CSS Classes

For custom styling, target these classes:

```css
/* Main container */
.ai-chatbot-container { }

/* Toggle button */
.ai-chatbot-toggle { }

/* Chat window */
.ai-chatbot-window { }
.ai-chatbot-window.dark { }

/* Messages */
.ai-chatbot-message { }
.ai-chatbot-message.user { }
.ai-chatbot-message.assistant { }

/* Input area */
.ai-chatbot-input { }
.ai-chatbot-send { }
```

## 📱 Mobile Behavior

On screens smaller than 480px:
- Chat window becomes full-screen
- Resize handle is hidden
- Toggle button remains accessible

## 🔒 Security Considerations

1. **API Endpoint**: Always use HTTPS in production
2. **File Uploads**: Validate file types and sizes on the server
3. **XSS Protection**: User input is automatically escaped
4. **CORS**: Configure your API to accept requests from your domain

## 📊 File Size

- **Original**: 35.9 KB
- **Optimized**: 31.3 KB (12.8% reduction)
- **Gzipped**: ~8.5 KB

## 🧪 Testing

Create a simple test server:

```javascript
const express = require('express');
const app = express();

app.use(express.static('.'));
app.post('/api/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.write('data: {"content": "Hello! How can I help?"}\n\n');
    res.write('data: {"done": true}\n\n');
    res.end();
});

app.listen(3000);
```

## 🐛 Troubleshooting

### Chat doesn't appear
- Check browser console for errors
- Verify the script is loaded
- Ensure `createChatbot` is called after DOM loads

### Messages not sending
- Verify your API endpoint is correct
- Check CORS settings
- Inspect network tab for API errors

### Files not uploading
- Check file size limits
- Verify multipart/form-data handling
- Ensure file types are supported

## 📄 License

This is a portable, standalone implementation. Customize and use as needed for your projects.

## 🤝 Contributing

To contribute improvements:
1. Maintain backward compatibility
2. Keep the single-file structure
3. Test all features after changes
4. Document any new options

---

Built with vanilla JavaScript for maximum compatibility and zero dependencies.