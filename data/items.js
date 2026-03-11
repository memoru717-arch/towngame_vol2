// ============================================
// のんびりタウン - アイテムデータ
// ============================================
// 食堂のメニュー
const shokudoItems = [
    // テイクアウト品（空腹1〜2段階↑）※所持品に入る
    { type: 'separator', name: 'テイクアウト品' },
    { name: 'おにぎり', price: 100, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 180, useCount: 1 },
    { name: 'カップラーメン', price: 150, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 250, useCount: 1 },
    { name: '肉まん', price: 150, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 280, useCount: 1 },
    { name: 'ホットドッグ', price: 200, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 300, useCount: 1 },
    { name: 'チキンナゲット', price: 250, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 350, useCount: 1 },
    { name: 'サンドイッチ', price: 300, consumable: true, hungerEffect: 1, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度1UP',
      stats: {}, calorie: 320, useCount: 1 },
    { name: 'たこ焼き', price: 350, consumable: true, hungerEffect: 2, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度2UP',
      stats: {}, calorie: 400, useCount: 1 },
    { name: '焼きそば', price: 400, consumable: true, hungerEffect: 2, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度2UP',
      stats: { 体力: 1, 気力: 1 }, calorie: 500, useCount: 1 },
    { name: 'ピザ', price: 600, consumable: true, hungerEffect: 2, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度2UP',
      stats: { 体力: 1, 面白さ: 2, 美術: 1 }, calorie: 600, useCount: 1 },
    { name: 'ハンバーガー', price: 800, consumable: true, hungerEffect: 2, takeout: true, genre: 'ファーストフード', stock: 10,
      effect: { hunger: -1 }, description: '空腹度2UP',
      stats: { 体力: 3, 気力: 1, エロさ: 1 }, calorie: 700, useCount: 1 },

    // デザート（空腹度に影響しない・体重増加）
    { type: 'separator', name: 'デザート' },
    { name: 'プリン', price: 300, consumable: true, takeout: true, genre: 'デザート', stock: 10,
      effect: {}, stats: {}, calorie: 400, useCount: 1, isSweet: true },
    { name: 'ソフトクリーム', price: 500, consumable: true, takeout: true, genre: 'デザート', stock: 10,
      effect: {}, stats: {}, calorie: 600, useCount: 1, isSweet: true },
    { name: 'パンケーキ', price: 800, consumable: true, takeout: true, genre: 'デザート', stock: 10,
      effect: {}, stats: { 優しさ: 1, 体力: 1 }, calorie: 800, useCount: 1, isSweet: true },
    { name: 'パフェ', price: 1000, consumable: true, takeout: true, genre: 'デザート', stock: 10,
      effect: {}, stats: { 数学: 1, 英語: 1, 面白さ: 1 }, calorie: 1100, useCount: 1, isSweet: true },
    { name: 'チョコレートケーキ', price: 1200, consumable: true, takeout: true, genre: 'デザート', stock: 10,
      effect: {}, stats: { 国語: 1, 音楽: 1, エロさ: 1 }, calorie: 1500, useCount: 1, isSweet: true },

    // ドリンク（空腹度に影響しない・体重増加）
    { type: 'separator', name: 'ドリンク' },
    { name: 'オレンジジュース', price: 150, consumable: true, takeout: true, genre: 'ドリンク', stock: 10,
      effect: {}, stats: {}, calorie: 150, useCount: 1, isSweet: true },
    { name: 'クリームソーダ', price: 400, consumable: true, takeout: true, genre: 'ドリンク', stock: 10,
      effect: {}, stats: {}, calorie: 350, useCount: 1, isSweet: true },
    { name: 'キャラメルラテ', price: 600, consumable: true, takeout: true, genre: 'ドリンク', stock: 10,
      effect: {}, stats: {}, calorie: 500, useCount: 1, isSweet: true },
    { name: 'タピオカミルクティー', price: 800, consumable: true, takeout: true, genre: 'ドリンク', stock: 10,
      effect: {}, stats: { ルックス: 1, 素早さ: 1 }, calorie: 600, useCount: 1, isSweet: true },
    { name: 'チョコミルクフラペチーノ', price: 1000, consumable: true, takeout: true, genre: 'ドリンク', stock: 10,
      effect: {}, stats: { 気力: 2, 社会: 1 }, calorie: 750, useCount: 1, isSweet: true },

    // 食料品（満腹になる）※その場で食べる
    { type: 'separator', name: '食料品' },
    { name: 'かけうどん', price: 500, consumable: true, hungerEffect: 6, stock: 15,
      effect: { hunger: -1 }, image: 'foods/kakeudon.png',
      stats: { 素早さ: 1 }, calorie: 450 },
    { name: 'のり弁当', price: 650, consumable: true, hungerEffect: 6, stock: 15,
      effect: { hunger: -1 }, image: 'foods/noriben.png',
      stats: { 体力: 1 }, calorie: 500 },
    { name: '牛丼', price: 700, consumable: true, hungerEffect: 6, stock: 15,
      effect: { hunger: -1 }, image: 'foods/gyudon.png',
      stats: { 国語: 1, 体力: 1 }, calorie: 650 },
    { name: '醤油ラーメン', price: 800, consumable: true, hungerEffect: 6, stock: 15,
      effect: { hunger: -1 }, image: 'foods/syoyuramen.png',
      stats: { 素早さ: 2, 面白さ: 1 }, calorie: 750 },
    { name: 'カレーライス', price: 900, consumable: true, hungerEffect: 6, stock: 15,
      effect: { hunger: -1 }, image: 'foods/curry.png',
      stats: { 気力: 2, エロさ: 1 }, calorie: 700 },
    { name: 'オムライス', price: 1000, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/omurice.png',
      stats: { 優しさ: 2, 音楽: 2 }, calorie: 600 },
    { name: 'カルボナーラ', price: 1200, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/carbonara.png',
      stats: { ルックス: 1, 優しさ: 1, 美術: 2 }, calorie: 800 },
    { name: '唐揚げ定食', price: 1400, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/friedchicken_set.png',
      stats: { 体力: 3, 社会: 1 }, calorie: 800 },
    { name: '焼肉定食', price: 1600, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/yakiniku_set.png',
      stats: { 気力: 3, 体力: 2 }, calorie: 900 },
    { name: 'キムチ鍋', price: 2000, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/kimchi.png',
      stats: { 数学: 2, 社会: 2, 優しさ: 1 }, calorie: 700 },
    { name: 'ステーキ', price: 2500, consumable: true, hungerEffect: 6, stock: 10,
      effect: { hunger: -1 }, image: 'foods/steak.png',
      stats: { 体力: 2, ルックス: 2, エロさ: 2 }, calorie: 950 },
    { name: '特上握り寿司', price: 3000, consumable: true, hungerEffect: 6, stock: 5,
      effect: { hunger: -1 }, image: 'foods/tokujo_sushi.png',
      stats: { 国語: 1, 数学: 1, 理科: 1, 社会: 1, 英語: 1, 音楽: 1, 美術: 1 }, calorie: 750 },
];

