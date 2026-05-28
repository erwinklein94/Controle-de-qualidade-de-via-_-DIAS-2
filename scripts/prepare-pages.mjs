import { copyFileSync, cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const distDir = 'dist'
const docsDir = 'docs'
const indexPath = join(distDir, 'index.html')
const notFoundPath = join(distDir, '404.html')
const noJekyllPath = join(distDir, '.nojekyll')

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html não foi encontrado. Rode vite build antes de preparar o GitHub Pages.')
}

copyFileSync(indexPath, notFoundPath)
writeFileSync(noJekyllPath, '')

rmSync(docsDir, { recursive: true, force: true })
cpSync(distDir, docsDir, { recursive: true })

for (const entry of readdirSync(distDir)) {
  cpSync(join(distDir, entry), entry, { recursive: true, force: true })
}
