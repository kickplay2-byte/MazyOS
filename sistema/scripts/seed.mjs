// Seed script: reads all JSON data files and upserts to Supabase
// Usage (from sistema/ directory): node scripts/seed.mjs
// Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
// Safe to run multiple times — upsert is idempotent (same id → overwrite).

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Load .env.local
const envPath = join(root, '.env.local')
if (!existsSync(envPath)) {
  console.error('ERROR: .env.local not found at', envPath)
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#') && l.trim())
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key)

const TABLES = [
  'processos',
  'consultorias',
  'extrajudiciais',
  'imobiliarias',
  'corretores',
  'clientes',
  'oportunidades',
  'propostas',
  'tarefas',
  'arquivos',
  // Base de Conhecimento (Fase 10)
  'modelos_juridicos',
  'clausulas_padrao',
  'checklists_juridicos',
  'orientacoes_internas',
  // Minutas Assistidas (Fase 10.3)
  'minutas_assistidas',
]

// Table names that don't match their JSON filename (underscores → hyphens)
const FILE_NAMES = {
  modelos_juridicos: 'modelos-juridicos',
  clausulas_padrao: 'clausulas-padrao',
  checklists_juridicos: 'checklists-juridicos',
  orientacoes_internas: 'orientacoes-internas',
}

let totalUpserted = 0
let totalSkipped = 0
let totalErrors = 0

async function seedTable(table) {
  const fileName = FILE_NAMES[table] ?? table
  const filePath = join(root, 'data', `${fileName}.json`)

  if (!existsSync(filePath)) {
    console.log(`  ${table.padEnd(18)} → [skip] file not found`)
    totalSkipped++
    return
  }

  let records
  try {
    records = JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.log(`  ${table.padEnd(18)} → [error] invalid JSON: ${e.message}`)
    totalErrors++
    return
  }

  if (!Array.isArray(records)) {
    console.log(`  ${table.padEnd(18)} → [error] expected JSON array, got ${typeof records}`)
    totalErrors++
    return
  }

  if (records.length === 0) {
    console.log(`  ${table.padEnd(18)} → [skip] empty array (0 records)`)
    totalSkipped++
    return
  }

  const rows = records.map((r) => ({ id: r.id, data: r }))
  const { error } = await supabase.from(table).upsert(rows)

  if (error) {
    console.log(`  ${table.padEnd(18)} → [error] ${error.message}`)
    totalErrors++
  } else {
    console.log(`  ${table.padEnd(18)} → [ok] ${rows.length} record${rows.length !== 1 ? 's' : ''} upserted`)
    totalUpserted += rows.length
  }
}

console.log(`\nPIPE OS — Supabase Seed`)
console.log(`URL: ${url}`)
console.log(`─────────────────────────────────────`)

for (const table of TABLES) {
  await seedTable(table)
}

console.log(`─────────────────────────────────────`)
console.log(`Total upserted : ${totalUpserted}`)
console.log(`Total skipped  : ${totalSkipped}`)
console.log(`Total errors   : ${totalErrors}`)

if (totalErrors > 0) {
  console.log(`\nIf you see "table not found" errors, run scripts/schema.sql in Supabase first.`)
  process.exit(1)
} else {
  console.log(`\nDone. ✓`)
}
