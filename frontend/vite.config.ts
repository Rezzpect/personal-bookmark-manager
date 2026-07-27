import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config();
const serverPort = process.env.PORT ? Number(process.env.PORT) : 5173;

export default defineConfig({
  server: {
    port: serverPort,
  },
  plugins: [react()],
})
