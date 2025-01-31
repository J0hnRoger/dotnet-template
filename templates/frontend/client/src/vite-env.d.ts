/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_APP_SERVER_URL: string
   readonly NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
