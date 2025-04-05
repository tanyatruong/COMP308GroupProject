import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    federation({
      name: 'authApp',
      filename: 'remoteEntry.js',
      exposes: {
        './SignUp': './src/components/SignUp/SignUp',
        './LogIn': './src/components/LogIn/LogIn'
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql', 'react-bootstrap', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
});
