# 故障排查与最佳实践

本文档涵盖 CodeBuddy Code 的常见问题、解决方案和使用优化建议。

## 安装与系统要求

### Node.js 版本要求

CodeBuddy Code 需要 Node.js v18.20.8 或更高版本。

**检查版本**:
```bash
node -v
```

**升级 Node.js**: https://nodejs.org/en/download/

### Windows 平台特殊要求

#### Git Bash 依赖

Windows 平台必须安装 Git Bash 才能运行 CodeBuddy。

**安装 Git Bash**:
- 下载地址: https://git-scm.com/downloads/win
- 安装时确保勾选 "Git Bash" 组件

**自动检测逻辑**:
1. 优先检查环境变量 `CODEBUDDY_CODE_GIT_BASH_PATH`
2. 尝试在 PATH 中查找 `git` 命令
3. 检查常见安装位置:
   - `C:/Program Files/Git/bin/bash.exe`
   - `C:/Program Files (x86)/Git/bin/bash.exe`

**自定义 Git Bash 路径**:

如果 Git Bash 安装在非标准位置,设置环境变量:
```bash
set CODEBUDDY_CODE_GIT_BASH_PATH=C:\Program Files\Git\bin\bash.exe
```

或在 PowerShell 中:
```powershell
$env:CODEBUDDY_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
```

### 搜索工具问题

#### Ripgrep (rg) 未找到

CodeBuddy Code 使用 ripgrep 作为代码搜索工具，并提供了多种自动降级机制:

1. **内置二进制文件**: vendor 目录中预置了预编译的 ripgrep 二进制文件
2. **系统 PATH 检测**: 自动检测系统 PATH 中是否已安装 `rg` 命令
3. **自动下载**: 如果以上都不可用，会根据平台自动下载相应的二进制文件
   - 二进制文件会被缓存，避免重复下载
   - 支持 macOS (Intel/Apple Silicon)、Windows 和 Linux 平台

#### 搜索性能优化

虽然自动降级机制可以保证基本功能，但为获得最佳性能，建议通过包管理器在系统级别安装 ripgrep:

```bash
# macOS
brew install ripgrep

# Windows (Chocolatey)
choco install ripgrep

# Ubuntu/Debian
sudo apt install ripgrep
```

### Windows 安装常见问题

#### "codebuddy 不是内部或外部命令" 错误

**症状**:
- `npm install -g @tencent-ai/codebuddy-code` 安装成功
- 运行 `codebuddy` 命令时提示: "'codebuddy' 不是内部或外部命令"

**原因**: 
npm 全局安装目录未加入系统环境变量 PATH

**解决方案**:

1. 查找 npm 全局安装路径:
   ```bash
   npm config get prefix
   ```

2. 将以下路径添加到系统环境变量 PATH:
   - `%USERPROFILE%\AppData\Roaming\npm` (默认路径)
   - 或上一步命令显示的路径

3. 重启命令行窗口使环境变量生效

4. 验证安装:
   ```bash
   codebuddy --version
   ```

#### Git Bash 未找到错误

**症状**: 启动 CodeBuddy 时提示需要安装 git-bash

**解决方案**: 参考上方 "Windows 平台特殊要求 > Git Bash 依赖" 章节

## 常用功能

### JetBrains IDE 中 ESC 键不生效

**症状**: 在 JetBrains 系列 IDE (IntelliJ IDEA、WebStorm、PyCharm 等) 的终端中，按 `ESC` 键无法触发 CodeBuddy 的退出、取消等操作。

**原因**: JetBrains IDE 终端对 ESC 键的处理机制与标准终端不同。

**解决方案**:

所有需要使用 `ESC` 键的场景，在 JetBrains IDE 终端中改用 `Ctrl + ESC` or `Shift + ESC` 组合键：

| 场景 | 系统终端 | JetBrains IDE 终端 |
|------|---------|-------------------|
| 退出 Bash Mode | `ESC` | `Ctrl + ESC` or `Shift + ESC` or BackSpace 退格至行首 |
| 取消模型选择 | `ESC` | `Ctrl + ESC` or `Shift + ESC` |
| 退出配置界面 | `ESC` | `Ctrl + ESC` or `Shift + ESC` |
| 其他需要 ESC 的操作 | `ESC` | `Ctrl + ESC` or `Shift + ESC` |

**BackSpace 退格退出** (仅适用于 Bash Mode):
- 在 Bash Mode 中，连续按 `BackSpace` 删除所有输入
- 当光标退格至行首时，自动退出 Bash Mode

