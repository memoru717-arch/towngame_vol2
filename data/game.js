// ============================================
// のんびりタウン - ゲームロジック
// ============================================

// 選択可能なアバター（Profile1〜40）
const avatarOptions = Array.from({length: 40}, (_, i) => `Profile/Profile${i + 1}.png`);

// ゲーム状態
const gameState = {
    player: {
        name: '',
        avatar: 'Profile/Profile1.png',
        avatarBgColor: '#FFB6C1',
        money: 10000,
        health: 30,
        maxHealth: 30,
        intelligence: 30,
        maxIntelligence: 30,
        weight: null,
        height: null,
        bodyFat: null,
        gender: null, // 性別（'男' / '女' / null）
        lastMealTime: Date.now() - 4 * 60 * 60 * 1000, // 最後に食事した時刻（初期：丁度いい）
        lastRegenTime: Date.now(), // 最後にパワーが回復した時刻
        job: '無職',
        jobLevel: 0,
        jobExp: 0,
        currentJobId: null, // 現在の職業ID
        workCount: 0, // 出勤回数
        lastWorkTime: null, // 最終出勤時刻
        spouse: null,
        lover: null,
        possessions: [], // 所有物（アイテム全般）
        disease: null, // 現在の病気（null = 健康）
        mealCount: 0, // 食事回数（病気判定用）
        targetJob: null, // 目標の職業ID（単一）
        birthday: null, // 生年月日 { year, month, day }
        publicSettings: { gender: true, birthday: true, height: true, weight: true }, // 公開設定
        // 能力値
        abilities: {
            国語: 15,
            数学: 15,
            理科: 15,
            社会: 15,
            英語: 15,
            音楽: 15,
            美術: 15,
            体力: 15,
            気力: 15,
            ルックス: 15,
            素早さ: 15,
            面白さ: 15,
            優しさ: 15,
            エロさ: 15
        }
    },
    currentLocation: null,
    day: 1,
    actionCount: 0,
    lastDiseaseCheckDate: null, // 最後に病気チェックした日付（YYYY-MM-DD）
    // 銀行預金
    savings: 0,
    // 入出金履歴（最新100件）
    bankHistory: [],
    // 掲示板データ
    boardPosts: [],
    boardNextId: 1,
    // つぶやきデータ
    tweets: [],
    tweetNextId: 1,
    tweetLikes: [],
    lastTweetTime: null,
    lastGymTime: null,
    lastSchoolTime: null,
    lastEmergencySupport: null,
    coinTree: {
        date: null,
        y: null,
        x: null,
        amount: null,
        collected: false
    },
    likedAnswers: [],
    // カードゲームデータ
    cardGame: {
        tableCards: [],   // 現在のチェーン上のカード
        lastCard: null,   // 前の人が引いたカード（これと違う数字を引く必要がある）
        history: [],      // 最近のゲーム履歴（最大20件）
        lastDrawDate: null // 最後にカードを引いた日付（YYYY-MM-DD）
    },
    // メールボックスデータ
    mailbox: {
        inbox: [
            {
                id: 1,
                from: 'Ren',
                fromAvatar: '😎',
                fromAvatarBg: '#FFD700',
                subject: 'こんにちは！',
                body: 'はじめまして！よろしくね〜！\nのんびりタウンでいっしょに楽しもうね！',
                date: Date.now() - 1000 * 60 * 2,
                read: false,
                starred: false
            },
            {
                id: 2,
                from: 'みさき',
                fromAvatar: '🦋',
                fromAvatarBg: '#E0BBE4',
                subject: 'お手紙ありがとうございます',
                body: 'こちらこそよろしくお願いします！\nいつでも遊びに来てね(*^^*)',
                date: Date.now() - 1000 * 60 * 5,
                read: false,
                starred: false,
                letter: 2
            },
            {
                id: 3,
                from: '管理人',
                fromAvatar: '🐻',
                fromAvatarBg: '#D4A017',
                subject: 'メインタウンへようこそ！',
                body: 'のんびりタウンへようこそ！\n素敵な町での生活をお楽しみください。\n何かお困りのことがあれば、いつでもご連絡ください！',
                date: Date.now() - 1000 * 60 * 60 * 24 * 3,
                read: true,
                starred: false
            }
        ],
        sent: [],
        draft: [],
        favorites: [],
        later: [],
        trash: []
    },
    mailNextId: 4,
    // 通知データ
    notifications: [
        { id: 1, type: 'like',              fromName: 'みかん', fromAvatar: 'Profile/Profile3.png',  fromAvatarBg: '#FFB347', postSnippet: 'のんびりしてたら猫が来た〜！🐱',      date: Date.now() - 3 * 60 * 1000,          read: false },
        { id: 2, type: 'stamp',             fromName: 'もも',   fromAvatar: 'Profile/Profile5.png',  fromAvatarBg: '#DDA0DD', stampEmoji: '🌸', postSnippet: '今日の晩ごはんは手作りカレー！', date: Date.now() - 5 * 60 * 60 * 1000,     read: false },
        { id: 3, type: 'comment',           fromName: 'さくら', fromAvatar: 'Profile/Profile2.png',  fromAvatarBg: '#FFB6C1', postSnippet: '今日のお天気最高だったね☀️', commentText: 'わかる〜！お散歩したくなる！', date: Date.now() - 25 * 60 * 1000,         read: false },
        { id: 4, type: 'reply',             fromName: 'たろう', fromAvatar: 'Profile/Profile7.png',  fromAvatarBg: '#87CEEB', postSnippet: '明日の朝ごはん何にしよっかな〜', commentText: 'パンケーキはどう？🥞',          date: Date.now() - 2 * 60 * 60 * 1000,     read: true  },
        { id: 5, type: 'friend_build_house',fromName: 'ゆき',   fromAvatar: 'Profile/Profile10.png', fromAvatarBg: '#B0E0E6',                                                                                                   date: Date.now() - 3 * 60 * 60 * 1000,     read: true  },
        { id: 6, type: 'friend_build_town', fromName: 'けん',   fromAvatar: 'Profile/Profile12.png', fromAvatarBg: '#90EE90',                                                                                                                                     date: Date.now() - 1 * 60 * 60 * 1000,      read: false },
        { id: 7, type: 'news',               fromName: '管理人', fromAvatar: '🐻',                   fromAvatarBg: '#D4A017', title: '🌸 のんびりタウンへようこそ！', postSnippet: 'タウンの使い方や各施設の説明はこちらをご覧ください。', date: Date.now() - 24 * 60 * 60 * 1000,     read: false },
    ],
    notifNextId: 8,
    // 温泉コンビニ購入記録（1日1個制限用）
    onsenShopPurchaseDate: null, // 最後に購入した日付(YYYY-MM-DD)
    onsenShopPurchased: [], // その日に購入済みの商品名リスト
    // アイテム使用間隔記録（{ itemName: timestamp }）
    itemCooldowns: {},
    // チャレンジ報酬受取日（YYYY-MM-DD）
    lastChallengeRewardDate: null,
    // 納税イベント最終発生日時（ISO文字列）
    lastTaxEventDate: null
};

// ============================================
// 初期化
// ============================================
function init() {
    loadGame(); // セーブデータがあれば復元
    updateBackground(); // 時間帯に応じた背景を設定
    renderMap();
    updateStatus();
    updateMailBadges(); // メールアイコンバッジを初期表示

    renderTweetList();
    setupTweetInfiniteScroll(); // 無限スクロール設定

    // 最初はマップを表示（施設に移動しない）
    document.getElementById('mapView').style.display = 'block';
    document.getElementById('actionView').style.display = 'none';
    document.getElementById('tweetView').style.display = 'none';

    // プロフィール未登録（誕生日が未設定）なら初回登録画面を自動表示
    if (!gameState.player.birthday) {
        setTimeout(() => {
            openYakubaModal();
            openProfileRegistration();
        }, 100);
    }
}

// ============================================
// 時間帯別背景設定
// ============================================
function updateBackground() {
    const hour = new Date().getHours();
    const body = document.body;

    // 既存の背景クラスを削除
    body.classList.remove('bg-day', 'bg-evening', 'bg-night');

    // 時間帯に応じてクラスを追加
    if (hour >= 5 && hour < 15) {
        // 5:00〜15:00 → 昼
        body.classList.add('bg-day');
    } else if (hour >= 15 && hour < 18) {
        // 15:00〜18:00 → 夕方
        body.classList.add('bg-evening');
    } else {
        // 18:00〜5:00 → 夜
        body.classList.add('bg-night');
    }
}

// ============================================
// モーダル操作
// ============================================

function openNameModal() {
    document.getElementById('nameInput').value = gameState.player.name;
    document.getElementById('nameModal').classList.add('active');
}

function closeNameModal() {
    document.getElementById('nameModal').classList.remove('active');
}

function saveName() {
    const newName = document.getElementById('nameInput').value.trim();
    if (newName && newName.length <= 10) {
        gameState.player.name = newName;
        updateStatus();
        closeNameModal();
    }
}

// ============================================
// マップ描画
// ============================================
function renderMap() {
    const mapTable = document.getElementById('townMap');
    const labelsTop = document.getElementById('mapLabelsTop');
    const labelsLeft = document.getElementById('mapLabelsLeft');
    mapTable.innerHTML = '';
    labelsTop.innerHTML = '';
    labelsLeft.innerHTML = '';
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    // 上部ラベル（横軸の数字 1-16）
    for (let x = 1; x <= 16; x++) {
        const label = document.createElement('div');
        label.classList.add('map-label', 'map-label-top');
        label.textContent = x;
        labelsTop.appendChild(label);
    }

    // 左側ラベル（縦軸 A-L）
    for (let y = 0; y < rowLabels.length; y++) {
        const label = document.createElement('div');
        label.classList.add('map-label', 'map-label-left');
        label.textContent = rowLabels[y];
        labelsLeft.appendChild(label);
    }

    // マップ本体
    for (let y = 0; y < townMap.length; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < townMap[y].length; x++) {
            const cell = document.createElement('td');
            const placeId = townMap[y][x];
            const place = places[placeId];
            const tile = mapTiles[y][x];

            // タイル画像があれば画像を表示、なければ絵文字を表示
            if (tile) {
                // フォルダ指定があればそのパス、なければtree&roadフォルダ
                const imgPath = tile.includes('/') ? `${tile}.png` : `tree&road/${tile}.png`;
                cell.innerHTML = `<img src="${imgPath}" alt="${tile}" class="tile-img">`;
            } else {
                cell.innerHTML = `<span class="emoji">${place.emoji}</span>`;
            }
            cell.dataset.place = placeId;

            if (placeId === 'road') {
                cell.classList.add('road');
            }

            // 木や道路タイル（T, +, Y, L, K, S）はホバーエフェクトを無効化
            const noHoverTiles = ['T', '+', 'Y', 'L', 'K', 'S'];
            if (noHoverTiles.includes(tile)) {
                cell.classList.add('no-hover');
            }

            cell.addEventListener('click', () => moveTo(placeId, y, x));
            cell.addEventListener('mouseenter', () => showPlaceInfo(placeId, tile, y, x));
            cell.addEventListener('mouseleave', () => hidePlaceInfo());
            row.appendChild(cell);
        }
        mapTable.appendChild(row);
    }
}

// ============================================
// マップホバー説明表示
// ============================================
function showPlaceInfo(placeId, tile, tileY, tileX) {
    const place = places[placeId];
    const infoBox = document.getElementById('placeInfoBox');
    // 木タイルはコインチェックを先に行う
    if (placeId === 'tree') {
        initDailyCoin();
        const coin = gameState.coinTree;
        if (!coin.collected && coin.y === tileY && coin.x === tileX) {
            infoBox.textContent = 'おや...？なにか落ちている...？';
        } else {
            infoBox.textContent = '';
        }
    // 道路タイル（T, +, Y, L, K）の場合は説明を空欄に
    } else if (['T', '+', 'Y', 'L', 'K'].includes(tile)) {
        infoBox.textContent = '';
    } else if (tile === 'S') {
        infoBox.textContent = 'この場所に家を建てることができます';
    } else if (tile === 'H') {
        infoBox.textContent = '他のタウンに移動します。※ただいま建設工事中';
    } else if (placeId === 'company') {
        // 会社の場合は動的に情報を生成
        const p = gameState.player;
        if (p.job === '無職') {
            infoBox.textContent = '仕事に出かけます。※職に就いていません';
        } else {
            const currentLevel = getCurrentJobLevel();
            const nextLevel = jobLevels[currentLevel.level] || null;
            const expToNext = nextLevel ? nextLevel.expRequired - p.jobExp : 0;
            const nextText = nextLevel ? `次のLvまであと ${expToNext}` : 'MAX';
            infoBox.textContent = `仕事に出かけます。【現在】Lv.${currentLevel.level} | 勤務回数 ${p.workCount}回 | 経験値 ${p.jobExp} | ${nextText}`;
        }
    } else {
        infoBox.textContent = place.mapDescription || place.description;
    }
    infoBox.classList.add('visible');
}

function hidePlaceInfo() {
    const infoBox = document.getElementById('placeInfoBox');
    infoBox.classList.remove('visible');
}

// ============================================
// 移動
// ============================================
function moveTo(placeId, tileY, tileX) {
    const place = places[placeId];
    if (!place) return;

    // 道・空き地はクリックしても何もしない
    if (placeId === 'road' || placeId === 'sale') {
        return;
    }

    // 木：コインが落ちているかチェック
    if (placeId === 'tree') {
        checkTreeCoin(tileY, tileX);
        return;
    }

    gameState.currentLocation = placeId;

    // マップの現在地表示を更新
    document.querySelectorAll('.town-map td').forEach(cell => {
        cell.classList.remove('current');
        if (cell.dataset.place === placeId) {
            cell.classList.add('current');
        }
    });

    // 役場は直接モーダルを開く
    if (placeId === 'yakuba') {
        openYakubaModal();
        return;
    }

    // 温泉は直接モーダルを開く
    if (placeId === 'onsen') {
        openOnsenLobby();
        return;
    }

    // 掲示板は直接モーダルを開く
    if (placeId === 'board') {
        openBoardLobby();
        return;
    }

    // 不動産屋は直接モーダルを開く
    if (placeId === 'hudosan') {
        openHudosan();
        return;
    }

    // 食堂は直接モーダルを開く
    if (placeId === 'shokudo') {
        openShokudo();
        return;
    }

    // 職業安定所は直接モーダルを開く
    if (placeId === 'work') {
        openHelloworkModal();
        return;
    }

    // 会社は直接仕事モーダルを開く
    if (placeId === 'company') {
        openWorkModal();
        return;
    }

    // 新デパートは直接モーダルを開く
    if (placeId === 'shop2') {
        openShop2();
        return;
    }

    // ジムは直接モーダルを開く
    if (placeId === 'gym') {
        openGymModal();
        return;
    }

    // 習い事スクールは直接モーダルを開く
    if (placeId === 'school') {
        openSchoolModal();
        return;
    }

    // 銀行は直接モーダルを開く
    if (placeId === 'bank') {
        openBankModal();
        return;
    }

    // 病院は直接モーダルを開く
    if (placeId === 'hospital') {
        openHospitalModal();
        return;
    }

    // カードゲームは直接モーダルを開く
    if (placeId === 'cardgame') {
        openCardGameModal();
        return;
    }

    // アクションビューを表示
    showActionView(place);
}

// ============================================
// アクションビュー表示
// ============================================
// 現在のアクションを保存するグローバル配列
let currentActions = [];

function showActionView(place) {
    // マップを非表示、アクションビューを表示
    document.getElementById('mapView').style.display = 'none';
    document.getElementById('actionView').style.display = 'block';

    const titleEl = document.getElementById('actionViewTitle');
    const descEl = document.getElementById('actionViewDesc');

    // タイトルを非表示
    titleEl.style.display = 'none';

    // 説明文を設定（HTMLタグ対応）
    descEl.innerHTML = place.description;

    // 説明の背景を非表示、フォント設定
    descEl.style.background = 'none';
    descEl.style.border = 'none';
    descEl.style.boxShadow = 'none';
    descEl.style.fontFamily = '"ヒラギノ角ゴシック", "Hiragino Sans", sans-serif';
    descEl.style.color = '#333333';


    // 施設スタイルのリセット
    document.getElementById('actionButtons').classList.remove('shop-buttons');
    document.querySelector('.action-view-content').style.borderColor = '';

    // アクションを保存
    currentActions = place.actions;

    // アクションボタンを生成
    const buttonsContainer = document.getElementById('actionButtons');
    let html = '';

    place.actions.forEach((action, index) => {
        const descHtml = action.description ? `<span class="action-btn-desc">${action.description}</span>` : '';
        html += `
            <button class="btn btn-primary action-btn" onclick="executeAction(${index})">
                <span class="action-btn-name">${action.name}</span>
                ${descHtml}
            </button>
        `;
    });

    buttonsContainer.innerHTML = html;

    // 商店スタイルの適用
    if (place === places.shop) {
        buttonsContainer.classList.add('shop-buttons');
    }
}

