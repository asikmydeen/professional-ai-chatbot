# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional AI Chatbot is a customizable web component built with Lit Element that can be integrated into any web application. It provides a chat interface for AI-powered conversations and supports multiple frameworks including React, Vue, Angular, and Svelte.

## Build Commands

```bash
# Build the component for distribution
npm run build

# Build before publishing to npm
npm run prepublishOnly
```

## Architecture

### Component Structure

The project follows a modular architecture with the main chatbot component broken down into specialized modules:

- **src/components/chat-bot/chat-bot.js** - Main LitElement component that orchestrates the chatbot
- **src/components/chat-bot/chat-bot-messages.js** - Handles message rendering and sending logic
- **src/components/chat-bot/chat-bot-settings.js** - Manages settings UI and configuration
- **src/components/chat-bot/chat-bot-styles.js** - Contains component styling
- **src/components/chat-bot/chat-bot-theme.js** - Handles theme management and persistence
- **src/components/chat-bot/chat-bot-utils.js** - Utility functions for dragging, resizing, language support

### Build System

The project uses Rollup for bundling with the following key configurations:
- Entry point: `src/index.js`
- Output: ES module format to `dist/chatbot.js`
- Integrates Tailwind CSS with PostCSS processing
- Includes terser for minification
- External dependencies for Lit and marked libraries loaded via CDN

### Key Dependencies

- **lit** (v2.6.1) - Web component framework
- **marked** (v4.0.0) - Markdown parsing
- **highlight.js** (v11.10.0) - Code syntax highlighting
- **tailwindcss** (v3.4.10) - Utility-first CSS framework

### API Integration

The component expects an endpoint that accepts POST requests with the following structure:
- Model selection
- Temperature, max tokens, and top-p parameters
- Message history array
- Returns streamed or complete AI responses

### Storage

The component uses localStorage for:
- Chat message history persistence
- Theme preferences
- Model and parameter settings