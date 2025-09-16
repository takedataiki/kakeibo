// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
  app: {
    // 👇 リポジトリ名に置き換える
    baseURL: '/kakeibo/',  
    buildAssetsDir: '_nuxt/', // デフォルトだが明示しておくと安全
  }
})