// アクション実行関数
function executeAction(index) {
    if (currentActions[index] && currentActions[index].effect) {
        currentActions[index].effect();
    }
}

// ============================================
// マップに戻る
// ============================================
function backToMap() {
    hideRandomEvent();
    document.getElementById('mapView').style.display = 'block';
    document.getElementById('actionView').style.display = 'none';
    document.getElementById('tweetView').style.display = 'none';
    // アクション後のみランダムイベント判定
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

// ============================================
// ステータス更新
// ============================================
function updateStatus() {
    const p = gameState.player;

    // 基本情報
    document.getElementById('playerAvatar').innerHTML = `<img src="${p.avatar}" alt="アバター" class="player-avatar-img">`;
    document.getElementById('playerAvatar').style.backgroundColor = p.avatarBgColor;
    document.getElementById('playerName').textContent = p.name;
    document.getElementById('money').textContent = p.money.toLocaleString();

    // 総資産計算（所持金 + 銀行預金）
    document.getElementById('totalAssets').textContent = (p.money + gameState.savings).toLocaleString();

    // 職業
    document.getElementById('playerJob').textContent = p.job;
    document.getElementById('playerJobLevel').textContent = '';

    // 身体ステータス
    document.getElementById('health').textContent = Math.floor(p.health);
    document.getElementById('maxHealth').textContent = p.maxHealth;
    document.getElementById('intelligence').textContent = Math.floor(p.intelligence);
    document.getElementById('maxIntelligence').textContent = p.maxIntelligence;
    document.getElementById('weight').textContent = p.weight !== null ? p.weight.toFixed(1) : '--';
    document.getElementById('height').textContent = p.height !== null ? p.height : '--';

    // BMI計算: 体重(kg) ÷ {身長(m) × 身長(m)}
    const heightInMeters = p.height / 100;
    const bmi = p.weight && p.height ? p.weight / (heightInMeters * heightInMeters) : null;
    document.getElementById('bodyFat').textContent = bmi !== null ? bmi.toFixed(1) : '--';

    // バー更新
    const healthPercent = p.health / p.maxHealth * 100;
    const intelligencePercent = p.intelligence / p.maxIntelligence * 100;

    // ゲージ色の計算
    const getBarColor = (percent) => {
        if (percent <= 10) return '#EB6101';
        if (percent <= 50) return '#EAD504';
        return '#329E27';
    };

    const healthBar = document.getElementById('healthBar');
    const intelligenceBar = document.getElementById('intelligenceBar');

    if (healthBar) {
        healthBar.style.width = healthPercent + '%';
        healthBar.style.background = getBarColor(healthPercent);
    }
    if (intelligenceBar) {
        intelligenceBar.style.width = intelligencePercent + '%';
        intelligenceBar.style.background = getBarColor(intelligencePercent);
    }

    // 空腹度テキスト
    const hungerResult = getHungerText();
    const hungerEl = document.getElementById('hungerText');
    if (hungerEl) {
        hungerEl.textContent = hungerResult.text;
        hungerEl.style.color = hungerResult.isWarning ? '#EB6101' : '';
    }

    // コンディション
    const condition = getCondition();
    const conditionEl = document.getElementById('condition');
    if (conditionEl) {
        conditionEl.textContent = condition.text;
        conditionEl.style.color = condition.class === 'bad' ? '#D32F2F' : '';
    }

    // BMIラベル
    const bmiLabel = getBMILabel(bmi);
    const bmiLabelEl = document.getElementById('bodyFatLabel');
    if (bmiLabelEl) {
        bmiLabelEl.textContent = bmiLabel.text;
        bmiLabelEl.className = 'body-fat-label ' + bmiLabel.class;
    }

    // 所有物更新
    renderPossessions();
}

// ============================================
// 職業レベル取得
// ============================================
function getCurrentJobLevel() {
    const exp = gameState.player.jobExp;
    for (let i = jobLevels.length - 1; i >= 0; i--) {
        if (exp >= jobLevels[i].expRequired) {
            return jobLevels[i];
        }
    }
    return jobLevels[0];
}

// ============================================
// 空腹度テキスト（時間ベース）
// ============================================

// 空腹度ステージ定義（startHours: そのステージの開始時間）
const hungerStages = [
    { stage: 1, text: '満腹（食事できません）', isWarning: true, startHours: 0 },
    { stage: 2, text: '丁度いい', isWarning: false, startHours: 2 },
    { stage: 3, text: 'やや空腹', isWarning: false, startHours: 8 },
    { stage: 4, text: '空腹', isWarning: false, startHours: 16 },
    { stage: 5, text: 'かなり空腹', isWarning: false, startHours: 24 },
    { stage: 6, text: '死にそう⋯', isWarning: true, startHours: 72 }
];

function getHungerText() {
    const lastMeal = gameState.player.lastMealTime;
    const now = Date.now();
    // lastMealTime が無効な場合は73時間前として扱う（死にそう状態）
    const elapsed = (typeof lastMeal === 'number' && isFinite(lastMeal)) ? now - lastMeal : 73 * 60 * 60 * 1000;
    const hoursElapsed = elapsed / (1000 * 60 * 60);

    // 後ろから判定して該当ステージを返す
    for (let i = hungerStages.length - 1; i >= 0; i--) {
        if (hoursElapsed >= hungerStages[i].startHours) {
            return { text: hungerStages[i].text, isWarning: hungerStages[i].isWarning, stage: hungerStages[i].stage };
        }
    }
    // フォールバック：死にそう（stage 6）
    return { text: hungerStages[5].text, isWarning: hungerStages[5].isWarning, stage: 6 };
}

// ============================================
// コンディション判定
// ============================================
function getCondition() {
    const p = gameState.player;
    const hungerStatus = getHungerText();

    // 死にそうな状態 → 絶不調
    if (hungerStatus.text === '死にそう⋯') {
        return { text: '絶不調', class: 'bad' };
    }
    // 病気の場合は病名を表示
    if (p.disease) {
        const diseaseInfo = diseasesData.find(d => d.id === p.disease);
        if (diseaseInfo) {
            return { text: diseaseInfo.name, class: 'bad' };
        }
    }

    // 「最高」判定：空腹度が丁度いい & 身体・頭脳パワー両方95%以上 & BMI 17~30
    const hpRatio = p.health / p.maxHealth;
    const intRatio = p.intelligence / p.maxIntelligence;
    const heightM = p.height / 100;
    const bmi = p.weight / (heightM * heightM);
    if (hungerStatus.text === '丁度いい' && hpRatio >= 0.95 && intRatio >= 0.95 && bmi >= 17 && bmi < 30) {
        return { text: '最高', class: 'best' };
    }

    // 身体パワー + 頭脳パワーの合計で判定
    const totalPower = p.health + p.intelligence;
    const maxTotalPower = p.maxHealth + p.maxIntelligence;
    const powerRatio = totalPower / maxTotalPower;

    if (powerRatio >= 0.8) {
        return { text: '良好', class: 'good' };
    }
    if (powerRatio >= 0.5) {
        return { text: '普通', class: 'normal' };
    }
    if (powerRatio >= 0.3) {
        return { text: '悪い', class: 'tired' };
    }
    return { text: 'かなり悪い', class: 'bad' };
}

// ============================================
// BMIラベル
// ============================================
function getBMILabel(bmi) {
    if (bmi < 17) return { text: 'やせすぎ', class: 'thin' };
    if (bmi < 18.5) return { text: 'やせ', class: 'thin' };
    if (bmi < 25) return { text: '普通', class: 'normal' };
    if (bmi < 30) return { text: 'やや肥満', class: 'overweight' };
    return { text: '肥満', class: 'overweight' };
}

// ============================================
// 所有物描画
// ============================================
function renderPossessions() {
    const container = document.getElementById('possessions');
    if (!container) return; // 要素が存在しない場合はスキップ

    const poss = gameState.player.possessions;

    if (poss.length === 0) {
        container.innerHTML = '<div class="empty-inventory">何も持っていません</div>';
        return;
    }

    // アイテムをグループ化（同じ名前のアイテムをまとめる）
    const grouped = {};
    poss.forEach(item => {
        if (grouped[item.name]) {
            grouped[item.name].count++;
        } else {
            grouped[item.name] = { ...item, count: 1 };
        }
    });

    let html = '';
    Object.values(grouped).forEach(item => {
        const isConsumable = item.consumable;
        const countBadge = item.count > 1 ? `<span class="possession-count">×${item.count}</span>` : '';
        const useButton = isConsumable ? `<button class="btn-use" onclick="useItem('${item.name}')">使う</button>` : '';

        html += `
            <div class="possession-item ${isConsumable ? 'consumable' : ''}">
                <span class="possession-emoji">${item.emoji || ''}</span>
                <span class="possession-name">${item.name}</span>
                ${countBadge}
                ${useButton}
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================
// アイテム使用
// ============================================

// '15分' → 15 * 60 * 1000 ms に変換
function parseCooldownMs(cooldownStr) {
    if (!cooldownStr || cooldownStr === '0分') return 0;
    const match = cooldownStr.match(/^(\d+)分$/);
    return match ? parseInt(match[1]) * 60 * 1000 : 0;
}

function useItem(itemName) {
    const p = gameState.player;
    const itemIndex = p.possessions.findIndex(item => item.name === itemName);

    if (itemIndex === -1) {
        return;
    }

    const item = p.possessions[itemIndex];
    const shopItem = shopItems.find(si => si.name === itemName) || shokudoItems.find(si => si.name === itemName) || onsenShopItems.find(si => si.name === itemName);

    if (!shopItem || !shopItem.consumable) {
        return;
    }

    // 使用間隔チェック
    const cooldownMs = parseCooldownMs(shopItem.cooldown);
    if (cooldownMs > 0) {
        if (!gameState.itemCooldowns) gameState.itemCooldowns = {};
        const lastUsed = gameState.itemCooldowns[itemName];
        if (lastUsed) {
            const elapsed = Date.now() - lastUsed;
            if (elapsed < cooldownMs) {
                const remaining = cooldownMs - elapsed;
                const min = Math.ceil(remaining / 60000);
                showToast(`使用間隔中です。あと${min}分お待ちください。`);
                return;
            }
        }
    }

    // 病気を治す薬の場合、病気の有無・対応を確認
    if (shopItem.cures) {
        if (!p.disease) {
            showToast('今は病気ではありません。');
            return;
        }
        const canCure = shopItem.cures === 'all' || shopItem.cures.includes(p.disease);
        if (!canCure) {
            const diseaseInfo = diseasesData.find(d => d.id === p.disease);
            showToast(`${diseaseInfo ? diseaseInfo.name : '病気'}にはこの薬は効きません。`);
            return;
        }
    }

    // パワーチェック（消費パワーが足りるか確認）
    const bodyConsume = shopItem.bodyConsume || 0;
    const brainConsume = shopItem.brainConsume || 0;
    if (p.health < bodyConsume && p.intelligence < brainConsume) {
        showToast('身体パワーと頭脳パワーが足りません');
        return;
    } else if (p.health < bodyConsume) {
        showToast('身体パワーが足りません');
        return;
    } else if (p.intelligence < brainConsume) {
        showToast('頭脳パワーが足りません');
        return;
    }

    // パワー消費
    p.health = Math.max(0, p.health - bodyConsume);
    p.intelligence = Math.max(0, p.intelligence - brainConsume);

    // 効果を適用
    if (shopItem.effect) {
        if (shopItem.effect.health) {
            changeHealth(shopItem.effect.health);
        }
        if (shopItem.effect.intelligence) {
            changeIntelligence(shopItem.effect.intelligence);
        }
        if (shopItem.effect.weight) {
            changeWeight(shopItem.effect.weight);
        }
        if (shopItem.effect.hunger) {
            eatFood(shopItem.hungerEffect || 1);
        }
        if (shopItem.effect.bodyFat) {
            changeBodyFat(shopItem.effect.bodyFat);
        }
    }

    // 上限値アップ（温泉コンビニ商品）
    if (shopItem.maxHpUp) {
        p.maxHealth += shopItem.maxHpUp;
    }
    if (shopItem.maxIntUp) {
        p.maxIntelligence += shopItem.maxIntUp;
    }

    // カロリーによる体重増加（1000kcal = 1kg）
    if (shopItem.calorie && shopItem.calorie > 0) {
        const weightGain = shopItem.calorie / 1000;
        changeWeight(weightGain);
    }

    // デザート・ドリンクは食べ過ぎで虫歯リスク（mealCountに加算）
    if (shopItem.isSweet) {
        gameState.player.mealCount++;
    }

    // 能力値を適用
    if (shopItem.stats) {
        const stats = shopItem.stats;
        const abilities = p.abilities;

        for (const key in stats) {
            if (key in abilities && stats[key]) {
                abilities[key] += stats[key];
            }
        }
    }

    // 病気を治す
    if (shopItem.cures) {
        const diseaseInfo = diseasesData.find(d => d.id === p.disease);
        const diseaseName = diseaseInfo ? diseaseInfo.name : '病気';
        p.disease = null;
        showToast(`${diseaseName}が治りました！`);
    }

    // アイテムを消費（残り回数を減らす）
    if (item.remainingUses > 1) {
        item.remainingUses -= 1;
    } else {
        // 残り1個の場合は削除
        p.possessions.splice(itemIndex, 1);
    }

    // 使用間隔を記録
    if (cooldownMs > 0) {
        if (!gameState.itemCooldowns) gameState.itemCooldowns = {};
        gameState.itemCooldowns[itemName] = Date.now();
    }

    updateStatus();
}


// ============================================
// ステータス変更ヘルパー
// ============================================
function changeHealth(amount) {
    const p = gameState.player;
    p.health = Math.max(0, Math.min(p.maxHealth, p.health + amount));
    updateStatus();
}

function changeMoney(amount) {
    gameState.player.money += amount;
    updateStatus();
}

function changeIntelligence(amount) {
    const p = gameState.player;
    // ノートパソコン所持で効率UP
    const hasLaptop = p.possessions.some(item => item.name === 'ノートパソコン');
    const finalAmount = hasLaptop && amount > 0 ? amount * 2 : amount;
    p.intelligence = Math.max(0, Math.min(p.maxIntelligence, p.intelligence + finalAmount));
    updateStatus();
}

function changeWeight(amount) {
    gameState.player.weight = Math.max(40, gameState.player.weight + amount);
    updateStatus();
}

function changeHunger(amount) {
    // 食事した場合（マイナス値）は lastMealTime をリセット
    if (amount < 0) {
        eatFood();
    }
    // プラス値は何もしない（時間ベースのため）
    updateStatus();
}

// 食事関数（hungerEffectの段階数ぶん空腹度を回復）
function eatFood(stages = 1) {
    const hungerStatus = getHungerText();
    if (hungerStatus.text === '満腹（食事できません）') {
        return false;
    }

    // 現在のステージからstages分だけ回復（最低ステージ1＝満腹）
    const currentStage = hungerStatus.stage;
    const targetStage = Math.max(1, currentStage - stages);

    // 目標ステージの開始時間ぶんだけlastMealTimeを設定
    const targetHours = hungerStages[targetStage - 1].startHours;
    gameState.player.lastMealTime = Date.now() - targetHours * 60 * 60 * 1000;

    gameState.player.mealCount++;
    updateStatus();
    return true;
}

function changeBodyFat(amount) {
    const p = gameState.player;
    p.bodyFat = Math.max(5, Math.min(40, p.bodyFat + amount));
    updateStatus();
}

// ============================================
// アクション後の処理
// ============================================
function afterAction() {
    gameState.actionCount++;
    gameState.pendingRandomEvent = true;
}

// ============================================
// パワー自然回復（30秒に1ポイント）
// ============================================
setInterval(() => {
    const p = gameState.player;
    if (p.health < p.maxHealth) {
        p.health = Math.min(p.maxHealth, p.health + 1);
    }
    if (p.intelligence < p.maxIntelligence) {
        p.intelligence = Math.min(p.maxIntelligence, p.intelligence + 1);
    }
    p.lastRegenTime = Date.now();
    updateStatus();
}, 30000);

// ============================================
// アクション関数
// ============================================

// 会社モーダル
let workCooldownInterval = null;

function openWorkModal() {
    const modal = document.getElementById('workModal');
    const messageEl = document.getElementById('workResultMessage');
    const detailsEl = document.getElementById('workResultDetails');
    const p = gameState.player;

    // 無職チェック
    if (p.job === '無職') {
        messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>まだ職に就いていないようです。<br>E-12の職業安定所で職を探しましょう！';
        messageEl.classList.add('no-job');
        detailsEl.innerHTML = '';
    } else {
        // 現在の職業データを取得
        const job = jobsData.find(j => j.id === p.currentJobId);
        if (!job) {
            messageEl.innerHTML = '職業データが見つかりません。';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        }

        // 出勤間隔チェック（1分 = 60000ミリ秒）
        const workInterval = 600000; // 10分のクールタイム
        if (p.lastWorkTime && Date.now() - p.lastWorkTime < workInterval) {
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';

            // カウントダウン更新関数
            const updateWorkCooldown = () => {
                const remaining = workInterval - (Date.now() - p.lastWorkTime);
                if (remaining <= 0) {
                    if (workCooldownInterval) {
                        clearInterval(workCooldownInterval);
                        workCooldownInterval = null;
                    }
                    messageEl.innerHTML = '出勤できるようになりました！';
                    return;
                }
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                const timeText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
                messageEl.innerHTML = `<span class="error-text">ERROR！</span><br>仕事に行ける間隔は1分です。<br>次に出勤できるまであと ${timeText}`;
            };

            updateWorkCooldown();
            if (workCooldownInterval) clearInterval(workCooldownInterval);
            workCooldownInterval = setInterval(updateWorkCooldown, 1000);

            modal.classList.add('active');
            return;
        }

        // コンディションチェック
        const condition = getCondition();
        if (condition.text === '絶不調') {
            messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>コンディションが絶不調のため出勤できないようです。。。';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        }

        // BMIチェック（表示値と合わせるため小数点1桁で比較）
        const heightM = p.height / 100;
        const playerBMI = Math.round(p.weight / (heightM * heightM) * 10) / 10;
        const minBMI = job.conditions.bmi[0];
        const maxBMI = job.conditions.bmi[1];
        if (playerBMI < minBMI || playerBMI > maxBMI) {
            messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>体格指数（BMI）が条件を満たしていないため出勤できません。。。';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        }

        // パワーチェック
        const bodyConsume = job.bodyConsume;
        const brainConsume = job.brainConsume;

        if (p.health < bodyConsume && p.intelligence < brainConsume) {
            messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>身体パワーと頭脳パワーが足りないようです！';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        } else if (p.health < bodyConsume) {
            messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>身体パワーが足りないようです！';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        } else if (p.intelligence < brainConsume) {
            messageEl.innerHTML = '<span class="error-text">ERROR！</span><br>頭脳パワーが足りないようです！';
            messageEl.classList.add('no-job');
            detailsEl.innerHTML = '';
            modal.classList.add('active');
            return;
        }

        // 最終出勤時刻を記録
        p.lastWorkTime = Date.now();

        // 出勤回数をカウント
        p.workCount++;

        // 経験値（コンディションに応じてランダム）
        const prevLevel = getCurrentJobLevel();
        const prevSalary = Math.floor(job.salary * prevLevel.salaryRate);

        let expGain;
        // 病気のときは経験値が減る
        const diseaseInfo = p.disease ? diseasesData.find(d => d.id === p.disease) : null;
        if (diseaseInfo) {
            if (diseaseInfo.severity === 1) {
                expGain = -(Math.floor(Math.random() * 3) + 2); // -2~-4
            } else if (diseaseInfo.severity === 2) {
                expGain = -(Math.floor(Math.random() * 4) + 5); // -5~-8
            } else {
                expGain = -(Math.floor(Math.random() * 4) + 9); // -9~-12
            }
        } else if (condition.text === '最高') {
            expGain = 20;
        } else if (condition.text === '良好') {
            expGain = Math.floor(Math.random() * 4) + 14; // 14~17
        } else if (condition.text === '普通') {
            expGain = Math.floor(Math.random() * 4) + 10; // 10~13
        } else if (condition.text === '悪い') {
            expGain = Math.floor(Math.random() * 4) + 6; // 6~9
        } else {
            expGain = Math.floor(Math.random() * 4) + 2; // 2~5（かなり悪い）
        }
        p.jobExp = Math.max(0, p.jobExp + expGain);

        // レベルアップチェック
        const newLevel = getCurrentJobLevel();
        const newSalary = Math.floor(job.salary * newLevel.salaryRate);
        const leveledUp = newLevel.level > prevLevel.level;

        // 身体パワー・頭脳パワー消費
        p.health = Math.max(0, p.health - bodyConsume);
        p.intelligence = Math.max(0, p.intelligence - brainConsume);

        // 体重減少（ベース0.05 + 身体消費に応じた減少）
        const weightLoss = 0.05 + bodyConsume * 0.01;
        p.weight = Math.max(0, p.weight - weightLoss);

        // 給料計算（昇給率を適用）
        const baseSalary = Math.floor(job.salary * newLevel.salaryRate);
        let salaryEarned = baseSalary;
        let bonusEarned = 0;

        // レベルアップボーナス（前のレベルの給料で計算）
        if (leveledUp && job.bonus > 0) {
            bonusEarned = prevSalary * job.bonus;
        }

        // 給料・ボーナスを所持金に追加
        const totalEarned = salaryEarned + bonusEarned;
        if (totalEarned > 0) {
            p.money += totalEarned;
        }

        // 表示を更新
        messageEl.innerHTML = `仕事に出かけました(${p.workCount}回目)`;
        messageEl.classList.remove('no-job');

        let detailsHTML = `
            <p>${expGain >= 0 ? `${expGain}の経験値を得ました。` : `経験値が${Math.abs(expGain)}下がってしまいました。`}</p>
            <p>身体パワーを${bodyConsume}使いました。</p>
            <p>頭脳パワーを${brainConsume}使いました。</p>
            <p>体重が${weightLoss.toFixed(2)}kg減りました。</p>
        `;

        // 給料表示
        if (salaryEarned > 0) {
            detailsHTML += `<p class="salary-info">${salaryEarned.toLocaleString()}円のお給料をもらいました！</p>`;
        }

        // ボーナス表示
        if (bonusEarned > 0) {
            detailsHTML += `<p class="bonus-info">${bonusEarned.toLocaleString()}円のボーナスが出ました！</p>`;
        }

        // レベルアップ表示
        if (leveledUp) {
            detailsHTML += `<p class="levelup-info">レベルが${newLevel.level}へ上がりました！</p>`;
            detailsHTML += `<p class="levelup-info">${newSalary.toLocaleString()}円 / 1回に昇給しました！</p>`;
        }

        detailsEl.innerHTML = detailsHTML;

        // ステータス更新
        updateStatus();

        // 通勤成功時のみイベント判定フラグを立てる
        gameState.pendingRandomEvent = true;
    }

    modal.classList.add('active');
}

function closeWorkModal() {
    hideRandomEvent();
    if (workCooldownInterval) {
        clearInterval(workCooldownInterval);
        workCooldownInterval = null;
    }
    document.getElementById('workModal').classList.remove('active');
    // 通勤成功時のみランダムイベント判定
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

// ジムモーダル
function openGymModal() {
    renderGymTable();
    document.getElementById('gymTableView').style.display = 'flex';
    document.getElementById('gymResultView').style.display = 'none';
    document.getElementById('gymModal').classList.add('active');
}

function closeGymModal() {
    document.getElementById('gymModal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

// 習い事スクールモーダル
function openSchoolModal() {
    renderSchoolTable();
    document.getElementById('schoolTableView').style.display = 'block';
    document.getElementById('schoolResultView').style.display = 'none';
    document.getElementById('schoolModal').classList.add('active');
}

function closeSchoolModal() {
    document.getElementById('schoolModal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

// ジム
const gymMenus = [
    { name: 'スイミング',   image: 'public/gym/swimming.png',   stats: { 体力: 8, ルックス: 7, 素早さ: 6, エロさ: 9 },  price: 15000, bodyConsume: 20, bmi: [17, 35], calorie: 1050 },
    { name: 'ダンス',       image: 'public/gym/dance.png',       stats: { ルックス: 6, 素早さ: 7, 面白さ: 7, エロさ: 10 }, price: 15000, bodyConsume: 20, bmi: [17, 32], calorie: 850 },
    { name: 'ジョギング',   image: 'public/gym/Jogging.png',     stats: { 体力: 8, 気力: 8, ルックス: 7, 優しさ: 7 },  price: 15000, bodyConsume: 20, bmi: [17, 35], calorie: 700 },
    { name: 'フットサル',   image: 'public/gym/futsal.png',      stats: { 体力: 6, 素早さ: 9, 面白さ: 7, 優しさ: 8 },  price: 15000, bodyConsume: 20, bmi: [17, 33], calorie: 950 },
    { name: 'テニス',       image: 'public/gym/tennis.png',      stats: { 体力: 7, 気力: 6, 素早さ: 10, 面白さ: 7 },  price: 15000, bodyConsume: 20, bmi: [17, 33], calorie: 800 },
    { name: '空手',         image: 'public/gym/karate.png',      stats: { 体力: 8, 気力: 10, 優しさ: 7, エロさ: 5 },  price: 15000, bodyConsume: 20, bmi: [17, 35], calorie: 1000 },
    { name: 'ヨガ',         image: 'public/gym/yoga.png',        stats: { 気力: 7, ルックス: 8, 優しさ: 5, エロさ: 10 }, price: 15000, bodyConsume: 20, bmi: [17, 40], calorie: 600 },
    { name: 'ボクシング',   image: 'public/gym/boxing.png',      stats: { 体力: 8, 素早さ: 9, 面白さ: 5, エロさ: 8 },  price: 15000, bodyConsume: 20, bmi: [17, 35], calorie: 1200 },
    { name: 'トランポリン', image: 'public/gym/trampoline.png',  stats: { ルックス: 6, 素早さ: 5, 面白さ: 11, 優しさ: 8 }, price: 15000, bodyConsume: 20, bmi: [17, 30], calorie: 900 },
    { name: '弓道',         image: 'public/gym/kyudo.png',       stats: { 気力: 10, ルックス: 7, 面白さ: 5, 優しさ: 8 }, price: 15000, bodyConsume: 20, bmi: [17, 40], calorie: 650 },
    { name: 'バレエ',       image: 'public/gym/ballet.png',      stats: { 気力: 5, ルックス: 10, 素早さ: 6, エロさ: 9 }, price: 15000, bodyConsume: 20, bmi: [17, 25], calorie: 750 },
    { name: 'ボルダリング', image: 'public/gym/bouldering.png',  stats: { 体力: 7, 気力: 6, 面白さ: 9, 優しさ: 8 },  price: 15000, bodyConsume: 20, bmi: [17, 28], calorie: 1100 }
];

function updateGymPanel() {
    const selected = document.querySelector('input[name="gymMenu"]:checked');
    const panel = document.getElementById('gymPanel');
    const trainBtn = document.getElementById('gymTrainBtn');

    if (!selected) {
        panel.innerHTML = '<p class="shokudo-no-select">メニューを選んでください</p>';
        trainBtn.disabled = true;
        trainBtn.classList.remove('active');
        return;
    }

    const index = parseInt(selected.value);
    const menu = gymMenus[index];
    const p = gameState.player;
    const playerBmi = p.weight / ((p.height / 100) ** 2);
    const bmiOk = playerBmi >= menu.bmi[0] && playerBmi <= menu.bmi[1];
    const canTrain = p.health >= menu.bodyConsume && p.money >= menu.price && bmiOk && !p.disease;

    panel.innerHTML = `
        <div class="shokudo-selected-content">
            <p class="shokudo-select-name">${menu.name}</p>
            ${menu.image ? `<img src="${menu.image}" alt="${menu.name}" class="gym-select-img">` : ''}
            <div class="shokudo-select-divider"></div>
            <div class="shokudo-select-row">
                <span class="shokudo-select-key">消費カロリー</span>
                <span class="shokudo-select-val">${menu.calorie}kcal</span>
            </div>
            <div class="shokudo-select-row">
                <span class="shokudo-select-key">身体消費</span>
                <span class="shokudo-select-val">${menu.bodyConsume}</span>
            </div>
            <div class="shokudo-select-row shokudo-select-price-row">
                <span class="shokudo-select-key">金額</span>
                <span class="shokudo-select-val shokudo-select-price">${menu.price.toLocaleString()} 円</span>
            </div>
        </div>
    `;

    const bodyWarn = document.getElementById('gymBodyWarn');
    let warnMsg = '';
    if (p.disease) {
        warnMsg = '病気のためトレーニングできません';
    } else if (!bmiOk) {
        warnMsg = '体格指数の条件を満たしていません';
    } else if (p.money < menu.price) {
        warnMsg = '所持金が足りません';
    } else if (p.health < menu.bodyConsume) {
        warnMsg = '身体パワーが足りません';
    }
    if (warnMsg) {
        bodyWarn.textContent = warnMsg;
        bodyWarn.style.display = '';
    } else {
        bodyWarn.style.display = 'none';
    }

    trainBtn.disabled = !canTrain;
    trainBtn.classList.toggle('active', canTrain);
}

function renderGymTable() {
    const tbody = document.getElementById('gymTableBody');
    const abilities = gameState.player.abilities;
    const playerBmi = gameState.player.weight / ((gameState.player.height / 100) ** 2);

    const gymAbilityKeys = ['体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];

    // ユーザー能力値行
    let userCells = '';
    gymAbilityKeys.forEach(key => {
        userCells += `<td>${abilities[key]}</td>`;
    });

    const userStatsRow = `
        <tr class="gym-user-stats">
            <td class="gym-user-stats-label">現在の能力値</td>
            ${userCells}
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;

    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            const targetCells = gymAbilityKeys.map(k => `<td>${targetJob.abilities[k] || ''}</td>`).join('');
            targetJobRow = `
        <tr class="target-job-stats">
            <td class="target-job-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td></td><td></td><td></td>
        </tr>`;
        }
    }

    // メニュー行
    let menuRows = '';
    gymMenus.forEach((menu, index) => {
        let abilityCells = '';
        gymAbilityKeys.forEach(key => {
            const val = menu.stats[key];
            abilityCells += `<td>${val ? val : ''}</td>`;
        });

        menuRows += `
            <tr>
                <td class="gym-menu-name"><label><input type="radio" name="gymMenu" class="gym-radio" value="${index}" onchange="updateGymPanel()"> ${menu.name}</label></td>
                ${abilityCells}
                <td>${menu.calorie > 0 ? menu.calorie + 'kcal' : '-'}</td>
                <td class="gym-price">${menu.price.toLocaleString()}円</td>
                <td>${menu.bodyConsume}</td>
            </tr>
        `;
    });

    tbody.innerHTML = userStatsRow + targetJobRow + menuRows;

    // 右パネル初期化
    document.getElementById('gymMoney').textContent = `${gameState.player.money.toLocaleString()}円`;
    document.getElementById('gymPanel').innerHTML = '<p class="shokudo-no-select">メニューを選んでください</p>';
    document.getElementById('gymBodyWarn').style.display = 'none';
    const trainBtn = document.getElementById('gymTrainBtn');
    trainBtn.disabled = true;
    trainBtn.classList.remove('active');
}

// ============================================
// 習い事スクール
// ============================================
const schoolMenus = [
    { name: '英会話教室', stats: { 国語: 8, 社会: 7, 英語: 9, 音楽: 6 }, price: 15000, brainConsume: 20 },
    { name: 'ピアノレッスン', stats: { 数学: 5, 理科: 7, 音楽: 9, 美術: 9 }, price: 15000, brainConsume: 20 },
    { name: 'プログラミング講座', stats: { 数学: 10, 理科: 8, 社会: 5, 英語: 7 }, price: 15000, brainConsume: 20 },
    { name: 'お料理教室', stats: { 国語: 6, 理科: 8, 社会: 8, 美術: 8 }, price: 15000, brainConsume: 20 },
    { name: 'イラスト講座', stats: { 国語: 7, 数学: 6, 音楽: 7, 美術: 10 }, price: 15000, brainConsume: 20 },
    { name: 'ボーカルレッスン', stats: { 国語: 6, 英語: 7, 音楽: 10, 美術: 7 }, price: 15000, brainConsume: 20 },
    { name: '写真教室', stats: { 理科: 7, 社会: 8, 音楽: 7, 美術: 8 }, price: 15000, brainConsume: 20 },
    { name: 'コーヒー講座', stats: { 国語: 8, 数学: 8, 理科: 7, 社会: 7 }, price: 15000, brainConsume: 20 },
    { name: '心理学講座', stats: { 国語: 9, 数学: 8, 社会: 8, 英語: 5 }, price: 15000, brainConsume: 20 },
    { name: 'ペン字・美文字', stats: { 国語: 8, 数学: 5, 英語: 7, 美術: 10 }, price: 15000, brainConsume: 20 },
    { name: '占い講座', stats: { 理科: 7, 社会: 8, 英語: 9, 音楽: 6 }, price: 15000, brainConsume: 20 },
    { name: 'マネーリテラシー講座', stats: { 数学: 9, 理科: 7, 英語: 8, 音楽: 6 }, price: 15000, brainConsume: 20 }
];

function renderSchoolTable() {
    const tbody = document.getElementById('schoolTableBody');
    const abilities = gameState.player.abilities;

    const schoolAbilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術'];

    // ユーザー能力値行
    let userCells = '';
    schoolAbilityKeys.forEach(key => {
        userCells += `<td>${abilities[key]}</td>`;
    });

    const userStatsRow = `
        <tr class="gym-user-stats">
            <td class="gym-user-stats-label">現在の能力値</td>
            ${userCells}
            <td></td>
            <td></td>
        </tr>
    `;

    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            const targetCells = schoolAbilityKeys.map(k => `<td>${targetJob.abilities[k] || ''}</td>`).join('');
            targetJobRow = `
        <tr class="target-job-stats">
            <td class="target-job-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td></td><td></td>
        </tr>`;
        }
    }

    // メニュー行
    let menuRows = '';
    schoolMenus.forEach((menu, index) => {
        let abilityCells = '';
        schoolAbilityKeys.forEach(key => {
            const val = menu.stats[key];
            abilityCells += `<td>${val ? val : ''}</td>`;
        });

        menuRows += `
            <tr>
                <td class="gym-menu-name"><label><input type="radio" name="schoolMenu" class="gym-radio" value="${index}"> ${menu.name}</label></td>
                ${abilityCells}
                <td class="gym-price">${menu.price.toLocaleString()}円</td>
                <td>${menu.brainConsume}</td>
            </tr>
        `;
    });

    tbody.innerHTML = userStatsRow + targetJobRow + menuRows;
}

