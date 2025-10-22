# CLI 参考

CodeBuddy Code 命令行工具的完整参考手册，基于真实命令结构提供准确的使用说明。

> 注意：部分命令为预留占位，当前版本尚未完全实现，调用时会提示不支持。请以 `--help` 实际输出为准。

## 🚀 基本语法

```bash
codebuddy [options] [command] [prompt]
cbc [options] [command] [prompt]
```

CodeBuddy Code 默认启动交互式会话，使用 `-p/--print` 进行非交互式输出。

> **重要提示**：当使用 `-p/--print` 参数时，如果需要调用需要授权的工具（如文件操作、网络请求等），必须明确指定 `--dangerously-skip-permissions` 参数，否则会被权限检查阻止。

## 📋 全局选项

### 基础选项
```bash
-V, --version                         输出版本号
-h, --help                            显示帮助信息
-d, --debug [filter]                  启用调试模式，支持可选的类别过滤
                                      (如 "api,hooks" 或 "!statsig,!file") (默认: false)
    --verbose                         覆盖配置中的详细模式设置 (默认: false)
-p, --print                           打印响应并退出 (适用于管道) (默认: false)
```

### 输入输出格式  
```bash
--output-format <format>              输出格式 (仅与 --print 配合使用):
                                      "text" (默认), "json" (单个结果),
                                      或 "stream-json" (实时流式)
--input-format <format>               输入格式 (仅与 --print 配合使用):
                                      "text" (默认), 或 "stream-json"
                                      (实时流式输入)
```

### 会话管理
```bash
-c, --continue                        继续最近的对话 (默认: false)
-r, --resume [sessionId]              恢复对话 - 提供会话ID或交互式选择
    --session-id <uuid>               使用特定的会话ID (必须是有效的UUID)
```

### AI 模型选项
```bash
--model <model>                       当前会话的模型。提供模型名称
                                      (如 'gpt-5' 或 'gpt-4')
--fallback-model <model>              当默认模型过载时自动回退到指定模型
                                      (仅与 --print 配合使用)
```

### 安全和权限
```bash
--dangerously-skip-permissions        绕过所有权限检查。仅推荐用于无网络访问的沙箱
--permission-mode <mode>              权限模式: "acceptEdits", "bypassPermissions", 
                                      "default", "plan"
                                      支持会话级动态管理，UI实时显示当前状态
--allowedTools <tools...>             允许的工具列表 (如 "Bash(git:*) Edit")
--disallowedTools <tools...>          禁止的工具列表 (如 "Bash(git:*) Edit")
--add-dir <directories...>            允许工具访问的额外目录
```

### 网络和请求
```bash
-H, --header <headers...>             自定义HTTP请求头 (格式: "Header-Key: Header-Value")
                                      可多次使用以设置多个请求头
-s, --serve                           启动 HTTP 服务器模式 (非交互式) (默认: false)
    --port <number>                   HTTP 服务器端口 (默认: 自动分配)
    --host <string>                   HTTP 服务器绑定地址 (默认: 127.0.0.1)
```

### 沙箱模式 (Beta)

> ⚠️ **Beta 功能**: Sandbox 功能目前处于 Beta 阶段。
> 📘 **详细文档**: 查看 [Sandbox 沙箱使用指南](./sandbox.md) 获取完整的沙箱使用说明、最佳实践和故障排查。

```bash
--sandbox [url]                       在沙箱中运行 CodeBuddy:
                                      - 不带参数或 "container": 使用容器 (Docker/Podman)
                                      - "seatbelt": 使用 macOS Seatbelt (仅 macOS)
                                      - 提供完整的 E2B API URL: 使用云端沙箱 (如 https://api.e2b.dev)
--sandbox-upload-dir                  上传当前工作目录到沙箱 (仅 E2B) (默认: false)
--sandbox-new                         强制创建新沙箱 (忽略缓存的沙箱) (默认: false)
--sandbox-id <id>                     连接到指定的沙箱 ID 或别名
                                      - 已存在的别名: 自动复用对应的沙箱
                                      - E2B 真实 ID: 直接连接
                                      - 新名称: 创建新沙箱并保存为别名
--sandbox-kill                        退出时终止沙箱 (默认: 保持运行以便复用) (默认: false)
--sandbox-profile <profile>           Seatbelt 配置文件 (仅 Seatbelt):
                                      permissive-open (默认), permissive-closed,
                                      restrictive-open, restrictive-closed
```

