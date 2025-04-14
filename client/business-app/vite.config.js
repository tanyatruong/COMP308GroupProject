// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  server: {
    port: 3003, // Business app port
  },
  plugins: [
    react(),
    federation({
      name: "businessApp",
      filename: "remoteEntry.js",
      exposes: {
        "./BusinessDashboard": "./src/components/business/BusinessDashboard",
        "./BusinessProfile": "./src/components/business/BusinessProfile",
        "./OffersList": "./src/components/business/Offers/OffersList",
        "./CreateOffer": "./src/components/business/Offers/CreateOffer",
        "./ReviewsList": "./src/components/business/Reviews/ReviewsList",
        "./ResidentDashboard": "./src/components/residentCommunity/residentDashboard/ResidentDashboard",
        "./BulletinBoard": "./src/components/residentCommunity/bulletinBoard/BulletinBoard",
        "./IndividualDiscussion": "/src/components/residentCommunity/bulletinBoard/IndividualDiscussion"
      },
      shared: [
        "react",
        "react-dom",
        "@apollo/client",
        "graphql",
        "react-bootstrap",
        "react-router-dom",
      ],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