function doSchoolLesson() {
    const selected = document.querySelector('input[name="schoolMenu"]:checked');
    if (!selected) {
        showToast('メニューを選択してください');
        return;
    }

    const menu = schoolMenus[selected.value];
    const p = gameState.player;

    // 病気チェック
    if (p.disease) {
        const diseaseInfo = diseasesData.find(d => d.id === p.disease);
        showToast(`${diseaseInfo ? diseaseInfo.name : '病気'}のためレッスンを受けられません。。。`, 2000);
        return;
    }

    // クールダウンチェック（30分）※テスト用: 無効化
    /* if (gameState.lastSchoolTime) {
        const elapsed = Date.now() - new Date(gameState.lastSchoolTime).getTime();
        const cooldownMs = 30 * 60 * 1000;
        if (elapsed < cooldownMs) {
            const remaining = cooldownMs - elapsed;
            const min = Math.floor(remaining / 60000);
            const sec = Math.floor((remaining % 60000) / 1000);
            showToast(`まだ30分経過していません。\n次のレッスンまであと ${min}分${sec.toString().padStart(2, '0')}秒`, 3000);
            return;
        }
    } */

    // 所持金チェック
    if (p.money < menu.price) {
        showToast('所持金が足りません');
        return;
    }

    // 頭脳パワーチェック
    if (p.intelligence < menu.brainConsume) {
        showToast('頭脳パワーが足りません');
        return;
    }

    // 支払い＆消費
    changeMoney(-menu.price);
    changeIntelligence(-menu.brainConsume);

    // クールダウン開始時刻を記録
    gameState.lastSchoolTime = new Date().toISOString();

    // 能力値を加算
    const abilities = p.abilities;
    for (const key in menu.stats) {
        if (key in abilities && menu.stats[key]) {
            abilities[key] += menu.stats[key];
        }
    }

    updateStatus();

    // 結果表示（画面切り替え）
    let statsHtml = '';
    for (const [key, value] of Object.entries(menu.stats)) {
        if (value > 0) {
            statsHtml += `<div class="gym-stat-up-item">${key}が <strong>+${value}</strong> アップ！</div>`;
        }
    }

    let schoolStatsHtml = '<div class="shokudo-eat-changes">';
    for (const [key, value] of Object.entries(menu.stats)) {
        if (value > 0) {
            schoolStatsHtml += `<div class="shokudo-change-row">
                <span class="shokudo-change-label">${key}</span>
                <span class="shokudo-change-plus">+${value}</span>
            </div>`;
        }
    }
    schoolStatsHtml += `<div class="shokudo-change-row">
        <span class="shokudo-change-label">頭脳パワー消費</span>
        <span class="shokudo-change-plus">-${menu.brainConsume}</span>
    </div>`;
    schoolStatsHtml += '</div>';

    document.getElementById('schoolResultMessage').textContent = `${menu.name}を受講しました！`;
    document.getElementById('schoolResultStats').innerHTML = schoolStatsHtml;

    // スクールモーダル内でテーブルビューを隠して結果ビューを表示
    document.getElementById('schoolTableView').style.display = 'none';
    document.getElementById('schoolResultView').style.display = 'flex';

    gameState.pendingRandomEvent = true;
    afterAction();
}

