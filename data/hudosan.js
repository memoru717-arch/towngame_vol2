// ============================================
// のんびりタウン - 不動産屋機能
// ============================================
// ============================================
// 不動産屋
// ============================================
function openHudosan() {
    const modal = document.getElementById('hudosanModal');
    document.getElementById('hudosanBuyView').style.display = 'none';
    document.getElementById('hudosanLobbyView').style.display = 'flex';
    modal.classList.add('active');
}

function closeHudosan() {
    const modal = document.getElementById('hudosanModal');
    modal.classList.remove('active');
}

function backToHudosanLobby() {
    document.getElementById('hudosanBuyView').style.display = 'none';
    document.getElementById('hudosanLobbyView').style.display = 'flex';
}

function hudosanBack() {
    if (document.getElementById('hudosanBuyStep4').style.display !== 'none') {
        hudosanBackToStep3();
    } else if (document.getElementById('hudosanBuyStep3').style.display !== 'none') {
        hudosanBackToStep2();
    } else if (document.getElementById('hudosanBuyStep2').style.display !== 'none') {
        hudosanBackToStep1();
    } else {
        backToHudosanLobby();
    }
}

function openHudosanRent() {
    // TODO: 賃貸ビュー（未実装）
}

// 購入フロー状態
const hudosanBuyState = {
    selectedRow: null,
    selectedCol: null,
    selectedCoord: null,
    selectedHouse: null,
    selectedRank: null
};

const hudosanRanks = [
    { id: 'D', price: 1000000,  slots: 1, label: 'Dランク' },
    { id: 'C', price: 4000000,  slots: 2, label: 'Cランク' },
    { id: 'B', price: 8000000,  slots: 3, label: 'Bランク' },
    { id: 'A', price: 12000000, slots: 4, label: 'Aランク' },
];

const hudosanContents = [
    { id: 'bulletin', name: '簡易掲示板',  icon: '📋' },
    { id: 'shop',     name: '商売スペース', icon: '🏪' },
    { id: 'url',      name: 'URLスペース',  icon: '🌐' },
    { id: 'diary',    name: '家主掲示板',   icon: '📖' },
];

function openHudosanBuy() {
    document.getElementById('hudosanLobbyView').style.display = 'none';
    document.getElementById('hudosanBuyView').style.display = 'flex';
    hudosanBuyState.selectedRow = null;
    hudosanBuyState.selectedCol = null;
    hudosanBuyState.selectedCoord = null;
    document.getElementById('hudosanStep1NextBtn').disabled = true;
    renderHudosanMiniMap();
}

function fitHudosanMap() {
    const mapArea = document.querySelector('#hudosanBuyStep1 .hudosan-step1-map-area');
    const mapInfo = document.querySelector('#hudosanBuyStep1 .hudosan-step1-map-info');
    const wrap    = document.querySelector('#hudosanBuyStep1 .hudosan-mini-map-wrap');
    const table   = document.getElementById('hudosanMiniMapTable');
    if (!mapArea || !mapInfo || !wrap || !table) return;

    const BASE_W = 35 * 16; // 560px
    const BASE_H = 35 * 12; // 420px

    // mapAreaの実サイズを直接測定してfitスケールを決める
    const PADDING = 10;
    const availW = mapArea.clientWidth - PADDING * 2;
    const availH = mapArea.clientHeight - mapInfo.offsetHeight - PADDING * 2;
    if (availW <= 0 || availH <= 0) return;

    const scale = Math.min(availW / BASE_W, availH / BASE_H);
    wrap.style.width  = Math.round(BASE_W * scale + PADDING * 2) + 'px';
    wrap.style.height = Math.round(BASE_H * scale + PADDING * 2) + 'px';
    table.style.zoom  = scale;
}

function renderHudosanMiniMap() {
    // 地価テキストを動的に設定
    const landPriceEl = document.getElementById('hudosanMapLandPrice');
    if (landPriceEl) {
        landPriceEl.textContent = `地価：${(TOWN_LAND_PRICE / 10000).toLocaleString()}万円`;
    }

    const table = document.getElementById('hudosanMiniMapTable');
    let html = '';
    for (let y = 0; y < townMap.length; y++) {
        html += '<tr>';
        for (let x = 0; x < townMap[y].length; x++) {
            const tile = mapTiles[y][x];
            const placeId = townMap[y][x];
            const imgPath = tile.includes('/') ? `${tile}.png` : `tree&road/${tile}.png`;
            const isSale = placeId === 'sale';
            const cls = isSale ? ' class="sale-lot"' : '';
            const coord = `${String.fromCharCode(65 + y)}-${x + 1}`;
            const onClick  = isSale ? ` onclick="selectHudosanLot(${y},${x})"` : '';
            const onHover  = isSale ? ` onmouseenter="document.getElementById('hudosanMapCoordHint').textContent='${coord}'" onmouseleave="restoreCoordHint()"` : '';
            html += `<td${cls}${onClick}${onHover}><img src="${imgPath}" alt=""></td>`;
        }
        html += '</tr>';
    }
    table.innerHTML = html;

    // レイアウト確定後にズーム調整
    requestAnimationFrame(() => requestAnimationFrame(fitHudosanMap));

    // ウィンドウリサイズでも追従（重複登録を防ぐ）
    window.removeEventListener('resize', fitHudosanMap);
    window.addEventListener('resize', fitHudosanMap);
}

