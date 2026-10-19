// 站内入口校验同时供浏览器与维护脚本使用。
export function validEntry(entry) {
  return typeof entry === 'string' && /^experiments\/[a-z0-9-]+\/[a-zA-Z0-9_./-]+\.html$/.test(entry)
    && !entry.split('/').includes('..');
}