// はてなツールチップ（position:fixed で overflow の影響を回避）
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gym-hatena-wrapper').forEach(wrapper => {
        const icon = wrapper.querySelector('.gym-hatena-icon');
        const tooltip = wrapper.querySelector('.gym-hatena-tooltip');
        if (icon && tooltip) {
            icon.addEventListener('mouseenter', () => {
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - 8) + 'px';
                tooltip.style.transform = 'translate(-50%, -100%)';
                tooltip.style.display = 'block';
            });
            icon.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }
    });
});

// トースト通知
let toastTimer = null;
function showToast(message, duration = 2000) {
    const el = document.getElementById('toastNotification');
    el.textContent = message;
    el.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        el.classList.remove('show');
    }, duration);
}

function doGymTraining() {
    const selected = document.querySelector('input[name="gymMenu"]:checked');
    if (!selected) {
        showToast('メニューを選択してください');
        return;
    }

    const menu = gymMenus[selected.value];
    const p = gameState.player;

    // 病気チェック
    if (p.disease) {
        const diseaseInfo = diseasesData.find(d => d.id === p.disease);
        showToast(`${diseaseInfo ? diseaseInfo.name : '病気'}のためトレーニングできません。。。`, 2000);
        return;
    }

    // クールダウンチェック（30分）※テスト用: 無効化
    /* if (gameState.lastGymTime) {
        const elapsed = Date.now() - new Date(gameState.lastGymTime).getTime();
        const cooldownMs = 30 * 60 * 1000;
        if (elapsed < cooldownMs) {
            const remaining = cooldownMs - elapsed;
            const min = Math.floor(remaining / 60000);
            const sec = Math.floor((remaining % 60000) / 1000);
            showToast(`まだ30分経過していません。\n次のトレーニングまであと ${min}分${sec.toString().padStart(2, '0')}秒`, 3000);
            return;
        }
    } */

    const playerBmi = p.weight / ((p.height / 100) ** 2);

    // BMIチェック
    if (playerBmi < menu.bmi[0] || playerBmi > menu.bmi[1]) {
        showToast('体格指数（BMI）が条件を満たしていません');
        return;
    }

    // 所持金チェック
    if (p.money < menu.price) {
        showToast('所持金が足りません');
        return;
    }

    // 身体パワーチェック
    if (p.health < menu.bodyConsume) {
        showToast('身体パワーが足りません');
        return;
    }

    // 支払い＆消費
    changeMoney(-menu.price);
    changeHealth(-menu.bodyConsume);
    const weightLoss = menu.calorie / 1000;
    changeWeight(-weightLoss);

    // クールダウン開始時刻を記録
    gameState.lastGymTime = new Date().toISOString();

    // 能力値を加算
    const abilities = p.abilities;
    for (const key in menu.stats) {
        if (key in abilities && menu.stats[key]) {
            abilities[key] += menu.stats[key];
        }
    }

    updateStatus();

    // 結果表示（画面切り替え）
    let statsHtml = '<div class="shokudo-eat-changes">';
    for (const [key, value] of Object.entries(menu.stats)) {
        if (value > 0) {
            statsHtml += `<div class="shokudo-change-row">
                <span class="shokudo-change-label">${key}</span>
                <span class="shokudo-change-plus">+${value}</span>
            </div>`;
        }
    }
    statsHtml += `<div class="shokudo-change-row">
        <span class="shokudo-change-label">消費カロリー</span>
        <span class="shokudo-change-plus">${menu.calorie}kcal</span>
    </div>
    <div class="shokudo-change-row">
        <span class="shokudo-change-label">体重</span>
        <span class="shokudo-change-plus">-${weightLoss.toFixed(1)}kg</span>
    </div>`;
    statsHtml += '</div>';

    document.getElementById('gymResultMessage').textContent = `${menu.name}をしました！`;
    document.getElementById('gymResultStats').innerHTML = statsHtml;

    // ジムモーダル内でテーブルビューを隠して結果ビューを表示
    document.getElementById('gymTableView').style.display = 'none';
    document.getElementById('gymResultView').style.display = 'flex';

    gameState.pendingRandomEvent = true;
    afterAction();
}

// BGM
// ↓ここに曲を追加するだけでランダム再生されます♪
const onsenBgmList = [
    'BGM/onsen-ryokan-1.mp3',
    'BGM/onsen-ryokan-3.mp3',
    'BGM/onsen-ryokan-6.mp3',
    'BGM/onsen-ryokan-7.mp3',
    'BGM/onsen-ryokan-8.mp3',
    'BGM/onsen-ryokan-9.mp3',
    'BGM/onsen-ryokan-15.mp3',
    'BGM/onsen-ryokan-16.mp3',
    'BGM/onsen-ryokan-17.mp3',
    'BGM/onsen-ryokan-18.mp3',
    'BGM/onsen-ryokan-19.mp3',
    'BGM/onsen-ryokan-20.mp3',
];

let bgmPlaying = false;
let lastBgmIndex = -1;
const bgmAudio = new Audio();
bgmAudio.volume = 0.50;

function playRandomBgm() {
    let index;
    if (onsenBgmList.length === 1) {
        index = 0;
    } else {
        do {
            index = Math.floor(Math.random() * onsenBgmList.length);
        } while (index === lastBgmIndex);
    }
    lastBgmIndex = index;
    bgmAudio.src = onsenBgmList[index];
    bgmAudio.play();
}

// 曲が終わったら次のランダム曲を再生
bgmAudio.addEventListener('ended', () => {
    if (bgmPlaying) {
        playRandomBgm();
    }
});

function toggleBgm() {
    if (bgmPlaying) {
        bgmAudio.pause();
        bgmPlaying = false;
    } else {
        playRandomBgm();
        bgmPlaying = true;
    }
}

// 温泉施設
let onsenBgTimer = null;
let onsenRecoveryTimer = null;

function openOnsenLobby() {
    document.getElementById('onsenLobbyView').style.display = '';
    document.getElementById('onsenBathView').style.display = 'none';
    document.getElementById('onsenShopView').style.display = 'none';
    document.getElementById('onsenShopCompleteView').style.display = 'none';
    document.getElementById('onsenLobbyCloseBtn').style.display = '';
    const mc = document.querySelector('#onsenModal .modal-content');
    mc.classList.add('onsen-lobby-mode');
    mc.classList.remove('onsen-shop-mode');
    document.getElementById('onsenModal').classList.add('active');
}

function closeOnsenLobbyAndOpenShop() {
    openOnsenShop();
}

function normalBath() {
    if (gameState.player.money < 1500) {
        showToast('所持金が足りません（入浴料：1,500円）');
        return;
    }
    changeMoney(-1500);
    updateStatus();

    const p = gameState.player;
    const healthPercent = p.health / p.maxHealth * 100;
    const intelligencePercent = p.intelligence / p.maxIntelligence * 100;
    const getBarColor = (percent) => {
        if (percent <= 10) return '#EB6101';
        if (percent <= 50) return '#EAD504';
        return '#329E27';
    };

    document.getElementById('onsenHealth').textContent = p.health;
    document.getElementById('onsenMaxHealth').textContent = p.maxHealth;
    document.getElementById('onsenHealthBar').style.width = healthPercent + '%';
    document.getElementById('onsenHealthBar').style.background = getBarColor(healthPercent);

    document.getElementById('onsenIntelligence').textContent = p.intelligence;
    document.getElementById('onsenMaxIntelligence').textContent = p.maxIntelligence;
    document.getElementById('onsenIntelligenceBar').style.width = intelligencePercent + '%';
    document.getElementById('onsenIntelligenceBar').style.background = getBarColor(intelligencePercent);

    // ロビーを隠して入浴ビューを表示
    document.getElementById('onsenLobbyView').style.display = 'none';
    document.getElementById('onsenBathView').style.display = '';
    document.getElementById('onsenLobbyCloseBtn').style.display = 'none';
    document.querySelector('#onsenModal .modal-content').classList.remove('onsen-lobby-mode');
    document.getElementById('onsenModal').classList.add('active');

    // 背景画像の交互切り替え開始
    const img = document.getElementById('onsenBgImg');
    let isFirst = true;
    img.src = 'haikei/onsen.png';
    onsenBgTimer = setInterval(() => {
        isFirst = !isFirst;
        img.src = isFirst ? 'haikei/onsen.png' : 'haikei/onsen2.png';
    }, 2000);

    // 10倍速回復（3秒に1ポイント）
    onsenRecoveryTimer = setInterval(() => {
        const pl = gameState.player;
        let recovered = false;
        if (pl.health < pl.maxHealth) {
            pl.health = Math.min(pl.maxHealth, pl.health + 1);
            recovered = true;
        }
        if (pl.intelligence < pl.maxIntelligence) {
            pl.intelligence = Math.min(pl.maxIntelligence, pl.intelligence + 1);
            recovered = true;
        }
        if (recovered) {
            const hp = pl.health / pl.maxHealth * 100;
            const ip = pl.intelligence / pl.maxIntelligence * 100;
            const barColor = (pct) => pct <= 10 ? '#EB6101' : pct <= 50 ? '#EAD504' : '#329E27';
            document.getElementById('onsenHealth').textContent = pl.health;
            document.getElementById('onsenHealthBar').style.width = hp + '%';
            document.getElementById('onsenHealthBar').style.background = barColor(hp);
            document.getElementById('onsenIntelligence').textContent = pl.intelligence;
            document.getElementById('onsenIntelligenceBar').style.width = ip + '%';
            document.getElementById('onsenIntelligenceBar').style.background = barColor(ip);
            updateStatus();
        }
    }, 3000);
}

function closeOnsenModal() {
    // タイマー停止
    if (onsenBgTimer) {
        clearInterval(onsenBgTimer);
        onsenBgTimer = null;
    }
    if (onsenRecoveryTimer) {
        clearInterval(onsenRecoveryTimer);
        onsenRecoveryTimer = null;
    }
    // BGM停止
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
    bgmPlaying = false;
    document.getElementById('onsenModal').classList.remove('active');
    // ビューをロビーに戻す
    document.getElementById('onsenLobbyView').style.display = '';
    document.getElementById('onsenBathView').style.display = 'none';
    document.getElementById('onsenShopView').style.display = 'none';
    document.getElementById('onsenShopCompleteView').style.display = 'none';
    document.getElementById('onsenLobbyCloseBtn').style.display = '';
    const mc = document.querySelector('#onsenModal .modal-content');
    mc.classList.add('onsen-lobby-mode');
    mc.classList.remove('onsen-shop-mode');
    // ランダムイベント判定
    hideRandomEvent();
    tryShowRandomEvent();
}

