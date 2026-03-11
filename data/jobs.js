// ============================================
// のんびりタウン - 職業データ
// ============================================
// 職業レベルシステム
// salaryRate: 昇給率（Lv1〜5: +3%, Lv6〜10: +5%, Lv11〜15: +8%）
const jobLevels = [
    { level: 1, expRequired: 0, salaryRate: 1.00 },
    { level: 2, expRequired: 50, salaryRate: 1.03 },
    { level: 3, expRequired: 120, salaryRate: 1.06 },
    { level: 4, expRequired: 210, salaryRate: 1.09 },
    { level: 5, expRequired: 330, salaryRate: 1.12 },
    { level: 6, expRequired: 480, salaryRate: 1.17 },
    { level: 7, expRequired: 660, salaryRate: 1.22 },
    { level: 8, expRequired: 880, salaryRate: 1.27 },
    { level: 9, expRequired: 1140, salaryRate: 1.32 },
    { level: 10, expRequired: 1450, salaryRate: 1.37 },
    { level: 11, expRequired: 1810, salaryRate: 1.45 },
    { level: 12, expRequired: 2230, salaryRate: 1.53 },
    { level: 13, expRequired: 2720, salaryRate: 1.61 },
    { level: 14, expRequired: 3290, salaryRate: 1.69 },
    { level: 15, expRequired: 3950, salaryRate: 1.80 }
];

// 病気データ（8種類）
// severity: 1=軽め, 2=中くらい, 3=重め
const diseasesData = [
    // 軽め（28,000円）
    { id: 'kaze', name: '風邪', severity: 1, cost: 28000,
      doctorMsg: 'ふむふむ。単なる風邪ですね。<br>注射を打てばすぐに治りますよ。<br>治療費に28,000円かかります。よろしいですね？' },
    { id: 'mushiba', name: '虫歯', severity: 1, cost: 28000,
      doctorMsg: 'ほう、虫歯ですか。<br>さてはあなた、食べすぎましたね？<br>治療費に28,000円かかります。よろしいですね？' },
    // 中くらい（40,000円）
    { id: 'kossetsu', name: '骨折', severity: 2, cost: 40000,
      doctorMsg: '骨折ですね。<br>専用のギプスがあればすぐに治りますよ。<br>治療費に40,000円かかります。よろしいですね？' },
    { id: 'ichouen', name: '胃腸炎', severity: 2, cost: 40000,
      doctorMsg: 'あちゃー、胃腸が荒れ放題！<br>まぁ胃腸薬を飲めば大した事ないですよ。<br>治療費に40,000円かかります。よろしいですね？' },
    { id: 'gikkurigoshi', name: 'ぎっくり腰', severity: 2, cost: 40000,
      doctorMsg: 'ぎっくり腰だなんて。<br>さてはあなた、働きすぎましたね？<br>治療費に40,000円かかります。よろしいですね？' },
    // 重め（80,000円）
    { id: 'haien', name: '肺炎', severity: 3, cost: 80000,
      doctorMsg: 'ふむ。肺炎ですね。<br>では点滴を打っておきましょう。<br>治療費に80,000円かかります。よろしいですね？<br>あ、マスクはしっかりしといてね。' },
    { id: 'kansenshou', name: '感染症', severity: 3, cost: 80000,
      doctorMsg: '感染症ですか。<br>仕方がないので抗生物質を出しておきましょう。<br>治療費に80,000円かかります。よろしいですね？' },
    { id: 'utsubyou', name: 'うつ病', severity: 3, cost: 80000,
      doctorMsg: 'ここは精神病院ではないですが…<br>この魔法のような薬を飲めばたちまち良くなるでしょう。<br>治療費に80,000円かかります。よろしいですね？' }
];

