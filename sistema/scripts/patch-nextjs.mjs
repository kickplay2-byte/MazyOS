/**
 * Workaround for Next.js 16.2.6 bug: /_global-error prerender fails with
 * "InvariantError: Expected workStore to be initialized".
 *
 * Root cause: the synthetic /_global-error prerender worker in Next.js 16.2.6
 * does not initialize workAsyncStorage before metadata collection, so any route
 * that triggers this path throws an InvariantError. This is a confirmed Next.js
 * bug — the error message itself says "This is a bug in Next.js."
 *
 * Fix: intercept the InvariantError in the /_global-error catch block and return
 * a dynamic-page result instead of re-throwing, so the build continues normally.
 *
 * When to remove: after upgrading Next.js beyond 16.2.6. Verify by removing this
 * script, removing the build/postinstall references in package.json, and running
 * npm run build. If the build passes without error on /_global-error, the bug
 * is fixed upstream.
 *
 * Idempotent: safe to run multiple times — detects existing patch via MARKER.
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const target = resolve(__dirname, '../node_modules/next/dist/export/routes/app-page.js')

const MARKER = '// patch:E1068'

const SEARCH = `    } catch (err) {
        if (!(0, _isdynamicusageerror.isDynamicUsageError)(err)) {
            throw err;
        }`

const REPLACE = `    } catch (err) {
        ${MARKER} — Next.js 16 bug: /_global-error and /_not-found prerenders do not init workStore
        if ((isDefaultGlobalError || isDefaultNotFound) && err && err.message && err.message.includes('workStore to be initialized')) {
            return { cacheControl: { revalidate: 0, expire: undefined }, fetchMetrics: undefined };
        }
        if (!(0, _isdynamicusageerror.isDynamicUsageError)(err)) {
            throw err;
        }`

let content
try {
  content = readFileSync(target, 'utf8')
} catch {
  console.error('patch-nextjs: target not found, skipping')
  process.exit(0)
}

if (content.includes(MARKER)) {
  console.log('patch-nextjs: already applied, skipping')
  process.exit(0)
}

if (!content.includes(SEARCH)) {
  console.error('patch-nextjs: anchor not found — Next.js may have changed; verify and update the patch or remove it')
  process.exit(0)
}

writeFileSync(target, content.replace(SEARCH, REPLACE), 'utf8')
console.log('patch-nextjs: patch applied to', target)
