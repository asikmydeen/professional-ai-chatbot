# Portable Chatbot Usage Guide

## Overview

The portable chatbot is a single JavaScript file (`portable-chatbot.js`) that you can copy and use anywhere. No build tools, no npm install, no dependencies!

## Features

- 🎯 **Zero Dependencies** - Pure vanilla JavaScript
- 📦 **Single File** - Just copy `portable-chatbot.js`
- 🎨 **Styled** - All styles are embedded
- 🌐 **Framework Agnostic** - Works with React, Vue, Angular, or plain HTML
- 📱 **Responsive** - Mobile-friendly design
- 🌗 **Theme Support** - Light and dark themes
- 💬 **Streaming** - Real-time message streaming
- 🔒 **Secure** - Backend handles all API keys

## Quick Start

### Method 1: Auto-initialization with Data Attributes

```html
<script src="portable-chatbot.js" 
        data-chatbot-endpoint="https://your-backend.com/api/chat"
        data-chatbot-heading="Support"
        data-chatbot-theme="light"></script>
```

### Method 2: Manual Initialization

```html
<script src="portable-chatbot.js"></script>
<script>
    const chatbot = createChatbot({
        endpoint: 'https://your-backend.com/api/chat',
        heading: 'AI Assistant',
        theme: 'dark'
    });
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `endpoint` | string | '/api/chat' | Your backend API endpoint |
| `heading` | string | 'AI Assistant' | Chat window title |
| `theme` | string | 'light' | Theme: 'light' or 'dark' |
| `position` | string | 'bottom-right' | Position (future feature) |

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';

function MyApp() {
    const chatbotRef = useRef(null);

    useEffect(() => {
        // Create chatbot
        chatbotRef.current = createChatbot({
            endpoint: 'https://api.example.com/chat',
            heading: 'Support Bot',
            theme: 'light'
        });

        // Cleanup
        return () => {
            if (chatbotRef.current) {
                chatbotRef.current.destroy();
            }
        };
    }, []);

    return <div>Your app content</div>;
}
```

### Vue 3

```vue
<template>
    <div>Your app content</div>
</template>

<script>
export default {
    data() {
        return {
            chatbot: null
        };
    },
    mounted() {
        this.chatbot = createChatbot({
            endpoint: 'https://api.example.com/chat',
            heading: 'Vue Assistant',
            theme: 'dark'
        });
    },
    beforeUnmount() {
        if (this.chatbot) {
            this.chatbot.destroy();
        }
    }
};
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

declare global {
    interface Window {
        createChatbot: any;
    }
}

@Component({
    selector: 'app-root',
    template: '<div>Your app content</div>'
})
export class AppComponent implements OnInit, OnDestroy {
    private chatbot: any;

    ngOnInit() {
        this.chatbot = window.createChatbot({
            endpoint: 'https://api.example.com/chat',
            heading: 'Angular Bot',
            theme: 'light'
        });
    }

    ngOnDestroy() {
        if (this.chatbot) {
            this.chatbot.destroy();
        }
    }
}
```

## API Methods

### `createChatbot(options)`
Creates a new chatbot instance.

### `chatbot.open()`
Opens the chat window.

### `chatbot.close()`
Closes the chat window.

### `chatbot.toggle()`
Toggles the chat window open/closed.

### `chatbot.destroy()`
Removes the chatbot from the page.

## Styling Customization

While the chatbot comes with built-in styles, you can override them:

```css
/* Override primary color */
.ai-chatbot-toggle {
    background: #your-color !important;
}

.ai-chatbot-header {
    background: #your-color !important;
}

/* Override chat window size */
.ai-chatbot-window {
    width: 400px !important;
    height: 650px !important;
}
```

## Mobile Support

The chatbot is responsive and will automatically:
- Take full screen on mobile devices
- Adjust input and button sizes
- Handle touch interactions

## Browser Support

Works in all modern browsers:
- Chrome/Edge 60+
- Firefox 60+
- Safari 12+
- Mobile browsers

## Tips

1. **Load Order**: Include the script at the end of your HTML or after DOM is ready
2. **Multiple Instances**: You can create multiple chatbots with different endpoints
3. **Dynamic Loading**: You can dynamically load the script when needed
4. **CDN Usage**: Host the file on your CDN for better performance

## Example: Dynamic Loading

```javascript
function loadChatbot() {
    const script = document.createElement('script');
    script.src = 'https://cdn.example.com/portable-chatbot.js';
    script.onload = () => {
        window.createChatbot({
            endpoint: 'https://api.example.com/chat'
        });
    };
    document.body.appendChild(script);
}

// Load chatbot when user clicks a button
document.getElementById('support-btn').addEventListener('click', loadChatbot);
```

## Troubleshooting

1. **Chatbot not appearing**: Check browser console for errors
2. **CORS errors**: Ensure your backend allows requests from your domain
3. **Styling conflicts**: Use more specific CSS selectors or !important
4. **Mobile issues**: Check viewport meta tag is set correctly