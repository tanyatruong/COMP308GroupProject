// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 3003, // Business app port
  },
  plugins: [
    react(),
    federation({
      name: 'businessApp',
      filename: 'remoteEntry.js',
      exposes: {
        './BusinessDashboard': './src/components/BusinessDashboard',
        './BusinessProfile': './src/components/BusinessProfile',
        './OffersList': './src/components/Offers/OffersList',
        './CreateOffer': './src/components/Offers/CreateOffer',
        './ReviewsList': './src/components/Reviews/ReviewsList'
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql', 'react-bootstrap', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});