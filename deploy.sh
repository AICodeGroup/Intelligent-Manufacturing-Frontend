#!/bin/bash
# --- 项目配置 (制造业 Agent 专用) ---
APP_NAME="AI-Manufacturing-Industry"        # 1. 必须改名，区分进程
SERVER_IP="115.190.208.96"
REMOTE_DIR="/root/AI-Manufacturing-Industry" # 2. 必须指向 Agent 的目录
PORT="5002"                          # 3. 端口 5002 没问题

echo "🚀 开始部署项目: $APP_NAME 到 $SERVER_IP..."

# 1. 本地清理
rm -rf .next

# 2. 同步代码
echo "📦 正在同步代码到服务器..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    ./ root@$SERVER_IP:$REMOTE_DIR/

# 3. 远程构建与重启
ssh root@$SERVER_IP << EOF
    cd $REMOTE_DIR
    [ -s "\$HOME/.nvm/nvm.sh" ] && . "\$HOME/.nvm/nvm.sh"
    
    pnpm install
    pnpm run build
    
    # 关键修复：强制杀掉可能占用 5002 的幽灵，并启动新进程
    pm2 delete $APP_NAME 2>/dev/null
    PORT=$PORT pm2 start "pnpm start -- -p $PORT" --name "$APP_NAME"
    
    pm2 save
    echo "✅ Agent 部署完成！"
EOF
echo "🎉 部署成功！访问地址: https://agent.futureway-ai.com"