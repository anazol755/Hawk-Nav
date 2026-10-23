import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { register } from './serviceWorkerRegistration'; // Import the service worker registration
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


register(); // Call the register function