function restoreCoordHint() {
    const hint = document.getElementById('hudosanMapCoordHint');
    if (hint) hint.textContent = hudosanBuyState.selectedCoord || '';
}

function selectHudosanLot(row, col) {
    const table = document.getElementById('hudosanMiniMapTable');
    table.querySelectorAll('.sale-lot.selected').forEach(td => td.classList.remove('selected'));
    table.querySelectorAll('tr')[row].querySelectorAll('td')[col].classList.add('selected');

    hudosanBuyState.selectedRow = row;
    hudosanBuyState.selectedCol = col;
    const rowLetter = String.fromCharCode(65 + row);
    const colNum = col + 1;
    hudosanBuyState.selectedCoord = `${rowLetter}-${colNum}`;

    document.getElementById('hudosanStep1NextBtn').disabled = false;
}

const hudosanHouses = [
    // 100万円
    { id: 'orange1',      file: 'house/orange1.png',       name: 'オレンジの家',    enName: 'orange house',        price: 1000000,  bgColor: '#D87A40', stats: { space:1, style:2, calm:3 }, desc: 'オレンジ色の外観が明るくて可愛い一階建て。はじめての一軒家にぴったり！' },
    { id: 'red1',         file: 'house/red1.png',          name: 'レッドの家',      enName: 'red house',           price: 1000000,  bgColor: '#CC5050', stats: { space:1, style:2, calm:2 }, desc: '赤い外観が目を引く一階建て。元気よく暮らしたい人にオススメ！' },
    { id: 'blue1',        file: 'house/blue1.png',         name: 'ブルーの家',      enName: 'blue house',          price: 1000000,  bgColor: '#5A9CC4', stats: { space:1, style:3, calm:3 }, desc: 'さわやかなブルーの一階建て。シンプルで住みやすいスタンダードモデル。' },
    // 400万円
    { id: 'orange2',      file: 'house/orange2.png',       name: 'オレンジの家2',   enName: 'orange house II',     price: 4000000,  bgColor: '#C07038', stats: { space:2, style:2, calm:3 }, desc: 'オレンジの家をゆったり広げたモデル。使いやすい間取りが魅力。' },
    { id: 'red2',         file: 'house/red2.png',          name: 'レッドの家2',     enName: 'red house II',        price: 4000000,  bgColor: '#BA4444', stats: { space:2, style:3, calm:3 }, desc: '落ち着いたレッドが大人っぽい中型の一軒家。収納も充実。' },
    { id: 'blue2',        file: 'house/blue2.png',         name: 'ブルーの家2',     enName: 'blue house II',       price: 4000000,  bgColor: '#3C84B8', stats: { space:2, style:3, calm:4 }, desc: 'ブルーで統一されたすっきりとした外観。広めのリビングが自慢。' },
    // 800万円
    { id: 'blue_cute',    file: 'house/blue_cute.png',     name: 'キュートブルー',  enName: 'cute blue house',     price: 8000000,  bgColor: '#50B0E0', stats: { space:3, style:4, calm:2 }, desc: 'ポップでキュートなブルー仕上げ。見た目も個性も抜群の一軒家！' },
    { id: 'pink_cute',    file: 'house/pink_cute.png',     name: 'キュートピンク',  enName: 'cute pink house',     price: 8000000,  bgColor: '#D05C8A', stats: { space:3, style:5, calm:2 }, desc: 'ふわふわピンクの外観がとにかくかわいい！おしゃれ好きに大人気。' },
    { id: 'yellow_cute',  file: 'house/yellow_cute.png',   name: 'キュートイエロー', enName: 'cute yellow house',  price: 8000000,  bgColor: '#D4A830', stats: { space:3, style:4, calm:3 }, desc: '太陽みたいに明るいイエローの家。毎日ハッピーな気分になれる！' },
    { id: 'two_stories1', file: 'house/two_stories1.png',  name: '2階建て①',        enName: 'two-story house I',   price: 8000000,  bgColor: '#6AAE50', stats: { space:4, style:3, calm:4 }, desc: '2階建てでスペースも収納もたっぷり。家族みんなで住めるゆったりサイズ。' },
    { id: 'two_stories2', file: 'house/two_stories2.png',  name: '2階建て②',        enName: 'two-story house II',  price: 8000000,  bgColor: '#5090B8', stats: { space:4, style:4, calm:3 }, desc: 'スタイリッシュな外観の2階建て。インテリアにこだわりたい人にぴったり。' },
    // 1000万円
    { id: 'concrete',     file: 'house/concrete.png',      name: 'コンクリート',    enName: 'concrete house',      price: 10000000, bgColor: '#607888', stats: { space:4, style:5, calm:2 }, desc: 'モダンなコンクリート打ちっぱなし。クールで都会的なライフスタイルを。' },
    // 1200万円
    { id: 'country',      file: 'house/country.png',       name: 'カントリー',      enName: 'country house',       price: 12000000, bgColor: '#A87838', stats: { space:4, style:4, calm:5 }, desc: '木のぬくもりたっぷりのカントリースタイル。自然と調和した癒しの住まい。' },
    // 1500万円
    { id: 'japan1',       file: 'house/japan1.png',        name: '和風の家',        enName: 'japanese house',      price: 15000000, bgColor: '#886040', stats: { space:5, style:5, calm:5 }, desc: '落ち着いた和風建築の一軒家。日本の美を感じる、上品でゆったりした住まい。' },
];

