// tools/gen-ss.js

const fs = require('fs');

// 读取 sub.txt
const raw = fs.readFileSync('sub.txt', 'utf-8');
const lines = raw
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0 && line.startsWith('ss://'));

// 编码成 base64（小火箭订阅格式）
const encoded = Buffer.from(lines.join('\n')).toString('base64');

// 保存成 ss.txt
fs.writeFileSync('ss.txt', encoded, 'utf-8');
console.log(`✅ 已生成 ss.txt（适用于 Shadowrocket，共 ${lines.length} 条）`);
