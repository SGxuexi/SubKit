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
    .filter(line =>
      line.startsWith('ss://') ||
      line.startsWith('vmess://') ||
      line.startsWith('vless://') ||
      line.startsWith('trojan://')
    );

  fs.writeFileSync('sub.txt', lines.join('\n'), 'utf-8');
  console.log(`✅ 抓取完成，共写入 ${lines.length} 条节点`);
}

// 判断是否为 base64
function isBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf-8').includes('://');
  } catch {
    return false;
  }
}

// 拉取远程文本内容
function fetchRemote(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// 执行主函数
fetchAndMerge();