### 模型切换

CodeBuddy Code 支持多个 AI 模型，可根据不同的使用场景和需求灵活切换。

**切换方式**:

1. **使用斜杠命令** (推荐):
   ```
   /model
   ```
   - 会显示一个交互式选择界面
   - 列出所有可用的模型及其描述
   - 当前使用的模型会标记为绿色 ✓
   - 使用方向键选择,按 Enter 确认,按 Esc 退出

2. **指定具体模型名称**:
   ```
   /model [模型名称]
   ```
   - 直接切换到指定的模型
   - 适用于自定义模型名称的场景

**效果范围**:
- 切换后的模型会立即应用到当前对话
- 设置会持久保存,影响未来的所有会话

**查看当前模型**:
```
/status
```
查看当前会话使用的模型、Token 消耗等信息。

### 更新 CodeBuddy Code

#### 自动更新

CodeBuddy Code 默认开启了自动更新功能，无需手动操作即可获取最新版本。

**自动更新策略**:
- **检查频率**: 启动时和每隔一段时间自动检查新版本
- **下载方式**: 发现新版本后在后台静默下载
- **生效时机**: 下载完成后，下次启动 CodeBuddy Code 时自动应用新版本
- **更新提示**: 有新版本可用时会在界面显示提示信息

**管理自动更新**:

1. **查看自动更新状态**:
   ```
   /config
   ```
   在配置界面中查看 "自动更新" 选项的当前状态

2. **开启自动更新**:
   ```
   /config
   ```
   在配置界面中将 "自动更新" 设置为 `true`

3. **关闭自动更新**:
   ```
   /config
   ```
   在配置界面中将 "自动更新" 设置为 `false`

**注意事项**:
- 推荐保持自动更新开启，以获得最新功能和安全修复
- 关闭自动更新后，需要手动执行更新命令来获取新版本
- 自动更新不会中断当前工作，只在启动时生效

#### 手动更新

如果关闭了自动更新或需要立即更新到最新版本，可以使用以下方法：

**方法一: 使用内置命令** (推荐):
```bash
codebuddy update
```
此命令会检查最新版本并自动完成更新。

**方法二: 使用 npm 更新**:
```bash
npm install -g @tencent-ai/codebuddy-code@latest
```
直接通过 npm 安装最新版本，适用于所有平台。

**方法三: 更新到指定版本**:
```bash
npm install -g @tencent-ai/codebuddy-code@1.11.0
```
安装特定版本，适用于需要回退或测试特定版本的场景。

**方法四: 完全重装** (用于解决更新问题):
```bash
npm uninstall -g @tencent-ai/codebuddy-code
npm install -g @tencent-ai/codebuddy-code
```
先卸载再安装，可以解决某些更新异常问题。

#### 检查版本

**查看当前安装版本**:
```bash
codebuddy --version
# 或
codebuddy -v
```

**查看 npm 上的最新版本**:
```bash
npm view @tencent-ai/codebuddy-code version
```

**对比版本**:
```bash
# 一次性查看本地和最新版本
npm outdated -g @tencent-ai/codebuddy-code
```

#### 更新后验证

更新完成后，建议重启终端并验证：

1. **检查版本号**:
   ```bash
   codebuddy --version
   ```
   确认版本号已更新

2. **测试基本功能**:
   ```bash
   codebuddy
   ```
   启动 CodeBuddy Code，确认可以正常运行

3. **查看更新日志**:
   访问 [CHANGELOG.md](../CHANGELOG.md) 查看新版本的功能和改进

## 从 Claude Code 迁移到 CodeBuddy Code

### 迁移方案概述

如果你之前使用 Claude Code (claude-code) 并希望迁移到 CodeBuddy Code,以下提供多种方案以保留原有配置和数据。

### 方案一: 符号链接方式 (推荐)

这是最简单且高效的方式,直接复用 Claude Code 的配置和数据,无需复制文件。

**全局配置迁移**:

1. 确保已安装 CodeBuddy Code:
   ```bash
   npm install -g @tencent-ai/codebuddy-code
   ```

2. 在 CodeBuddy 全局配置目录创建符号链接:
   ```bash
   # macOS/Linux
   cd ~/.codebuddy
   ln -s ~/.claude/agents agents
   ln -s ~/.claude/commands commands
   ln -s ~/.claude/CLAUDE.md CODEBUDDY.md
   ```

   ```powershell
   # Windows (PowerShell,需要管理员权限)
   cd $env:USERPROFILE\.codebuddy
   New-Item -ItemType SymbolicLink -Path agents -Target $env:USERPROFILE\.claude\agents
   New-Item -ItemType SymbolicLink -Path commands -Target $env:USERPROFILE\.claude\commands
   New-Item -ItemType SymbolicLink -Path CODEBUDDY.md -Target $env:USERPROFILE\.claude\CLAUDE.md
   ```

