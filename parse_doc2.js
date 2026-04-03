#!/usr/bin/env node
/**
 * parse_doc2.js - 最终版
 * 手动构建完整数据，包含所有12个账号的完整12天数据
 */
const fs = require('fs');

// 完整的账号数据（从原始TSV中手动提取）
const ACCOUNTS = [
  {
    name: '房探长',
    owner: 'lenerwang(王迅)',
    daily: {
      '2026-03-20': { fan:90, like:54382, cumComment:4452, followComment:28, article:150 },
      '2026-03-21': { fan:93, like:55199, cumComment:4515, followComment:97, article:150 },
      '2026-03-22': { fan:93, like:55736, cumComment:4585, followComment:71, article:150 },
      '2026-03-23': { fan:94, like:56155, cumComment:4655, followComment:59, article:150 },
      '2026-03-24': { fan:94, like:56347, cumComment:4710, followComment:110, article:158 },
      '2026-03-25': { fan:94, like:56347, cumComment:4710, followComment:0, article:0 },
      '2026-03-26': { fan:94, like:56347, cumComment:4710, followComment:0, article:0 },
      '2026-03-27': { fan:95, like:57405, cumComment:4760, followComment:28, article:130 },
      '2026-03-28': { fan:95, like:57708, cumComment:4805, followComment:66, article:150 },
      '2026-03-29': { fan:96, like:58181, cumComment:4855, followComment:28, article:150 },
      '2026-03-30': { fan:97, like:58382, cumComment:4910, followComment:21, article:150 },
      '2026-03-31': { fan:98, like:58825, cumComment:4970, followComment:14, article:150 }
    }
  },
  {
    name: '方向盘诗人',
    owner: 'truchenzhang(张若琛)',
    daily: {
      '2026-03-20': { fan:203, like:66691, cumComment:4403, followComment:56, article:150 },
      '2026-03-21': { fan:206, like:66930, cumComment:4475, followComment:19, article:150 },
      '2026-03-22': { fan:209, like:67222, cumComment:4546, followComment:32, article:160 },
      '2026-03-23': { fan:212, like:68512, cumComment:4617, followComment:50, article:150 },
      '2026-03-24': { fan:212, like:68512, cumComment:4617, followComment:0, article:0 },
      '2026-03-25': { fan:212, like:68512, cumComment:4617, followComment:0, article:0 },
      '2026-03-26': { fan:215, like:68985, cumComment:4671, followComment:143, article:150 },
      '2026-03-27': { fan:218, like:69439, cumComment:4721, followComment:19, article:140 },
      '2026-03-28': { fan:221, like:69992, cumComment:4776, followComment:28, article:150 },
      '2026-03-29': { fan:226, like:70238, cumComment:4826, followComment:31, article:150 },
      '2026-03-30': { fan:229, like:71093, cumComment:4881, followComment:16, article:150 },
      '2026-03-31': { fan:229, like:71093, cumComment:4881, followComment:0, article:0 }
    }
  },
  {
    name: '跃动星球',
    owner: 'bubblewang(王世浩)',
    daily: {
      '2026-03-20': { fan:null, like:26150, cumComment:2385, followComment:45, article:150 },
      '2026-03-21': { fan:null, like:26150, cumComment:2385, followComment:0, article:0 },
      '2026-03-22': { fan:null, like:26150, cumComment:2385, followComment:0, article:0 },
      '2026-03-23': { fan:22, like:27432, cumComment:2460, followComment:25, article:150 },
      '2026-03-24': { fan:22, like:28130, cumComment:2510, followComment:55, article:150 },
      '2026-03-25': { fan:22, like:28541, cumComment:2561, followComment:8, article:150 },
      '2026-03-26': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 },
      '2026-03-27': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 },
      '2026-03-28': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 },
      '2026-03-29': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 },
      '2026-03-30': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 },
      '2026-03-31': { fan:22, like:28541, cumComment:2561, followComment:0, article:0 }
    }
  },
  {
    name: '社会观察眼',
    owner: 'billlzhang(张淇)',
    daily: {
      '2026-03-20': { fan:null, like:69832, cumComment:4151, followComment:221, article:145 },
      '2026-03-21': { fan:null, like:69832, cumComment:4151, followComment:0, article:0 },
      '2026-03-22': { fan:null, like:70490, cumComment:4225, followComment:34, article:152 },
      '2026-03-23': { fan:null, like:71170, cumComment:4305, followComment:20, article:162 },
      '2026-03-24': { fan:null, like:76378, cumComment:4370, followComment:118, article:140 },
      '2026-03-25': { fan:38, like:77387, cumComment:4436, followComment:201, article:141 },
      '2026-03-26': { fan:39, like:78228, cumComment:4502, followComment:30, article:145 },
      '2026-03-27': { fan:39, like:78228, cumComment:4502, followComment:0, article:0 },
      '2026-03-28': { fan:39, like:78228, cumComment:4502, followComment:0, article:0 },
      '2026-03-29': { fan:39, like:78228, cumComment:4502, followComment:0, article:0 },
      '2026-03-30': { fan:39, like:80240, cumComment:4568, followComment:43, article:155 },
      '2026-03-31': { fan:39, like:83500, cumComment:4634, followComment:50, article:150 }
    }
  },
  {
    name: '养生漫游记',
    owner: 'rilefsyyu(于潇潇)',
    daily: {
      '2026-03-20': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-21': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-22': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-23': { fan:null, like:null, cumComment:null, followComment:48, article:160 },
      '2026-03-24': { fan:null, like:335586, cumComment:5139, followComment:70, article:152 },
      '2026-03-25': { fan:null, like:337623, cumComment:5210, followComment:0, article:0 },
      '2026-03-26': { fan:null, like:337623, cumComment:5210, followComment:0, article:0 },
      '2026-03-27': { fan:null, like:337623, cumComment:5210, followComment:0, article:0 },
      '2026-03-28': { fan:null, like:342811, cumComment:5270, followComment:54, article:143 },
      '2026-03-29': { fan:137, like:346438, cumComment:5331, followComment:214, article:150 },
      '2026-03-30': { fan:138, like:350479, cumComment:5399, followComment:160, article:150 },
      '2026-03-31': { fan:139, like:353122, cumComment:5455, followComment:247, article:156 }
    }
  },
  {
    name: '动感次元—花生了什么树',
    owner: 'chaoswwang(王赟菡)',
    daily: {
      '2026-03-20': { fan:101, like:365061, cumComment:4733, followComment:186, article:145 },
      '2026-03-21': { fan:101, like:372615, cumComment:4799, followComment:762, article:151 },
      '2026-03-22': { fan:104, like:378384, cumComment:4862, followComment:231, article:147 },
      '2026-03-23': { fan:106, like:384805, cumComment:4932, followComment:239, article:150 },
      '2026-03-24': { fan:108, like:390011, cumComment:5002, followComment:163, article:152 },
      '2026-03-25': { fan:108, like:390011, cumComment:5002, followComment:0, article:0 },
      '2026-03-26': { fan:108, like:390011, cumComment:5002, followComment:0, article:0 },
      '2026-03-27': { fan:110, like:398195, cumComment:5053, followComment:163, article:150 },
      '2026-03-28': { fan:110, like:401899, cumComment:5105, followComment:124, article:150 },
      '2026-03-29': { fan:110, like:404816, cumComment:5155, followComment:105, article:148 },
      '2026-03-30': { fan:110, like:408574, cumComment:5205, followComment:121, article:155 },
      '2026-03-31': { fan:111, like:415422, cumComment:5261, followComment:118, article:150 }
    }
  },
  {
    name: '世界脉搏—山的那边',
    owner: 'hilaryma(马逸俊)',
    daily: {
      '2026-03-20': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-21': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-22': { fan:null, like:null, cumComment:null, followComment:0, article:0 },
      '2026-03-23': { fan:114, like:241416, cumComment:4206, followComment:259, article:150 },
      '2026-03-24': { fan:114, like:241416, cumComment:4206, followComment:0, article:0 },
      '2026-03-25': { fan:114, like:244929, cumComment:4261, followComment:22, article:154 },
      '2026-03-26': { fan:114, like:248609, cumComment:4321, followComment:112, article:153 },
      '2026-03-27': { fan:116, like:250950, cumComment:4371, followComment:58, article:150 },
      '2026-03-28': { fan:124, like:254136, cumComment:4421, followComment:100, article:150 },
      '2026-03-29': { fan:125, like:256562, cumComment:4481, followComment:31, article:150 },
      '2026-03-30': { fan:127, like:260075, cumComment:4531, followComment:75, article:150 },
      '2026-03-31': { fan:127, like:260075, cumComment:4531, followComment:0, article:0 }
    }
  },
  {
    name: '隐藏战线-蜗牛小姐',
    owner: 'jiaoiiwang(王娇)',
    daily: {
      '2026-03-20': { fan:50, like:95131, cumComment:4650, followComment:103, article:160 },
      '2026-03-21': { fan:51, like:97453, cumComment:4718, followComment:152, article:150 },
      '2026-03-22': { fan:52, like:99230, cumComment:4785, followComment:171, article:150 },
      '2026-03-23': { fan:52, like:99230, cumComment:4785, followComment:0, article:0 },
      '2026-03-24': { fan:52, like:99230, cumComment:4785, followComment:0, article:0 },
      '2026-03-25': { fan:53, like:102766, cumComment:4840, followComment:71, article:140 },
      '2026-03-26': { fan:54, like:103412, cumComment:4890, followComment:117, article:140 },
      '2026-03-27': { fan:55, like:104400, cumComment:4940, followComment:35, article:140 },
      '2026-03-28': { fan:55, like:105592, cumComment:5000, followComment:87, article:150 },
      '2026-03-29': { fan:55, like:105592, cumComment:5000, followComment:0, article:0 },
      '2026-03-30': { fan:55, like:105592, cumComment:5000, followComment:0, article:0 },
      '2026-03-31': { fan:56, like:108741, cumComment:5060, followComment:77, article:150 }
    }
  },
  {
    name: '边角料小百科',
    owner: '马逸俊',
    daily: {
      '2026-03-20': { fan:null, like:254, cumComment:155, followComment:null, article:null },
      '2026-03-21': { fan:null, like:321, cumComment:157, followComment:null, article:null },
      '2026-03-22': { fan:null, like:211, cumComment:161, followComment:null, article:null },
      '2026-03-23': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-24': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-25': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-26': { fan:null, like:129, cumComment:151, followComment:null, article:null },
      '2026-03-27': { fan:null, like:241, cumComment:171, followComment:null, article:null },
      '2026-03-28': { fan:null, like:229, cumComment:153, followComment:null, article:null },
      '2026-03-29': { fan:null, like:160, cumComment:151, followComment:null, article:null },
      '2026-03-30': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-31': { fan:null, like:97, cumComment:151, followComment:null, article:null }
    }
  },
  {
    name: '打油诗人孔乙己',
    owner: '',
    daily: {
      '2026-03-20': { fan:null, like:204, cumComment:185434, followComment:4621, article:null },
      '2026-03-21': { fan:null, like:208, cumComment:189806, followComment:4694, article:null },
      '2026-03-22': { fan:null, like:208, cumComment:189806, followComment:4694, article:null },
      '2026-03-23': { fan:null, like:210, cumComment:193610, followComment:4775, article:null },
      '2026-03-24': { fan:null, like:212, cumComment:196026, followComment:4835, article:null },
      '2026-03-25': { fan:null, like:215, cumComment:199792, followComment:4900, article:null },
      '2026-03-26': { fan:null, like:217, cumComment:201486, followComment:4931, article:null },
      '2026-03-27': { fan:null, like:220, cumComment:204089, followComment:4993, article:null },
      '2026-03-28': { fan:null, like:220, cumComment:204089, followComment:4993, article:null },
      '2026-03-29': { fan:null, like:220, cumComment:204089, followComment:4993, article:null },
      '2026-03-30': { fan:null, like:221, cumComment:207618, followComment:5048, article:null },
      '2026-03-31': { fan:null, like:225, cumComment:209727, followComment:5104, article:null }
    }
  },
  {
    name: '挽联先生',
    owner: '王娇',
    daily: {
      '2026-03-20': { fan:null, like:279, cumComment:156, followComment:null, article:null },
      '2026-03-21': { fan:null, like:148, cumComment:158, followComment:null, article:null },
      '2026-03-22': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-23': { fan:null, like:131, cumComment:162, followComment:null, article:null },
      '2026-03-24': { fan:null, like:151, cumComment:150, followComment:null, article:null },
      '2026-03-25': { fan:null, like:198, cumComment:153, followComment:null, article:null },
      '2026-03-26': { fan:null, like:224, cumComment:70, followComment:null, article:null },
      '2026-03-27': { fan:null, like:46, cumComment:155, followComment:null, article:null },
      '2026-03-28': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-29': { fan:null, like:0, cumComment:0, followComment:null, article:null },
      '2026-03-30': { fan:null, like:154, cumComment:158, followComment:null, article:null },
      '2026-03-31': { fan:null, like:169, cumComment:152, followComment:null, article:null }
    }
  },
  {
    name: '司马迁的硬盘',
    owner: '青岛评论运营',
    daily: {
      '2026-03-20': { fan:null, like:100, cumComment:209188, followComment:5387, article:null },
      '2026-03-21': { fan:null, like:103, cumComment:214024, followComment:5468, article:null },
      '2026-03-22': { fan:null, like:105, cumComment:218538, followComment:5539, article:null },
      '2026-03-23': { fan:null, like:105, cumComment:218538, followComment:5539, article:null },
      '2026-03-24': { fan:null, like:105, cumComment:218538, followComment:5539, article:null },
      '2026-03-25': { fan:null, like:105, cumComment:218538, followComment:5539, article:null },
      '2026-03-26': { fan:null, like:108, cumComment:224700, followComment:5604, article:null },
      '2026-03-27': { fan:null, like:112, cumComment:230100, followComment:5671, article:null },
      '2026-03-28': { fan:null, like:112, cumComment:234173, followComment:5732, article:null },
      '2026-03-29': { fan:null, like:112, cumComment:238784, followComment:5795, article:null },
      '2026-03-30': { fan:null, like:112, cumComment:238784, followComment:5795, article:null },
      '2026-03-31': { fan:null, like:115, cumComment:243010, followComment:5856, article:null }
    }
  }
];

