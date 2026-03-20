#!/bin/bash# --- 项目配置 (根据实际项目修改) ---
APP_NAME="futureway-official"        # PM2 进程名称
SERVER_IP="115.190.208.96"           # 服务器 IP
REMOTE_DIR="/root/futureway-official" # 服务器目标目录
PORT="5002"                          # 运行端口 (官网5002, Agent5002)echo "🚀 开始部署项目: $APP_NAME 到 $SERVER_IP..."# 1. 本地清理 (可选，防止旧缓存干扰)echo "🧹 清理本地旧缓存..."
rm -rf .next

# 2. 同步代码到服务器 (排除不必要的文件夹)echo "📦 正在同步代码到服务器..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    ./ root@$SERVER_IP:$REMOTE_DIR/

# 3. 远程执行构建与重启echo "🛠️ 正在服务器上执行构建 (这可能需要一点时间)..."
ssh root@$SERVER_IP << EOF
    cd $REMOTE_DIR
    
    # 加载环境变量 (根据服务器 shell 环境可能需要)
    [ -s "\$HOME/.nvm/nvm.sh" ] && . "\$HOME/.nvm/nvm.sh"
    
    # 安装依赖与构建
    pnpm install
    pnpm run build
    
    # 使用 PM2 重启服务
    # 如果进程不存在则启动，存在则重启
    pm2 delete $APP_NAME 2>/dev/null
    pm2 start pnpm --name "$APP_NAME" -- start -- -p $PORT
    
    # 保存 PM2 状态
    pm2 save
    
    echo "✅ 服务器操作完成！"
EOFecho "🎉 部署成功！访问地址: https://agent.futureway-ai.com"