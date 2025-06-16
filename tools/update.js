const https = require('https');
const fs = require('fs');
const path = require('path');

// 你要拉取的三个远程 GitHub 文件
const sources = {
  clash: 'https://api.github.com/repos/TheSpeedX/PROXY-List/contents/clash.yaml',
  ss: 'https://api.github.com/repos/clarketm/proxy-list/contents/proxy-list.txt',
  v2ray: 'https://api.github.com/repos/prxchk/proxy-list/contents/http.txt',
};

const outputFiles = {
  clash: path.join(__dirname, '../public/clash.yaml'),
  ss: path.join(__dirname, '../public/ss.txt'),
  v2ray: path.join(__dirname, '../public/v2ray.txt'),
};

async function fetchFromGitHub(apiUrl) {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3.raw'  // 直接获取原始内容
      }
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve(raw));
    }).on('error', reject);
  });
}

async function update() {
  try {
    console.log('📡 正在从 GitHub 抓取节点数据...');

    let count = 0;

    for (const key in sources) {
      const url = sources[key];
      const filePath = outputFiles[key];
      console.log(`🔗 拉取 ${key} 数据中...`);

      const content = await fetchFromGitHub(url);

      // 简单判断节点数（非严格）
      const lines = content.split('\n');
      if (lines.length < 5) {
        console.warn(`⚠️ ${key} 数据过少，可能拉取失败。`);
      } else {
        count += lines.length;
      }

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ 写入 ${key} 节点完成，共 ${lines.length} 行`);
    }

    console.log(`\n🎉 抓取完成：总计 ${count} 条节点，文件生成成功。`);
  } catch (err) {
    console.error('❌ 更新失败：', err.message);
  }
}

update();
