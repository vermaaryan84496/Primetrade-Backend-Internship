import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy forwards all requests starting with /api to your Spring Boot backend on port 8080
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // The URL of your Spring Boot server
        changeOrigin: true,
        secure: false, 
      }
    }
  }
});