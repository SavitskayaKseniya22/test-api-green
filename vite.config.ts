import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [react(), svgr()],

    resolve: {
        alias: {
            "@": path.resolve("src"),
            "@app": path.resolve("src/app"),
            "@abstracts": path.resolve("src/app/styles/abstracts"),
            "@shared": path.resolve("src/shared"),
            "@pages": path.resolve("src/pages"),
        },
    },
});
