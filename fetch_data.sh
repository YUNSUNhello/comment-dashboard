#!/bin/bash
# ============================================================
# 自动化数据抓取脚本 - 评论运营数据看板
# 从腾讯文档抓取最新数据并更新看板
# ============================================================
set -e

# Paths
NODE_BIN="/Users/wind/.workbuddy/binaries/node/versions/22.12.0/bin"
DASHBOARD_DIR="/Users/wind/WorkBuddy/20260403120152/dashboard"
DATA_FILE="$DASHBOARD_DIR/data.json"
LOG_FILE="$DASHBOARD_DIR/fetch.log"
DOC_URL="https://doc.weixin.qq.com/sheet/e3_APMA_AZiACICNr8oCT0zTQkqbd0V7?scode=AJEAIQdfAAo2m68v1qAPMA_AZiACI&tab=3edp8v"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========== 开始数据抓取 =========="

# Step 1: Open browser and navigate to doc
log "打开浏览器并访问腾讯文档..."
PATH="$NODE_BIN:$PATH" npx agent-browser open "$DOC_URL" --ignore-https-errors 2>&1 | tee -a "$LOG_FILE"

# Wait for page load
log "等待页面加载..."
sleep 8

# Step 2: Check if we need to switch to personal login
log "检查登录状态..."
LOGIN_CHECK=$(PATH="$NODE_BIN:$PATH" npx agent-browser snapshot -i 2>&1 | head -20)

if echo "$LOGIN_CHECK" | grep -q "切换个人身份登录"; then
    log "需要切换到个人身份登录..."
    PATH="$NODE_BIN:$PATH" npx agent-browser eval "
        const btn = document.querySelector('[class*=switch]');
        if(btn) btn.click();
        'switched';
    " 2>&1 | tee -a "$LOG_FILE"
    sleep 3
fi

if echo "$LOGIN_CHECK" | grep -q "扫码"; then
    log "需要微信扫码登录，等待60秒..."
    sleep 60
fi

# Verify we're on the spreadsheet
PAGE_TITLE=$(PATH="$NODE_BIN:$PATH" npx agent-browser get title 2>&1)
log "当前页面标题: $PAGE_TITLE"

if echo "$PAGE_TITLE" | grep -qi "登录\|login"; then
    log "ERROR: 仍在登录页面，可能需要重新授权微信登录"
    PATH="$NODE_BIN:$PATH" npx agent-browser close 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi

# Wait for spreadsheet to fully load
log "等待表格数据加载..."
sleep 5

# Step 3: Select all and copy data
log "全选并复制表格数据..."

# Click on the grid area to focus
PATH="$NODE_BIN:$PATH" npx agent-browser eval "
    var grid = document.querySelector('[class*=editor-zone_grid]') || document.querySelector('[class*=surface_stack]');
    if(grid) grid.click();
    'focused';
" 2>&1 | tee -a "$LOG_FILE"

sleep 1

# Use Meta+A (Cmd+A on Mac) to select all
PATH="$NODE_BIN:$PATH" npx agent-browser press Meta+a 2>&1 | tee -a "$LOG_FILE"
sleep 1

# Copy
PATH="$NODE_BIN:$PATH" npx agent-browser press Meta+c 2>&1 | tee -a "$LOG_FILE"
sleep 1

# Step 4: Read clipboard data via JS
log "从剪贴板读取数据..."
RAW_DATA=$(PATH="$NODE_BIN:$PATH" npx agent-browser eval "navigator.clipboard.readText()" 2>&1)

# Clean up the JSON string wrapper
RAW_DATA=$(echo "$RAW_DATA" | sed 's/^"//' | sed 's/"$//')
RAW_DATA=$(echo "$RAW_DATA" | sed 's/\\t/\t/g')
RAW_DATA=$(echo "$RAW_DATA" | sed 's/\\n/\n/g')

if [ -z "$RAW_DATA" ]; then
    log "ERROR: 未获取到数据"
    PATH="$NODE_BIN:$PATH" npx agent-browser close 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi

# Close browser
log "关闭浏览器..."
PATH="$NODE_BIN:$PATH" npx agent-browser close 2>&1 | tee -a "$LOG_FILE"

# Step 5: Save raw data
echo "$RAW_DATA" > "$DASHBOARD_DIR/raw_data.tsv"
log "原始数据已保存到 raw_data.tsv"

# Step 6: Parse data and generate data.json
log "解析数据并生成 JSON..."
PATH="$NODE_BIN:$PATH" node "$DASHBOARD_DIR/parse_data.js" "$DASHBOARD_DIR/raw_data.tsv" "$DATA_FILE" 2>&1 | tee -a "$LOG_FILE"

if [ -f "$DATA_FILE" ]; then
    DATA_SIZE=$(wc -c < "$DATA_FILE" | tr -d ' ')
    log "SUCCESS: 数据已更新! data.json 大小: ${DATA_SIZE} bytes"
else
    log "ERROR: data.json 未生成"
    exit 1
fi

log "========== 数据抓取完成 =========="
