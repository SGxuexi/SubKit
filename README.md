# 自建节点订阅系统

这是一个基于 GitHub + Cloudflare Pages 的免费节点订阅系统，适合不方便使用 VPS 的用户自建订阅源。

## 功能介绍

- 自动拉取公开节点（支持 Clash / V2ray / Shadowsocks）
- 自动转换格式，生成三种订阅链接
- Cloudflare Pages 托管，永久免费在线
- 支持 GitHub Actions 自动定时更新（可选）

## 订阅链接示例

- Clash: `https://你的域名/clash.yaml`
- V2ray: `https://你的域名/v2ray.txt`
- Shadowsocks: `https://你的域名/ss.txt`

## 使用说明

1. 克隆或 Fork 本仓库
2. 部署到 Cloudflare Pages
3. 自定义或更换公开节点源（修改 `tools/update.js`）
4. 可选：设置 GitHub Actions 自动更新

## 免责声明

所有节点信息来源于公开地址，仅供学习与交流使用，请勿用于非法用途。
