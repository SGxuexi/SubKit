const axios = require("axios");
const { Base64 } = require("js-base64");
const fs = require("fs");

async function fetchAndSave(url, filename, convertFunc = (x) => x) {
  try {
    const res = await axios.get(url);
    const data = convertFunc(res.data);
    fs.writeFileSync(filename, data);
    console.log(`Saved: ${filename}`);
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
  }
}

// 示例节点源（可替换为你喜欢的）
const sources = [
  {
    url: "https://raw.githubusercontent.com/SSNg/TelegramNode/main/clash.yaml",
    clash: "clash.yaml",
    ss: "ss.txt",
    v2ray: "v2ray.txt",
  },
];

function convertClashToSS(data) {
  const matches = data.match(/ss:\/\/[^\s#"]+/g);
  return matches ? matches.join("\n") : "";
}

function convertClashToV2ray(data) {
  const matches = data.match(/(vmess:\/\/[^\s#"]+|vless:\/\/[^\s#"]+)/g);
  return matches ? matches.join("\n") : "";
}

(async () => {
  for (const src of sources) {
    await fetchAndSave(src.url, src.clash);
    await fetchAndSave(src.url, src.ss, convertClashToSS);
    await fetchAndSave(src.url, src.v2ray, convertClashToV2ray);
  }
})();
