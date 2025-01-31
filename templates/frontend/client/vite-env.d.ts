/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly NODE_ENV: 'development' | 'production' | 'test'
   readonly VITE_BACKEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