#### 沙箱使用示例
```bash
# macOS Seatbelt 沙箱 (轻量快速, 仅 macOS)
codebuddy --sandbox seatbelt "分析这个项目"
codebuddy --sandbox seatbelt --sandbox-profile restrictive-closed "高安全任务"

# 容器沙箱 (Docker/Podman, 自动挂载当前目录)
codebuddy --sandbox "分析这个项目"              # 等价于 --sandbox container
codebuddy --sandbox container "分析这个项目"

# E2B 云端沙箱 (自动复用)
codebuddy --sandbox https://api.e2b.dev "创建 Python web 应用"
codebuddy --sandbox https://api.e2b.dev --sandbox-upload-dir "分析代码"

# 强制创建新沙箱
codebuddy --sandbox --sandbox-new "从头开始"

# 连接到指定沙箱 (真实 ID)
codebuddy --sandbox --sandbox-id sb_abc123 "继续工作"

# 使用别名 (自动创建和复用)
codebuddy --sandbox https://api.e2b.dev --sandbox-id user-123 -p "任务"  # 首次创建
codebuddy --sandbox https://api.e2b.dev --sandbox-id user-123 -p "任务"  # 自动复用

# 退出时清理沙箱
codebuddy --sandbox --sandbox-kill "临时测试"
```

#### 沙箱环境变量
```bash
E2B_API_KEY                          E2B API 密钥 (E2B 沙箱必需)
E2B_TEMPLATE                         E2B 模板 ID (默认: base)
CODEBUDDY_SANDBOX_IMAGE              自定义 Docker 镜像 (容器沙箱，默认: node:20-alpine)
```

#### E2B 模板说明

**默认模板（base）**：
- E2B 官方基础镜像
- 启动时自动安装 CodeBuddy CLI
- 包含 Node.js、Python 等常用开发工具

**自定义模板**：
你也可以创建预装 CodeBuddy 的自定义模板以加快启动速度：

```typescript
import { Template } from '@e2b/code-interpreter';

const template = Template()
  .fromNodeImage('20')
  .npmInstall(['@tencent-ai/codebuddy-code'], { g: true })
  .apt(['git', 'python3', 'python3-pip']);  // 添加额外工具

await Template.build(template, { alias: 'my-codebuddy-template' });
```

然后使用：`export E2B_TEMPLATE=my-codebuddy-template`

### MCP 集成
```bash
--mcp-config <fileOrString>           从JSON文件或字符串加载MCP服务器
--strict-mcp-config                   仅使用 --mcp-config 中的MCP服务器，
                                      忽略其他MCP配置 (默认: false)
```

### IDE 集成
```bash
--ide                                 如果有且仅有一个有效IDE可用，
                                      启动时自动连接 (默认: false)
```

## 🎯 主要命令

### 交互模式
```bash
# 启动交互式对话
codebuddy

# 指定模型启动
codebuddy --model gpt-5

# 继续最近的对话
codebuddy -c

# 恢复特定会话
codebuddy -r session-id-12345

# 自动连接IDE
codebuddy --ide
```

### 单次执行模式
```bash
# 基本提问
codebuddy -p "解释这个函数的作用"

# JSON 格式输出
codebuddy -p "分析代码结构" --output-format json

# 流式输出
codebuddy -p "生成大量代码" --output-format stream-json

# 管道输入
cat error.log | codebuddy -p "分析这些错误日志"

# 需要工具授权的操作（必须添加 --dangerously-skip-permissions）
codebuddy -p "修改这个文件" --dangerously-skip-permissions
codebuddy -p "运行测试命令" --dangerously-skip-permissions
```

### 模型和回退
```bash
# 使用特定模型
codebuddy --model gpt-5 -p "复杂的代码分析任务"

# 设置回退模型
codebuddy --model gpt-5 --fallback-model gpt-4 -p "查询"

# 使用自定义请求头
codebuddy -H "Authorization: Bearer token123" -H "X-Custom-Header: value" -p "查询"
```

### 配置命令 (config)

```bash
# 列出配置（支持）
codebuddy config list

# 获取配置（支持）
codebuddy config get model

# 设置配置（支持，限 keys: permissions, model, env, apiKeyHelper）
codebuddy config set model gpt-5
```

### MCP 命令 (mcp)

```bash
# 列出 MCP（支持）
codebuddy mcp list

# 其他子命令（帮助可见，但可能因配置缺失而不可用）
codebuddy mcp add <name> <commandOrUrl> [args...]
codebuddy mcp remove <name>
codebuddy mcp get <name>
codebuddy mcp add-json <name> <json>
```

## 🛠️ 实用命令

### HTTP 服务器模式
```bash
# 启动 HTTP 服务器(自动分配端口)
codebuddy --serve

# 指定端口启动服务器
codebuddy --serve --port 3000

# 自定义绑定地址和端口
codebuddy --serve --host 0.0.0.0 --port 8080

# 使用 npm script 启动
npm run serve          # 自动分配端口
npm run serve:port     # 固定 3000 端口
```

### 安装和更新
```bash
# 安装(当前不支持,执行会提示不支持)
codebuddy install [options] [target]

# 检查更新(支持)
codebuddy update

# 从全局npm安装迁移(当前不支持,执行会提示不支持)
codebuddy migrate-installer

# 健康检查(当前不支持,执行会提示不支持)
codebuddy doctor
```

