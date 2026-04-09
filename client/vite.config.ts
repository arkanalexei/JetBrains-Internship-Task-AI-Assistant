import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import svgr from 'vite-plugin-svgr'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: true,
  },
  plugins: [basicSsl(), react(), svgr(), splitVendorChunkPlugin()],
  // plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  

});
