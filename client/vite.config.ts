import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from "node:path";
export default defineConfig(() => {
    return {
        build: {
            outDir: 'dist',
        },
        plugins: [react()],
        resolve: {
            alias: [{ find: "@shared", replacement: path.resolve(__dirname, "../shared") }],
        }
    };
});