import { html } from 'lit';

export const ChatBotSettings = {
    renderChatButton(chatBot) {
        return html`
      <button
        class="chat-button"
        @click=${() => (chatBot.isChatOpen = true)}
        aria-label="Open Chat"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9 17H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </button>
    `;
    },

    renderChatContainer(chatBot) {
        return html`
      <div class="chat-container" style="width: ${chatBot.chatContainerWidth}px; height: ${chatBot.chatContainerHeight}px;">
        <div class="chat-header">
          <span class="text-lg font-semibold ${chatBot.fontSize}">${chatBot.heading}</span>
          <div class="flex space-x-2">
            ${chatBot.enableSettings ? html`
              <button class="icon-button" @click=${() => chatBot.isSettingsOpen = !chatBot.isSettingsOpen} aria-label="Toggle Settings">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M19.14 12.936a7.031 7.031 0 010-1.872l2.037-1.486a.5.5 0 00.122-.617l-1.931-3.343a.5.5 0 00-.6-.22l-2.397.96a7.012 7.012 0 00-1.621-.94l-.36-2.548a.5.5 0 00-.492-.416h-3.862a.5.5 0 00-.492.416l-.36 2.548a7.012 7.012 0 00-1.621.94l-2.397-.96a.5.5 0 00-.6.22l-1.931 3.343a.5.5 0 00.122.617l2.037 1.486c-.056.299-.086.603-.086.911s.03.612.086.911l-2.037 1.486a.5.5 0 00-.122.617l1.931 3.343a.5.5 0 00.6.22l2.397-.96a7.012 7.012 0 001.621.94l.36 2.548a.5.5 0 00.492.416h3.862a.5.5 0 00.492-.416l.36-2.548a7.012 7.012 0 001.621-.94l2.397.96a.5.5 0 00.6-.22l1.931-3.343a.5.5 0 00-.122-.617l-2.037-1.486zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"/>
                </svg>
              </button>
            ` : ''}
            <button class="icon-button" @click=${() => chatBot.isChatOpen = false} aria-label="${chatBot.buttonLabels.close}">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        ${chatBot.isSettingsOpen && chatBot.enableSettings ? this.renderSettings(chatBot) : ''}
        <div class="message-container" id="message-container">
          ${chatBot.messages.map((message, index) => chatBot.renderMessage(message, index))}
        </div>
        <div class="chat-input-container">
          <textarea
            .value=${chatBot.input}
            @input=${(e) => chatBot.input = e.target.value}
            @keypress=${(e) => e.key === 'Enter' && !e.shiftKey && chatBot.handleSend()}
            class="chat-input"
            rows="2"
            style="resize: none; overflow-y: auto;"
            placeholder=${chatBot.messages.length === 0 ? chatBot.initialPlaceholder : chatBot.subsequentPlaceholder}
            ?disabled=${chatBot.isLoading}
            id="chat-input"
            aria-label="Message input"
          ></textarea>
          <button
            @click=${chatBot.handleSend}
            class="send-button"
            ?disabled=${chatBot.isLoading}
            aria-label="${chatBot.buttonLabels.send}"
          >
            ${chatBot.isLoading
                ? html`<svg class="icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>`
                : html`<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M10.185 3L3 21h18L10.185 3z"/>
                    </svg>`}
          </button>
        </div>
      </div>
    `;
    },

    renderSettings(chatBot) {
        return html`
      <div class="settings-container p-4 border-b" style="background: var(--bg-color); border-color: var(--border-color); border-radius: 8px; box-shadow: 0 2px 4px var(--shadow-color);">
        <div class="setting-item mb-4">
          <h3 class="text-sm font-medium mb-1" style="color: var(--text-color);">Adjust Theme</h3>
          <input
            type="range"
            id="theme-slider"
            min="0"
            max="100"
            .value=${chatBot.themeSliderValue}
            @input=${chatBot.handleThemeSliderChange.bind(chatBot)}
            class="w-full"
            aria-label="Theme adjustment slider"
          />
        </div>
        <div class="p-2 flex justify-end space-x-2" style="background: var(--bg-color); border-top: 1px solid var(--border-color);">
          <button @click=${chatBot.clearChat} class="icon-button" aria-label="Clear chat" style="background: var(--button-bg); color: var(--button-text); border-radius: 4px; padding: 8px;">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6l3 1 1 11h8l1-11 3-1v-1H3v1zm4 2h10v9H7V8zm4 0V5h2v3h-2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    }
};