function adBath() {
    // TODO: 広告風呂の処理
}

// 病院
function openHospitalModal() {
    const p = gameState.player;
    const diseaseInfo = p.disease ? diseasesData.find(d => d.id === p.disease) : null;

    // 診察画面をリセット
    document.getElementById('hospitalMainView').style.display = 'block';
    document.getElementById('hospitalCompleteView').style.display = 'none';

    if (diseaseInfo) {
        document.getElementById('hospitalModalDesc').innerHTML = diseaseInfo.doctorMsg;
        document.getElementById('hospitalModalButtons').innerHTML = `
            <button class="btn btn-primary hospital-action-btn" onclick="treatDisease()">お願いします</button>
            <button class="btn hospital-cancel-btn" onclick="closeHospitalModal()">ぼったくりっぽいのでやめる</button>
        `;
    } else {
        document.getElementById('hospitalModalDesc').innerHTML = 'どこも悪いところはないようです。<br>念のため注射を打っておきますか？<br>10,000円かかりますが。。。';
        document.getElementById('hospitalModalButtons').innerHTML = `
            <button class="btn btn-primary hospital-action-btn" onclick="preventiveShot()">お願いします</button>
            <button class="btn hospital-cancel-btn" onclick="closeHospitalModal()">金を取られる前に退散する</button>
        `;
    }

    document.getElementById('hospitalModal').classList.add('active');
}

