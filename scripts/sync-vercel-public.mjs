import { cp, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const distDir = 'dist'
const publicDir = 'public'

if (!existsSync(distDir)) {
  throw new Error(`Expected ${distDir}/ to exist before syncing Vercel output.`)
}

await mkdir(publicDir, { recursive: true })

// Remove generated files from previous builds, but keep checked-in static source files
// such as public/hamilton.jpg and public/analysis-*.png.
await rm(join(publicDir, 'index.html'), { force: true })
await rm(join(publicDir, 'assets'), { recursive: true, force: true })

await cp(distDir, publicDir, { recursive: true })

console.log(`Synced ${distDir}/ into ${publicDir}/ for Vercel output.`)
