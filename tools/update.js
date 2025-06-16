const fs = require('fs');
const https = require('https');

const sources = [
  'https://raw.githubusercontent.com/ermaozi01/free-clash-subscribe/main/sub.list',
  'https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub',
  'https://raw.githubusercontent.com/learnhard-cn/free_proxy_ss/main/subscribe.txt'
];

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
    .filter(line => line.startsWith('ss://') || line.startsWith('vmess://') || line.startsWith('vless://') || line.startsWith('trojan://'))
    .filter(line =>
      /香港|HK|Singapore|新加坡|日本|Japan|美国|US|Germany|德国|台湾|Taiwan/i.test(decodeURIComponent(line))
    );

  // 分类节点
  const clashNodes = lines.filter(l => l.startsWith('vmess://') || l.startsWith('vless://') || l.startsWith('trojan://'));
  const v2rayNodes = clashNodes;
  const ssNodes = lines.filter(l => l.startsWith('ss://'));

  // 生成订阅文件（你可根据格式需求自行修改）
  fs.writeFileSync('clash.yaml', clashNodes.join('\n'), 'utf-8');
  fs.writeFileSync('v2ray.txt', v2rayNodes.join('\n'), 'utf-8');
  fs.writeFileSync('ss.txt', ssNodes.join('\n'), 'utf-8');

  console.log(`✅ 抓取完成：总计 ${lines.length} 条节点，生成 clash.yaml(${clashNodes.length})，v2ray.txt(${v2rayNodes.length})，ss.txt(${ssNodes.length})`);
}

function fetchRemote(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

fetchAndMerge();
