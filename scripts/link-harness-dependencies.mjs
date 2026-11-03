import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const host = process.env.DSH_REPO || process.argv[2]
if (!host) throw new Error('Set DSH_REPO or pass the Harness checkout path')
const result = spawnSync(process.execPath, [resolve(root, 'scripts/link-host.mjs'), host], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})
if (result.error) throw result.error
process.exit(result.status ?? 1)