function closeHospitalModal() {
    document.getElementById('hospitalModal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

function treatDisease() {
    const p = gameState.player;
    const diseaseInfo = p.disease ? diseasesData.find(d => d.id === p.disease) : null;
    if (!diseaseInfo) return;

    if (p.money < diseaseInfo.cost) {
        showToast('お金が足りません。。。', 2000);
        return;
    }

    p.money -= diseaseInfo.cost;
    p.disease = null;
    gameState.pendingRandomEvent = true;
    updateStatus();

    document.getElementById('hospitalMainView').style.display = 'none';
    document.getElementById('hospitalCompleteMsg').innerHTML = '病気の治療が完了しました。<br>これでもう安心です。<br>病気の際はまた当院をご利用くださいませ。';
    document.getElementById('hospitalCompleteView').style.display = 'block';
}

function preventiveShot() {
    const p = gameState.player;

    if (p.money < 10000) {
        showToast('お金が足りません。。。', 2000);
        return;
    }

    p.money -= 10000;
    gameState.pendingRandomEvent = true;
    updateStatus();

    document.getElementById('hospitalMainView').style.display = 'none';
    document.getElementById('hospitalCompleteMsg').innerHTML = 'これで風邪予防は万全です。<br>まぁ、だからと言って体調に何の変化もありませんがね。<br>ぜひまたお待ちしております。';
    document.getElementById('hospitalCompleteView').style.display = 'block';
}

// ============================================
// 役場
// ============================================

function openYakubaModal() {
    document.getElementById('yakubaLobbyView').style.display = '';
    document.getElementById('yakubaModal').style.display = 'flex';
}

function closeYakubaModal() {
    document.getElementById('yakubaModal').style.display = 'none';
    // ロビー画面に戻す
    document.getElementById('yakubaProfileView').style.display = 'none';
    document.getElementById('profileConfirmView').style.display = 'none';
    document.getElementById('profileFormView').style.display = 'block';
    document.getElementById('yakubaLobbyView').style.display = '';
    // ボタンを元に戻す
    document.getElementById('yakubaCloseBtn').style.display = '';
    document.getElementById('profileFormBackBtn').style.display = '';
}

function applyEmergencySupport() {
    const player = gameState.player;
    const totalAssets = player.money + gameState.savings;
    const heightM = player.height / 100;
    const bmi = player.weight / (heightM * heightM);

    // クールタイムチェック（7日に1回）
    if (gameState.lastEmergencySupport) {
        const daysSince = (Date.now() - gameState.lastEmergencySupport) / (1000 * 60 * 60 * 24);
        if (daysSince < 7) {
            const remaining = Math.ceil(7 - daysSince);
            showToast(`緊急支援金は7日に1回です。あと${remaining}日お待ちください。`);
            return;
        }
    }

    // 受給条件：総資産が0円
    if (totalAssets > 0) {
        showToast('緊急支援金は総資産（所持金＋預金）が0円のときに申請できます。');
        return;
    }

    // BMIチェック
    const tooThin = bmi < 17;
    const tooFat = bmi > 35;

    if (!tooThin && !tooFat) {
        showToast('緊急支援金の対象条件を満たしていません（BMIが正常範囲内です）。');
        return;
    }

    // モーダル表示
    const supportItems = tooThin ? ['おにぎり', 'サンドイッチ', '焼きそば'] : [];
    const supportMoney = 5000;

    const nameEl = document.getElementById('emergencySupportName');
    const contentEl = document.getElementById('emergencySupportContent');
    if (nameEl) nameEl.textContent = player.name;
    document.querySelectorAll('.emergency-name-inline').forEach(el => el.textContent = player.name);

    let contentHtml = `<div class="emergency-support-item">💴 現金 <strong>${supportMoney.toLocaleString()}円</strong></div>`;
    if (tooThin) {
        supportItems.forEach(item => {
            contentHtml += `<div class="emergency-support-item">🍱 ${item} ×1</div>`;
        });
    }
    if (contentEl) contentEl.innerHTML = contentHtml;

    // 受給ボタンにデータをセット
    const receiveBtn = document.getElementById('emergencySupportReceiveBtn');
    if (receiveBtn) {
        receiveBtn.dataset.tooThin = tooThin ? '1' : '0';
    }

    document.getElementById('emergencySupportMainView').style.display = '';
    document.getElementById('emergencySupportCompleteView').style.display = 'none';
    document.getElementById('emergencySupportModal').style.display = 'flex';
}

function receiveEmergencySupport() {
    const player = gameState.player;
    const receiveBtn = document.getElementById('emergencySupportReceiveBtn');
    const tooThin = receiveBtn && receiveBtn.dataset.tooThin === '1';

    // 支給
    changeMoney(5000);
    addBankHistory('入金', 5000, '緊急支援金');

    if (tooThin) {
        const foodItems = [
            { name: 'おにぎり', consumable: true, price: 130, calorie: 180, hungerEffect: 1, description: 'コンビニのおにぎり。', effect: null, stats: {}, useCount: 1, remainingUses: 1, purchaseDate: Date.now() },
            { name: 'サンドイッチ', consumable: true, price: 300, calorie: 320, hungerEffect: 1, description: 'サンドイッチ。', effect: null, stats: {}, useCount: 1, remainingUses: 1, purchaseDate: Date.now() },
            { name: '焼きそば', consumable: true, price: 500, calorie: 500, hungerEffect: 2, description: '焼きそば。', effect: null, stats: { 体力: 1, 気力: 1 }, useCount: 1, remainingUses: 1, purchaseDate: Date.now() }
        ];
        foodItems.forEach(item => player.possessions.push(item));
    }

    gameState.lastEmergencySupport = Date.now();

    // 完了画面へ
    document.getElementById('emergencySupportMainView').style.display = 'none';
    document.getElementById('emergencySupportCompleteView').style.display = '';
}

function closeEmergencyModal() {
    document.getElementById('emergencySupportModal').style.display = 'none';
}

// ============================================
// 木のコイン
// ============================================
function getTreePositions() {
    const positions = [];
    for (let y = 0; y < townMap.length; y++) {
        for (let x = 0; x < townMap[y].length; x++) {
            if (townMap[y][x] === 'tree') {
                positions.push({ y, x });
            }
        }
    }
    return positions;
}

function initDailyCoin() {
    const today = new Date().toISOString().slice(0, 10);
    if (gameState.coinTree.date === today) return;

    const positions = getTreePositions();
    const pos = positions[Math.floor(Math.random() * positions.length)];

    // 確率：500(50%) 1000(30%) 3000(12%) 5000(6%) 10000(2%)
    const rand = Math.random() * 100;
    let amount;
    if (rand < 50) amount = 500;
    else if (rand < 80) amount = 1000;
    else if (rand < 92) amount = 3000;
    else if (rand < 98) amount = 5000;
    else amount = 10000;

    gameState.coinTree = {
        date: today,
        y: pos.y,
        x: pos.x,
        amount: amount,
        collected: false
    };
}

function checkTreeCoin(y, x) {
    initDailyCoin();
    const coin = gameState.coinTree;
    if (!coin.collected && coin.y === y && coin.x === x) {
        const msg = coin.amount === 10000
            ? `超ラッキー！！${coin.amount.toLocaleString()}円を見つけた！！`
            : `ラッキー！${coin.amount.toLocaleString()}円を見つけた！`;
        document.getElementById('treeCoinMessage').textContent = msg;
        document.getElementById('treeCoinModal').classList.add('active');
    }
}

function collectCoin() {
    const coin = gameState.coinTree;
    changeMoney(coin.amount);
    coin.collected = true;
    closeTreeCoinModal();
}

function closeTreeCoinModal() {
    document.getElementById('treeCoinModal').classList.remove('active');
}

let selectedProfileAvatar = 'Profile/Profile1.png';

// 使用済みの名前リスト（将来的にサーバーから取得する想定）
const reservedNames = ['管理人', 'admin', 'のんびりタウン'];

function validateProfileName() {
    const name = document.getElementById('profileName').value.trim();
    const status = document.getElementById('profileNameStatus');
    const hint = document.getElementById('profileNameHint');

    if (!name) {
        status.textContent = '';
        status.className = 'profile-name-status';
        hint.textContent = '';
        return;
    }

    // 重複チェック（予約名 + 将来のユーザー名チェック）
    const isReserved = reservedNames.some(n => n.toLowerCase() === name.toLowerCase());

    if (isReserved) {
        status.textContent = '！';
        status.className = 'profile-name-status invalid';
        hint.textContent = 'この名前はすでに使われています';
    } else if (name.length > 10) {
        status.textContent = '！';
        status.className = 'profile-name-status invalid';
        hint.textContent = '名前は10文字以内で入力してください';
    } else {
        status.textContent = '✓';
        status.className = 'profile-name-status valid';
        hint.textContent = '';
    }
}

function openProfileRegistration() {
    const p = gameState.player;

    // 現在の値をフォームにセット
    document.getElementById('profileName').value = p.name || '';
    selectedProfileAvatar = p.avatar || 'Profile/Profile1.png';
    updateProfileAvatarPreview();
    document.getElementById('profileAvatarPreview').style.backgroundColor = p.avatarBgColor || '#FFB6C1';
    document.getElementById('profileBgColor').value = p.avatarBgColor || '#FFB6C1';

    // 性別（ラジオボタン）
    document.querySelectorAll('input[name="profileGender"]').forEach(radio => {
        radio.checked = (radio.value === p.gender);
    });

    // 生年月日プルダウンを生成
    initBirthdaySelects();

    // プロフィール登録済みかどうか（birthdayがあれば登録済み）
    const isRegistered = !!p.birthday;

    // 身長プルダウン（140〜190cm）
    const heightSelect = document.getElementById('profileHeight');
    heightSelect.innerHTML = '<option value="" disabled selected></option>';
    for (let h = 140; h <= 190; h++) {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        if (p.height !== null && p.height === h) opt.selected = true;
        heightSelect.appendChild(opt);
    }

    // 体重プルダウン（40〜100kg）
    const weightSelect = document.getElementById('profileWeight');
    weightSelect.innerHTML = '<option value="" disabled selected></option>';
    for (let w = 40; w <= 100; w++) {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        if (p.weight !== null && Math.round(p.weight) === w) opt.selected = true;
        weightSelect.appendChild(opt);
    }

    // 登録済みの場合：生年月日・身長・体重を変更不可にする
    document.getElementById('profileBirthYear').disabled = isRegistered;
    document.getElementById('profileBirthMonth').disabled = isRegistered;
    document.getElementById('profileBirthDay').disabled = isRegistered;
    heightSelect.disabled = isRegistered;
    weightSelect.disabled = isRegistered;

    // 公開設定を復元
    if (p.publicSettings) {
        document.getElementById('profileGenderPublic').checked = p.publicSettings.gender !== false;
        document.getElementById('profileBirthdayPublic').checked = p.publicSettings.birthday !== false;
        document.getElementById('profileHeightPublic').checked = p.publicSettings.height !== false;
        document.getElementById('profileWeightPublic').checked = p.publicSettings.weight !== false;
    }

    // ヒントリセット
    document.getElementById('profileNameHint').textContent = '';
    document.getElementById('profileNameStatus').textContent = '';
    document.getElementById('profileNameStatus').className = 'profile-name-status';

    // アイコングリッド非表示
    document.getElementById('profileAvatarGrid').style.display = 'none';

    // 初回登録時は閉じるボタン・もどるボタンを非表示
    const hideNavBtns = !isRegistered;
    document.getElementById('yakubaCloseBtn').style.display = hideNavBtns ? 'none' : '';
    document.getElementById('profileFormBackBtn').style.display = hideNavBtns ? 'none' : '';

    // 役場モーダル内のビュー切り替え
    document.getElementById('yakubaLobbyView').style.display = 'none';
    document.getElementById('yakubaProfileView').style.display = 'block';
}

function backToYakubaLobby() {
    document.getElementById('yakubaProfileView').style.display = 'none';
    document.getElementById('profileConfirmView').style.display = 'none';
    document.getElementById('profileFormView').style.display = 'block';
    document.getElementById('yakubaLobbyView').style.display = '';
    // ボタンを元に戻す
    document.getElementById('yakubaCloseBtn').style.display = '';
    document.getElementById('profileFormBackBtn').style.display = '';
}

function initBirthdaySelects() {
    const yearSelect = document.getElementById('profileBirthYear');
    const monthSelect = document.getElementById('profileBirthMonth');
    const daySelect = document.getElementById('profileBirthDay');
    const p = gameState.player;

    // 年（1950〜2015）
    yearSelect.innerHTML = '<option value="" disabled selected></option>';
    for (let y = 1950; y <= 2015; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (p.birthday && p.birthday.year === y) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    // 月（1〜12）
    monthSelect.innerHTML = '<option value="" disabled selected></option>';
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        if (p.birthday && p.birthday.month === m) opt.selected = true;
        monthSelect.appendChild(opt);
    }

    // 日（1〜31）
    daySelect.innerHTML = '<option value="" disabled selected></option>';
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        if (p.birthday && p.birthday.day === d) opt.selected = true;
        daySelect.appendChild(opt);
    }
}

function openProfileAvatarSelect() {
    const grid = document.getElementById('profileAvatarGrid');
    if (grid.style.display === 'none') {
        grid.style.display = 'grid';
        grid.innerHTML = avatarOptions.map(path =>
            `<div class="profile-avatar-option ${path === selectedProfileAvatar ? 'selected' : ''}"
                  onclick="selectProfileAvatar('${path}')">
                <img src="${path}" alt="アバター">
            </div>`
        ).join('');
    } else {
        grid.style.display = 'none';
    }
}

function selectProfileAvatar(path) {
    selectedProfileAvatar = path;
    updateProfileAvatarPreview();
    // 選択状態を更新
    document.querySelectorAll('.profile-avatar-option').forEach(el => {
        el.classList.remove('selected');
        if (el.querySelector('img').src.includes(path)) {
            el.classList.add('selected');
        }
    });
}

function updateProfileAvatarPreview() {
    document.getElementById('profileAvatarPreview').innerHTML =
        `<img src="${selectedProfileAvatar}" alt="アバター" class="profile-avatar-img">`;
}

function changeProfileBgColor(color) {
    document.getElementById('profileAvatarPreview').style.backgroundColor = color;
}

function showProfileConfirm() {
    const name = document.getElementById('profileName').value.trim();
    const genderRadio = document.querySelector('input[name="profileGender"]:checked');
    const gender = genderRadio ? genderRadio.value : '';
    const birthYear = document.getElementById('profileBirthYear').value;
    const birthMonth = document.getElementById('profileBirthMonth').value;
    const birthDay = document.getElementById('profileBirthDay').value;
    const height = document.getElementById('profileHeight').value;
    const weight = document.getElementById('profileWeight').value;
    const hint = document.getElementById('profileNameHint');

    // バリデーション
    if (!name) {
        hint.textContent = '名前を入力してください';
        return;
    }
    if (name.length > 10) {
        hint.textContent = '名前は10文字以内で入力してください';
        return;
    }
    // 重複チェック
    const isReserved = reservedNames.some(n => n.toLowerCase() === name.toLowerCase());
    if (isReserved) {
        hint.textContent = 'この名前はすでに使われています';
        return;
    }
    if (genderRadio === null) {
        hint.textContent = '';
        showToast('性別を選択してください');
        return;
    }
    if (!birthYear || !birthMonth || !birthDay) {
        hint.textContent = '';
        showToast('生年月日を選択してください');
        return;
    }
    if (!height) {
        hint.textContent = '';
        showToast('身長を選択してください');
        return;
    }
    if (!weight) {
        hint.textContent = '';
        showToast('体重を選択してください');
        return;
    }
    hint.textContent = '';

    // 公開設定テキスト
    const publicTag = (isPublic) => isPublic
        ? '<span class="profile-confirm-tag profile-tag-public">公開</span>'
        : '<span class="profile-confirm-tag profile-tag-private">非公開</span>';
    const genderPublic = document.getElementById('profileGenderPublic').checked;
    const birthdayPublic = document.getElementById('profileBirthdayPublic').checked;
    const heightPublic = document.getElementById('profileHeightPublic').checked;
    const weightPublic = document.getElementById('profileWeightPublic').checked;

    // 確認画面HTML生成
    const bgColor = document.getElementById('profileBgColor').value;
    let html = '';
    html += `<div class="profile-confirm-avatar"><span class="profile-confirm-label">プロフィールアイコン</span><div class="profile-avatar-preview" style="background-color: ${bgColor}; margin: 8px auto 0;"><img src="${selectedProfileAvatar}" alt="アバター" class="profile-avatar-img"></div></div>`;
    html += `<div class="profile-confirm-row"><span class="profile-confirm-label">名前</span><span class="profile-confirm-value">${name}</span></div>`;
    html += `<div class="profile-confirm-row"><span class="profile-confirm-label">性別 ${publicTag(genderPublic)}</span><span class="profile-confirm-value">${gender}</span></div>`;
    html += `<div class="profile-confirm-row"><span class="profile-confirm-label profile-caution">生年月日 ${publicTag(birthdayPublic)}</span><span class="profile-confirm-value profile-caution">${birthYear}年${birthMonth}月${birthDay}日</span></div>`;
    html += `<div class="profile-confirm-row"><span class="profile-confirm-label profile-caution">身長 ${publicTag(heightPublic)}</span><span class="profile-confirm-value profile-caution">${height}cm</span></div>`;
    html += `<div class="profile-confirm-row"><span class="profile-confirm-label profile-caution">体重 ${publicTag(weightPublic)}</span><span class="profile-confirm-value profile-caution">${weight}kg</span></div>`;

    document.getElementById('profileConfirmContent').innerHTML = html;

    // 画面切り替え
    document.getElementById('profileFormView').style.display = 'none';
    document.getElementById('profileConfirmView').style.display = 'block';
}

function backToProfileForm() {
    document.getElementById('profileConfirmView').style.display = 'none';
    document.getElementById('profileFormView').style.display = 'block';
}

function submitProfile() {
    // 確認画面からの登録（バリデーション済み）
    const name = document.getElementById('profileName').value.trim();
    const genderRadio = document.querySelector('input[name="profileGender"]:checked');
    const gender = genderRadio ? genderRadio.value : '';
    const birthYear = document.getElementById('profileBirthYear').value;
    const birthMonth = document.getElementById('profileBirthMonth').value;
    const birthDay = document.getElementById('profileBirthDay').value;
    const height = document.getElementById('profileHeight').value;
    const weight = document.getElementById('profileWeight').value;

    // プレイヤーデータに反映
    const p = gameState.player;
    const isFirstRegistration = !p.birthday;
    p.name = name;
    p.avatar = selectedProfileAvatar;
    p.avatarBgColor = document.getElementById('profileBgColor').value;
    p.gender = gender;

    // 初回登録時のみ：生年月日・身長・体重を設定（以降変更不可）
    if (isFirstRegistration) {
        p.birthday = { year: parseInt(birthYear), month: parseInt(birthMonth), day: parseInt(birthDay) };
        p.height = parseInt(height);
        p.weight = parseFloat(weight);
    }

    // 公開設定を保存
    p.publicSettings = {
        gender: document.getElementById('profileGenderPublic').checked,
        birthday: document.getElementById('profileBirthdayPublic').checked,
        height: document.getElementById('profileHeightPublic').checked,
        weight: document.getElementById('profileWeightPublic').checked
    };

    // ステータス更新
    updateStatus();

    closeYakubaModal();
    showToast(isFirstRegistration ? 'プロフィールを登録しました！' : 'プロフィールを更新しました！');
}

function openInformation() {
    // TODO: インフォメーション画面を表示
    showToast('インフォメーション（準備中）');
}

function openFeedback() {
    // TODO: ご意見・ご感想画面を表示
    showToast('ご意見・ご感想（準備中）');
}

function openNews() {
    // TODO: 最近のニュース画面を表示
    showToast('最近のニュース（準備中）');
}

// 銀行
function openBankModal() {
    // 全サブビューをリセットしてロビーを表示
    document.getElementById('bankLobbyView').style.display = 'flex';
    document.getElementById('bankDepositView').style.display = 'none';
    document.getElementById('bankDepositCompleteView').style.display = 'none';
    document.getElementById('bankWithdrawView').style.display = 'none';
    document.getElementById('bankWithdrawCompleteView').style.display = 'none';
    document.getElementById('bankTransferView').style.display = 'none';
    document.getElementById('bankTransferConfirmView').style.display = 'none';
    document.getElementById('bankHistoryView').style.display = 'none';
    document.getElementById('bankModal').classList.add('active');
}

function closeBankModal() {
    document.getElementById('bankModal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

function deposit() {
    // ロビーを隠してお預入れ画面を表示
    document.getElementById('bankLobbyView').style.display = 'none';
    document.getElementById('bankDepositView').style.display = 'block';

    // 現在の所持金と預金残高を表示
    document.getElementById('depositCurrentMoney').textContent = gameState.player.money.toLocaleString();
    document.getElementById('depositCurrentSavings').textContent = gameState.savings.toLocaleString();

    // 入力欄をリセット
    document.getElementById('depositAmount').value = '';
}

function backToBankMenu() {
    // 全サブビューを隠してロビーに戻る
    document.getElementById('bankDepositView').style.display = 'none';
    document.getElementById('bankDepositCompleteView').style.display = 'none';
    document.getElementById('bankWithdrawView').style.display = 'none';
    document.getElementById('bankWithdrawCompleteView').style.display = 'none';
    document.getElementById('bankTransferView').style.display = 'none';
    document.getElementById('bankTransferConfirmView').style.display = 'none';
    document.getElementById('bankHistoryView').style.display = 'none';
    document.getElementById('bankLobbyView').style.display = 'flex';
}

function showDepositComplete(amount) {
    // 預け入れ完了画面を表示
    document.getElementById('depositCompleteAmount').textContent = amount.toLocaleString();
    document.getElementById('depositCompleteMoney').textContent = gameState.player.money.toLocaleString();
    document.getElementById('depositCompleteSavings').textContent = gameState.savings.toLocaleString();

    document.getElementById('bankDepositView').style.display = 'none';
    document.getElementById('bankDepositCompleteView').style.display = 'block';
}

function confirmDeposit() {
    const amount = parseInt(document.getElementById('depositAmount').value) || 0;

    if (amount <= 0) {
        return;
    }

    if (amount > gameState.player.money) {
        return;
    }

    // 預け入れ処理
    gameState.player.money -= amount;
    gameState.savings += amount;
    addBankHistory('deposit', amount, 'お預入れ');
    updateStatus();

    // 完了画面を表示
    gameState.pendingRandomEvent = true;
    showDepositComplete(amount);
    afterAction();
}

function depositKeepAmount() {
    const keepAmount = parseInt(document.getElementById('depositKeepAmount').value);
    const currentMoney = gameState.player.money;

    // 残す金額より所持金が少ない場合
    if (currentMoney <= keepAmount) {
        return;
    }

    // 預ける金額を計算（所持金 - 残す金額）
    const depositAmount = currentMoney - keepAmount;

    // 預け入れ処理
    gameState.player.money -= depositAmount;
    gameState.savings += depositAmount;
    addBankHistory('deposit', depositAmount, 'お預入れ');
    updateStatus();

    // 完了画面を表示
    gameState.pendingRandomEvent = true;
    showDepositComplete(depositAmount);
    afterAction();
}

function showBankHistory() {
    // ロビーを隠して入出金明細画面を表示
    document.getElementById('bankLobbyView').style.display = 'none';
    document.getElementById('bankHistoryView').style.display = 'block';

    // テーブルを更新
    renderBankHistory();
}

function renderBankHistory() {
    const tbody = document.getElementById('bankHistoryTableBody');
    const emptyMsg = document.getElementById('bankHistoryEmpty');

    // 最新100件を取得（新しい順）
    const history = gameState.bankHistory.slice(-100).reverse();

    if (history.length === 0) {
        tbody.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';

    tbody.innerHTML = history.map(item => {
        const date = new Date(item.date);
        const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        const payment = item.payment ? `<span class="payment">-${item.payment.toLocaleString()}</span>` : '';
        const deposit = item.deposit ? `<span class="deposit">+${item.deposit.toLocaleString()}</span>` : '';
        const balance = `<span class="balance">${item.balance.toLocaleString()}</span>`;

        return `
            <tr>
                <td>${dateStr}</td>
                <td>${item.description}</td>
                <td>${payment}</td>
                <td>${deposit}</td>
                <td>${balance}</td>
            </tr>
        `;
    }).join('');
}

function addBankHistory(type, amount, description, memo = '') {
    const now = new Date();
    const entry = {
        date: now.getTime(),
        payment: type === 'payment' ? amount : 0,
        deposit: type === 'deposit' ? amount : 0,
        description: description,
        balance: gameState.savings,
        memo: memo
    };

    gameState.bankHistory.push(entry);

    // 100件を超えたら古いものを削除
    if (gameState.bankHistory.length > 100) {
        gameState.bankHistory = gameState.bankHistory.slice(-100);
    }
}

function showTransfer() {
    // ロビーを隠してお振り込み画面を表示
    document.getElementById('bankLobbyView').style.display = 'none';
    document.getElementById('bankTransferView').style.display = 'block';

    // 預金残高を表示
    document.getElementById('transferCurrentSavings').textContent = gameState.savings.toLocaleString();

    // 入力欄をリセット
    document.getElementById('transferName').value = '';
    document.getElementById('transferAmount').value = '';
}

function showTransferConfirm() {
    const name = document.getElementById('transferName').value.trim();
    const amount = parseInt(document.getElementById('transferAmount').value) || 0;
    const errorEl = document.getElementById('transferErrorMessage');

    if (gameState.savings <= 0) {
        errorEl.textContent = '預金が無いためお振込みができません';
        errorEl.style.display = 'block';
        return;
    }

    if (!name) {
        errorEl.textContent = 'お振込み先のお名前を入力してください';
        errorEl.style.display = 'block';
        return;
    }

    if (amount <= 0 || amount > gameState.savings) {
        errorEl.textContent = '預金残高が足りません';
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';

    // 確認画面に情報を表示
    document.getElementById('transferTargetName').textContent = name;
    document.getElementById('transferTargetJob').textContent = '---'; // Firebase連携時に取得
    document.getElementById('transferTargetAvatar').innerHTML = `<img src="${gameState.player.avatar}" alt="アバター" class="player-avatar-img">`;
    document.getElementById('transferTargetAvatar').style.backgroundColor = gameState.player.avatarBgColor;
    document.getElementById('transferConfirmAmount').textContent = amount.toLocaleString();
    document.getElementById('transferConfirmSavings').textContent = gameState.savings.toLocaleString();

    // 確認画面を表示
    document.getElementById('bankTransferView').style.display = 'none';
    document.getElementById('bankTransferConfirmView').style.display = 'block';
}

function backToTransferInput() {
    // 入力画面に戻る
    document.getElementById('bankTransferConfirmView').style.display = 'none';
    document.getElementById('bankTransferView').style.display = 'block';
}

function confirmTransfer() {
    const name = document.getElementById('transferName').value.trim();
    const amount = parseInt(document.getElementById('transferAmount').value) || 0;

    // 振り込み処理（普通口座から引き落とし）
    gameState.savings -= amount;
    addBankHistory('payment', amount, `お振込み→${name}`);
    updateStatus();

    // 確認画面を非表示にして銀行メニューに戻る
    gameState.pendingRandomEvent = true;
    document.getElementById('bankTransferConfirmView').style.display = 'none';
    backToBankMenu();
    afterAction();
}

function withdraw() {
    // ロビーを隠してお引き出し画面を表示
    document.getElementById('bankLobbyView').style.display = 'none';
    document.getElementById('bankWithdrawView').style.display = 'block';

    // 現在の所持金と預金残高を表示
    document.getElementById('withdrawCurrentMoney').textContent = gameState.player.money.toLocaleString();
    document.getElementById('withdrawCurrentSavings').textContent = gameState.savings.toLocaleString();

    // 入力欄をリセット
    document.getElementById('withdrawAmount').value = '';
}

function showWithdrawComplete(amount) {
    // 引き出し完了画面を表示
    document.getElementById('withdrawCompleteAmount').textContent = amount.toLocaleString();
    document.getElementById('withdrawCompleteMoney').textContent = gameState.player.money.toLocaleString();
    document.getElementById('withdrawCompleteSavings').textContent = gameState.savings.toLocaleString();

    document.getElementById('bankWithdrawView').style.display = 'none';
    document.getElementById('bankWithdrawCompleteView').style.display = 'block';
}

function confirmWithdraw() {
    const amount = parseInt(document.getElementById('withdrawAmount').value) || 0;

    if (amount <= 0) {
        return;
    }

    if (amount > gameState.savings) {
        return;
    }

    // 引き出し処理
    gameState.savings -= amount;
    gameState.player.money += amount;
    addBankHistory('payment', amount, 'お引き出し');
    updateStatus();

    // 完了画面を表示
    gameState.pendingRandomEvent = true;
    showWithdrawComplete(amount);
    afterAction();
}

function withdrawFixedAmount() {
    const selectValue = document.getElementById('withdrawFixedAmount').value;

    // 全額の場合
    let amount;
    if (selectValue === 'all') {
        amount = gameState.savings;
        if (amount <= 0) {
            return;
        }
    } else {
        amount = parseInt(selectValue);
        if (amount > gameState.savings) {
            return;
        }
    }

    // 引き出し処理
    gameState.savings -= amount;
    gameState.player.money += amount;
    addBankHistory('payment', amount, 'お引き出し');
    updateStatus();

    // 完了画面を表示
    gameState.pendingRandomEvent = true;
    showWithdrawComplete(amount);
    afterAction();
}

function withdrawKeepAmount() {
    const keepAmount = parseInt(document.getElementById('withdrawKeepAmount').value);
    const currentSavings = gameState.savings;

    // 残す金額より預金が少ない場合
    if (currentSavings <= keepAmount) {
        return;
    }

    // 引き出す金額を計算（預金 - 残す金額）
    const withdrawAmount = currentSavings - keepAmount;

    // 引き出し処理
    gameState.savings -= withdrawAmount;
    gameState.player.money += withdrawAmount;
    addBankHistory('payment', withdrawAmount, 'お引き出し');
    updateStatus();

    // 完了画面を表示
    gameState.pendingRandomEvent = true;
    showWithdrawComplete(withdrawAmount);
    afterAction();
}

// 神社
function pray() {
    if (gameState.player.money < 100) {
        return;
    }
    changeMoney(-100);
    const luck = Math.random();
    if (luck < 0.3) {
        changeMoney(500);
    } else {
        changeHealth(10);
    }
    afterAction();
}

function drawFortune() {
    if (gameState.player.money < 200) {
        return;
    }
    changeMoney(-200);
    const fortunes = [
        { name: '大吉', effect: () => { changeMoney(1000); return '臨時収入1000円！'; } },
        { name: '吉', effect: () => { changeHealth(20); return '体力+20！'; } },
        { name: '中吉', effect: () => { changeIntelligence(5); return '知力+5！'; } },
        { name: '小吉', effect: () => { changeHealth(10); return '体力+10！'; } },
        { name: '末吉', effect: () => { return '今日は静かに過ごしましょう'; } },
        { name: '凶', effect: () => { changeHealth(-5); return 'ちょっと疲れました...'; } }
    ];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const result = fortune.effect();
    afterAction();
}

// 学校

// ゲームセンター
function playGames() {
    if (gameState.player.money < 300) {
        return;
    }
    changeMoney(-300);
    changeHealth(5);
    changeIntelligence(3);
    afterAction();
}

function craneGame() {
    if (gameState.player.money < 200) {
        return;
    }
    changeMoney(-200);

    const chance = Math.random();
    if (chance < 0.25) {
        const prizes = [
            { name: 'ぬいぐるみ', emoji: '🧸' },
            { name: 'キーホルダー', emoji: '🔑' },
            { name: 'お菓子', emoji: '🍬' }
        ];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        gameState.player.possessions.push({
            name: prize.name,
            emoji: prize.emoji,
            consumable: false
        });
        updateStatus();
    }
    afterAction();
}

// ============================================
// 所持品機能
// ============================================
let inventoryActiveTab = 'all';

function openInventoryModal() {
    // モーダルを表示
    document.getElementById('inventoryModal').classList.add('active');

    // ビューをリセット
    document.getElementById('inventoryListView').style.display = 'block';
    document.getElementById('itemUsedView').style.display = 'none';
    document.getElementById('inventoryTitle').textContent = '所持品リスト';

    // 使うボタンをリセット
    const useBtn = document.getElementById('inventoryUseBtn');
    useBtn.disabled = true;
    useBtn.classList.remove('active');

    // タブをリセット＆描画
    inventoryActiveTab = 'all';
    renderInventoryTabs();

    // 所持品一覧を描画
    renderInventoryTable();

    // 全ジャンル表示時のサイズを記録してモーダルを固定
    requestAnimationFrame(() => {
        const modalContent = document.querySelector('.inventory-modal-content');
        if (modalContent) {
            modalContent.style.height = modalContent.offsetHeight + 'px';
            modalContent.style.width = modalContent.offsetWidth + 'px';
        }
    });
}

function renderInventoryTabs() {
    const tabsEl = document.getElementById('inventoryTabs');
    if (!tabsEl) return;

    const possessions = gameState.player.possessions;
    const allCategories = [...new Set([...shopItems, ...shokudoItems, ...onsenShopItems].filter(s => s.type === 'separator').map(s => s.name))];

    // 所持品に存在するジャンルだけ抽出（順番はallCategoriesの順を保持）
    const ownedCategories = new Set(possessions.map(p => getItemCategory(p.name)));
    const genres = allCategories.filter(c => ownedCategories.has(c));

    let html = `<button class="shop2-tab ${inventoryActiveTab === 'all' ? 'active' : ''}" onclick="inventorySelectTab('all')">全ジャンル</button>`;
    genres.forEach(genre => {
        html += `<button class="shop2-tab ${inventoryActiveTab === genre ? 'active' : ''}" onclick="inventorySelectTab('${genre}')">${genre}</button>`;
    });
    tabsEl.innerHTML = html;
}

function scrollInventoryTabs(amount) {
    const scroll = document.getElementById('inventoryTabsScroll');
    if (scroll) scroll.scrollBy({ left: amount, behavior: 'smooth' });
}

function inventorySelectTab(genre) {
    inventoryActiveTab = genre;
    renderInventoryTabs();
    renderInventoryTable();
}

// ============================================
// セーブ・ロード機能
// ============================================
function saveGame() {
    try {
        localStorage.setItem('townGameSave', JSON.stringify(gameState));
        showToast('セーブしました！');
    } catch (e) {
        console.error('保存に失敗しました:', e);
        showToast('保存に失敗しました');
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('townGameSave');
        if (!saved) return; // セーブデータがなければ初期値のまま
        const data = JSON.parse(saved);
        Object.assign(gameState, data);

        // オフライン中の回復を計算（30秒ごとに1回復）
        const p = gameState.player;
        if (p.lastRegenTime) {
            const elapsed = Date.now() - p.lastRegenTime;
            const recovered = Math.floor(elapsed / 30000);
            if (recovered > 0) {
                p.health = Math.min(p.maxHealth, p.health + recovered);
                p.intelligence = Math.min(p.maxIntelligence, p.intelligence + recovered);
                p.lastRegenTime = Date.now();
            }
        }
    } catch (e) {
        console.error('ロードに失敗しました:', e);
    }
}

function resetGame() {
    if (!confirm('セーブデータを削除して最初からやり直しますか？\nこの操作は取り消せません。')) return;
    localStorage.removeItem('townGameSave');
    location.reload();
}

// ============================================
// 更新機能
// ============================================
function refreshGame() {
    location.reload();
}

function renderAbilityRow(highlightStats = null) {
    const abilities = gameState.player.abilities;
    const row = document.getElementById('abilityRow');

    // ハイライトするかどうかを判定するヘルパー関数
    const highlight = (key) => {
        if (highlightStats && highlightStats[key] && highlightStats[key] > 0) {
            return ' class="ability-highlight"';
        }
        return '';
    };

    row.innerHTML = `
        <td${highlight('国語')}>${abilities.国語}</td>
        <td${highlight('数学')}>${abilities.数学}</td>
        <td${highlight('理科')}>${abilities.理科}</td>
        <td${highlight('社会')}>${abilities.社会}</td>
        <td${highlight('英語')}>${abilities.英語}</td>
        <td${highlight('音楽')}>${abilities.音楽}</td>
        <td${highlight('美術')}>${abilities.美術}</td>
        <td${highlight('体力')}>${abilities.体力}</td>
        <td${highlight('気力')}>${abilities.気力}</td>
        <td${highlight('ルックス')}>${abilities.ルックス}</td>
        <td${highlight('素早さ')}>${abilities.素早さ}</td>
        <td${highlight('面白さ')}>${abilities.面白さ}</td>
        <td${highlight('優しさ')}>${abilities.優しさ}</td>
        <td${highlight('エロさ')}>${abilities.エロさ}</td>
    `;
}

function closeInventoryModal() {
    // サイズ固定を解除してから閉じる
    const modalContent = document.querySelector('.inventory-modal-content');
    if (modalContent) {
        modalContent.style.height = '';
        modalContent.style.width = '';
    }
    document.getElementById('inventoryModal').classList.remove('active');
}

function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const emptyMsg = document.getElementById('inventoryEmpty');
    const tableContainer = document.querySelector('.inventory-table-container');
    const possessions = gameState.player.possessions;

    tableContainer.style.display = 'block';
    if (possessions.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
    }

    // 能力値行をテーブル先頭に生成
    const abilities = gameState.player.abilities;
    const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
    let abilityCells = '';
    abilityKeys.forEach(key => {
        abilityCells += `<td>${abilities[key]}</td>`;
    });

    // 目標職業の能力値行
    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            let targetCells = '';
            abilityKeys.forEach(key => {
                const req = targetJob.abilities[key];
                targetCells += `<td>${req || ''}</td>`;
            });
            targetJobRow = `
        <tr class="shop2-target-stats">
            <td class="shop2-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;
        }
    }

    let html = `
        <tr class="shop2-user-stats">
            <td class="shop2-stats-label">現在の能力値</td>
            ${abilityCells}
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        ${targetJobRow}
    `;

    // カテゴリごとにグループ化
    const grouped = groupPossessionsByCategory(possessions);
    const categoryOrder = [...new Set([...shopItems, ...shokudoItems, ...onsenShopItems].filter(s => s.type === 'separator').map(s => s.name))];

    categoryOrder.forEach(category => {
        if (inventoryActiveTab !== 'all' && inventoryActiveTab !== category) return;
        if (grouped[category] && grouped[category].length > 0) {
            // カテゴリヘッダー
            html += `<tr class="separator-row"><td colspan="21">${category}</td></tr>`;

            grouped[category].forEach(item => {
                const index = item.originalIndex;
                // アイテムにstatsがない場合はshopItems/shokudoItems/onsenShopItemsから取得（後方互換性）
                const shopItem = shopItems.find(s => s.name === item.name) || shokudoItems.find(s => s.name === item.name) || onsenShopItems.find(s => s.name === item.name);
                const stats = item.stats || shopItem?.stats || {};
                const calorieVal = item.calorie !== undefined ? item.calorie : (shopItem?.calorie !== undefined ? shopItem.calorie : 0);
                const calorie = calorieVal ? calorieVal + 'kcal' : '';
                const cooldownVal = item.cooldown || shopItem?.cooldown || '0分';
                const cooldown = cooldownVal !== '0分' ? cooldownVal : '';
                const bodyConsumeVal = item.bodyConsume !== undefined ? item.bodyConsume : (shopItem?.bodyConsume !== undefined ? shopItem.bodyConsume : 0);
                const bodyConsume = bodyConsumeVal ? bodyConsumeVal : '';
                const brainConsumeVal = item.brainConsume !== undefined ? item.brainConsume : (shopItem?.brainConsume !== undefined ? shopItem.brainConsume : 0);
                const brainConsume = brainConsumeVal ? brainConsumeVal : '';
                const remainingUses = item.remainingUses !== undefined ? item.remainingUses : (item.useCount || shopItem?.useCount || 1);

                const isConsumable = item.consumable;

                // クールタイム残り時間を計算
                const itemCooldownMs = parseCooldownMs(cooldownVal);
                let cooldownDisplay = cooldown;
                let isOnCooldown = false;
                if (itemCooldownMs > 0 && gameState.itemCooldowns && gameState.itemCooldowns[item.name]) {
                    const elapsed = Date.now() - gameState.itemCooldowns[item.name];
                    if (elapsed < itemCooldownMs) {
                        const remaining = itemCooldownMs - elapsed;
                        const min = Math.ceil(remaining / 60000);
                        cooldownDisplay = `<span class="inventory-cooldown-remain">あと${min}分</span>`;
                        isOnCooldown = true;
                    }
                }

                const rowClass = isOnCooldown ? ' class="inventory-row-cooldown"' : '';
                html += `
                    <tr${rowClass}>
                        <td class="shop2-item-name"><label><input type="radio" name="inventoryItem" class="shop2-checkbox" value="${index}" ${(!isConsumable || isOnCooldown) ? 'disabled' : ''}> ${item.name}</label></td>
                        <td>${stats.国語 || ''}</td>
                        <td>${stats.数学 || ''}</td>
                        <td>${stats.理科 || ''}</td>
                        <td>${stats.社会 || ''}</td>
                        <td>${stats.英語 || ''}</td>
                        <td>${stats.音楽 || ''}</td>
                        <td>${stats.美術 || ''}</td>
                        <td>${stats.体力 || ''}</td>
                        <td>${stats.気力 || ''}</td>
                        <td>${stats.ルックス || ''}</td>
                        <td>${stats.素早さ || ''}</td>
                        <td>${stats.面白さ || ''}</td>
                        <td>${stats.優しさ || ''}</td>
                        <td>${stats.エロさ || ''}</td>
                        <td>${bodyConsume}</td>
                        <td>${brainConsume}</td>
                        <td>${calorie}</td>
                        <td>${cooldownDisplay}</td>
                        <td>${(item.description || shopItem?.description) ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${item.description || shopItem?.description}</span></span>` : ''}</td>
                        <td>${remainingUses}</td>
                    </tr>
                `;
            });
        }
    });

    tbody.innerHTML = html;

    // ヘッダー高さに基づいてstickyのtop値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('inventoryTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowHeight = headerRows[0].offsetHeight;
            const totalHeaderHeight = firstRowHeight + headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => {
                th.style.top = firstRowHeight + 'px';
            });
            const userStatsRow = table.querySelector('.shop2-user-stats');
            if (userStatsRow) {
                userStatsRow.style.top = totalHeaderHeight + 'px';
                const targetRow = table.querySelector('.shop2-target-stats');
                if (targetRow) {
                    targetRow.style.top = '88px';
                }
            }
        }
    });

    // 備考ツールチップ
    document.querySelectorAll('#inventoryTableBody .shop2-desc-symbol').forEach(symbol => {
        const tooltip = symbol.nextElementSibling;
        if (!tooltip) return;
        symbol.addEventListener('mouseenter', () => {
            const rect = symbol.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 8) + 'px';
            tooltip.style.transform = 'translate(-50%, -100%)';
            tooltip.style.display = 'block';
        });
        symbol.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });

    // ラジオボタンの変更を監視
    document.querySelectorAll('input[name="inventoryItem"]').forEach(radio => {
        radio.addEventListener('change', updateInventoryUseButton);
    });
    updateInventoryUseButton();
}

