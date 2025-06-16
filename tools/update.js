const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 自动创建 public 目录（如果不存在）
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// 订阅源列表（可根据需要增删）
const sources = [
  'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
  'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt'
];

// 结果存储
let nodes = [];

async function fetchSources() {
  for (const url of sources) {
    try {
      const res = await axios.get(url, { timeout: 15000 });
      const lines = res.data.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      nodes = nodes.concat(lines);
    } catch (err) {
      console.warn(`⚠️ 无法抓取：${url}`);
    }
  }
}

function saveToFile(filename, content) {
  fs.writeFileSync(path.join(publicDir, filename), content, 'utf8');
}

function generateClash(nodes) {
  const proxies = nodes.map((line, i) => {
    const [host, port] = line.trim().split(':');
    return {
      name: `node${i + 1}`,
      type: 'socks5',
      server: host,
      port: parseInt(port),
      udp: true
    };
  });

  return {
    port: 7890,
    socks-port: 7891,
    allow-lan: true,
    mode: 'Rule',
    proxies: proxies,
    'proxy-groups': [
      {
        name: 'Auto',
        type: 'url-test',
        proxies: proxies.map(p => p.name),
        url: 'http://www.gstatic.com/generate_204',
        interval: 300
      }
    ],
    rules: ['MATCH,Auto']
  };
}

function generateV2Ray(nodes) {
  return nodes
    .map(line => {
      const [host, port] = line.trim().split(':');
      return `socks://${host}:${port}`;
    })
    .join('\n');
}

function generateSS(nodes) {
  return nodes
    .map(line => {
      const [host, port] = line.trim().split(':');
      return `ss://YWVzLTI56CBzaW1wbGU6cGFzc3dvcmRA${host}:${port}#node`;
    })
    .join('\n');
}

(async () => {
  console.log('📡 正在从 GitHub 抓取节点数据...\n');
  await fetchSources();

  const total = nodes.length;
  console.log(`✅ 抓取完成：共 ${total} 条节点`);

  if (total === 0) {
    console.warn('⚠️ 无节点可写入，跳过生成文件');
    process.exit(0);
  }

  try {
    const clash = generateClash(nodes);
    const v2ray = generateV2Ray(nodes);
    const ss = generateSS(nodes);

    saveToFile('clash.yaml', `# 由 SubKit 自动生成\n${JSON.stringify(clash, null, 2)}`);
    saveToFile('v2ray.txt', v2ray);
    saveToFile('ss.txt', ss);

    console.log('\n✅ 已写入：');
    console.log(`  - public/clash.yaml (${nodes.length} 条)`);
    console.log(`  - public/v2ray.txt`);
    console.log(`  - public/ss.txt`);
  } catch (err) {
    console.error('❌ 写入文件出错：', err.message);
    process.exit(1);
  }
})();