**项目级配置迁移**:

在每个项目目录下:
```bash
# macOS/Linux
cd /path/to/your/project/.codebuddy
ln -s ../.claude/agents agents
ln -s ../.claude/commands commands
ln -s ../.claude/CLAUDE.md CODEBUDDY.md
```

```powershell
# Windows (PowerShell,需要管理员权限)
cd C:\path\to\your\project\.codebuddy
New-Item -ItemType SymbolicLink -Path agents -Target ..\\.claude\\agents
New-Item -ItemType SymbolicLink -Path commands -Target ..\\.claude\\commands
New-Item -ItemType SymbolicLink -Path CODEBUDDY.md -Target ..\\.claude\\CLAUDE.md
```

**优点**:
- 无需复制文件,节省磁盘空间
- Claude Code 和 CodeBuddy Code 可以共享配置和 agents/commands
- 修改一处,两边同步生效

**缺点**:
- Windows 需要管理员权限创建符号链接
- 两个工具会共享同一份数据,删除 Claude Code 会影响 CodeBuddy Code

### 方案二: 复制文件方式

完全迁移到 CodeBuddy Code,保留 Claude Code 的独立性。

**全局配置迁移**:

```bash
# macOS/Linux
cp -r ~/.claude/agents ~/.codebuddy/agents
cp -r ~/.claude/commands ~/.codebuddy/commands
cp ~/.claude/CLAUDE.md ~/.codebuddy/CODEBUDDY.md
```

```powershell
# Windows (PowerShell)
Copy-Item -Recurse $env:USERPROFILE\.claude\agents $env:USERPROFILE\.codebuddy\agents
Copy-Item -Recurse $env:USERPROFILE\.claude\commands $env:USERPROFILE\.codebuddy\commands
Copy-Item $env:USERPROFILE\.claude\CLAUDE.md $env:USERPROFILE\.codebuddy\CODEBUDDY.md
```

**项目级配置迁移**:

```bash
# macOS/Linux
cp -r .claude/agents .codebuddy/agents
cp -r .claude/commands .codebuddy/commands
cp .claude/CLAUDE.md .codebuddy/CODEBUDDY.md
```

```powershell
# Windows (PowerShell)
Copy-Item -Recurse .claude\agents .codebuddy\agents
Copy-Item -Recurse .claude\commands .codebuddy\commands
Copy-Item .claude\CLAUDE.md .codebuddy\CODEBUDDY.md
```

**优点**:
- 两个工具完全独立,互不影响
- 不需要管理员权限
- 删除 Claude Code 不会影响 CodeBuddy Code

**缺点**:
- 占用额外磁盘空间
- 需要在两边分别维护配置

### 方案三: 混合方式

将部分常用配置使用符号链接共享,其他配置独立管理。

**示例**: agents 和 commands 使用符号链接,CODEBUDDY.md 独立:

```bash
# macOS/Linux
cd ~/.codebuddy
ln -s ~/.claude/agents agents
ln -s ~/.claude/commands commands
cp ~/.claude/CLAUDE.md CODEBUDDY.md
```

这样可以共享 agents 和 slash commands,但保持项目配置文件独立,便于针对 CodeBuddy Code 进行特定调整。

### 配置内容说明

迁移涉及的主要内容:

