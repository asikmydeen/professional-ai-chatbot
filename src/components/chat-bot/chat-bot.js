import { LitElement, html, unsafeCSS } from 'lit';
import { ChatBotMessages } from './chat-bot-messages.js';
import { ChatBotSettings } from './chat-bot-settings.js';
import { ChatBotStyles } from './chat-bot-styles.js';
import { ChatBotTheme } from './chat-bot-theme.js';
import { ChatBotUtils } from './chat-bot-utils.js';
import styles from './styles.css';

ChatBotUtils.loadHighlightJsCss();

export class ChatBot extends LitElement {
    static properties = {
        endpoint: { type: String },
        heading: { type: String },
        theme: { type: String },
        input: { type: String },
        messages: { type: Array },
        isLoading: { type: Boolean },
        isChatOpen: { type: Boolean },
        isSettingsOpen: { type: Boolean },
        selectedModel: { type: String },
        temperature: { type: Number },
        maxTokens: { type: Number },
        topP: { type: Number },
        enableSettings: { type: Boolean },
        buttonLabels: { type: Object },
        fontSize: { type: String },
        initialPlaceholder: { type: String },
        subsequentPlaceholder: { type: String },
        themeSliderValue: { type: Number },
        chatContainerWidth: { type: Number },
        chatContainerHeight: { type: Number },
        language: { type: String },
        analyticsEnabled: { type: Boolean },
        maxRetryAttempts: { type: Number },
        retryDelay: { type: Number },
        errorNotification: { type: Function },
    };

    static styles = [ChatBotStyles, unsafeCSS(styles)];

