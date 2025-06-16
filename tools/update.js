// tools/update.js

const fs = require('fs');
const https = require('https');

// 1. 我们只使用 FreeFQ 的 Vmess JSON 源
const source = 'https://raw.githubusercontent.com/freefq/free/master/v2ray/freefq-vmess.json';

// 2. 需要保留的国家/地区代码
const allowed = ['HK','SG','JP','US','DE','TW'];

// 3. 拉取并过滤节点
async function fetchAndFilter() {
  try {
    const data = await fetchRemote(source);
    const list = JSON.parse(data);
    // 只保留指定国家/地区
    const filtered = list.filter(item => allowed.includes(item.country));
    // 转成 vmess:// 链接
    const lines = filtered.map(n => 'vmess://' + Buffer.from(JSON.stringify(n)).toString('base64'));
    // 写入文件
    fs.writeFileSync('sub.txt', lines.join('\n'), 'utf-8');
    console.log(`✅ 抓取完成，共写入 ${lines.length} 条节点`);
  } catch (e) {
    console.error('❌ 更新失败：', e.message);
  }
}

// 简单封装 HTTPS GET
function fetchRemote(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => resolve(raw));
    }).on('error', reject);
  });
}

fetchAndFilter();
