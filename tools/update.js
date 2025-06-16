// tools/update.js

const fs = require('fs');
const https = require('https');

// ✅ 替换为以下有效来源（多源备份）
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
      const data = await fetchRemote(url);
      all += data.trim() + '\n';
    } catch (e) {
      console.error(`❌ 无法拉取: ${url}`);
    }
  }

  // 过滤并保存
  const lines = Array.from(new Set(all.split('\n')))
    .filter(line =>
      line.startsWith('ss://') ||
      line.startsWith('vmess://') ||
      line.startsWith('vless://') ||
      line.startsWith('trojan://')
    )
    .filter(line =>
      /香港|HK|Singapore|新加坡|日本|Japan|美国|US|Germany|德国|台湾|Taiwan/i.test(decodeURIComponent(line))
    );

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
