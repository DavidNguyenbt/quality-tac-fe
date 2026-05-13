import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base:'/quality-dashboard-tac',
    plugins: [react(), svgr({
        include: "**/*.svg?react",
    })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
        }
    },
    optimizeDeps: {
        exclude: ['@mui/x-date-pickers/themeAugmentation'],
    }
})
