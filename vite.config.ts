import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  // 指定项目的根目录
  root: "./",
  
  base: "./",

  build: {
    outDir: "dist",
  },

  // 配置开发服务器
  server: {
    port: 3000, // 指定端口号
  },

  plugins: [react()],
});
