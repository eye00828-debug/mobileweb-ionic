/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // 🔥 สำคัญมาก สำหรับ GitHub Pages (repo: mobileweb-ionic / folder: lab06)
  base: '/mobileweb-ionic/lab06/',

  plugins: [
    vue(),
    legacy()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom'
  }
})