function hudosanGoStep2() {
    document.getElementById('hudosanBuyStep1').style.display = 'none';
    document.getElementById('hudosanBuyStep2').style.display = 'flex';


    renderHudosanHouseGrid();
}

function renderHudosanHouseGrid() {
    const grid = document.getElementById('hudosanHouseGrid');
    grid.innerHTML = hudosanHouses.map(h => `
        <div class="hudosan-house-card" id="houseCard-${h.id}" onclick="selectHudosanHouse('${h.id}')">
            <img src="${h.file}" alt="${h.name}">
            <span class="hudosan-house-name">${h.name}</span>
        </div>
    `).join('');
}

function hudosanStars(n) {
    return '<span style="opacity:1">★</span>'.repeat(n) + '<span style="opacity:0.2">★</span>'.repeat(5 - n);
}

function selectHudosanHouse(id) {
    document.querySelectorAll('.hudosan-house-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`houseCard-${id}`).classList.add('selected');
    hudosanBuyState.selectedHouse = id;
    const house = hudosanHouses.find(h => h.id === id);
    const priceStr = (house.price / 10000).toLocaleString() + '万円';
    document.querySelector('.hudosan-step2-right').style.background = house.bgColor;
    document.getElementById('hudosanHousePreview').innerHTML = `
        <div class="hudosan-preview-card">
            <div class="hudosan-preview-card-header" style="border-bottom-color:${house.bgColor}">
                <div class="hudosan-step2-preview-sublabel" style="color:${house.bgColor}">${house.enName}</div>
                <div class="hudosan-step2-preview-name">${house.name}</div>
            </div>
            <div class="hudosan-preview-card-image">
                <img src="${house.file}" alt="${house.name}" class="hudosan-step2-preview-img">
            </div>
            <div class="hudosan-preview-card-footer" style="border-top-color:${house.bgColor}">
                <div class="hudosan-preview-stats" style="color:${house.bgColor}">
                    <div class="hudosan-preview-stat-row"><span class="hudosan-preview-stat-label">広さ</span>${hudosanStars(house.stats.space)}</div>
                    <div class="hudosan-preview-stat-row"><span class="hudosan-preview-stat-label">おしゃれ度</span>${hudosanStars(house.stats.style)}</div>
                    <div class="hudosan-preview-stat-row"><span class="hudosan-preview-stat-label">落ち着き度</span>${hudosanStars(house.stats.calm)}</div>
                </div>
                <div class="hudosan-step2-preview-desc">${house.desc}</div>
                <div class="hudosan-step2-preview-price">${priceStr}</div>
            </div>
        </div>
    `;
    document.getElementById('hudosanStep2NextBtn').disabled = false;
}

function hudosanBackToStep1() {
    document.getElementById('hudosanBuyStep2').style.display = 'none';
    document.getElementById('hudosanBuyStep1').style.display = 'flex';


}

function hudosanGoStep3() {
    document.getElementById('hudosanBuyStep2').style.display = 'none';
    document.getElementById('hudosanBuyStep3').style.display = 'flex';


    renderHudosanRankGrid();
}

function renderHudosanRankGrid() {
    const grid = document.getElementById('hudosanRankGrid');
    grid.innerHTML = hudosanRanks.map(rank => {
        const contentItems = hudosanContents.map((c, i) => {
            const enabled = i < rank.slots;
            return `
                <div class="hudosan-content-item${enabled ? '' : ' disabled'}">
                    <span class="hudosan-content-check">${enabled ? '✓' : '—'}</span>
                    <span>${c.icon} ${c.name}</span>
                </div>`;
        }).join('');

        return `
        <div class="hudosan-rank-card" data-rank="${rank.id}" id="rankCard-${rank.id}" onclick="selectHudosanRank('${rank.id}')">
            <div class="hudosan-rank-header">
                <div class="hudosan-rank-letter">${rank.id}</div>
                <div class="hudosan-rank-name">${rank.label}</div>
                <div class="hudosan-rank-price">${(rank.price / 10000).toLocaleString()}万円</div>
            </div>
            <div class="hudosan-rank-body">
                <div class="hudosan-rank-slots">
                    <strong>×${rank.slots}</strong>
                    コンテンツ設置数
                </div>
                <div class="hudosan-content-list">${contentItems}</div>
            </div>
        </div>`;
    }).join('');
}

function selectHudosanRank(id) {
    document.querySelectorAll('.hudosan-rank-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`rankCard-${id}`).classList.add('selected');
    hudosanBuyState.selectedRank = id;
    const rank = hudosanRanks.find(r => r.id === id);
    document.getElementById('hudosanRankInfo').textContent = `選択中：${rank.label}（${(rank.price / 10000).toLocaleString()}万円）`;
    document.getElementById('hudosanStep3NextBtn').disabled = false;
}

function hudosanBackToStep2() {
    document.getElementById('hudosanBuyStep3').style.display = 'none';
    document.getElementById('hudosanBuyStep2').style.display = 'flex';


}

// 現タウンの地価（仮：後で変更可）
const TOWN_LAND_PRICE = 14000000;

function hudosanGoStep4() {
    document.getElementById('hudosanBuyStep3').style.display = 'none';
    document.getElementById('hudosanBuyStep4').style.display = 'flex';



    // 選択内容を表示
    const house = hudosanHouses.find(h => h.id === hudosanBuyState.selectedHouse);
    const rank  = hudosanRanks.find(r => r.id === hudosanBuyState.selectedRank);
    const total = TOWN_LAND_PRICE + rank.price;

    document.getElementById('hudosanConfirmCoord').textContent    = hudosanBuyState.selectedCoord;
    document.getElementById('hudosanConfirmHouseImg').src         = house.file;
    document.getElementById('hudosanConfirmHouseName').textContent = house.name;
    document.getElementById('hudosanConfirmRankLetter').textContent = rank.id;
    document.getElementById('hudosanConfirmRankName').textContent  = rank.label;
    document.getElementById('hudosanCostLand').textContent  = `${(TOWN_LAND_PRICE / 10000).toLocaleString()}万円`;
    document.getElementById('hudosanCostRank').textContent  = `${(rank.price / 10000).toLocaleString()}万円`;
    document.getElementById('hudosanCostTotal').textContent = `${(total / 10000).toLocaleString()}万円`;
    document.getElementById('hudosanConfirmMoney').textContent = `${gameState.player.money.toLocaleString()}円`;

    const canAfford = gameState.player.money >= total;
    document.getElementById('hudosanPurchaseBtn').disabled = !canAfford;
    document.getElementById('hudosanBuyInsufficient').style.display = canAfford ? 'none' : '';
}

function hudosanBackToStep3() {
    document.getElementById('hudosanBuyStep4').style.display = 'none';
    document.getElementById('hudosanBuyStep3').style.display = 'flex';


}

function executeHudosanPurchase() {
    const rank  = hudosanRanks.find(r => r.id === hudosanBuyState.selectedRank);
    const total = TOWN_LAND_PRICE + rank.price;

    if (gameState.player.money < total) return;

    // お金を減らす
    changeMoney(-total);

    // マップを更新（sale → 建てた家）
    const row = hudosanBuyState.selectedRow;
    const col = hudosanBuyState.selectedCol;
    townMap[row][col] = 'myhouse';
    mapTiles[row][col] = `house/${hudosanBuyState.selectedHouse}.png`;

    // プレイヤーデータに保存
    gameState.player.house = {
        coord:   hudosanBuyState.selectedCoord,
        row, col,
        houseId: hudosanBuyState.selectedHouse,
        rank:    hudosanBuyState.selectedRank
    };

    // マップ再描画
    renderMap();

    // 完了画面へ
    document.getElementById('hudosanBuyStep4').style.display = 'none';


    const house = hudosanHouses.find(h => h.id === hudosanBuyState.selectedHouse);
    document.getElementById('hudosanCompleteIcon').innerHTML = `<img src="${house.file}" alt="${house.name}">`;
    document.getElementById('hudosanCompleteCoord').textContent = `建設場所：${hudosanBuyState.selectedCoord}`;
    document.getElementById('hudosanCompleteView').style.display = 'flex';
}