// 商店のアイテム
const shopItems = [
    // 書籍（日用品レート：総獲得×150円/pt）
    { type: 'separator', name: '書籍' },
    { name: 'はらぺこいもむし', price: 1200, consumable: true,
      stats: { 国語: 2, 優しさ: 2 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5, description: '空腹度が1段階DOWN' },
    { name: 'まんが・下剋上', price: 1200, consumable: true,
      stats: { 社会: 2, 面白さ: 2 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '雑誌・Azura', price: 1200, consumable: true,
      stats: { ルックス: 2, 美術: 2 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: 'Music ++', price: 1200, consumable: true,
      stats: { 音楽: 2, エロさ: 2 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '新発見！昆虫サバイバル図鑑', price: 1500, consumable: true,
      stats: { 理科: 4, 体力: 1 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '英単語は覚えるな。', price: 1500, consumable: true,
      stats: { 英語: 4, 気力: 1 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: 'まるわかり世界史', price: 1500, consumable: true,
      stats: { 社会: 4, 国語: 1 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '今日のごはん365', price: 1200, consumable: true,
      stats: { 優しさ: 2, 美術: 1, 体力: 1 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '鬼の計算1000問ドリル', price: 1500, consumable: true,
      stats: { 数学: 3, 素早さ: 2 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },
    { name: '朝5時起きで人生が変わる', price: 1500, consumable: true,
      stats: { 気力: 2, 国語: 2, 数学: 1 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 5 },

    // 楽器（専門品レート：総獲得×130~150円/pt）
    { type: 'separator', name: '楽器' },
    { name: 'リコーダー', price: 2250, consumable: true,
      stats: { 音楽: 3, 気力: 2 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 4, brainConsume: 6 },
    { name: 'ハーモニカ', price: 2940, consumable: true,
      stats: { 音楽: 4, 気力: 2, 体力: 1 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 6, brainConsume: 9 },
    { name: 'メトロノーム', price: 6500, consumable: true,
      stats: { 音楽: 5, 数学: 3, 素早さ: 2 }, calorie: 0, useCount: 5, cooldown: '20分', bodyConsume: 0, brainConsume: 15 },
    { name: 'コンデンサーマイク', price: 8450, consumable: true,
      stats: { 音楽: 5, ルックス: 3, エロさ: 3, 面白さ: 2 }, calorie: 0, useCount: 5, cooldown: '20分', bodyConsume: 10, brainConsume: 15 },
    { name: 'ベース', price: 14560, consumable: true,
      stats: { 音楽: 6, 体力: 4, 気力: 3, 面白さ: 3 }, calorie: 0, useCount: 7, cooldown: '30分', bodyConsume: 14, brainConsume: 21 },
    { name: 'エレキギター', price: 18200, consumable: true,
      stats: { 音楽: 7, ルックス: 4, 面白さ: 4, エロさ: 3, 気力: 2 }, calorie: 0, useCount: 7, cooldown: '30分', bodyConsume: 14, brainConsume: 21 },
    { name: 'キーボード', price: 26000, consumable: true,
      stats: { 音楽: 8, 数学: 5, 素早さ: 5, 美術: 3, 気力: 4 }, calorie: 0, useCount: 8, cooldown: '30分', bodyConsume: 20, brainConsume: 30 },
    { name: 'バイオリン', price: 39000, consumable: true,
      stats: { 音楽: 10, 美術: 6, ルックス: 5, 気力: 5, 優しさ: 4 }, calorie: 0, useCount: 10, cooldown: '45分', bodyConsume: 20, brainConsume: 30 },
    { name: 'ドラムセット', price: 45500, consumable: true,
      stats: { 音楽: 10, 体力: 8, 素早さ: 6, 面白さ: 5, 気力: 6 }, calorie: 0, useCount: 10, cooldown: '45分', bodyConsume: 40, brainConsume: 25 },
    { name: 'グランドピアノ', price: 70200, consumable: true,
      stats: { 音楽: 12, 美術: 8, 数学: 7, 気力: 6, ルックス: 5, 優しさ: 5, エロさ: 2 }, calorie: 0, useCount: 12, cooldown: '45分', bodyConsume: 30, brainConsume: 50 },

    // 画材（専門品レート：総獲得×130~140円/pt）
    { type: 'separator', name: '画材' },
    { name: '色鉛筆セット', price: 2100, consumable: true,
      stats: { 美術: 3, 気力: 2 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 2, brainConsume: 8 },
    { name: 'スケッチブック', price: 2940, consumable: true,
      stats: { 美術: 4, 気力: 2, 国語: 1 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 2, brainConsume: 8 },
    { name: '粘土', price: 4200, consumable: true,
      stats: { 美術: 5, 体力: 3, 面白さ: 2 }, calorie: 0, useCount: 3, cooldown: '20分', bodyConsume: 3, brainConsume: 12 },
    { name: '水彩絵の具', price: 5070, consumable: true,
      stats: { 美術: 5, 優しさ: 3, ルックス: 2, 気力: 3 }, calorie: 0, useCount: 3, cooldown: '20分', bodyConsume: 3, brainConsume: 12 },
    { name: 'デッサン人形', price: 8320, consumable: true,
      stats: { 美術: 6, ルックス: 4, エロさ: 3, 素早さ: 3 }, calorie: 0, useCount: 4, cooldown: '20分', bodyConsume: 5, brainConsume: 20 },
    { name: '彫刻刀セット', price: 10400, consumable: true,
      stats: { 美術: 7, 体力: 5, 素早さ: 4, 気力: 4 }, calorie: 0, useCount: 4, cooldown: '30分', bodyConsume: 5, brainConsume: 20 },
    { name: 'コピックセット', price: 16250, consumable: true,
      stats: { 美術: 8, ルックス: 5, 面白さ: 5, 気力: 4, 素早さ: 3 }, calorie: 0, useCount: 5, cooldown: '30分', bodyConsume: 7, brainConsume: 28 },
    { name: '油絵セット', price: 23400, consumable: true,
      stats: { 美術: 10, 優しさ: 6, 気力: 5, ルックス: 5, 国語: 4 }, calorie: 0, useCount: 6, cooldown: '30分', bodyConsume: 10, brainConsume: 40 },
    { name: 'ペンタブレット', price: 31850, consumable: true,
      stats: { 美術: 10, 素早さ: 7, 面白さ: 6, 数学: 6, 気力: 6 }, calorie: 0, useCount: 7, cooldown: '45分', bodyConsume: 10, brainConsume: 40 },
    { name: 'スプレー塗料', price: 41600, consumable: true,
      stats: { 美術: 12, 面白さ: 8, 体力: 6, ルックス: 5, エロさ: 5, 気力: 4 }, calorie: 0, useCount: 8, cooldown: '45分', bodyConsume: 10, brainConsume: 40 },

    // スポーツ用品（専門品レート：総獲得×130~140円/pt）
    { type: 'separator', name: 'スポーツ用品' },
    { name: '縄跳び', price: 2100, consumable: true,
      stats: { 体力: 2, 素早さ: 2, 気力: 1 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 10, brainConsume: 0 },
    { name: 'ヨガマット', price: 2940, consumable: true,
      stats: { 気力: 3, 体力: 2, ルックス: 1, 優しさ: 1 }, calorie: 0, useCount: 3, cooldown: '15分', bodyConsume: 10, brainConsume: 5 },
    { name: 'サッカーボール', price: 5850, consumable: true,
      stats: { 体力: 3, 素早さ: 3, 気力: 2, 面白さ: 1 }, calorie: 0, useCount: 5, cooldown: '20分', bodyConsume: 15, brainConsume: 0 },
    { name: 'バスケットボール', price: 8450, consumable: true,
      stats: { 体力: 4, 素早さ: 4, 気力: 3, 面白さ: 2 }, calorie: 0, useCount: 5, cooldown: '20分', bodyConsume: 23, brainConsume: 2 },
    { name: 'テニスラケット', price: 10400, consumable: true,
      stats: { 体力: 5, 素早さ: 4, 気力: 3, ルックス: 2, 面白さ: 2 }, calorie: 0, useCount: 5, cooldown: '30分', bodyConsume: 20, brainConsume: 5 },
    { name: '野球バット', price: 11700, consumable: true,
      stats: { 体力: 6, 素早さ: 4, 気力: 4, 面白さ: 2, ルックス: 2 }, calorie: 0, useCount: 5, cooldown: '30分', bodyConsume: 25, brainConsume: 0 },
    { name: 'フィットネス水着', price: 13650, consumable: true,
      stats: { 体力: 5, ルックス: 5, エロさ: 4, 気力: 4, 素早さ: 3 }, calorie: 0, useCount: 5, cooldown: '30分', bodyConsume: 30, brainConsume: 5 },
    { name: 'ダンベル', price: 16900, consumable: true,
      stats: { 体力: 8, 気力: 6, ルックス: 5, 素早さ: 4, エロさ: 3 }, calorie: 0, useCount: 5, cooldown: '30分', bodyConsume: 35, brainConsume: 0 },
    { name: 'ボクシンググローブ', price: 23400, consumable: true,
      stats: { 体力: 8, 素早さ: 6, 気力: 6, 面白さ: 5, ルックス: 5 }, calorie: 0, useCount: 6, cooldown: '30分', bodyConsume: 45, brainConsume: 5 },
    { name: 'ゴルフクラブ', price: 31850, consumable: true,
      stats: { 体力: 8, 気力: 7, ルックス: 6, 素早さ: 5, 社会: 5, 優しさ: 4 }, calorie: 0, useCount: 7, cooldown: '45分', bodyConsume: 38, brainConsume: 12 },

    // ファッション（準備中）
    { type: 'separator', name: 'ファッション' },

    // 日用品（準備中）
    { type: 'separator', name: '日用品' },

    // 美容グッズ（準備中）
    { type: 'separator', name: '美容グッズ' },

    // 電化製品（準備中）
    { type: 'separator', name: '電化製品' },

    // ゲーム（準備中）
    { type: 'separator', name: 'ゲーム' },

    // おもちゃ・ホビー（準備中）
    { type: 'separator', name: 'おもちゃ・ホビー' },

    // 薬（9種：価格帯 50〜50,000円）
    { type: 'separator', name: '薬' },
    // 病気を治す薬
    { name: '風邪薬', price: 500, consumable: true,
      cures: ['kaze'],
      stats: {}, calorie: 0, useCount: 1, bodyConsume: 0, brainConsume: 0,
      description: '風邪を治す' },
    { name: '痛み止め', price: 1500, consumable: true,
      cures: ['mushiba', 'kossetsu'],
      stats: {}, calorie: 0, useCount: 1, bodyConsume: 0, brainConsume: 0,
      description: '虫歯・骨折を治す' },
    { name: '胃腸薬', price: 800, consumable: true,
      cures: ['ichouen'],
      stats: {}, calorie: 0, useCount: 1, bodyConsume: 0, brainConsume: 0,
      description: '胃腸炎を治す' },
    { name: '腰サポーター', price: 2500, consumable: true,
      cures: ['gikkurigoshi'],
      stats: {}, calorie: 0, useCount: 1, bodyConsume: 0, brainConsume: 0,
      description: 'ぎっくり腰を治す' },
    { name: '伝説の薬', price: 50000, consumable: true,
      cures: 'all', stock: 1,
      stats: {}, calorie: 0, useCount: 1, bodyConsume: 0, brainConsume: 0,
      description: '全ての病気を治す（超レア）' },
    // パワー・能力値回復系
    { name: '栄養ドリンク', price: 200, consumable: true,
      effect: { health: 30 },
      stats: {}, calorie: 0, useCount: 1, cooldown: '15分', bodyConsume: 0, brainConsume: 0,
      description: '身体パワーを30回復' },
    { name: '漢方薬', price: 800, consumable: true,
      effect: { intelligence: 30 },
      stats: {}, calorie: 0, useCount: 1, cooldown: '15分', bodyConsume: 0, brainConsume: 0,
      description: '頭脳パワーを30回復' },
    { name: 'ビタミン剤', price: 1500, consumable: true,
      stats: { 体力: 3 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 0,
      description: '体力パラメータが3UP' },
    { name: 'メンタルサプリ', price: 1500, consumable: true,
      stats: { 気力: 3 }, calorie: 0, useCount: 2, cooldown: '15分', bodyConsume: 0, brainConsume: 0,
      description: '気力パラメータが3UP' },

    // お花（準備中）
    { type: 'separator', name: 'お花' },

    // ギフト（準備中）
    { type: 'separator', name: 'ギフト' },

    // 乗り物（準備中）
    { type: 'separator', name: '乗り物' }
];

// ============================================
// 温泉コンビニ商品データ
// ============================================
const onsenShopItems = [
    // ドリンク系（頭脳パワー上限アップ）
    { type: 'separator', name: 'ドリンク' },
    { name: 'ゴクッと牛乳', price: 600, consumable: true, maxIntUp: 3, maxHpUp: 0, calorie: 120,
      description: '頭脳パワー上限+3', dailyLimit: 1, useCount: 1 },
    { name: 'さわやかコーヒー牛乳', price: 1200, consumable: true, maxIntUp: 6, maxHpUp: 0, calorie: 150,
      description: '頭脳パワー上限+6', dailyLimit: 1, useCount: 1 },
    { name: 'フルーツスムージー', price: 1800, consumable: true, maxIntUp: 9, maxHpUp: 0, calorie: 200,
      description: '頭脳パワー上限+9', dailyLimit: 1, useCount: 1 },

    // フード系（身体パワー上限アップ）
    { type: 'separator', name: 'フード' },
    { name: '温泉たまご', price: 600, consumable: true, maxHpUp: 3, maxIntUp: 0, calorie: 80,
      description: '身体パワー上限+3', dailyLimit: 1, useCount: 1 },
    { name: '温泉まんじゅう', price: 1200, consumable: true, maxHpUp: 6, maxIntUp: 0, calorie: 200,
      description: '身体パワー上限+6', dailyLimit: 1, useCount: 1 },
    { name: '濃厚ソフトクリーム', price: 1800, consumable: true, maxHpUp: 9, maxIntUp: 0, calorie: 300,
      description: '身体パワー上限+9', dailyLimit: 1, useCount: 1 },

    // ケア系（両方アップ）
    { type: 'separator', name: 'ケア' },
    { name: '化粧水', price: 4000, consumable: true, maxHpUp: 5, maxIntUp: 5, calorie: 0,
      description: '身体+5 頭脳+5', dailyLimit: 1, useCount: 1 },
    { name: 'オリジナル入浴剤', price: 8000, consumable: true, maxHpUp: 10, maxIntUp: 10, calorie: 0,
      description: '身体+10 頭脳+10', dailyLimit: 1, useCount: 1 },
    { name: '足つぼサンダル', price: 12000, consumable: true, maxHpUp: 15, maxIntUp: 15, calorie: 0,
      description: '身体+15 頭脳+15', dailyLimit: 1, useCount: 1 }
];

