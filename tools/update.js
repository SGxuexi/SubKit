// tools/update.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');

// 确保输出目录 public/ 存在
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

// 订阅源：SpeedX 的 SOCKS5 列表
const source = 'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt';

(async () => {
  try {
    console.log('📡 开始拉取 SOCKS5 节点...');
    const res = await axios.get(source, { timeout: 10000 });
    const lines = res.data
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && /^\d+\.\d+\.\d+\.\d+:\d+$/.test(l));

    if (lines.length === 0) {
      console.error('❌ 未抓取到任何节点');
      process.exit(1);
    }
    console.log(`✅ 抓取到 ${lines.length} 个 SOCKS5 节点`);

    // ss.txt 伪造 Shadowsocks 链接
    const ss = lines.map((l, i) => {
      const [host, port] = l.split(':');
      const fake = 'YWVzLTI1Ni1nY206cGFzc3MhQHNzbmV0OjEyMw=='; // fake user:pass
      return `ss://${fake}@${host}:${port}#node${i+1}`;
    });
    fs.writeFileSync(path.join(publicDir, 'ss.txt'), ss.join('\n'));

    // v2ray.txt 使用 socks:// 前缀
    const v2ray = lines.map(l => `socks5://${l}`);
    fs.writeFileSync(path.join(publicDir, 'v2ray.txt'), v2ray.join('\n'));

    // clash.yaml 格式
    const proxies = lines.map((l, i) => {
      const [host, port] = l.split(':');
      return {
        name: `socks5-${i+1}`,
        type: 'socks5',
        server: host,
        port: parseInt(port),
        udp: true
      };
    });
    const config = {
      proxies,
      'proxy-groups': [{
        name: 'Auto',
        type: 'url-test',
        proxies: proxies.map(p => p.name),
        url: 'http://www.gstatic.com/generate_204',
        interval: 300
      }],
      rules: ['MATCH,Auto']
    };
    fs.writeFileSync(path.join(publicDir, 'clash.yaml'), yaml.dump(config));

    console.log('✅ 订阅文件生成完成！');
  } catch (err) {
    console.error('❌ 错误：', err.message);
    process.exit(1);
  }
})();
