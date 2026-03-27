import { registerRootComponent } from 'expo';
import App from './App';

// Фикс скролла для веб-режима
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root { height: 100%; margin: 0; padding: 0; }
    #root > div { height: 100%; }
  `;
  document.head.appendChild(style);
}

registerRootComponent(App);
