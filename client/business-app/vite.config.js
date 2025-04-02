import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 3003, // DISCUSS Port for the business app
  },
  plugins: [
    react(),
    federation({
      name: 'businessApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',
        './BusinessDashboard': './src/components/BusinessDashboard/BusinessDashboard',
        './BusinessProfile': './src/components/BusinessProfile/BusinessProfileView',
        './Offers': './src/components/Offers/OffersList',
        './Reviews': './src/components/Reviews/ReviewsList'
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