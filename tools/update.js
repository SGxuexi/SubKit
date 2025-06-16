// tools/update.js

const fs = require('fs');
const https = require('https');

// 新的节点源（推荐公开免费源，主要包含 Socks5/HTTP 代理，适合翻墙）
const sources = [
  'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
  'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/socks5.txt'
];

// 合并所有节点
async function fetchAndMerge() {
  let all = '';
  for (const url of sources) {
    try {
      const data = await fetchRemote(url);
      all += data.trim() + '\n';
    } catch (e) {
      console.error(`❌ 无法拉取: ${url}`);
    }
  }

  const lines = Array.from(new Set(all.split('\n')))
    .filter(line => /^(\d{1,3}\.){3}\d{1,3}:\d{2,5}$/.test(line));

  fs.writeFileSync('sub.txt', lines.join('\n'), 'utf-8');
  console.log(`✅ 抓取完成，共写入 ${lines.length} 条节点`);
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
