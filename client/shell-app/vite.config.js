// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shellApp',
      remotes: {
        businessApp: 'http://localhost:3003/assets/remoteEntry.js',
        authApp: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql', 'react-bootstrap', 'react-router-dom'],
    }),
  ],
});