    constructor() {
        super();
        this.endpoint = '';
        this.heading = 'AI Assistant';
        this.theme = 'dark';
        this.input = '';
        this.messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        this.isLoading = false;
        this.isChatOpen = false;
        this.isSettingsOpen = false;
        this.enableSettings = true;
        this.buttonLabels = { send: 'Send', close: 'Close', settings: 'Settings' };
        this.fontSize = 'text-base';
        this.initialPlaceholder = 'Type your message...';
        this.subsequentPlaceholder = 'Continue the conversation...';
        this.themeSliderValue = 0;
        this.chatContainerWidth = 384;
        this.chatContainerHeight = 600;
        this.language = 'en';
        this.analyticsEnabled = false;
        this.maxRetryAttempts = 3;
        this.retryDelay = 2000;
        this.errorNotification = (message) => console.error(message);

        // Bind methods from settings and messages modules
        this.handleSend = ChatBotMessages.handleSend.bind(this);
        this.sendMessageWithRetry = ChatBotMessages.sendMessageWithRetry.bind(this);
        this.clearChat = ChatBotMessages.clearChat.bind(this);
        this.renderMessage = ChatBotMessages.renderMessage.bind(this);
        this.renderSettings = ChatBotSettings.renderSettings.bind(this);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('authToken')) {
            console.log('authToken property changed to:', this.authToken);
        }
    }

    firstUpdated() {
        console.log('Component firstUpdated - authToken:', this.authToken);
        ChatBotTheme.loadThemeFromLocalStorage(this);
        ChatBotTheme.applyTheme(this);
        this.syncSettingsUI();
        this.scrollToBottom();
        ChatBotUtils.setupLanguage(this);
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        ChatBotUtils.setupResizeObserver(this);
        ChatBotUtils.setupDraggable(this);
    }

    syncSettingsUI() {
        const modelSelect = this.shadowRoot.querySelector('#model-select');
        if (modelSelect) {
            modelSelect.value = this.selectedModel;
        }

        const tempInput = this.shadowRoot.querySelector('#temperature');
        if (tempInput) {
            tempInput.value = this.temperature;
        }

        const maxTokensInput = this.shadowRoot.querySelector('#max-tokens');
        if (maxTokensInput) {
            maxTokensInput.value = this.maxTokens;
        }

        const topPInput = this.shadowRoot.querySelector('#top-p');
        if (topPInput) {
            topPInput.value = this.topP;
        }
    }

    handleThemeSliderChange(event) {
        this.themeSliderValue = parseInt(event.target.value, 10);
        this.updateThemeColors();
        this.saveThemeToLocalStorage();
    }

    updateThemeColors() {
        const value = this.themeSliderValue;
        if (value <= 10) {
            // Dark Theme
            this.style.setProperty('--bg-color', '#1a202c');
            this.style.setProperty('--text-color', '#ffffff');
            this.style.setProperty('--button-color', '#4a5568');
            this.style.setProperty('--input-bg', '#2d3748');
            this.style.setProperty('--input-text', '#e2e8f0');
            this.style.setProperty('--border-color', '#2d3748');
            this.style.setProperty('--icon-color', '#e2e8f0');
            this.style.setProperty('--header-bg', '#2d3748');
            this.style.setProperty('--header-text', '#ffffff');
            this.style.setProperty('--button-text', '#ffffff');
            this.style.setProperty('--accent-color', '#3b82f6');
            this.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        } else if (value >= 90) {
            // Light Theme
            this.style.setProperty('--bg-color', '#ffffff');
            this.style.setProperty('--text-color', '#1f2937');
            this.style.setProperty('--button-color', '#3b82f6');
            this.style.setProperty('--input-bg', '#e5e7eb');
            this.style.setProperty('--input-text', '#1f2937');
            this.style.setProperty('--border-color', '#d1d5db');
            this.style.setProperty('--icon-color', '#1f2937');
            this.style.setProperty('--header-bg', '#e5e7eb');
            this.style.setProperty('--header-text', '#1f2937');
            this.style.setProperty('--button-text', '#ffffff');
            this.style.setProperty('--accent-color', '#1d4ed8');
            this.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.15)');
        } else {
            // Gradient Theme Transition
            const progress = (value - 10) / 80;
            this.style.setProperty('--bg-color', `hsl(${progress * 210}, 40%, ${100 - progress * 50}%)`);
            this.style.setProperty('--text-color', `hsl(${progress * 210}, 30%, ${30 + progress * 40}%)`);
            this.style.setProperty('--button-color', `hsl(${progress * 210 + 120}, 60%, 50%)`);
            this.style.setProperty('--input-bg', `hsl(${progress * 210}, 50%, 90%)`);
            this.style.setProperty('--input-text', `hsl(${progress * 210}, 30%, 20%)`);
            this.style.setProperty('--border-color', `hsl(${progress * 210}, 40%, 70%)`);
            this.style.setProperty('--icon-color', `hsl(${progress * 210 + 180}, 60%, 40%)`);
            this.style.setProperty('--header-bg', `hsl(${progress * 210}, 40%, 80%)`);
            this.style.setProperty('--header-text', `hsl(${progress * 210}, 20%, 10%)`);
            this.style.setProperty('--button-text', `hsl(${progress * 210 + 180}, 80%, 90%)`);
            this.style.setProperty('--accent-color', `hsl(${progress * 210 + 90}, 60%, 50%)`);
            this.style.setProperty('--shadow-color', `rgba(0, 0, 0, ${0.3 - progress * 0.15})`);
        }
    }

    scrollToBottom(smooth = true) {
        const chatContainer = this.shadowRoot?.querySelector('.message-container');
        if (chatContainer) {
            if (smooth) {
                chatContainer.style.scrollBehavior = 'smooth';
            }
            chatContainer.scrollTop = chatContainer.scrollHeight;
            if (smooth) {
                setTimeout(() => chatContainer.style.scrollBehavior = 'auto', 500);
            }
        }
    }

    loadThemeFromLocalStorage() {
        const savedThemeValue = localStorage.getItem('chatbotThemeSliderValue');
        if (savedThemeValue) {
            this.themeSliderValue = parseInt(savedThemeValue, 10);
            this.updateThemeColors();
        }
    }

    saveThemeToLocalStorage() {
        localStorage.setItem('chatbotThemeSliderValue', this.themeSliderValue.toString());
    }

    saveMessagesToLocalStorage() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }

    focusInput() {
        requestAnimationFrame(() => {
            const inputElement = this.shadowRoot?.querySelector('#chat-input');
            if (inputElement) {
                inputElement.focus();
            }
        });
    }

    copyToClipboard(content) {
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('Copied to clipboard!');
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `fixed bottom-20 right-4 ${this.theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        const header = this.shadowRoot.querySelector('.chat-header');
        if (header) {
            header.removeEventListener('mousedown', this.startDragging);
        }
    }

    render() {
        return html`
      ${this.isChatOpen ? ChatBotSettings.renderChatContainer(this) : ChatBotSettings.renderChatButton(this)}
    `;
    }
}

customElements.define('chat-bot', ChatBot);