function updateInventoryUseButton() {
    const selected = document.querySelector('input[name="inventoryItem"]:checked');
    const useBtn = document.getElementById('inventoryUseBtn');
    const fullMsg = document.getElementById('inventoryFullMsg');

    if (!selected) {
        useBtn.disabled = true;
        useBtn.classList.remove('active');
        if (fullMsg) fullMsg.style.visibility = 'hidden';
        return;
    }

    // 選択アイテムが食べ物かつ満腹チェック
    const index = parseInt(selected.value);
    const item = gameState.player.possessions[index];
    const shopItem = shopItems.find(si => si.name === item?.name) || shokudoItems.find(si => si.name === item?.name) || onsenShopItems.find(si => si.name === item?.name);
    const isFoodItem = !!(shopItem?.effect?.hunger);
    const isFull = isFoodItem && getHungerText().stage === 1;

    // 薬チェック（健康なときは使用不可）
    const isMedicine = !!(shopItem?.cures);
    const isHealthy = isMedicine && !gameState.player.disease;

    // 使用間隔チェック
    const cdMs = parseCooldownMs(shopItem?.cooldown);
    const lastUsed = gameState.itemCooldowns && gameState.itemCooldowns[item?.name];
    const isOnCooldown = cdMs > 0 && lastUsed && (Date.now() - lastUsed) < cdMs;

    if (isFull || isHealthy || isOnCooldown) {
        useBtn.disabled = true;
        useBtn.classList.remove('active');
        if (fullMsg) {
            if (isFull) {
                fullMsg.textContent = '満腹のため、食事できません。';
                fullMsg.style.visibility = 'visible';
            } else if (isHealthy) {
                fullMsg.textContent = '今は使っても効果が無いようです。';
                fullMsg.style.visibility = 'visible';
            } else {
                fullMsg.style.visibility = 'hidden';
            }
        }
    } else {
        useBtn.disabled = false;
        useBtn.classList.add('active');
        if (fullMsg) fullMsg.style.visibility = 'hidden';
    }
}

function useSelectedInventoryItem() {
    const selected = document.querySelector('input[name="inventoryItem"]:checked');
    if (!selected) return;
    const useBtn = document.getElementById('inventoryUseBtn');
    useBtn.disabled = true;
    useBtn.classList.remove('active');
    useInventoryItem(parseInt(selected.value));
}

function useInventoryItem(index) {
    const item = gameState.player.possessions[index];
    if (!item || !item.consumable) return;

    // アイテム情報を取得（使用前に取得）
    const shopItem = shopItems.find(si => si.name === item.name) || shokudoItems.find(si => si.name === item.name) || onsenShopItems.find(si => si.name === item.name);

    // 満腹チェックはupdateInventoryUseButton()でボタン無効化により防止済み

    const p = gameState.player;
    const itemName = item.name;
    const stats = shopItem?.stats || {};

    // 変更前の値を保存
    const beforeStats = {};
    if (shopItem?.stats) {
        for (const key in shopItem.stats) {
            if (key in p.abilities && shopItem.stats[key]) {
                beforeStats[key] = p.abilities[key];
            }
        }
    }
    const beforeHunger = getHungerText().text;
    const beforeHealth = p.health;
    const beforeIntelligence = p.intelligence;
    const beforeWeight = p.weight;
    const beforeMaxHealth = p.maxHealth;
    const beforeMaxIntelligence = p.maxIntelligence;

    // アイテムを使用
    useItem(item.name);

    // 変更後の値を取得
    const afterHunger = getHungerText().text;
    const afterHealth = p.health;
    const afterIntelligence = p.intelligence;
    const afterWeight = p.weight;

    // 結果画面を表示
    showItemUsedResult(itemName, stats, beforeStats, beforeHunger, afterHunger, beforeHealth, afterHealth, beforeIntelligence, afterIntelligence, beforeWeight, afterWeight, beforeMaxHealth, beforeMaxIntelligence);
}

