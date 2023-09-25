# 以下判斷可移除 但先保留
if [ ! -d ".output" ]; then
    npm install --force
    npm run build
fi

# 啟動前端伺服器
npx pm2 start ecosystem.config.js
