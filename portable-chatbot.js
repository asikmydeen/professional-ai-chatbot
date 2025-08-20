/**
 * Portable AI Chatbot - Enhanced Version (Optimized)
 * Feature-rich chatbot with file handling, dragging, resizing, and advanced markdown
 * Usage: createChatbot({ endpoint: 'your-backend-url' })
 */
(function() {
    'use strict';

    // Consolidated CSS Styles
    const styles = `
        .ai-chatbot-container {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .ai-chatbot-toggle {
            width: 60px; height: 60px; border-radius: 50%; background: #3b82f6;
            border: none; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,.1);
            display: flex; align-items: center; justify-content: center;
            transition: all .3s;
        }
        .ai-chatbot-toggle:hover { background: #2563eb; transform: scale(1.05); }
        .ai-chatbot-toggle svg { width: 30px; height: 30px; fill: white; }
        .ai-chatbot-window {
            position: fixed; bottom: 80px; right: 20px; width: 400px; height: 600px;
            min-width: 320px; min-height: 400px; background: white; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,.1); display: flex; flex-direction: column;
            overflow: hidden; transition: opacity .3s, transform .3s;
            transform-origin: bottom right;
        }
        .ai-chatbot-window.hidden {
            transform: scale(0); opacity: 0; pointer-events: none;
        }
        .ai-chatbot-window.dark { background: #1f2937; color: white; }
        .ai-chatbot-header {
            background: #3b82f6; color: white; padding: 16px; display: flex;
            justify-content: space-between; align-items: center; cursor: move;
            user-select: none;
        }
        .ai-chatbot-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
        .ai-chatbot-header-actions { display: flex; gap: 8px; }
        .ai-chatbot-header-btn {
            background: none; border: none; color: white; cursor: pointer;
            padding: 4px; display: flex; align-items: center; justify-content: center;
            border-radius: 4px; transition: background .2s;
        }
        .ai-chatbot-header-btn:hover { background: rgba(255,255,255,.2); }
        .ai-chatbot-messages {
            flex: 1; overflow-y: auto; padding: 16px; display: flex;
            flex-direction: column; gap: 12px;
        }
        .ai-chatbot-message {
            display: flex; gap: 8px; animation: fadeIn .3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ai-chatbot-message.user { justify-content: flex-end; }
        .ai-chatbot-message-content {
            max-width: 80%; padding: 12px 16px; border-radius: 12px;
            line-height: 1.5; word-wrap: break-word;
        }
        .ai-chatbot-message.user .ai-chatbot-message-content {
            background: #3b82f6; color: white; border-bottom-right-radius: 4px;
        }
        .ai-chatbot-message.assistant .ai-chatbot-message-content {
            background: #f3f4f6; color: #1f2937; border-bottom-left-radius: 4px;
        }
        .dark .ai-chatbot-message.assistant .ai-chatbot-message-content {
            background: #374151; color: white;
        }
        .ai-chatbot-message-content h1,
        .ai-chatbot-message-content h2,
        .ai-chatbot-message-content h3 { margin: 16px 0 8px; line-height: 1.3; }
        .ai-chatbot-message-content h1 { font-size: 1.5em; }
        .ai-chatbot-message-content h2 { font-size: 1.3em; }
        .ai-chatbot-message-content h3 { font-size: 1.1em; }
        .ai-chatbot-message-content p { margin: 8px 0; }
        .ai-chatbot-message-content ul,
        .ai-chatbot-message-content ol { margin: 8px 0; padding-left: 24px; }
        .ai-chatbot-message-content li { margin: 4px 0; }
        .ai-chatbot-message-content code {
            background: rgba(0,0,0,.05); padding: 2px 4px; border-radius: 3px;
            font-family: Monaco, Menlo, monospace; font-size: .9em;
        }
        .dark .ai-chatbot-message-content code { background: rgba(255,255,255,.1); }
        .ai-chatbot-message-content pre {
            position: relative; background: #1e293b; color: #e2e8f0; padding: 16px;
            border-radius: 8px; overflow-x: auto; margin: 12px 0;
        }
        .ai-chatbot-message-content pre code {
            background: none; padding: 0; color: inherit; font-size: .9em;
        }
        .ai-chatbot-copy-btn {
            position: absolute; top: 8px; right: 8px; background: #475569;
            color: white; border: none; padding: 4px 8px; border-radius: 4px;
            font-size: 12px; cursor: pointer; opacity: 0; transition: opacity .2s;
        }
        .ai-chatbot-message-content pre:hover .ai-chatbot-copy-btn { opacity: 1; }
        .ai-chatbot-copy-btn:hover { background: #64748b; }
        .ai-chatbot-message-content table {
            border-collapse: collapse; width: 100%; margin: 12px 0;
        }
        .ai-chatbot-message-content th,
        .ai-chatbot-message-content td {
            border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left;
        }
        .dark .ai-chatbot-message-content th,
        .dark .ai-chatbot-message-content td { border-color: #4b5563; }
        .ai-chatbot-message-content th { background: #f9fafb; font-weight: 600; }
        .dark .ai-chatbot-message-content th { background: #374151; }
        .ai-chatbot-message-content blockquote {
            border-left: 4px solid #3b82f6; padding-left: 16px;
            margin: 12px 0; color: #6b7280;
        }
        .dark .ai-chatbot-message-content blockquote { color: #9ca3af; }
        .ai-chatbot-file-message {
            display: flex; align-items: center; gap: 8px; padding: 8px 12px;
            background: #eff6ff; border-radius: 8px; font-size: 14px;
        }
        .dark .ai-chatbot-file-message { background: #1e3a8a; }
        .ai-chatbot-input-container {
            padding: 16px; border-top: 1px solid #e5e7eb; display: flex;
            flex-direction: column; gap: 8px;
        }
        .dark .ai-chatbot-input-container { border-top-color: #374151; }
        .ai-chatbot-input-wrapper { display: flex; gap: 8px; }
        .ai-chatbot-input {
            flex: 1; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px;
            font-size: 14px; outline: none; transition: border-color .2s;
            background: white; color: #1f2937; min-height: 44px; max-height: 120px;
            resize: vertical;
        }
        .dark .ai-chatbot-input {
            background: #374151; border-color: #4b5563; color: white;
        }
        .ai-chatbot-input:focus { border-color: #3b82f6; }
        .ai-chatbot-file-input { display: none; }
        .ai-chatbot-file-btn {
            padding: 12px; background: #f3f4f6; border: 1px solid #e5e7eb;
            border-radius: 8px; cursor: pointer; transition: all .2s;
            display: flex; align-items: center; justify-content: center;
        }
        .dark .ai-chatbot-file-btn { background: #374151; border-color: #4b5563; }
        .ai-chatbot-file-btn:hover { background: #e5e7eb; }
        .dark .ai-chatbot-file-btn:hover { background: #4b5563; }
        .ai-chatbot-send {
            padding: 12px 20px; background: #3b82f6; color: white; border: none;
            border-radius: 8px; cursor: pointer; font-weight: 500;
            transition: background .2s; display: flex; align-items: center; gap: 6px;
        }
        .ai-chatbot-send:hover:not(:disabled) { background: #2563eb; }
        .ai-chatbot-send:disabled { opacity: .5; cursor: not-allowed; }
        .ai-chatbot-loading {
            display: inline-block; width: 14px; height: 14px; border: 2px solid #fff;
            border-radius: 50%; border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ai-chatbot-error {
            background: #fee; color: #c00; padding: 12px; border-radius: 8px;
            margin: 12px 16px; font-size: 14px;
        }
        .ai-chatbot-resize-handle {
            position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
            cursor: nwse-resize; background: transparent;
        }
        .ai-chatbot-resize-handle::after {
            content: ''; position: absolute; bottom: 3px; right: 3px;
            width: 10px; height: 10px; border-right: 2px solid #9ca3af;
            border-bottom: 2px solid #9ca3af;
        }
        .ai-chatbot-file-list {
            display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;
        }
        .ai-chatbot-file-tag {
            display: flex; align-items: center; gap: 4px; padding: 4px 8px;
            background: #eff6ff; border-radius: 4px; font-size: 12px; color: #1e40af;
        }
        .dark .ai-chatbot-file-tag { background: #1e3a8a; color: #93bbfc; }
        .ai-chatbot-file-remove {
            cursor: pointer; color: #dc2626; font-weight: bold;
        }
        @media (max-width: 480px) {
            .ai-chatbot-window {
                width: 100vw !important; height: 100vh !important;
                bottom: 0 !important; right: 0 !important; left: 0 !important;
                top: 0 !important; border-radius: 0; max-width: none !important;
                max-height: none !important;
            }
            .ai-chatbot-toggle { bottom: 20px; right: 20px; }
            .ai-chatbot-resize-handle { display: none; }
        }
    `;

    // Inject styles
    function injectStyles() {
        if (document.getElementById('ai-chatbot-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ai-chatbot-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Markdown parser
    function parseMarkdown(text) {
        const escapeHtml = (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };

        const codeBlocks = [];
        let parsed = text.replace(/```([\s\S]*?)```/g, (_, code) => {
            const index = codeBlocks.length;
            const trimmed = code.trim();
            const lines = trimmed.split('\n');
            const lang = lines[0] && !lines[0].includes(' ') ? lines[0] : '';
            const content = lang ? lines.slice(1).join('\n') : trimmed;
            
            codeBlocks.push(
                `<pre><code class="language-${lang}">${escapeHtml(content)}</code>` +
                `<button class="ai-chatbot-copy-btn" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)">Copy</button></pre>`
            );
            return `__CODE_BLOCK_${index}__`;
        });

        // Process markdown
        parsed = parsed
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\* (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\|(.+)\|/g, (_, content) => {
                const cells = content.split('|').map(cell => `<td>${cell.trim()}</td>`).join('');
                return `<tr>${cells}</tr>`;
            })
            .replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        parsed = `<p>${parsed}</p>`;
        
        // Restore code blocks
        codeBlocks.forEach((block, index) => {
            parsed = parsed.replace(`__CODE_BLOCK_${index}__`, block);
        });
        
        return parsed;
    }

    // Main chatbot class
    class AIChatbot {
        constructor(options = {}) {
            this.endpoint = options.endpoint || '/api/chat';
            this.heading = options.heading || 'AI Assistant';
            this.theme = options.theme || 'light';
            this.messages = [];
            this.isOpen = false;
            this.isLoading = false;
            this.attachedFiles = [];
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.isResizing = false;
            this.resizeStart = { x: 0, y: 0, width: 0, height: 0 };
            
            this.init();
        }

        init() {
            injectStyles();
            this.createDOM();
            this.attachEvents();
            this.loadState();
        }

        createDOM() {
            // Container
            this.container = document.createElement('div');
            this.container.className = 'ai-chatbot-container';
            
            // Toggle button
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.className = 'ai-chatbot-toggle';
            this.toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            `;
            
            // Chat window
            this.window = document.createElement('div');
            this.window.className = `ai-chatbot-window hidden ${this.theme}`;
            this.window.innerHTML = `
                <div class="ai-chatbot-header">
                    <h3>${this.heading}</h3>
                    <div class="ai-chatbot-header-actions">
                        <button class="ai-chatbot-header-btn ai-chatbot-minimize" title="Minimize">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                        <button class="ai-chatbot-header-btn ai-chatbot-theme-toggle" title="Toggle theme">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
                            </svg>
                        </button>
                        <button class="ai-chatbot-header-btn ai-chatbot-download" title="Download chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                        </button>
                        <button class="ai-chatbot-header-btn ai-chatbot-close" title="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ai-chatbot-messages"></div>
                <div class="ai-chatbot-input-container">
                    <div class="ai-chatbot-file-list"></div>
                    <div class="ai-chatbot-input-wrapper">
                        <input type="file" class="ai-chatbot-file-input" multiple accept="image/*,.pdf,.txt,.doc,.docx">
                        <button class="ai-chatbot-file-btn" title="Attach files">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                            </svg>
                        </button>
                        <textarea class="ai-chatbot-input" placeholder="Type your message..." rows="1"></textarea>
                        <button class="ai-chatbot-send">Send</button>
                    </div>
                </div>
                <div class="ai-chatbot-resize-handle"></div>
            `;
            
            // Append elements
            this.container.appendChild(this.toggleBtn);
            this.container.appendChild(this.window);
            document.body.appendChild(this.container);
            
            // Get element references
            this.messagesEl = this.window.querySelector('.ai-chatbot-messages');
            this.inputEl = this.window.querySelector('.ai-chatbot-input');
            this.sendBtn = this.window.querySelector('.ai-chatbot-send');
            this.fileListEl = this.window.querySelector('.ai-chatbot-file-list');
            this.fileInput = this.window.querySelector('.ai-chatbot-file-input');
            this.fileBtn = this.window.querySelector('.ai-chatbot-file-btn');
            this.headerEl = this.window.querySelector('.ai-chatbot-header');
            this.resizeHandle = this.window.querySelector('.ai-chatbot-resize-handle');
        }

        attachEvents() {
            // Button events
            this.toggleBtn.addEventListener('click', () => this.toggle());
            this.window.querySelector('.ai-chatbot-close').addEventListener('click', () => this.close());
            this.window.querySelector('.ai-chatbot-minimize').addEventListener('click', () => this.close());
            this.window.querySelector('.ai-chatbot-theme-toggle').addEventListener('click', () => this.toggleTheme());
            this.window.querySelector('.ai-chatbot-download').addEventListener('click', () => this.downloadChat());
            
            // Message sending
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Auto-resize textarea
            this.inputEl.addEventListener('input', () => {
                this.inputEl.style.height = 'auto';
                this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 120) + 'px';
            });
            
            // File handling
            this.fileBtn.addEventListener('click', () => this.fileInput.click());
            this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
            
            // Dragging
            this.headerEl.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.endDrag());
            
            // Touch support
            this.headerEl.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
            document.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
            document.addEventListener('touchend', () => this.endDrag());
            
            // Resizing
            this.resizeHandle.addEventListener('mousedown', (e) => this.startResize(e));
            document.addEventListener('mousemove', (e) => this.resize(e));
            document.addEventListener('mouseup', () => this.endResize());
        }

        // Drag methods
        startDrag(e) {
            if (e.target.closest('.ai-chatbot-header-btn')) return;
            this.isDragging = true;
            const rect = this.window.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.window.style.transition = 'none';
        }

        drag(e) {
            if (!this.isDragging) return;
            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;
            const maxX = window.innerWidth - this.window.offsetWidth;
            const maxY = window.innerHeight - this.window.offsetHeight;
            
            this.window.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            this.window.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            this.window.style.right = 'auto';
            this.window.style.bottom = 'auto';
        }

        endDrag() {
            this.isDragging = false;
            this.window.style.transition = '';
            this.saveState();
        }

        // Resize methods
        startResize(e) {
            this.isResizing = true;
            this.resizeStart = {
                x: e.clientX,
                y: e.clientY,
                width: this.window.offsetWidth,
                height: this.window.offsetHeight
            };
            this.window.style.transition = 'none';
            e.preventDefault();
        }

        resize(e) {
            if (!this.isResizing) return;
            const width = this.resizeStart.width + (e.clientX - this.resizeStart.x);
            const height = this.resizeStart.height + (e.clientY - this.resizeStart.y);
            
            this.window.style.width = Math.max(320, width) + 'px';
            this.window.style.height = Math.max(400, height) + 'px';
        }

        endResize() {
            this.isResizing = false;
            this.window.style.transition = '';
            this.saveState();
        }

        // File handling
        handleFiles(files) {
            Array.from(files).forEach(file => {
                if (this.attachedFiles.length >= 5) {
                    this.showError('Maximum 5 files allowed');
                    return;
                }
                this.attachedFiles.push(file);
            });
            this.renderFileList();
        }

        renderFileList() {
            this.fileListEl.innerHTML = this.attachedFiles.map((file, index) => `
                <div class="ai-chatbot-file-tag">
                    <span>${file.name}</span>
                    <span class="ai-chatbot-file-remove" data-index="${index}">×</span>
                </div>
            `).join('');
            
            this.fileListEl.querySelectorAll('.ai-chatbot-file-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.attachedFiles.splice(index, 1);
                    this.renderFileList();
                });
            });
        }

        // UI methods
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.window.classList.toggle('dark');
            this.saveState();
        }

        downloadChat() {
            const content = this.messages.map(msg => 
                `${msg.role.toUpperCase()}: ${msg.content}`
            ).join('\n\n---\n\n');
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.window.classList.remove('hidden');
            this.isOpen = true;
            this.inputEl.focus();
        }

        close() {
            this.window.classList.add('hidden');
            this.isOpen = false;
        }

        // State management
        saveState() {
            const state = {
                theme: this.theme,
                position: {
                    left: this.window.style.left,
                    top: this.window.style.top,
                    width: this.window.style.width,
                    height: this.window.style.height
                }
            };
            localStorage.setItem('ai-chatbot-state', JSON.stringify(state));
        }

        loadState() {
            const saved = localStorage.getItem('ai-chatbot-state');
            if (saved) {
                const state = JSON.parse(saved);
                this.theme = state.theme || 'light';
                this.window.classList.toggle('dark', this.theme === 'dark');
                
                if (state.position && state.position.left) {
                    Object.assign(this.window.style, state.position);
                    this.window.style.right = 'auto';
                    this.window.style.bottom = 'auto';
                }
            }
        }

        // Message handling
        async sendMessage() {
            const message = this.inputEl.value.trim();
            if (!message && this.attachedFiles.length === 0) return;
            if (this.isLoading) return;

            let content = message;
            if (this.attachedFiles.length > 0) {
                const fileNames = this.attachedFiles.map(f => f.name).join(', ');
                content = `${message}\n\n📎 Attached files: ${fileNames}`;
            }
            
            this.addMessage('user', content);
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            
            const filesToSend = [...this.attachedFiles];
            this.attachedFiles = [];
            this.renderFileList();
            this.setLoading(true);

            try {
                const formData = new FormData();
                formData.append('messages', JSON.stringify(this.messages));
                formData.append('stream', 'true');
                
                filesToSend.forEach((file, index) => {
                    formData.append(`file_${index}`, file);
                });

                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    body: filesToSend.length > 0 ? formData : JSON.stringify({
                        messages: this.messages,
                        stream: true
                    }),
                    headers: filesToSend.length > 0 ? {} : {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.content) {
                                    assistantMessage += data.content;
                                    this.updateAssistantMessage(assistantMessage);
                                }
                                if (data.done) {
                                    this.finalizeAssistantMessage(assistantMessage);
                                    this.setLoading(false);
                                    return;
                                }
                            } catch (e) {
                                console.error('Parse error:', e);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                this.showError('Failed to send message. Please try again.');
                this.setLoading(false);
            }
        }

        addMessage(role, content) {
            this.messages.push({ role, content });
            
            const messageEl = document.createElement('div');
            messageEl.className = `ai-chatbot-message ${role}`;
            
            const contentHtml = role === 'assistant' 
                ? parseMarkdown(content) 
                : content.replace(/\n/g, '<br>');
            
            messageEl.innerHTML = `
                <div class="ai-chatbot-message-content">
                    ${contentHtml}
                </div>
            `;
            
            this.messagesEl.appendChild(messageEl);
            this.scrollToBottom();
            
            return messageEl;
        }

        updateAssistantMessage(content) {
            let lastMessage = this.messagesEl.querySelector('.ai-chatbot-message.assistant:last-child');
            if (!lastMessage) {
                lastMessage = this.addMessage('assistant', content);
            } else {
                lastMessage.querySelector('.ai-chatbot-message-content').innerHTML = parseMarkdown(content);
            }
            this.scrollToBottom();
        }

        finalizeAssistantMessage(content) {
            this.messages.push({ role: 'assistant', content });
        }

        setLoading(loading) {
            this.isLoading = loading;
            this.sendBtn.disabled = loading;
            this.sendBtn.innerHTML = loading 
                ? '<span class="ai-chatbot-loading"></span>' 
                : 'Send';
        }

        showError(message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'ai-chatbot-error';
            errorEl.textContent = message;
            this.messagesEl.appendChild(errorEl);
            this.scrollToBottom();
            
            setTimeout(() => errorEl.remove(), 5000);
        }

        scrollToBottom() {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        }

        destroy() {
            this.container.remove();
        }
    }

    // Export to global scope
    window.createChatbot = function(options) {
        return new AIChatbot(options);
    };

    // Auto-initialize if data attribute is present
    document.addEventListener('DOMContentLoaded', function() {
        const autoInit = document.querySelector('[data-chatbot-endpoint]');
        if (autoInit) {
            window.createChatbot({
                endpoint: autoInit.dataset.chatbotEndpoint,
                heading: autoInit.dataset.chatbotHeading || 'AI Assistant',
                theme: autoInit.dataset.chatbotTheme || 'light'
            });
        }
    });
})();