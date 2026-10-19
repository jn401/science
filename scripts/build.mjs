import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { check, projectRoot, publicFiles } from './check.mjs';
await check();
const output = path.join(projectRoot, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) await cp(path.join(projectRoot, file), path.join(output, file), { recursive: true });
console.log('已生成 dist/。上传其中的内容即可，保留子目录结构。');