// Convert to flat rows
const rows = [];

for (const acct of ACCOUNTS) {
    const dates = Object.keys(acct.daily).sort();
    for (const dateStr of dates) {
        const d = acct.daily[dateStr];
        
        // Skip completely empty rows (all null or 0)
        const vals = [d.cumComment, d.like, d.fan, d.article, d.followComment].filter(v => v !== null && v !== undefined && v !== 0);
        if (vals.length === 0) continue;
        
        rows.push({
            filler: acct.owner || '未指定',
            dept: '',
            dateStr,
            articleCount: d.article || 0,
            cumComment: d.cumComment || 0,
            followComment: d.followComment || 0,
            cumLike: d.like || 0,
            cumFan: d.fan || 0,
            attribution: '',
            project: '新闻-垂类运营',
            accounts: [acct.name],
            fillTime: '',
            dataSource: '账号追踪表'
        });
    }
}

// Sort
rows.sort((a, b) => {
    const dateCmp = a.dateStr.localeCompare(b.dateStr);
    if (dateCmp !== 0) return dateCmp;
    return a.accounts[0].localeCompare(b.accounts[0]);
});

// Calculate daily increments per account
for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const acctName = row.accounts[0];
    
    for (let j = i - 1; j >= 0; j--) {
        if (rows[j].accounts[0] === acctName) {
            row.newComment = row.cumComment > 0 && rows[j].cumComment > 0 ? Math.max(0, row.cumComment - rows[j].cumComment) : (row.cumComment > 0 ? row.cumComment : 0);
            row.newLike = row.cumLike > 0 && rows[j].cumLike > 0 ? Math.max(0, row.cumLike - rows[j].cumLike) : (row.cumLike > 0 ? row.cumLike : 0);
            row.newFan = row.cumFan > 0 && rows[j].cumFan > 0 ? Math.max(0, row.cumFan - rows[j].cumFan) : (row.cumFan > 0 ? row.cumFan : 0);
            break;
        }
    }
    if (row.newComment === undefined) {
        row.newComment = row.cumComment;
        row.newLike = row.cumLike;
        row.newFan = row.cumFan;
    }
}

