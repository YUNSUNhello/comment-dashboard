#!/usr/bin/env node
/**
 * parse_data.js
 * 解析从腾讯文档抓取的 TSV 数据，生成 data.json 供看板使用
 * 
 * 用法: node parse_data.js <input.tsv> <output.json>
 */

const fs = require('fs');
const path = require('path');

// Field indices
const FIELDS = {
    FILLER: 0,
    DEPT: 1,
    FILL_TIME: 2,
    USER_TYPE: 3,
    PROJECT: 4,
    ACCOUNT_NEWS: 5,
    ACCOUNT_COMM: 6,
    ACCOUNT_WS: 7,
    ARTICLE_COUNT: 8,
    CUM_COMMENT: 9,
    FOLLOW_COMMENT: 10,
    CUM_LIKE: 11,
    CUM_FAN: 12,
    ATTRIBUTION: 13,
    DATE: 14
};

function parseData(tsvContent) {
    const lines = tsvContent.trim().split('\n');
    if (lines.length < 2) return [];

    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split('\t');
        if (cols.length < 15) continue;

        const filler = cols[FIELDS.FILLER].trim();
        const dept = cols[FIELDS.DEPT].trim();
        const dateStr = cols[FIELDS.DATE].trim()
            .replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '');
        const articleCount = parseInt(cols[FIELDS.ARTICLE_COUNT]) || 0;
        const cumComment = parseInt(cols[FIELDS.CUM_COMMENT]) || 0;
        const followComment = parseInt(cols[FIELDS.FOLLOW_COMMENT]) || 0;
        const cumLike = parseInt(cols[FIELDS.CUM_LIKE]) || 0;
        const cumFan = parseInt(cols[FIELDS.CUM_FAN]) || 0;
        const attribution = cols[FIELDS.ATTRIBUTION].trim();
        const project = cols[FIELDS.PROJECT].trim();

        // Collect all non-empty accounts
        const accounts = [];
        if (cols[FIELDS.ACCOUNT_NEWS] && cols[FIELDS.ACCOUNT_NEWS].trim()) accounts.push(cols[FIELDS.ACCOUNT_NEWS].trim());
        if (cols[FIELDS.ACCOUNT_COMM] && cols[FIELDS.ACCOUNT_COMM].trim()) accounts.push(cols[FIELDS.ACCOUNT_COMM].trim());
        if (cols[FIELDS.ACCOUNT_WS] && cols[FIELDS.ACCOUNT_WS].trim()) accounts.push(cols[FIELDS.ACCOUNT_WS].trim());

        if (!filler || !dateStr) continue;

        rows.push({
            filler,
            dept,
            dateStr,
            articleCount,
            cumComment,
            followComment,
            cumLike,
            cumFan,
            attribution,
            project,
            accounts: accounts.length > 0 ? accounts : ['未指定'],
            fillTime: cols[FIELDS.FILL_TIME]?.trim() || ''
        });
    }

    // Sort by date
    rows.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    // Calculate daily increments (new comment, new like, new fan)
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const prevRow = findPreviousRow(rows, i);
        if (prevRow) {
            row.newComment = Math.max(0, row.cumComment - prevRow.cumComment);
            row.newLike = Math.max(0, row.cumLike - prevRow.cumLike);
            row.newFan = Math.max(0, row.cumFan - prevRow.cumFan);
        } else {
            row.newComment = row.cumComment;
            row.newLike = row.cumLike;
            row.newFan = row.cumFan;
        }
    }

    return rows;
}

function findPreviousRow(rows, currentIndex) {
    const current = rows[currentIndex];
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (rows[i].filler === current.filler) {
            const hasOverlap = rows[i].accounts.some(a => current.accounts.includes(a));
            if (hasOverlap) return rows[i];
        }
    }
    return null;
}

// Main
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node parse_data.js <input.tsv> <output.json>');
    process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
}

const tsvContent = fs.readFileSync(inputFile, 'utf-8');
const data = parseData(tsvContent);

if (data.length === 0) {
    console.error('No valid data rows parsed');
    process.exit(1);
}

const output = {
    updatedAt: new Date().toISOString(),
    source: '腾讯文档-评论运营工作量提报',
    recordCount: data.length,
    data: data
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Parsed ${data.length} records, saved to ${outputFile}`);