function showItemUsedResult(itemName, stats, beforeStats, beforeHunger, afterHunger, beforeHealth, afterHealth, beforeIntelligence, afterIntelligence, beforeWeight, afterWeight, beforeMaxHealth, beforeMaxIntelligence) {
    // ビューを切り替え
    document.getElementById('inventoryListView').style.display = 'none';
    document.getElementById('itemUsedView').style.display = 'flex';
    document.getElementById('inventoryTitle').style.display = 'none';

    const p = gameState.player;

    // ジャンルに応じたアクション動詞を取得
    const category = getItemCategory(itemName);
    let actionVerb = '使用しました';
    if (category.includes('テイクアウト品') || category.includes('食料品') || category.includes('デザート')) actionVerb = '食べました';
    else if (category.includes('ドリンク')) actionVerb = '飲みました';
    else if (category.includes('書籍')) actionVerb = '読みました';
    else if (category.includes('スポーツ用品') || category.includes('電化製品')) actionVerb = '使いました';
    else if (category.includes('アクセサリー')) actionVerb = '身につけました';
    else if (category.includes('乗り物')) actionVerb = '乗りました';

    const statNames = {
        国語: '国語', 数学: '数学', 理科: '理科', 社会: '社会', 英語: '英語',
        音楽: '音楽', 美術: '美術', 体力: '体力', 気力: '気力',
        ルックス: 'ルックス', 素早さ: '素早さ', 面白さ: '面白さ',
        優しさ: '優しさ', エロさ: 'エロさ'
    };

    let html = `<div class="shokudo-eat-result">`;
    html += `<div class="shokudo-eat-heading">${itemName}を${actionVerb}！</div>`;
    html += `<div class="shokudo-eat-changes">`;

    // 能力値の変化（+N のみ）
    for (const [key, value] of Object.entries(stats)) {
        if (value && value > 0) {
            const diff = p.abilities[key] - beforeStats[key];
            html += `<div class="shokudo-change-row">`;
            html += `<span class="shokudo-change-label">${statNames[key] || key}</span>`;
            html += `<span class="shokudo-change-plus">+${diff}</span>`;
            html += `</div>`;
        }
    }

    // 空腹度の変化
    if (beforeHunger !== afterHunger) {
        const displayAfterHunger = afterHunger.replace('（食事できません）', '');
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">空腹度</span>`;
        html += `<span class="shokudo-change-after shokudo-change-up">${displayAfterHunger}</span>`;
        html += `</div>`;
    }

    // 身体パワーの変化
    if (beforeHealth !== afterHealth) {
        const diff = afterHealth - beforeHealth;
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">身体パワー</span>`;
        html += `<span class="shokudo-change-plus">${diff > 0 ? '+' : ''}${diff}</span>`;
        html += `</div>`;
    }

    // 頭脳パワーの変化
    if (beforeIntelligence !== afterIntelligence) {
        const diff = afterIntelligence - beforeIntelligence;
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">頭脳パワー</span>`;
        html += `<span class="shokudo-change-plus">${diff > 0 ? '+' : ''}${diff}</span>`;
        html += `</div>`;
    }

    // 体重の変化
    if (beforeWeight !== afterWeight) {
        const weightDiff = (afterWeight - beforeWeight).toFixed(2);
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">体重</span>`;
        html += `<span class="shokudo-change-plus">+${weightDiff}kg</span>`;
        html += `</div>`;
    }

    // 身体パワー上限の変化
    if (beforeMaxHealth !== undefined && p.maxHealth !== beforeMaxHealth) {
        const diff = p.maxHealth - beforeMaxHealth;
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">身体パワー上限</span>`;
        html += `<span class="shokudo-change-plus">+${diff}</span>`;
        html += `</div>`;
    }

    // 頭脳パワー上限の変化
    if (beforeMaxIntelligence !== undefined && p.maxIntelligence !== beforeMaxIntelligence) {
        const diff = p.maxIntelligence - beforeMaxIntelligence;
        html += `<div class="shokudo-change-row">`;
        html += `<span class="shokudo-change-label">頭脳パワー上限</span>`;
        html += `<span class="shokudo-change-plus">+${diff}</span>`;
        html += `</div>`;
    }

    html += `</div></div>`;
    document.getElementById('itemUsedContent').innerHTML = html;
}

function backToInventoryList() {
    // ビューを切り替え
    document.getElementById('itemUsedView').style.display = 'none';
    document.getElementById('inventoryListView').style.display = 'block';
    document.getElementById('inventoryTitle').style.display = '';
    document.getElementById('inventoryTitle').textContent = '所持品リスト';

    // タブをリセット＆再描画（空になったジャンルを消す）
    inventoryActiveTab = 'all';
    renderInventoryTabs();

    // モーダルサイズのロックを解除してから再描画・再ロック
    const modalContent = document.querySelector('.inventory-modal-content');
    if (modalContent) {
        modalContent.style.height = '';
        modalContent.style.width = '';
    }
    renderInventoryTable();
    requestAnimationFrame(() => {
        if (modalContent) {
            modalContent.style.height = modalContent.offsetHeight + 'px';
            modalContent.style.width = modalContent.offsetWidth + 'px';
        }
    });
}

function formatPurchaseDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// ============================================
// ランダムイベント
// ============================================
// 通常ランダムイベント（病気以外）
const randomEvents = [
    {
        text: 'ピアノの練習をしました。音楽の力が３アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.音楽 += 3; }
    },
    {
        text: '出した本の印税が1000円入りました。',
        type: 'good',
        effect: () => { gameState.player.money += 1000; }
    },
    {
        text: '裸で寝ていたら体調を崩したようです。',
        type: 'bad',
        effect: () => { gameState.player.disease = 'kaze'; }
    },
    {
        text: '社会への関心が引き潮が引くように無くなっていきました。社会の力が３ダウン。',
        type: 'bad',
        effect: () => { gameState.player.abilities.社会 = Math.max(0, gameState.player.abilities.社会 - 3); }
    },
    {
        text: '文学に目覚めました。国語力３アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.国語 += 3; }
    },
    {
        text: 'スリに遭いました。持ち金が半分になってしまいました。',
        type: 'bad',
        effect: () => { gameState.player.money = Math.floor(gameState.player.money / 2); }
    },
    {
        text: '不思議に優しい気持ちにつつまれました。優しさ度が５アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.優しさ += 5; }
    },
    {
        text: '下痢気味でエッチにも力が入りません。。エロさ度が３ダウン。。',
        type: 'bad',
        effect: () => { gameState.player.abilities.エロさ = Math.max(0, gameState.player.abilities.エロさ - 3); }
    },
    {
        text: 'パチンコで１万すってしまいました。。',
        type: 'bad',
        effect: () => { gameState.player.money = Math.max(0, gameState.player.money - 10000); }
    },
    {
        text: '理科の実験で試験管を割ってしまいました。理科の力が３ダウン！',
        type: 'bad',
        effect: () => { gameState.player.abilities.理科 = Math.max(0, gameState.player.abilities.理科 - 3); }
    },
    {
        // 週1回限定：総資産の1%を納税
        condition: () => {
            if (!gameState.lastTaxEventDate) return true;
            const elapsed = Date.now() - new Date(gameState.lastTaxEventDate).getTime();
            return elapsed >= 7 * 24 * 60 * 60 * 1000;
        },
        textFn: () => {
            const tax = Math.floor((gameState.player.money + gameState.savings) * 0.01);
            return `税務署に総資産の１％である${tax.toLocaleString()}円を納税しました。`;
        },
        type: 'bad',
        effect: () => {
            const tax = Math.floor((gameState.player.money + gameState.savings) * 0.01);
            gameState.player.money = Math.max(0, gameState.player.money - tax);
            gameState.lastTaxEventDate = new Date().toISOString();
        }
    },
    {
        text: 'ゲームばかりしていてノイローゼになりました。体重が1kg減りました。',
        type: 'bad',
        effect: () => { gameState.player.weight = Math.max(0, Math.round((gameState.player.weight - 1) * 10) / 10); }
    },
    {
        text: '古典的なギャグで滑り、周囲の空気がマイナスに…。社会の力が2ダウン。',
        type: 'bad',
        effect: () => { gameState.player.abilities.社会 = Math.max(0, gameState.player.abilities.社会 - 2); }
    },
    {
        text: '鼻歌を歌っていたら野良猫が寄ってきた！音楽の力が4アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.音楽 += 4; }
    },
    {
        text: '「絶対儲かる」という看板に釣られて怪しいセミナーへ。参加費で20,000円払いました。',
        type: 'bad',
        effect: () => { gameState.player.money = Math.max(0, gameState.player.money - 20000); }
    },
    {
        text: 'ラッキー！タンスの奥からへそくりを発見！10,000円ゲット！',
        type: 'good',
        effect: () => { gameState.player.money += 10000; }
    },
    {
        text: '朝起きたら寝癖が芸術的でした。芸術力5アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.美術 += 5; }
    },
    {
        text: '辛いものと甘いものを交互に食べていたら3kg太ってしまいました。。。',
        type: 'bad',
        effect: () => { gameState.player.weight = Math.round((gameState.player.weight + 3) * 10) / 10; }
    },
    {
        text: '留学した友達が英語を教えてくれました。英語力５アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.英語 += 5; }
    },
    {
        text: '数学クイズで遊びました。数学力３アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.数学 += 3; }
    },
    {
        text: '数字恐怖症になりました。数学力３ダウン。',
        type: 'bad',
        effect: () => { gameState.player.abilities.数学 = Math.max(0, gameState.player.abilities.数学 - 3); }
    },
    {
        textFn: () => {
            const pct = (Math.floor(Math.random() * 5) + 1) * 10;
            gameState._stolenAmount = Math.floor(gameState.player.money * pct / 100);
            return `泥棒に入られました。${gameState._stolenAmount.toLocaleString()}円盗まれました。`;
        },
        type: 'bad',
        effect: () => {
            gameState.player.money = Math.max(0, gameState.player.money - (gameState._stolenAmount || 0));
            gameState._stolenAmount = 0;
        }
    },
    {
        text: '失恋してやけ食いしました。体重が1kg増えました。',
        type: 'bad',
        effect: () => { gameState.player.weight = Math.round((gameState.player.weight + 1) * 10) / 10; }
    },
    {
        text: '車にひかれかけましたが、軽いフットワークでかわしました。',
        type: 'good',
        effect: () => {}
    },
    {
        text: '電車に乗り遅れそうになって全力ダッシュした！素早さが3アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.素早さ += 3; }
    },
    {
        text: 'バナナの皮で滑ったが周囲の人を笑わせた！面白さが5アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.面白さ += 5; }
    },
    {
        text: 'なんか今日、顔がいい気がする。ルックスが3アップ！',
        type: 'good',
        effect: () => { gameState.player.abilities.ルックス += 3; }
    },
    {
        text: '流れ星に願い事をしたら元気が出てきた！気力が10回復！',
        type: 'good',
        effect: () => { gameState.player.abilities.気力 += 10; }
    },
    {
        textFn: () => {
            gameState._walletAmount = (Math.floor(Math.random() * 6) + 1) * 500;
            return `落ちてる財布を発見！${gameState._walletAmount.toLocaleString()}円入っていたのでねこばばしました。`;
        },
        type: 'good',
        effect: () => {
            gameState.player.money += gameState._walletAmount || 0;
            gameState._walletAmount = 0;
        }
    },
];

// 病気チェック（1日1回、重→中→軽の優先順）
function checkDisease() {
    const p = gameState.player;
    // すでに病気なら判定しない
    if (p.disease) return null;

    // 今日の日付（YYYY-MM-DD）
    const today = new Date().toISOString().slice(0, 10);
    if (gameState.lastDiseaseCheckDate === today) return null;
    gameState.lastDiseaseCheckDate = today;

    const hpRatio = p.health / p.maxHealth;
    const kiryokuRatio = p.intelligence / p.maxIntelligence;

    // 重め（優先度：高）
    if (hpRatio <= 0.2 && Math.random() < 0.15) {
        return { id: 'haien', text: '肺炎にかかってしまいました。' };
    }
    if (hpRatio <= 0.3 && kiryokuRatio <= 0.3 && Math.random() < 0.15) {
        return { id: 'kansenshou', text: '感染症にかかってしまいました。' };
    }
    if (kiryokuRatio <= 0.05 && Math.random() < 0.45) {
        return { id: 'utsubyou', text: 'うつ病になってしまいました。' };
    }

    // 中くらい（優先度：中）
    if (p.workCount >= 8 && Math.random() < 0.45) {
        return { id: 'gikkurigoshi', text: 'ぎっくり腰になってしまいました。' };
    }
    if (Math.random() < 0.05) {
        return { id: 'kossetsu', text: '骨折してしまいました。' };
    }
    if (Math.random() < 0.05) {
        return { id: 'ichouen', text: '胃腸炎にかかってしまいました。' };
    }

    // 軽め（優先度：低）
    if (p.mealCount >= 5 && Math.random() < 0.20) {
        return { id: 'mushiba', text: '虫歯になってしまいました。' };
    }
    if (Math.random() < 0.05) {
        return { id: 'kaze', text: '風邪を引いてしまいました。' };
    }

    return null;
}

function tryShowRandomEvent() {
    // まず病気チェック（1日1回）
    const diseaseResult = checkDisease();
    if (diseaseResult) {
        gameState.player.disease = diseaseResult.id;
        updateStatus();
        showRandomEvent(diseaseResult.text, 'bad');
        return;
    }

    // 通常ランダムイベント（10%の確率）
    if (Math.random() > 0.1) return;

    // 発生可能なイベントを絞り込む（conditionがあるものはチェック）
    const eligibleEvents = randomEvents.filter(e => !e.condition || e.condition());
    if (eligibleEvents.length === 0) return;

    const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
    const text = event.textFn ? event.textFn() : event.text;
    event.effect();
    updateStatus();
    showRandomEvent(text, event.type);
}

function hideRandomEvent() {
    const container = document.getElementById('randomEventNotification');
    if (container) container.style.display = 'none';
}

function showRandomEvent(text, type) {
    const container = document.getElementById('randomEventNotification');
    const textEl = document.getElementById('randomEventText');
    if (!container || !textEl) return;

    // 一旦非表示にしてアニメーションをリセット
    container.style.display = 'none';
    container.className = 'random-event-notification';

    // 少し遅延させてアニメーションを確実に再トリガー
    requestAnimationFrame(() => {
        textEl.innerHTML = '●イベント発生！<br>' + text;
        container.classList.add(type === 'good' ? 'event-good' : 'event-bad');
        container.style.display = '';
    });
}

// ============================================
// 能力値ツールチップ（アバターホバー）
// ============================================
function buildAbilityTooltip() {
    const abilities = gameState.player.abilities;
    const values = Object.values(abilities);
    const maxVal = Math.max(...values, 1);

    let html = '<div class="ab-title">現在の能力値</div>';
    for (const [name, val] of Object.entries(abilities)) {
        const pct = Math.max((val / maxVal) * 100, 15);
        html += `<div class="ab-row">
            <span class="ab-name">${name}</span>
            <div class="ab-bar-outer">
                <div class="ab-bar-inner" style="width:${pct}%">
                    <span class="ab-num">${val}</span>
                </div>
            </div>
        </div>`;
    }
    return html;
}

document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('playerAvatar');
    const tooltip = document.getElementById('abilityTooltip');
    if (!avatar || !tooltip) return;

    avatar.addEventListener('mouseenter', () => {
        tooltip.innerHTML = buildAbilityTooltip();
        tooltip.style.display = 'block';

        const rect = avatar.getBoundingClientRect();
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;

        // アバターの左側に表示、はみ出したら右側に
        let left = rect.left - tw - 10;
        if (left < 5) left = rect.right + 10;

        // 上端が画面外に出ないよう調整
        let top = rect.top;
        if (top + th > window.innerHeight - 10) {
            top = window.innerHeight - th - 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    });

    avatar.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
});

// ============================================
// 起動
// ============================================
window.addEventListener('DOMContentLoaded', init);