// Load existing doc1 data
let existingData = [];
const existingFile = '/Users/wind/WorkBuddy/20260403120152/dashboard/data.json';
if (fs.existsSync(existingFile)) {
    try {
        const existing = JSON.parse(fs.readFileSync(existingFile, 'utf-8'));
        existingData = (existing.data || []).filter(r => r.dataSource !== '账号追踪表');
        existingData.forEach(r => { r.dataSource = r.dataSource || '工作量提报'; });
    } catch(e) {}
}

const allData = [...rows, ...existingData];
allData.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

const output = {
    updatedAt: new Date().toISOString(),
    source: '评论运营数据（工作量提报 + 账号追踪表）',
    recordCount: allData.length,
    data: allData
};

fs.writeFileSync(existingFile, JSON.stringify(output, null, 2), 'utf-8');

console.log(`解析完成！`);
console.log(`- 账号追踪表: ${rows.length} 条记录`);
console.log(`- 工作量提报: ${existingData.length} 条记录`);
console.log(`- 合计: ${allData.length} 条记录`);
console.log(`\n账号列表:`);
const acctNames = [...new Set(rows.map(r => r.accounts[0]))];
acctNames.forEach(n => {
    const count = rows.filter(r => r.accounts[0] === n).length;
    console.log(`  ${n} (${count}天)`);
});
if (allData.length > 0) {
    console.log(`\n日期范围: ${allData[0].dateStr} ~ ${allData[allData.length-1].dateStr}`);
}
