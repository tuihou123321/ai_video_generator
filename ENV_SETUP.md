# 环境变量配置说明

## 概述
项目现在使用环境变量来管理API密钥，提高了安全性和配置灵活性。

## 配置步骤

### 1. 代理服务器配置
位置：`proxy-server/`

1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入真实的API密钥：
   ```env
   # DashScope API配置
   DASHSCOPE_API_KEY=your_dashscope_api_key_here
   
   # Remove.bg API配置
   REMOVE_BG_API_KEY=your_remove_bg_api_key_here
   
   # 服务器配置
   PORT=3001
   ```

### 2. 前端应用配置
位置：`video-site/`

1. 复制环境变量模板：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件：
   ```env
   # Remove.bg API配置 (注意React环境变量必须以REACT_APP_开头)
   REACT_APP_REMOVE_BG_API_KEY=your_remove_bg_api_key_here
   ```

## 安全注意事项

- ✅ `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制
- ✅ 提供了 `.env.example` 模板文件供参考
- ✅ 代码中添加了环境变量检查和错误提示
- ✅ 生产环境请使用不同的API密钥

## 启动服务

1. 代理服务器：
   ```bash
   cd proxy-server
   npm start
   ```

2. 前端应用：
   ```bash
   cd video-site
   npm start
   ```

## 环境变量说明

| 变量名 | 用途 | 位置 |
|--------|------|------|
| `DASHSCOPE_API_KEY` | 阿里云DashScope API密钥 | proxy-server |
| `REMOVE_BG_API_KEY` | Remove.bg API密钥 | proxy-server |
| `REACT_APP_REMOVE_BG_API_KEY` | Remove.bg API密钥 | video-site |
| `PORT` | 代理服务器端口 | proxy-server |