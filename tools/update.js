// tools/update.js

const fs = require('fs');
const https = require('https');

// 免费节点来源（混合格式、base64 编码）
const sources = [
  'https://raw.githubusercontent.com/ermaozi01/free-clash-subscribe/main/sub.list',
  'https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub',
  'https://raw.githubusercontent.com/learnhard-cn/free_proxy_ss/main/subscribe.txt'
];

// 合并所有节点
async function fetchAndMerge() {
  let all = '';
  for (const url of sources) {
    try {
      const raw = await fetchRemote(url);
      const decoded = isBase64(raw) ? Buffer.from(raw, 'base64').toString() : raw;
      all += decoded.trim() + '\n';
    } catch (e) {
      console.error(`❌ 无法拉取: ${url}`);
    }
  }

  const lines = Array.from(new Set(all.split('\n')))
    .map(line => line.trim())
    .filter
