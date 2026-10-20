import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

// Where the site is served from. On GitHub Pages a project site lives under /<repo>/, so the deploy workflow sets
// BASE_PATH (e.g. "/portfolio/"). Locally it is just "/".
const base = process.env.BASE_PATH ?? '/'

// Files in /public are referenced all over the code as plain strings ("/photos/1.jpg", "/work/…/tile.jpg", …). Vite
// moves the base onto <link>/CSS references by itself, but not onto strings in scripts, so when the site is served from
// a sub-path this adds the base to those strings at build time. Only strings that end in a file extension are touched,
// so routes such as `/work/${slug}` are left alone.
const publicAssetBase = (): Plugin => ({
  name: 'public-asset-base',
  apply: 'build',
  enforce: 'pre',
  transform(code, id) {
    if (base === '/' || !/\/src\/.*\.(t|j)sx?$/.test(id)) return null
    const out = code.replace(
      /(["'`])\/((?:work|photos|logos|fonts|assets)\/[^"'`]*\.(?:jpe?g|png|webp|svg|mp4|webm|pdf|otf|ttf|woff2?|glb)|saumya-resume[^"'`]*\.pdf|favicon\.svg)(?=["'`])/g,
      (_m, q, path) => `${q}${base}${path}`,
    )
    return out === code ? null : { code: out, map: null }
  },
})

export default defineConfig({
  base,
  plugins: [publicAssetBase(), react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
