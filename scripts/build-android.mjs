import { spawnSync } from 'node:child_process';
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build', '--', '--outDir', 'dist_android'], {
  stdio: 'inherit', shell: process.platform === 'win32',
  env: { ...process.env, VITE_BUILD_TARGET: 'android', VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
});
process.exit(result.status ?? 1);