## 🎨 输出格式详解

### text 格式 (默认)
```bash
codebuddy -p "Hello" --output-format text
# 输出: 纯文本响应
```

### json 格式
```bash
codebuddy -p "分析代码" --output-format json
# 输出: {"response": "...", "metadata": {...}}
```

### stream-json 格式
```bash
codebuddy -p "生成长代码" --output-format stream-json
# 输出: 实时流式JSON响应
```

## 🔒 安全和权限控制

> **关键说明**：在使用 `-p/--print` 参数进行单次执行时，任何需要工具授权的操作都必须明确添加 `--dangerously-skip-permissions` 参数，否则会被权限检查阻止。

### 工具权限控制
```bash
# 只允许特定工具
codebuddy --allowedTools "Read Edit" -p "修改文件" --dangerously-skip-permissions

# 禁止特定工具
codebuddy --disallowedTools "Bash" -p "分析代码"

# 允许特定Git操作
codebuddy --allowedTools "Bash(git:status,git:diff)" -p "检查Git状态" --dangerously-skip-permissions

# 跳过权限检查 (谨慎使用，-p 模式下的必需参数)
codebuddy --dangerously-skip-permissions -p "执行需要授权的操作"
```

### 目录访问控制
```bash
# 添加允许访问的目录
codebuddy --add-dir /path/to/project --add-dir /tmp -p "处理文件"
```

## 📝 实用示例

### 日常开发
```bash
# 代码审查 (管道输入)
git diff | codebuddy -p "审查这些代码变更"

# 生成提交信息 (需要授权)
git diff --cached | codebuddy -p "生成提交信息" --output-format text --dangerously-skip-permissions

# 错误日志分析
tail -f error.log | codebuddy -p "实时分析错误" --input-format stream-json
```

### 项目分析
```bash
# 项目结构分析
codebuddy -p "分析项目结构并提供改进建议" --output-format json

# 依赖分析
cat package.json | codebuddy -p "分析依赖并建议优化"
```

### 会话管理
```bash
# 开始一个有特定ID的会话
codebuddy --session-id "550e8400-e29b-41d4-a716-446655440000"

# 继续上次对话
codebuddy -c

# 恢复特定会话 (交互式选择)
codebuddy -r
```

### MCP 工作流
```bash
# 配置文件系统MCP服务器
codebuddy mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ./src

# 使用MCP配置启动
codebuddy --mcp-config mcp-servers.json

# 严格MCP模式 (仅使用指定配置)
codebuddy --strict-mcp-config --mcp-config servers.json
```

## ⚡ 性能优化技巧

### 模型选择策略
```bash
# 简单任务使用快速模型
codebuddy --model gpt-4 -p "简单问题"

# 复杂任务使用高级模型
codebuddy --model gpt-5 -p "复杂分析任务"

# 设置回退模型防止过载
codebuddy --model gpt-5 --fallback-model gpt-4 -p "查询"
```

### 输出优化
```bash
# 流式输出获得即时反馈
codebuddy -p "生成大量代码" --output-format stream-json

# JSON格式便于程序处理
codebuddy -p "分析数据" --output-format json | jq '.response'
```

## 🚨 故障排除

### 调试选项
```bash
# 启用调试模式
codebuddy --debug -p "测试查询"

# 详细输出
codebuddy --verbose -p "需要详细信息的查询"

# 组合调试选项
codebuddy --debug --verbose -p "完整调试信息"
```

### 常见问题解决
```bash
# 权限问题 (必须添加 --dangerously-skip-permissions)
codebuddy --allowedTools "Read Edit Bash" -p "需要多种工具的操作" --dangerously-skip-permissions

# 会话问题
codebuddy --session-id "new-uuid" -p "开始新会话"

# MCP连接问题
codebuddy mcp list  # 检查MCP服务器状态
codebuddy --strict-mcp-config --mcp-config config.json  # 使用特定配置
```

## 🔄 命令组合和管道

### 管道操作
```bash
# 多阶段处理
find . -name "*.js" | head -5 | xargs cat | codebuddy -p "分析代码模式"

# 结合Git操作
git log --oneline -10 | codebuddy -p "分析提交历史"

# 实时日志分析
tail -f app.log | codebuddy -p "监控并分析日志" --input-format stream-json
```

### 批量操作
```bash
# 批量文件处理
for file in *.js; do
  codebuddy -p "为文件添加注释: $file" --output-format json >> results.json
done
```

## 🚀 下一步

掌握 CLI 命令后，您可以：

- **[学习交互模式](interactive-mode.md)** - 掌握键盘快捷键和技巧
- **[探索斜杠命令](slash-commands.md)** - 了解内置命令
- **[学习 MCP 集成](mcp.md)** - 扩展工具能力

---

*精确的命令行操作是高效开发的基础 ⚡*
