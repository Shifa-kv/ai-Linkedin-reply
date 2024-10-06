import React from 'react';
import { createRoot } from 'react-dom/client';
import PromptIcon from './components/PromptIcon'; 
import "~/assets/tailwind.css";

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  async main() {
    const container = document.createElement('div');
    
    container.style.position = 'relative';
    container.style.bottom = '0';
    container.style.right = '0'; 
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<PromptIcon />);
  },
});