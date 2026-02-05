import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import htmlMinifier from 'vite-plugin-html-minifier'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
    return {
        base: '/',
        build: {
            outDir: 'public/build',
            chunkSizeWarningLimit: 800,
            minify: 'terser',
            sourcemap: false,
            rollupOptions: {
                input: {
                    app: path.resolve(__dirname, 'resources/react/index.jsx'),
                },
                onwarn(warning, warn) {
                    if (warning.plugin === 'vite:esbuild') {
                        throw new Error(`Vite ESBuild error: ${warning.message}`)
                    }
                    warn(warning)
                },
                output: {
                    entryFileNames: 'assets/[hash].js',
                    chunkFileNames: 'assets/[hash].js',
                    assetFileNames: 'assets/[hash].[ext]',
                    manualChunks(id) {
                        // this thing fixes issues with vite build minif of sentry
                        if (id.includes('node_modules') && !id.includes('sentry')) {
                            return id.toString().split('node_modules/')[1].split('/')[0]
                        }
                    },
                },
            },
        },
        css: {
            postcss: {
                plugins: [
                    autoprefixer({}), // add options if needed
                ],
                sass: {
                    sassOptions: {
                        quietDeps: true,
                    },
                },
            },
        },
        esbuild: {
            loader: 'jsx',
            include: /resources\/.*\.jsx?$/,
            exclude: [],
            target: 'esnext',
        },
        optimizeDeps: {
            force: true,
            esbuildOptions: {
                treeShaking: true,
                minify: true,
                loader: {
                    '.js': 'jsx',
                },
            },
        },
        plugins: [
            react(),
            htmlMinifier({
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
            }),
            laravel({
                input: [],
                refresh: true,
            }),
        ],
        resolve: {
            alias: [
                {
                    find: 'resources/react',
                    replacement: `${path.resolve(__dirname, 'resources/react')}/`,
                },
            ],
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
        },
        server: {
            host: 'localhost',
            port: 5173,
            strictPort: true,
            cors: true,
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
            },
        },
    }
})
