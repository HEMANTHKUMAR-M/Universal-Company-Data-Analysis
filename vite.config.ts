import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Set a fixed dev port (5174) so localhost:5174 works for the starter
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
});