// 職業データ（50職業）
// abilities: { 国語, 数学, 理科, 社会, 英語, 音楽, 美術, 体力, 気力, ルックス, 素早さ, 面白さ, 優しさ, エロさ }
// conditions: { bmi: [最小, 最大], gender: '男性'/'女性'/null, height: [最小, 最大] }
const jobsData = [
    // ===== Lv.1 職業（10種）=====
    {
        id: 'hibarai',
        name: 'アルバイト',
        level: 1,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [15, 99], gender: null, height: [0, 999] },
        salary: 1500,
        bonus: 0,
        bodyConsume: 15,
        brainConsume: 15
    },
    {
        id: 'conveni',
        name: '猫カフェ店員',
        level: 1,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 30, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 30, 素早さ: 0, 面白さ: 0, 優しさ: 30, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 2400,
        bonus: 15,
        bodyConsume: 20,
        brainConsume: 15
    },
    {
        id: 'seisou',
        name: '地下アイドル',
        level: 1,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 40, 美術: 0, 体力: 30, 気力: 0, ルックス: 40, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 28], gender: '女性', height: [0, 999] },
        salary: 3300,
        bonus: 15,
        bodyConsume: 30,
        brainConsume: 15,
        upgrade: { name: '売れっ子アイドル', salary: 67500, bonus: 60, bodyConsume: 60, brainConsume: 40, abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 370, 美術: 0, 体力: 325, 気力: 0, ルックス: 380, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 305 } }
    },
    {
        id: 'babysitter',
        name: 'VTuber',
        level: 1,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 40, 音楽: 0, 美術: 50, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 45, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 4200,
        bonus: 15,
        bodyConsume: 15,
        brainConsume: 30,
        upgrade: { name: 'トップVTuber', salary: 73500, bonus: 60, bodyConsume: 30, brainConsume: 65, abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 355, 音楽: 0, 美術: 385, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 365, 優しさ: 295, エロさ: 0 } }
    },
    {
        id: 'kaseifu',
        name: 'お笑い芸人',
        level: 1,
        abilities: { 国語: 50, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 50, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 55, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 5100,
        bonus: 15,
        bodyConsume: 30,
        brainConsume: 20,
        upgrade: { name: '冠番組芸人', salary: 79500, bonus: 60, bodyConsume: 55, brainConsume: 50, abilities: { 国語: 375, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 345, 気力: 0, ルックス: 0, 素早さ: 305, 面白さ: 395, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'trimmer',
        name: 'ゲーム実況者',
        level: 1,
        abilities: { 国語: 0, 数学: 65, 理科: 0, 社会: 0, 英語: 55, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 70, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 6000,
        bonus: 15,
        bodyConsume: 15,
        brainConsume: 30,
        upgrade: { name: 'ミリオン実況者', salary: 84000, bonus: 60, bodyConsume: 25, brainConsume: 70, abilities: { 国語: 0, 数学: 385, 理科: 0, 社会: 310, 英語: 350, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 395, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'hoikushi',
        name: '小説家',
        level: 1,
        abilities: { 国語: 100, 数学: 0, 理科: 0, 社会: 65, 英語: 0, 音楽: 0, 美術: 75, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 7200,
        bonus: 15,
        bodyConsume: 15,
        brainConsume: 35,
        upgrade: { name: 'ベストセラー作家', salary: 88500, bonus: 60, bodyConsume: 20, brainConsume: 80, abilities: { 国語: 410, 数学: 0, 理科: 0, 社会: 340, 英語: 0, 音楽: 0, 美術: 380, 体力: 0, 気力: 330, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'kaigoshi',
        name: '占い師',
        level: 1,
        abilities: { 国語: 60, 数学: 0, 理科: 65, 社会: 75, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 70, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 8400,
        bonus: 15,
        bodyConsume: 15,
        brainConsume: 35,
        upgrade: { name: '伝説の占い師', salary: 93000, bonus: 60, bodyConsume: 25, brainConsume: 75, abilities: { 国語: 370, 数学: 0, 理科: 375, 社会: 395, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 385, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'souryo',
        name: '声優',
        level: 1,
        abilities: { 国語: 90, 数学: 0, 理科: 0, 社会: 0, 英語: 65, 音楽: 80, 美術: 0, 体力: 0, 気力: 75, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 9900,
        bonus: 15,
        bodyConsume: 20,
        brainConsume: 35,
        upgrade: { name: '売れっ子声優', salary: 99000, bonus: 60, bodyConsume: 45, brainConsume: 60, abilities: { 国語: 425, 数学: 0, 理科: 0, 社会: 0, 英語: 375, 音楽: 420, 美術: 0, 体力: 0, 気力: 395, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'uranaishi',
        name: '探偵',
        level: 1,
        abilities: { 国語: 0, 数学: 70, 理科: 75, 社会: 80, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 50, ルックス: 0, 素早さ: 65, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 35], gender: null, height: [0, 999] },
        salary: 11400,
        bonus: 15,
        bodyConsume: 30,
        brainConsume: 30,
        upgrade: { name: '名探偵', salary: 105000, bonus: 60, bodyConsume: 50, brainConsume: 65, abilities: { 国語: 0, 数学: 350, 理科: 355, 社会: 370, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 305, ルックス: 0, 素早さ: 320, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },

    // ===== Lv.2 職業（10種）=====
    {
        id: 'biyoushi',
        name: 'ミュージシャン',
        level: 2,
        abilities: { 国語: 60, 数学: 0, 理科: 0, 社会: 0, 英語: 65, 音楽: 95, 美術: 0, 体力: 0, 気力: 80, ルックス: 75, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 13500,
        bonus: 20,
        bodyConsume: 30,
        brainConsume: 30,
        upgrade: { name: '一流アーティスト', salary: 90000, bonus: 60, bodyConsume: 55, brainConsume: 55, abilities: { 国語: 315, 数学: 0, 理科: 0, 社会: 0, 英語: 325, 音楽: 395, 美術: 0, 体力: 0, 気力: 340, ルックス: 305, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'nailist',
        name: '清掃作業員',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 95, 英語: 0, 音楽: 0, 美術: 0, 体力: 115, 気力: 0, ルックス: 0, 素早さ: 105, 面白さ: 0, 優しさ: 95, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 15000,
        bonus: 20,
        bodyConsume: 45,
        brainConsume: 15
    },
    {
        id: 'esthe',
        name: 'イラストレーター',
        level: 2,
        abilities: { 国語: 110, 数学: 100, 理科: 0, 社会: 0, 英語: 100, 音楽: 0, 美術: 135, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 16500,
        bonus: 20,
        bodyConsume: 15,
        brainConsume: 45,
        upgrade: { name: '神絵師', salary: 97500, bonus: 60, bodyConsume: 25, brainConsume: 80, abilities: { 国語: 405, 数学: 385, 理科: 0, 社会: 0, 英語: 390, 音楽: 0, 美術: 465, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'hisho',
        name: '農家',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 120, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 130, 気力: 120, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 110, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 18000,
        bonus: 20,
        bodyConsume: 50,
        brainConsume: 15,
        upgrade: { name: 'ブランド農家', salary: 105000, bonus: 60, bodyConsume: 75, brainConsume: 35, abilities: { 国語: 0, 数学: 0, 理科: 405, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 440, 気力: 410, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 385, エロさ: 0 } }
    },
    {
        id: 'seitaishi',
        name: '漁師',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 125, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 140, 気力: 130, ルックス: 0, 素早さ: 120, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 35], gender: null, height: [0, 999] },
        salary: 19500,
        bonus: 20,
        bodyConsume: 50,
        brainConsume: 20,
        upgrade: { name: 'マグロ漁師', salary: 112500, bonus: 60, bodyConsume: 80, brainConsume: 35, abilities: { 国語: 0, 数学: 0, 理科: 415, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 455, 気力: 425, ルックス: 0, 素早さ: 395, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'takuhaibin',
        name: 'モデル俳優',
        level: 2,
        abilities: { 国語: 115, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 110, 体力: 100, 気力: 0, ルックス: 130, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 95 },
        conditions: { bmi: [17, 25], gender: null, height: [160, 999] },
        salary: 21000,
        bonus: 20,
        bodyConsume: 40,
        brainConsume: 25,
        upgrade: { name: '大物俳優', salary: 120000, bonus: 60, bodyConsume: 55, brainConsume: 65, abilities: { 国語: 350, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 335, 体力: 325, 気力: 0, ルックス: 390, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 300 } }
    },
    {
        id: 'gaichukujo',
        name: '介護士',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 145, 英語: 0, 音楽: 0, 美術: 0, 体力: 150, 気力: 135, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 155, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 22500,
        bonus: 20,
        bodyConsume: 45,
        brainConsume: 25
    },
    {
        id: 'animator',
        name: '動画編集者',
        level: 2,
        abilities: { 国語: 0, 数学: 140, 理科: 0, 社会: 0, 英語: 100, 音楽: 120, 美術: 150, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 110, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 23400,
        bonus: 20,
        bodyConsume: 15,
        brainConsume: 45
    },
    {
        id: 'busguide',
        name: 'ネイリスト',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 155, 英語: 0, 音楽: 0, 美術: 175, 体力: 0, 気力: 0, ルックス: 170, 素早さ: 0, 面白さ: 0, 優しさ: 160, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 24900,
        bonus: 20,
        bodyConsume: 20,
        brainConsume: 35
    },
    {
        id: 'tozankenka',
        name: 'ヨガ講師',
        level: 2,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 160, 気力: 150, ルックス: 140, 素早さ: 0, 面白さ: 0, 優しさ: 125, エロさ: 115 },
        conditions: { bmi: [17, 27], gender: null, height: [0, 999] },
        salary: 26400,
        bonus: 20,
        bodyConsume: 45,
        brainConsume: 20
    },

    // ===== Lv.3 職業（10種）=====
    {
        id: 'keisatsukan',
        name: 'ウェディングプランナー',
        level: 3,
        abilities: { 国語: 150, 数学: 0, 理科: 0, 社会: 160, 英語: 0, 音楽: 120, 美術: 155, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 140, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 25500,
        bonus: 25,
        bodyConsume: 25,
        brainConsume: 45
    },
    {
        id: 'jieitai',
        name: 'トリマー',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 185, 社会: 0, 英語: 0, 音楽: 0, 美術: 200, 体力: 180, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 195, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 27000,
        bonus: 25,
        bodyConsume: 35,
        brainConsume: 35
    },
    {
        id: 'daiku',
        name: '宅配便ドライバー',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 195, 英語: 0, 音楽: 0, 美術: 0, 体力: 215, 気力: 0, ルックス: 0, 素早さ: 200, 面白さ: 0, 優しさ: 185, エロさ: 0 },
        conditions: { bmi: [17, 35], gender: null, height: [0, 999] },
        salary: 28500,
        bonus: 25,
        bodyConsume: 55,
        brainConsume: 20
    },
    {
        id: 'seibishi',
        name: 'ハンター',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 205, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 220, 気力: 210, ルックス: 0, 素早さ: 195, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 35], gender: null, height: [0, 999] },
        salary: 30000,
        bonus: 25,
        bodyConsume: 55,
        brainConsume: 25
    },
    {
        id: 'patissier',
        name: '引越し業者',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 175, 英語: 0, 音楽: 0, 美術: 0, 体力: 210, 気力: 0, ルックス: 0, 素早さ: 195, 面白さ: 155, 優しさ: 130, エロさ: 0 },
        conditions: { bmi: [18, 35], gender: null, height: [0, 999] },
        salary: 32400,
        bonus: 25,
        bodyConsume: 60,
        brainConsume: 15
    },
    {
        id: 'ryoushi',
        name: 'パティシエ',
        level: 3,
        abilities: { 国語: 180, 数学: 165, 理科: 195, 社会: 0, 英語: 0, 音楽: 0, 美術: 210, 体力: 0, 気力: 150, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 34500,
        bonus: 25,
        bodyConsume: 35,
        brainConsume: 45,
        upgrade: { name: 'グランパティシエ', salary: 114000, bonus: 60, bodyConsume: 55, brainConsume: 65, abilities: { 国語: 350, 数学: 330, 理科: 360, 社会: 0, 英語: 0, 音楽: 0, 美術: 385, 体力: 0, 気力: 285, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'keiri',
        name: '保育士',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 200, 英語: 0, 音楽: 175, 美術: 0, 体力: 190, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 155, 優しさ: 215, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 36000,
        bonus: 25,
        bodyConsume: 40,
        brainConsume: 40
    },
    {
        id: 'eigyoman',
        name: '大工',
        level: 3,
        abilities: { 国語: 0, 数学: 210, 理科: 165, 社会: 0, 英語: 0, 音楽: 0, 美術: 195, 体力: 220, 気力: 180, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [18, 35], gender: null, height: [0, 999] },
        salary: 38400,
        bonus: 25,
        bodyConsume: 60,
        brainConsume: 20
    },
    {
        id: 'rinsho',
        name: '整体師',
        level: 3,
        abilities: { 国語: 0, 数学: 0, 理科: 225, 社会: 190, 英語: 0, 音楽: 0, 美術: 0, 体力: 200, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 215, エロさ: 170 },
        conditions: { bmi: [17, 30], gender: null, height: [0, 999] },
        salary: 40500,
        bonus: 25,
        bodyConsume: 40,
        brainConsume: 40
    },
    {
        id: 'mangaka',
        name: '美容師',
        level: 3,
        abilities: { 国語: 195, 数学: 0, 理科: 0, 社会: 210, 英語: 0, 音楽: 0, 美術: 240, 体力: 0, 気力: 0, ルックス: 225, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 165 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 43500,
        bonus: 25,
        bodyConsume: 35,
        brainConsume: 40,
        upgrade: { name: 'カリスマ美容師', salary: 135000, bonus: 60, bodyConsume: 50, brainConsume: 70, abilities: { 国語: 340, 数学: 0, 理科: 0, 社会: 350, 英語: 0, 音楽: 0, 美術: 390, 体力: 0, 気力: 0, ルックス: 370, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 260 } }
    },

    // ===== Lv.4 職業（10種）=====
    {
        id: 'kangoshi',
        name: 'エステティシャン',
        level: 4,
        abilities: { 国語: 0, 数学: 0, 理科: 205, 社会: 0, 英語: 0, 音楽: 0, 美術: 235, 体力: 0, 気力: 0, ルックス: 225, 素早さ: 0, 面白さ: 0, 優しさ: 215, エロさ: 190 },
        conditions: { bmi: [17, 28], gender: null, height: [0, 999] },
        salary: 44400,
        bonus: 30,
        bodyConsume: 35,
        brainConsume: 50
    },
    {
        id: 'programmer',
        name: 'ドローン操縦士',
        level: 4,
        abilities: { 国語: 0, 数学: 250, 理科: 230, 社会: 0, 英語: 165, 音楽: 0, 美術: 185, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 200, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 46500,
        bonus: 30,
        bodyConsume: 20,
        brainConsume: 55
    },
    {
        id: 'illustrator',
        name: '管理栄養士',
        level: 4,
        abilities: { 国語: 220, 数学: 190, 理科: 250, 社会: 235, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 205, エロさ: 0 },
        conditions: { bmi: [17, 30], gender: null, height: [0, 999] },
        salary: 49500,
        bonus: 30,
        bodyConsume: 20,
        brainConsume: 60
    },
    {
        id: 'eizou',
        name: '臨床心理士',
        level: 4,
        abilities: { 国語: 260, 数学: 0, 理科: 205, 社会: 245, 英語: 0, 音楽: 0, 美術: 0, 体力: 0, 気力: 230, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 220, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 53400,
        bonus: 30,
        bodyConsume: 15,
        brainConsume: 65
    },
    {
        id: 'seiyu',
        name: '僧侶',
        level: 4,
        abilities: { 国語: 260, 数学: 0, 理科: 0, 社会: 240, 英語: 0, 音楽: 210, 美術: 0, 体力: 0, 気力: 280, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 220, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: '男性', height: [0, 999] },
        salary: 55500,
        bonus: 30,
        bodyConsume: 40,
        brainConsume: 45
    },
    {
        id: 'shogakkou',
        name: 'シェフ',
        level: 4,
        abilities: { 国語: 225, 数学: 0, 理科: 255, 社会: 0, 英語: 0, 音楽: 0, 美術: 270, 体力: 240, 気力: 210, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 58500,
        bonus: 30,
        bodyConsume: 50,
        brainConsume: 40,
        upgrade: { name: '三ツ星シェフ', salary: 129000, bonus: 60, bodyConsume: 70, brainConsume: 75, abilities: { 国語: 365, 数学: 0, 理科: 385, 社会: 0, 英語: 0, 音楽: 0, 美術: 395, 体力: 365, 気力: 290, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'yakuzaishi',
        name: 'eスポーツ選手',
        level: 4,
        abilities: { 国語: 0, 数学: 280, 理科: 0, 社会: 0, 英語: 235, 音楽: 0, 美術: 0, 体力: 0, 気力: 255, ルックス: 0, 素早さ: 270, 面白さ: 210, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 62400,
        bonus: 30,
        bodyConsume: 25,
        brainConsume: 60,
        upgrade: { name: 'eスポーツ王者', salary: 139500, bonus: 60, bodyConsume: 60, brainConsume: 100, abilities: { 国語: 0, 数学: 395, 理科: 0, 社会: 0, 英語: 355, 音楽: 0, 美術: 0, 体力: 0, 気力: 380, ルックス: 0, 素早さ: 390, 面白さ: 330, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'sommelier',
        name: '自衛隊',
        level: 4,
        abilities: { 国語: 0, 数学: 0, 理科: 230, 社会: 240, 英語: 0, 音楽: 0, 美術: 0, 体力: 285, 気力: 270, ルックス: 0, 素早さ: 255, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [18, 30], gender: null, height: [150, 999] },
        salary: 65400,
        bonus: 30,
        bodyConsume: 65,
        brainConsume: 25,
        upgrade: { name: '特殊作戦隊員', salary: 150000, bonus: 60, bodyConsume: 110, brainConsume: 70, abilities: { 国語: 0, 数学: 0, 理科: 380, 社会: 385, 英語: 0, 音楽: 0, 美術: 0, 体力: 420, 気力: 395, ルックス: 0, 素早さ: 320, 面白さ: 0, 優しさ: 0, エロさ: 0 } }
    },
    {
        id: 'aidev',
        name: '地方公務員',
        level: 4,
        abilities: { 国語: 275, 数学: 260, 理科: 0, 社会: 290, 英語: 250, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 235, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 69000,
        bonus: 30,
        bodyConsume: 20,
        brainConsume: 60
    },
    {
        id: 'esports',
        name: 'アナウンサー',
        level: 4,
        abilities: { 国語: 310, 数学: 0, 理科: 0, 社会: 280, 英語: 265, 音楽: 250, 美術: 0, 体力: 0, 気力: 0, ルックス: 295, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 27], gender: null, height: [0, 999] },
        salary: 73500,
        bonus: 30,
        bodyConsume: 25,
        brainConsume: 60
    },

    // ===== Lv.5 職業（10種）=====
    {
        id: 'isha',
        name: '看護師',
        level: 5,
        abilities: { 国語: 0, 数学: 0, 理科: 300, 社会: 260, 英語: 0, 音楽: 0, 美術: 0, 体力: 275, 気力: 255, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 285, エロさ: 0 },
        conditions: { bmi: [17, 30], gender: null, height: [0, 999] },
        salary: 67500,
        bonus: 40,
        bodyConsume: 50,
        brainConsume: 55
    },
    {
        id: 'bengoshi',
        name: '消防士',
        level: 5,
        abilities: { 国語: 0, 数学: 0, 理科: 265, 社会: 260, 英語: 0, 音楽: 0, 美術: 0, 体力: 310, 気力: 295, ルックス: 0, 素早さ: 280, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [18, 30], gender: null, height: [0, 999] },
        salary: 72000,
        bonus: 40,
        bodyConsume: 70,
        brainConsume: 35
    },
    {
        id: 'pilot',
        name: '警察官',
        level: 5,
        abilities: { 国語: 275, 数学: 0, 理科: 0, 社会: 310, 英語: 0, 音楽: 0, 美術: 0, 体力: 300, 気力: 285, ルックス: 0, 素早さ: 275, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [18, 28], gender: null, height: [0, 999] },
        salary: 76500,
        bonus: 40,
        bodyConsume: 55,
        brainConsume: 50
    },
    {
        id: 'idol',
        name: '大学教授',
        level: 5,
        abilities: { 国語: 330, 数学: 285, 理科: 300, 社会: 270, 英語: 315, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 82500,
        bonus: 40,
        bodyConsume: 20,
        brainConsume: 70
    },
    {
        id: 'vtuber',
        name: 'プロンプトエンジニア',
        level: 5,
        abilities: { 国語: 320, 数学: 305, 理科: 295, 社会: 0, 英語: 330, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 285, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 88500,
        bonus: 40,
        bodyConsume: 15,
        brainConsume: 70
    },
    {
        id: 'owarai',
        name: '宇宙飛行士',
        level: 5,
        abilities: { 国語: 0, 数学: 295, 理科: 340, 社会: 0, 英語: 280, 音楽: 0, 美術: 0, 体力: 325, 気力: 310, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [18, 27], gender: null, height: [150, 190] },
        salary: 93000,
        bonus: 40,
        bodyConsume: 65,
        brainConsume: 55
    },
    {
        id: 'eigakantoku',
        name: '弁護士',
        level: 5,
        abilities: { 国語: 345, 数学: 295, 理科: 0, 社会: 335, 英語: 300, 音楽: 0, 美術: 0, 体力: 0, 気力: 315, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 99000,
        bonus: 40,
        bodyConsume: 25,
        brainConsume: 70
    },
    {
        id: 'daigakukyoju',
        name: '医者',
        level: 5,
        abilities: { 国語: 330, 数学: 295, 理科: 350, 社会: 0, 英語: 300, 音楽: 0, 美術: 0, 体力: 0, 気力: 0, ルックス: 0, 素早さ: 0, 面白さ: 0, 優しさ: 315, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 105000,
        bonus: 40,
        bodyConsume: 45,
        brainConsume: 70
    },
    {
        id: 'hitotsuboshichef',
        name: '政治家',
        level: 5,
        abilities: { 国語: 345, 数学: 0, 理科: 0, 社会: 365, 英語: 305, 音楽: 0, 美術: 0, 体力: 0, 気力: 325, ルックス: 310, 素早さ: 0, 面白さ: 0, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [17, 99], gender: null, height: [0, 999] },
        salary: 112500,
        bonus: 40,
        bodyConsume: 40,
        brainConsume: 65
    },
    {
        id: 'uchuhikoushi',
        name: 'プロ野球選手',
        level: 5,
        abilities: { 国語: 0, 数学: 0, 理科: 0, 社会: 0, 英語: 0, 音楽: 0, 美術: 0, 体力: 380, 気力: 345, ルックス: 325, 素早さ: 360, 面白さ: 300, 優しさ: 0, エロさ: 0 },
        conditions: { bmi: [19, 28], gender: '男性', height: [160, 195] },
        salary: 120000,
        bonus: 40,
        bodyConsume: 70,
        brainConsume: 60
    }
];

