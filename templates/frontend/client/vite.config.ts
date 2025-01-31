import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_BACKEND_URL;
  if (backendUrl === undefined) 
    throw new Error("VITE_BACKEND_URL is not set");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@common": path.resolve(__dirname, "./src/common"),
        "@components": path.resolve(__dirname, "./src/components"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    plugins: [react(), mkcert()],
    server: {
      proxy: {
        "/api": backendUrl,
      },
    },
  };
});