1. **agents/**: 自定义 agents 配置,用于扩展 AI 功能
2. **commands/**: 斜杠命令(slash commands)定义,如 `/mr`、`/release` 等
3. **CLAUDE.md / CODEBUDDY.md**: 项目或全局级别的 AI 指令和记忆文档

### 验证迁移结果

迁移完成后,验证配置是否生效:

1. 启动 CodeBuddy Code:
   ```bash
   codebuddy
   ```

2. 检查斜杠命令是否可用:
   ```
   /mr
   /release
   ```

3. 查看配置:
   ```
   /config
   ```

4. 检查 CODEBUDDY.md 是否被加载 (在聊天中询问 AI 是否知道项目配置)

**注意**: 如果使用符号链接方式,建议保留 `~/.claude` 目录,因为 CodeBuddy Code 仍在引用它。

## 成本优化最佳实践

合理管理对话会话可以显著降低 Token 消耗,同时提升 AI 响应质量。

### 为什么需要管理会话?

长期使用同一个会话会导致:

- **成本增加**: 每次请求都会携带完整的历史消息，即使命中缓存也会消耗大量 Token
- **效果下降**: 历史消息中的上下文干扰会让模型在处理新任务时表现不佳
- **响应变慢**: 上下文过长会增加模型处理时间

### 会话管理策略

**1. 新任务开启新会话**

当开始一个全新的需求或任务时,建议清空当前会话:

```
/clear
```

**适用场景**:
- 切换到完全不同的项目或功能
- 开始新的功能开发、问题修复或重构任务
- 之前的对话上下文对新任务没有帮助

**示例**:

❌ **错误做法**:
```
用户: 帮我实现用户登录功能
AI: [完成登录功能实现]
用户: 现在帮我优化数据库查询性能
// 问题: 登录功能的上下文会干扰数据库优化任务
```

✅ **正确做法**:
```
用户: 帮我实现用户登录功能
AI: [完成登录功能实现]
用户: /clear
用户: 帮我优化数据库查询性能
// 效果: 清空上下文，专注新任务
```

**2. 定期清理或压缩会话历史**

即使在同一任务中，当对话历史过长时也应考虑清理或压缩:

- 当前任务已完成，开始下一个相关任务
- 对话轮次超过 20-30 轮
- 发现 AI 响应速度明显变慢
- Token 消耗过快

可以使用 `/compact` 命令压缩历史，保留关键上下文，或使用 `/clear` 完全清空。

**3. 精简提问内容**

- **使用文件引用**: 使用 `@filename` 引用文件，而非直接粘贴大段代码
- **精准描述问题**: 简洁明确的问题描述比冗长的背景说明更有效
- **分步执行**: 将复杂任务拆分成多个小步骤，逐步完成
- **避免重复信息**: 如果 AI 已经知道的信息，无需重复提供

### Token 消耗对比

以典型的开发任务为例，对比不同会话管理方式的成本差异:

| 使用方式 | 输入 Token | 缓存命中 Token | 相对成本 |
|---------|-----------|--------------|---------|
| 单会话连续 10 个任务 | ~50,000 | ~200,000 | 高 ⬆️ |
| 每个任务新会话 | ~15,000 | ~30,000 | 低 ⬇️ |
| 使用 /compact 定期压缩 | ~25,000 | ~80,000 | 中等 |

**说明**: 
- 即使缓存命中，读取缓存仍然会产生成本（虽然比全新输入便宜约 90%）
- 数值为估算值，实际消耗取决于任务复杂度和对话长度

### 会话管理命令

CodeBuddy Code 提供了多个命令来帮助你管理会话和优化成本:

| 命令 | 功能 | 使用场景 |
|------|------|---------|
| `/cost` | 查看当前会话的 Token 使用情况和成本统计 | 定期检查成本消耗 |
| `/status` | 查看当前会话状态和模型信息 | 查看会话配置 |
| `/clear` | 清空当前会话历史，开启全新对话 | 开始新任务或切换主题 |
| `/compact` | 压缩历史对话，保留关键上下文 | 长对话中途优化 |

**推荐使用频率**:
- 每完成一个大任务后使用 `/clear`
- 每 20-30 轮对话使用 `/compact` 
- 定期使用 `/cost` 监控 Token 消耗

### 最佳实践总结

#### ✅ 推荐做法

**会话管理**:
- ✓ 新任务使用 `/clear` 开启新会话
- ✓ 定期使用 `/cost` 检查 Token 消耗
- ✓ 长对话中途使用 `/compact` 压缩历史

**交互方式**:
- ✓ 使用文件引用 `@filename` 而非直接粘贴代码
- ✓ 精简提问，专注核心问题
- ✓ 分步执行复杂任务
- ✓ 及时结束已完成任务的会话

#### ❌ 避免做法

**会话管理**:
- ✗ 在同一会话中处理多个不相关任务
- ✗ 让对话历史无限增长超过 30 轮
- ✗ 忽略 Token 消耗过高的警告

**交互方式**:
- ✗ 重复粘贴 AI 已知的代码内容
- ✗ 冗长的背景描述和无关信息
- ✗ 一次性提出过多复杂需求

#### 预期效果

遵循这些实践，可以在保持高质量对话的同时:
- **降低 60-80% 的 Token 消耗**
- **提升 AI 响应准确度和速度**
- **获得更好的问题解决效果**

---

**需要更多帮助？**
- 查看 [快速入门指南](./quickstart.md)
