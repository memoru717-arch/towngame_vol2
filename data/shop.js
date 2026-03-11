// ============================================
// のんびりタウン - 商店・食堂・売却機能
// ============================================
// 購入確認用の一時変数
let pendingPurchase = {
    items: [],
    totalPrice: 0
};

// 食堂の購入確認用の一時変数
let pendingShokudoPurchase = {
    items: [],
    totalPrice: 0
};

// ============================================
// 商店機能
// ============================================
function openShop() {
    const modal = document.getElementById('shopModal');
    const tbody = document.getElementById('shopTableBody');

    // ビューをリセット（買い物リスト画面に戻す）
    document.getElementById('shopListView').style.display = 'block';
    document.getElementById('shopConfirmView').style.display = 'none';
    document.getElementById('shopNoMoneyView').style.display = 'none';
    document.getElementById('shopCompleteView').style.display = 'none';
    document.getElementById('shopModal').querySelector('.shop-header').style.display = '';
    document.getElementById('shopMoney').style.display = 'block';
    document.getElementById('shopTitle').textContent = 'デパートの品揃えは毎日変わります。ぜひ見ていってくださいね！';

    // 所持金を表示
    document.getElementById('shopMoney').textContent = `現在の所持金：${gameState.player.money.toLocaleString()}円`;

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
                targetCells += `<td>${req || '-'}</td>`;
            });
            targetJobRow = `
        <tr class="target-job-stats">
            <td class="target-job-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>`;
        }
    }

    let html = `
        <tr class="gym-user-stats">
            <td class="gym-user-stats-label">現在の能力値</td>
            ${abilityCells}
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        ${targetJobRow}
    `;
    shopItems.forEach((item, index) => {
        if (item.type === 'separator') {
            html += `<tr class="separator-row"><td colspan="23">${item.name}</td></tr>`;
            return;
        }

        // 非消費アイテムは1つしか持てない
        const alreadyOwned = !item.consumable &&
            gameState.player.possessions.some(p => p.name === item.name);

        // 在庫表示（stockプロパティがあればその値、なければ従来ロジック）
        const stock = item.stock !== undefined ? item.stock : (item.consumable ? '∞' : (alreadyOwned ? '0' : '1'));

        // 在庫切れの場合はチェックボックスを無効化
        const isDisabled = (!item.consumable && alreadyOwned) || (item.stock !== undefined && item.stock <= 0);

        html += `
            <tr>
                <td class="gym-menu-name"><label><input type="checkbox" class="shop-checkbox" data-index="${index}" ${isDisabled ? 'disabled' : ''}> ${item.name}</label></td>
                <td>${item.stats?.国語 || '-'}</td>
                <td>${item.stats?.数学 || '-'}</td>
                <td>${item.stats?.理科 || '-'}</td>
                <td>${item.stats?.社会 || '-'}</td>
                <td>${item.stats?.英語 || '-'}</td>
                <td>${item.stats?.音楽 || '-'}</td>
                <td>${item.stats?.美術 || '-'}</td>
                <td>${item.stats?.体力 || '-'}</td>
                <td>${item.stats?.気力 || '-'}</td>
                <td>${item.stats?.ルックス || '-'}</td>
                <td>${item.stats?.素早さ || '-'}</td>
                <td>${item.stats?.面白さ || '-'}</td>
                <td>${item.stats?.優しさ || '-'}</td>
                <td>${item.stats?.エロさ || '-'}</td>
                <td>${item.calorie ? item.calorie + 'kcal' : '-'}</td>
                <td>${item.useCount || '-'}</td>
                <td>${item.cooldown && item.cooldown !== '0分' ? item.cooldown : '-'}</td>
                <td>${item.bodyConsume ? item.bodyConsume : '-'}</td>
                <td>${item.brainConsume ? item.brainConsume : '-'}</td>
                <td>${item.description || '-'}</td>
                <td>${item.price.toLocaleString()}円</td>
                <td>${stock}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // ヘッダー高さに基づいてstickyのtop値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('shopTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowHeight = headerRows[0].offsetHeight;
            const totalHeaderHeight = firstRowHeight + headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => {
                th.style.top = firstRowHeight + 'px';
            });
            const userStatsRow = table.querySelector('.gym-user-stats');
            if (userStatsRow) {
                userStatsRow.style.top = totalHeaderHeight + 'px';
                const targetRow = table.querySelector('.target-job-stats');
                if (targetRow) {
                    targetRow.style.top = '88px';
                }
            }
        }
    });

    // チェックボックスの変更を監視
    const checkboxes = document.querySelectorAll('.shop-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePurchaseButton);
    });

    // 購入ボタンの状態をリセット
    updatePurchaseButton();

    modal.classList.add('active');

    // ヘッダー高さに基づいてstickyのtop値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('shopTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowHeight = headerRows[0].offsetHeight;
            const totalHeaderHeight = firstRowHeight + headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => {
                th.style.top = firstRowHeight + 'px';
            });
            const userStatsRow = table.querySelector('.gym-user-stats');
            if (userStatsRow) {
                userStatsRow.style.top = totalHeaderHeight + 'px';
            }
        }
    });
}

function updatePurchaseButton() {
    const checkboxes = document.querySelectorAll('.shop-checkbox:checked');
    const purchaseBtn = document.getElementById('shopPurchaseBtn');

    if (checkboxes.length > 0) {
        purchaseBtn.disabled = false;
        purchaseBtn.classList.add('active');
    } else {
        purchaseBtn.disabled = true;
        purchaseBtn.classList.remove('active');
    }
}

function closeShop() {
    document.getElementById('shopModal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

function closeShopAndOpenInventory() {
    closeShop();
    openInventoryModal();
}

function purchaseSelectedItems() {
    const checkboxes = document.querySelectorAll('.shop-checkbox:checked');
    if (checkboxes.length === 0) return;

    // 選択された商品を取得
    const selectedItems = [];
    let totalPrice = 0;

    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        const item = shopItems[index];
        if (item && item.type !== 'separator') {
            selectedItems.push(item);
            totalPrice += item.price;
        }
    });

    // 確認画面に商品一覧を表示
    const itemsList = document.getElementById('confirmItemsList');
    let html = '';
    selectedItems.forEach(item => {
        html += `
            <div class="confirm-item">
                <span class="confirm-item-name">${item.name}</span>
                <span class="confirm-item-price">${item.price.toLocaleString()}円</span>
            </div>
        `;
    });
    itemsList.innerHTML = html;

    // 合計金額を表示
    document.getElementById('confirmTotalPrice').textContent = totalPrice.toLocaleString() + '円';

    // 購入確認用に保存
    pendingPurchase.items = selectedItems;
    pendingPurchase.totalPrice = totalPrice;

    // 所持金を表示
    document.getElementById('confirmCurrentMoney').textContent = `現在の所持金：${gameState.player.money.toLocaleString()}円`;

    // ビューを切り替え
    document.getElementById('shopListView').style.display = 'none';
    document.getElementById('shopConfirmView').style.display = 'block';
    document.getElementById('shopModal').querySelector('.shop-header').style.display = 'none';
}

function backToShopList() {
    // ビューを切り替え
    document.getElementById('shopConfirmView').style.display = 'none';
    document.getElementById('shopNoMoneyView').style.display = 'none';
    document.getElementById('shopListView').style.display = 'block';
    document.getElementById('shopModal').querySelector('.shop-header').style.display = '';
    document.getElementById('shopTitle').textContent = 'デパートの品揃えは毎日変わります。ぜひ見ていってくださいね！';
}


function confirmPurchase() {
    const items = pendingPurchase.items;
    const totalPrice = pendingPurchase.totalPrice;

    // 所持金チェック
    if (gameState.player.money < totalPrice) {
        // 所持金不足ビューを表示
        document.getElementById('noMoneyCurrentMoney').textContent = gameState.player.money.toLocaleString() + '円';
        document.getElementById('noMoneyTotalPrice').textContent = totalPrice.toLocaleString() + '円';
        document.getElementById('noMoneyShortage').textContent = (totalPrice - gameState.player.money).toLocaleString() + '円';
        document.getElementById('shopConfirmView').style.display = 'none';
        document.getElementById('shopNoMoneyView').style.display = 'block';
        document.getElementById('shopModal').querySelector('.shop-header').style.display = 'none';
        return;
    }

    // 各アイテムを所持品に追加
    items.forEach(item => {
        // 消費アイテムの場合、既存のアイテムがあれば残り回数を増やす
        if (item.consumable) {
            const existingItem = gameState.player.possessions.find(p => p.name === item.name);
            if (existingItem) {
                existingItem.remainingUses += (item.useCount || 1);
                return;
            }
        }

        // 非消費アイテムは1つしか持てない
        if (!item.consumable) {
            const alreadyOwned = gameState.player.possessions.some(p => p.name === item.name);
            if (alreadyOwned) {
                return;
            }
        }

        // 新規アイテムを追加
        gameState.player.possessions.push({
            name: item.name,
            consumable: item.consumable,
            price: item.price,
            description: item.description,
            effect: item.effect,
            stats: item.stats || {},
            calorie: item.calorie,
            useCount: item.useCount,
            remainingUses: item.useCount || 1,
            cooldown: item.cooldown,
            bodyConsume: item.bodyConsume,
            brainConsume: item.brainConsume,
            purchaseDate: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
        });
    });

    // お金を減らす
    changeMoney(-totalPrice);

    // 購入完了画面に商品一覧を表示
    const completeList = document.getElementById('completeItemsList');
    let html = '';
    items.forEach(item => {
        html += `<div class="complete-item">${item.name}</div>`;
    });
    completeList.innerHTML = html;

    // 購入完了ビューを表示
    document.getElementById('shopConfirmView').style.display = 'none';
    document.getElementById('shopCompleteView').style.display = 'block';
    document.getElementById('shopModal').querySelector('.shop-header').style.display = 'none';

    gameState.pendingRandomEvent = true;
    updateStatus();
}


function buyItem(index) {
    const item = shopItems[index];
    if (!item || item.type === 'separator') return;

    if (gameState.player.money < item.price) {
        return;
    }

    // 非消費アイテム（高額商品）は1つしか持てない
    if (!item.consumable) {
        const alreadyOwned = gameState.player.possessions.some(p => p.name === item.name);
        if (alreadyOwned) {
            return;
        }
    }

    changeMoney(-item.price);

    // 消費アイテムの場合、既存のアイテムがあれば残り回数を増やす
    if (item.consumable) {
        const existingItem = gameState.player.possessions.find(p => p.name === item.name);
        if (existingItem) {
            existingItem.remainingUses += (item.useCount || 1);
            updateStatus();
            openShop();
            return;
        }
    }

    // 新規アイテムを追加（すべてのステータスを保存）
    gameState.player.possessions.push({
        name: item.name,
        consumable: item.consumable,
        price: item.price,
        description: item.description,
        effect: item.effect,
        stats: item.stats || {},
        calorie: item.calorie,
        useCount: item.useCount,
        remainingUses: item.useCount || 1,
        cooldown: item.cooldown,
        bodyConsume: item.bodyConsume,
        brainConsume: item.brainConsume,
        purchaseDate: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
    });

    updateStatus();
    openShop(); // 商店を更新
}

// ============================================
// 食堂機能
// ============================================

let currentShokudoMode = 'eat';

function openShokudo() {
    const modal = document.getElementById('shokudoModal');
    document.getElementById('shokudoLobbyView').style.display = 'flex';
    document.getElementById('shokudoEatView').style.display = 'none';
    document.getElementById('shokudoListView').style.display = 'none';
    document.getElementById('shokudoCompleteView').style.display = 'none';
    modal.classList.add('shokudo-lobby-mode');
    modal.classList.add('active');
}

function openShokudoEat() {
    openShokudoList('eat');
}

function openShokudoTakeout() {
    openShokudoList('takeout');
}

function openShokudoList(mode) {
    currentShokudoMode = mode;
    const modal = document.getElementById('shokudoModal');

    modal.classList.remove('shokudo-lobby-mode');
    modal.classList.remove('shop2-complete-mode');
    document.getElementById('shokudoLobbyView').style.display = 'none';
    document.getElementById('shokudoCompleteView').style.display = 'none';

    if (mode === 'eat') {
        document.getElementById('shokudoListView').style.display = 'none';
        document.getElementById('shokudoEatView').style.display = 'flex';
        renderShokudoEat();
    } else {
        document.getElementById('shokudoEatView').style.display = 'none';
        document.getElementById('shokudoListView').style.display = 'block';
        renderShokudoTakeout();
    }
}

function renderShokudoEat() {
    document.getElementById('shokudoEatMoney').textContent = `${gameState.player.money.toLocaleString()}円`;
    const isFull = getHungerText().stage === 1;
    document.getElementById('shokudoEatFullWarn').style.display = isFull ? '' : 'none';

    const tbody = document.getElementById('shokudoEatTableBody');
    const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
    const abilities = gameState.player.abilities;

    // 現在の能力値行
    let abilityCells = '';
    abilityKeys.forEach(key => { abilityCells += `<td>${abilities[key]}</td>`; });

    // 目標職業行
    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            const targetCells = abilityKeys.map(k => `<td>${targetJob.abilities[k] || ''}</td>`).join('');
            targetJobRow = `
        <tr class="shop2-target-stats">
            <td class="shop2-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td></td><td></td><td></td><td></td>
        </tr>`;
        }
    }

    let html = `
        <tr class="shop2-user-stats">
            <td class="shop2-stats-label">現在の能力値</td>
            ${abilityCells}
            <td></td><td></td><td></td><td></td>
        </tr>
        ${targetJobRow}
    `;

    const eatItems = shokudoItems.filter(item => !item.type && !item.takeout);
    eatItems.forEach(item => {
        const index = shokudoItems.indexOf(item);
        const stock = item.stock !== undefined ? item.stock : '∞';
        const isDisabled = item.stock !== undefined && item.stock <= 0;
        const descCell = item.description
            ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${item.description}</span></span>`
            : '';

        html += `
            <tr>
                <td class="shop2-item-name">
                    <label>
                        <input type="radio" name="shokudo-eat-radio" class="shokudo-eat-radio shop2-checkbox"
                            data-index="${index}" ${isDisabled ? 'disabled' : ''} onchange="updateShokudoEatPanel()">
                        ${item.name}
                    </label>
                </td>
                <td>${item.stats?.国語 || ''}</td>
                <td>${item.stats?.数学 || ''}</td>
                <td>${item.stats?.理科 || ''}</td>
                <td>${item.stats?.社会 || ''}</td>
                <td>${item.stats?.英語 || ''}</td>
                <td>${item.stats?.音楽 || ''}</td>
                <td>${item.stats?.美術 || ''}</td>
                <td>${item.stats?.体力 || ''}</td>
                <td>${item.stats?.気力 || ''}</td>
                <td>${item.stats?.ルックス || ''}</td>
                <td>${item.stats?.素早さ || ''}</td>
                <td>${item.stats?.面白さ || ''}</td>
                <td>${item.stats?.優しさ || ''}</td>
                <td>${item.stats?.エロさ || ''}</td>
                <td>${item.calorie ? item.calorie + 'kcal' : ''}</td>
                <td>${descCell}</td>
                <td class="shop2-price">${item.price.toLocaleString()}円</td>
                <td>${isDisabled ? '売切' : stock}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // 備考ツールチップ設定
    document.querySelectorAll('#shokudoEatTableBody .shop2-desc-symbol').forEach(symbol => {
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

    // stickyのtop値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('shokudoEatTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowHeight = headerRows[0].offsetHeight;
            const totalHeaderHeight = firstRowHeight + headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => { th.style.top = firstRowHeight + 'px'; });
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

    document.getElementById('shokudoEatPanel').innerHTML = '<p class="shokudo-no-select">メニューを選んでください</p>';
    const orderBtn = document.getElementById('shokudoEatOrderBtn');
    orderBtn.disabled = true;
    orderBtn.classList.remove('active');
}

function updateShokudoEatPanel() {
    const selected = document.querySelector('.shokudo-eat-radio:checked');
    const panel = document.getElementById('shokudoEatPanel');
    const orderBtn = document.getElementById('shokudoEatOrderBtn');

    if (!selected) {
        panel.innerHTML = '<p class="shokudo-no-select">メニューを選んでください</p>';
        orderBtn.disabled = true;
        orderBtn.classList.remove('active');
        return;
    }

    const index = parseInt(selected.dataset.index);
    const item = shokudoItems[index];

    panel.innerHTML = `
        <div class="shokudo-selected-content">
            <p class="shokudo-select-name">${item.name}</p>
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="shokudo-select-img">` : ''}
            <div class="shokudo-select-divider"></div>
            <div class="shokudo-select-row">
                <span class="shokudo-select-key">空腹度</span>
                <span class="shokudo-select-val">満腹になります</span>
            </div>
            <div class="shokudo-select-row shokudo-select-price-row">
                <span class="shokudo-select-key">価格</span>
                <span class="shokudo-select-val shokudo-select-price">${item.price.toLocaleString()} 円</span>
            </div>
        </div>
    `;

    const isFull = getHungerText().stage === 1;
    const canAfford = gameState.player.money >= item.price;
    const canOrder = !isFull && canAfford;

    const warnEl = document.getElementById('shokudoEatWarn');
    if (warnEl) {
        if (!canAfford) {
            warnEl.textContent = '所持金が足りません';
            warnEl.style.display = '';
        } else {
            warnEl.style.display = 'none';
        }
    }

    orderBtn.disabled = !canOrder;
    orderBtn.classList.toggle('active', canOrder);
}

function purchaseShokudoEat() {
    const selected = document.querySelector('.shokudo-eat-radio:checked');
    if (!selected) return;

    const index = parseInt(selected.dataset.index);
    const item = shokudoItems[index];

    if (gameState.player.money < item.price) {
        showToast('所持金が足りません');
        return;
    }

    pendingShokudoPurchase.items = [item];
    pendingShokudoPurchase.totalPrice = item.price;

    confirmShokudoPurchase();
}

const shokudoTakeoutGenres = ['全ジャンル', 'ファーストフード', 'ドリンク', 'デザート'];

function renderShokudoTakeout() {
    const tbody = document.getElementById('shokudoTableBody');

    document.getElementById('shokudoMoney').textContent = `${gameState.player.money.toLocaleString()}円`;

    // タブ生成
    const tabsEl = document.getElementById('shokudoTabs');
    tabsEl.innerHTML = shokudoTakeoutGenres.map((g, i) =>
        `<button class="shop2-tab${i === 0 ? ' active' : ''}" onclick="filterShokudoByGenre(this, '${g}')">${g}</button>`
    ).join('');

    const abilities = gameState.player.abilities;
    const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
    let abilityCells = '';
    abilityKeys.forEach(key => { abilityCells += `<td>${abilities[key]}</td>`; });

    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            let targetCells = '';
            abilityKeys.forEach(key => {
                const req = targetJob.abilities[key];
                targetCells += `<td>${req || '-'}</td>`;
            });
            targetJobRow = `
        <tr class="shop2-target-stats">
            <td class="shop2-stats-label">目標の職業：${targetJob.name}</td>
            ${targetCells}
            <td></td><td></td><td></td><td></td>
        </tr>`;
        }
    }

    let html = `
        <tr class="shop2-user-stats">
            <td class="shop2-stats-label">現在の能力値</td>
            ${abilityCells}
            <td></td><td></td><td></td><td></td>
        </tr>
        ${targetJobRow}
    `;

    const takeoutItems = shokudoItems.filter(item => item.type !== 'separator' && item.takeout === true);
    const genreOrder = ['ファーストフード', 'ドリンク', 'デザート'];
    genreOrder.forEach(genre => {
        html += `<tr class="separator-row" data-genre="${genre}"><td colspan="19">${genre}</td></tr>`;
        const genreItems = takeoutItems.filter(item => (item.genre || 'ファーストフード') === genre);
        genreItems.forEach(item => {
            const index = shokudoItems.indexOf(item);
            const stock = item.stock !== undefined ? item.stock : '∞';
            const isDisabled = item.stock !== undefined && item.stock <= 0;
            const descCell = item.description
                ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${item.description}</span></span>`
                : '';

            html += `
                <tr data-genre="${genre}">
                    <td class="shop2-item-name"><label>
                        <input type="checkbox" class="shop2-checkbox shokudo-checkbox" data-index="${index}" data-takeout="true" ${isDisabled ? 'disabled' : ''}>
                        ${item.name}</label></td>
                    <td>${item.stats?.国語 || ''}</td>
                    <td>${item.stats?.数学 || ''}</td>
                    <td>${item.stats?.理科 || ''}</td>
                    <td>${item.stats?.社会 || ''}</td>
                    <td>${item.stats?.英語 || ''}</td>
                    <td>${item.stats?.音楽 || ''}</td>
                    <td>${item.stats?.美術 || ''}</td>
                    <td>${item.stats?.体力 || ''}</td>
                    <td>${item.stats?.気力 || ''}</td>
                    <td>${item.stats?.ルックス || ''}</td>
                    <td>${item.stats?.素早さ || ''}</td>
                    <td>${item.stats?.面白さ || ''}</td>
                    <td>${item.stats?.優しさ || ''}</td>
                    <td>${item.stats?.エロさ || ''}</td>
                    <td>${item.calorie ? item.calorie + 'kcal' : ''}</td>
                    <td>${descCell}</td>
                    <td class="shop2-price">${item.price.toLocaleString()}円</td>
                    <td>${isDisabled ? '売切' : stock}</td>
                </tr>
            `;
        });
    });

    tbody.innerHTML = html;

    // 備考ツールチップ設定
    document.querySelectorAll('#shokudoTableBody .shop2-desc-symbol').forEach(symbol => {
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

    requestAnimationFrame(() => {
        const table = document.getElementById('shokudoTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowHeight = headerRows[0].offsetHeight;
            const totalHeaderHeight = firstRowHeight + headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => { th.style.top = firstRowHeight + 'px'; });
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

    const checkboxes = document.querySelectorAll('.shokudo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateShokudoCart);
    });
    updateShokudoCart();
}

function filterShokudoByGenre(btn, genre) {
    document.querySelectorAll('#shokudoTabs .shop2-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#shokudoTableBody tr').forEach(row => {
        row.style.display = (genre === '全ジャンル' || row.dataset.genre === genre) ? '' : 'none';
    });
    // ユーザー能力値行・目標行は常に表示
    document.querySelectorAll('#shokudoTableBody .shop2-user-stats, #shokudoTableBody .shop2-target-stats').forEach(row => {
        row.style.display = '';
    });
}

function updateShokudoCart() {
    const checked = document.querySelectorAll('.shokudo-checkbox:checked');
    const cartItemsEl = document.getElementById('shokudoCartItems');
    const totalPriceEl = document.getElementById('shokudoTotalPrice');
    const insufficientEl = document.getElementById('shokudoInsufficient');
    const purchaseBtn = document.getElementById('shokudoPurchaseBtn');

    let total = 0;
    let html = '';

    if (checked.length === 0) {
        html = '<p class="shop2-cart-empty">アイテムを選んでください</p>';
    } else {
        checked.forEach(cb => {
            const item = shokudoItems[parseInt(cb.dataset.index)];
            if (!item) return;
            total += item.price;
            html += `<div class="shop2-cart-item"><span class="shop2-cart-name">${item.name}</span><span class="shop2-cart-price">${item.price.toLocaleString()}円</span></div>`;
        });
    }

    if (cartItemsEl) cartItemsEl.innerHTML = html;
    if (totalPriceEl) totalPriceEl.textContent = `${total.toLocaleString()}円`;

    const canAfford = total <= gameState.player.money;
    if (insufficientEl) insufficientEl.style.display = (checked.length > 0 && !canAfford) ? '' : 'none';

    const canBuy = checked.length > 0 && canAfford;
    purchaseBtn.disabled = !canBuy;
    purchaseBtn.classList.toggle('active', canBuy);
}


function closeShokudo() {
    const modal = document.getElementById('shokudoModal');
    modal.classList.remove('active');
    modal.classList.remove('shokudo-lobby-mode');
    modal.classList.remove('shop2-complete-mode');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

function closeShokudoAndOpenInventory() {
    closeShokudo();
    openInventoryModal();
}

function purchaseShokudoItems() {
    const checkboxes = document.querySelectorAll('.shokudo-checkbox:checked');
    if (checkboxes.length === 0) return;

    const selectedItems = [];
    let totalPrice = 0;

    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        const item = shokudoItems[index];
        if (item && item.type !== 'separator') {
            selectedItems.push(item);
            totalPrice += item.price;
        }
    });

    pendingShokudoPurchase.items = selectedItems;
    pendingShokudoPurchase.totalPrice = totalPrice;

    confirmShokudoPurchase();
}

function backToShokudoList() {
    if (currentShokudoMode === 'eat') {
        document.getElementById('shokudoEatView').style.display = 'flex';
    } else {
        document.getElementById('shokudoListView').style.display = 'block';
    }
}

function confirmShokudoPurchase() {
    const items = pendingShokudoPurchase.items;
    const totalPrice = pendingShokudoPurchase.totalPrice;

    // お金を減らす
    changeMoney(-totalPrice);

    // テイクアウト品と食料品を分ける
    const takeoutItems = items.filter(item => item.takeout);
    const eatHereItems = items.filter(item => !item.takeout);

    // 在庫を減らす
    items.forEach(item => {
        if (item.stock !== undefined && item.stock > 0) {
            item.stock--;
        }
    });

    // テイクアウト品 → 所持品に追加
    takeoutItems.forEach(item => {
        if (item.consumable) {
            const existingItem = gameState.player.possessions.find(p => p.name === item.name);
            if (existingItem) {
                existingItem.remainingUses += (item.useCount || 1);
                return;
            }
        }
        gameState.player.possessions.push({
            name: item.name,
            consumable: item.consumable,
            price: item.price,
            description: item.description,
            effect: item.effect,
            stats: item.stats || {},
            calorie: item.calorie,
            useCount: item.useCount,
            remainingUses: item.useCount || 1,
            purchaseDate: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
        });
    });

    // 食料品 → その場で食べる（効果を即時適用）
    const p = gameState.player;
    let eatResultHtml = '';

    const statNames = {
        国語: '国語', 数学: '数学', 理科: '理科', 社会: '社会', 英語: '英語',
        音楽: '音楽', 美術: '美術', 体力: '体力', 気力: '気力',
        ルックス: 'ルックス', 素早さ: '素早さ', 面白さ: '面白さ',
        優しさ: '優しさ', エロさ: 'エロさ'
    };

    eatHereItems.forEach(item => {
        // 変更前の値を保存
        const beforeStats = {};
        if (item.stats) {
            for (const key in item.stats) {
                if (key in p.abilities && item.stats[key]) {
                    beforeStats[key] = p.abilities[key];
                }
            }
        }
        const beforeHunger = getHungerText().text;
        const beforeHealth = p.health;
        const beforeWeight = p.weight;

        // 空腹度回復
        if (item.effect && item.effect.hunger) {
            eatFood(item.hungerEffect || 1);
        }

        // カロリーによる体重増加
        if (item.calorie && item.calorie > 0) {
            const weightGain = item.calorie / 1000;
            changeWeight(weightGain);
        }

        // 能力値を適用
        if (item.stats) {
            for (const key in item.stats) {
                if (key in p.abilities && item.stats[key]) {
                    p.abilities[key] += item.stats[key];
                }
            }
        }

        // 変更後の値を取得
        const afterHunger = getHungerText().text;
        const afterHealth = p.health;
        const afterWeight = p.weight;

        // 結果表示用HTML
        eatResultHtml += `<div class="shokudo-eat-result">`;
        eatResultHtml += `<div class="shokudo-eat-heading">${item.name}を食べました！</div>`;
        if (item.image) {
            eatResultHtml += `<img src="${item.image}" alt="${item.name}" class="shokudo-result-img">`;
        }
        eatResultHtml += `<div class="shokudo-eat-changes">`;

        // 能力値の変化（+N のみ）
        if (item.stats) {
            for (const [key, value] of Object.entries(item.stats)) {
                if (value && value > 0) {
                    const before = beforeStats[key];
                    const after = p.abilities[key];
                    const diff = after - before;
                    eatResultHtml += `<div class="shokudo-change-row">`;
                    eatResultHtml += `<span class="shokudo-change-label">${statNames[key] || key}</span>`;
                    eatResultHtml += `<span class="shokudo-change-plus">+${diff}</span>`;
                    eatResultHtml += `</div>`;
                }
            }
        }

        // 空腹度の変化
        if (beforeHunger !== afterHunger) {
            const displayAfterHunger = afterHunger.replace('（食事できません）', '');
            eatResultHtml += `<div class="shokudo-change-row">`;
            eatResultHtml += `<span class="shokudo-change-label">空腹度</span>`;
            eatResultHtml += `<span class="shokudo-change-after shokudo-change-up">${displayAfterHunger}</span>`;
            eatResultHtml += `</div>`;
        }

        // 体重の変化
        if (beforeWeight !== afterWeight) {
            const weightDiff = (afterWeight - beforeWeight).toFixed(2);
            eatResultHtml += `<div class="shokudo-change-row">`;
            eatResultHtml += `<span class="shokudo-change-label">体重</span>`;
            eatResultHtml += `<span class="shokudo-change-plus">+${weightDiff}kg</span>`;
            eatResultHtml += `</div>`;
        }

        eatResultHtml += `</div>`;
        eatResultHtml += `</div>`;
    });

    // 完了画面を構築
    const contentEl = document.getElementById('shokudoCompleteContent');
    const buttonsEl = document.getElementById('shokudoCompleteButtons');
    const modal = document.getElementById('shokudoModal');

    if (takeoutItems.length > 0) {
        // テイクアウト品 → shop2-complete-view スタイル
        contentEl.innerHTML = `
            <p class="shop2-complete-heading">お買い上げありがとうございます！</p>
            <p class="shop2-complete-subheading">またお越しくださいませ。</p>
        `;
        buttonsEl.innerHTML = `
            <button class="btn board-btn-confirm" onclick="closeShokudoAndOpenInventory()">所持品を見る</button>
            <button class="btn board-btn-back" onclick="openShokudoTakeout()">続けてテイクアウト</button>
        `;
    } else {
        // 食料品のみ → 能力値変化表示
        contentEl.innerHTML = eatResultHtml;
        buttonsEl.innerHTML = `
            <button class="btn board-btn-confirm" onclick="closeShokudo()">OK</button>
        `;
    }

    document.getElementById('shokudoListView').style.display = 'none';
    document.getElementById('shokudoEatView').style.display = 'none';
    document.getElementById('shokudoCompleteView').style.display = 'flex';
    modal.classList.add('shop2-complete-mode');

    updateStatus();

    // アクション完了フラグ
    gameState.pendingRandomEvent = true;
}

// ============================================
// 売却機能
// ============================================

// アイテムのカテゴリを取得するヘルパー関数
function getItemCategory(itemName) {
    // 商店・食堂・温泉コンビニから検索
    const allItems = [...shopItems, ...shokudoItems, ...onsenShopItems];
    let currentCategory = '';
    for (const item of allItems) {
        if (item.type === 'separator') {
            currentCategory = item.name;
        } else if (item.name === itemName) {
            return currentCategory;
        }
    }
    return '';
}

// 所持品をカテゴリごとにグループ化
function groupPossessionsByCategory(possessions) {
    const grouped = {};
    possessions.forEach((item, originalIndex) => {
        const category = getItemCategory(item.name);
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push({ ...item, originalIndex });
    });
    return grouped;
}

function openSellShop() {
    const modal = document.getElementById('sellModal');
    const tbody = document.getElementById('sellTableBody');

    // ビューをリセット
    document.getElementById('sellListView').style.display = '';
    document.getElementById('sellCompleteView').style.display = 'none';
    document.getElementById('sellModal').classList.remove('shop2-complete-mode');

    // 所持金を表示
    document.getElementById('sellMoneyValue').textContent = gameState.player.money.toLocaleString() + '円';

    // テーブルと右パネルをリセット
    tbody.innerHTML = '';
    updateSellCart();

    const possessions = gameState.player.possessions;

    if (possessions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="18" class="sell-empty-cell" style="text-align:center; padding:40px; color:#999; font-size:14px;">売却できるアイテムがありません</td></tr>';
    } else {
        let html = '';

        const grouped = groupPossessionsByCategory(possessions);
        const categoryOrder = [...shopItems, ...shokudoItems].filter(s => s.type === 'separator').map(s => s.name);

        categoryOrder.forEach(category => {
            if (grouped[category] && grouped[category].length > 0) {
                html += `<tr class="separator-row"><td colspan="18">${category}</td></tr>`;

                grouped[category].forEach(item => {
                    const shopItem = shopItems.find(s => s.name === item.name);
                    const originalPrice = shopItem ? shopItem.price : 0;
                    const sellPrice = Math.floor(originalPrice * 0.5);

                    html += `
                        <tr>
                            <td class="shop2-item-name"><label><input type="checkbox" class="sell-checkbox shop2-checkbox" data-index="${item.originalIndex}" data-price="${sellPrice}" data-name="${item.name}" onchange="updateSellCart()"> ${item.name}</label></td>
                            <td>${shopItem?.stats?.国語 || ''}</td>
                            <td>${shopItem?.stats?.数学 || ''}</td>
                            <td>${shopItem?.stats?.理科 || ''}</td>
                            <td>${shopItem?.stats?.社会 || ''}</td>
                            <td>${shopItem?.stats?.英語 || ''}</td>
                            <td>${shopItem?.stats?.音楽 || ''}</td>
                            <td>${shopItem?.stats?.美術 || ''}</td>
                            <td>${shopItem?.stats?.体力 || ''}</td>
                            <td>${shopItem?.stats?.気力 || ''}</td>
                            <td>${shopItem?.stats?.ルックス || ''}</td>
                            <td>${shopItem?.stats?.素早さ || ''}</td>
                            <td>${shopItem?.stats?.面白さ || ''}</td>
                            <td>${shopItem?.stats?.優しさ || ''}</td>
                            <td>${shopItem?.stats?.エロさ || ''}</td>
                            <td class="shop2-price">${sellPrice.toLocaleString()}円</td>
                            <td>${shopItem?.description ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${shopItem.description}</span></span>` : ''}</td>
                            <td>${gameState.player.possessions.filter(p => p.name === item.name).length}</td>
                        </tr>
                    `;
                });
            }
        });

        tbody.innerHTML = html;

        // 備考ツールチップ
        document.querySelectorAll('#sellTableBody .shop2-desc-symbol').forEach(symbol => {
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
    }

    modal.classList.add('active');

    // sticky top値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('sellTable');
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            headerRows[1].querySelectorAll('th').forEach(th => {
                th.style.top = '31px';
            });
        }
    });
}

function updateSellCart() {
    const checkboxes = document.querySelectorAll('.sell-checkbox:checked');
    const cartItemsEl = document.getElementById('sellCartItems');
    const totalPriceEl = document.getElementById('sellTotalPrice');
    const sellBtn = document.getElementById('sellButton');

    if (checkboxes.length === 0) {
        cartItemsEl.innerHTML = '<p class="shop2-cart-empty">アイテムを選んでください</p>';
        totalPriceEl.textContent = '0円';
        sellBtn.disabled = true;
        sellBtn.classList.remove('active');
        return;
    }

    let html = '';
    let total = 0;
    checkboxes.forEach(cb => {
        const price = parseInt(cb.dataset.price);
        const name = cb.dataset.name;
        total += price;
        html += `<div class="shop2-cart-item"><span class="shop2-cart-name">${name}</span><span class="shop2-cart-price">${price.toLocaleString()}円</span></div>`;
    });

    cartItemsEl.innerHTML = html;
    totalPriceEl.textContent = total.toLocaleString() + '円';
    sellBtn.disabled = false;
    sellBtn.classList.add('active');
}

function sellSelectedItems() {
    const checkboxes = document.querySelectorAll('.sell-checkbox:checked');
    if (checkboxes.length === 0) return;

    // 選択されたアイテムの情報を保存（削除前に取得）
    const soldItems = [];
    checkboxes.forEach(checkbox => {
        const index = parseInt(checkbox.dataset.index);
        const price = parseInt(checkbox.dataset.price);
        const item = gameState.player.possessions[index];
        soldItems.push({
            name: item.name,
            price: price
        });
    });

    // 選択されたアイテムのインデックスを取得（降順でソート）
    const indices = [];
    checkboxes.forEach(checkbox => {
        indices.push(parseInt(checkbox.dataset.index));
    });
    indices.sort((a, b) => b - a);

    // 合計売却金額を計算
    let totalPrice = 0;
    soldItems.forEach(item => {
        totalPrice += item.price;
    });

    // アイテムを削除（インデックスが大きい順に削除）
    indices.forEach(index => {
        gameState.player.possessions.splice(index, 1);
    });

    // お金を増やす
    changeMoney(totalPrice);

    // 売却完了ビューを表示
    document.getElementById('sellListView').style.display = 'none';
    document.getElementById('sellCompleteView').style.display = '';
    document.getElementById('sellModal').classList.add('shop2-complete-mode');

    updateStatus();
}

function closeSellShopAndOpenInventory() {
    closeSellShop();
    openInventoryModal();
}

function sellBackToList() {
    openSellShop();
}

function closeSellShop() {
    document.getElementById('sellModal').classList.remove('active');
}

function backFromSell() {
    closeSellShop();
    openShop2();
}


// ============================================
// 新デパート機能（shop2）
// ============================================
let shop2ActiveTab = 'all';
let shop2SortCol = null;
let shop2SortDir = 'desc';
let shop2CartItems = []; // { idx, item }[]

function openShop2() {
    // ロビービューを表示
    document.getElementById('shop2LobbyView').style.display = '';
    document.getElementById('shop2ListView').style.display = 'none';
    document.getElementById('shop2CompleteView').style.display = 'none';

    const modal = document.getElementById('shop2Modal');
    modal.classList.add('active');
    modal.classList.add('shop2-lobby-mode');
}

function openShop2Buy() {
    shop2CartItems = [];
    shop2ActiveTab = 'all';
    shop2SortCol = null;
    shop2SortDir = 'desc';

    document.getElementById('shop2LobbyView').style.display = 'none';
    document.getElementById('shop2ListView').style.display = '';
    document.getElementById('shop2CompleteView').style.display = 'none';

    document.getElementById('shop2Modal').classList.remove('shop2-lobby-mode');

    renderShop2Tabs();
    renderShop2Table();
    updateShop2Cart();
}

function openShop2Sell() {
    closeShop2();
    openSellShop();
}

function closeShop2() {
    document.getElementById('shop2Modal').classList.remove('active');
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

function closeShop2AndOpenInventory() {
    closeShop2();
    openInventoryModal();
}

function shop2BackToList() {
    document.getElementById('shop2ListView').style.display = '';
    document.getElementById('shop2CompleteView').style.display = 'none';
    document.getElementById('shop2Modal').classList.remove('shop2-complete-mode');
    shop2CartItems = [];
    renderShop2Table();
    updateShop2Cart();
}

function renderShop2Tabs() {
    const tabsEl = document.getElementById('shop2Tabs');
    const genres = shopItems.filter(i => i.type === 'separator').map(i => i.name);

    let html = `<button class="shop2-tab ${shop2ActiveTab === 'all' ? 'active' : ''}" onclick="shop2SelectTab('all')">全ジャンル</button>`;
    genres.forEach(genre => {
        html += `<button class="shop2-tab ${shop2ActiveTab === genre ? 'active' : ''}" onclick="shop2SelectTab('${genre}')">${genre}</button>`;
    });
    tabsEl.innerHTML = html;
}

function scrollShop2Tabs(amount) {
    const scroll = document.getElementById('shop2TabsScroll');
    if (scroll) scroll.scrollBy({ left: amount, behavior: 'smooth' });
}

function shop2SelectTab(genre) {
    shop2ActiveTab = genre;
    renderShop2Tabs();
    renderShop2Table();
}

function shop2SortBy(col) {
    if (shop2SortCol === col) {
        shop2SortDir = shop2SortDir === 'asc' ? 'desc' : 'asc';
    } else {
        shop2SortCol = col;
        shop2SortDir = 'desc';
    }
    renderShop2Table();
}

function renderShop2Table() {
    const tbody = document.getElementById('shop2TableBody');
    const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
    const abilities = gameState.player.abilities;

    // ジャンルごとにグループ化
    let genres = [];
    let currentGroup = null;
    shopItems.forEach((item, idx) => {
        if (item.type === 'separator') {
            currentGroup = { name: item.name, items: [] };
            genres.push(currentGroup);
        } else if (currentGroup) {
            currentGroup.items.push({ item, idx });
        }
    });

    // タブフィルター
    if (shop2ActiveTab !== 'all') {
        genres = genres.filter(g => g.name === shop2ActiveTab);
    }

    // ジャンル内ソート
    if (shop2SortCol) {
        genres.forEach(genre => {
            genre.items.sort((a, b) => {
                let valA, valB;
                if (shop2SortCol === 'price') {
                    valA = a.item.price;
                    valB = b.item.price;
                } else if (shop2SortCol === 'useCount') {
                    valA = a.item.useCount || 0;
                    valB = b.item.useCount || 0;
                } else {
                    valA = a.item.stats?.[shop2SortCol] || 0;
                    valB = b.item.stats?.[shop2SortCol] || 0;
                }
                return shop2SortDir === 'asc' ? valA - valB : valB - valA;
            });
        });
    }

    // 能力値ヘッダー行
    let abilityCells = abilityKeys.map(k => `<td>${abilities[k]}</td>`).join('');
    const emptyCols = '<td></td>'.repeat(7);

    let targetJobRow = '';
    if (gameState.player.targetJob) {
        const targetJob = jobsData.find(j => j.id === gameState.player.targetJob);
        if (targetJob) {
            const targetCells = abilityKeys.map(k => `<td>${targetJob.abilities[k] || ''}</td>`).join('');
            targetJobRow = `
            <tr class="shop2-target-stats">
                <td class="shop2-stats-label">目標の職業：${targetJob.name}</td>
                ${targetCells}${emptyCols}
            </tr>`;
        }
    }

    let html = `
        <tr class="shop2-user-stats">
            <td class="shop2-stats-label">現在の能力値</td>
            ${abilityCells}${emptyCols}
        </tr>
        ${targetJobRow}
    `;

    genres.forEach(genre => {
        if (shop2ActiveTab === 'all') {
            html += `<tr class="separator-row"><td colspan="22">${genre.name}</td></tr>`;
        }
        genre.items.forEach(({ item, idx }) => {
            const isChecked = shop2CartItems.some(c => c.idx === idx);
            const alreadyOwned = !item.consumable && gameState.player.possessions.some(p => p.name === item.name);
            const stockVal = item.stock !== undefined ? item.stock : (item.consumable ? '∞' : (alreadyOwned ? '0' : '1'));
            const isDisabled = (!item.consumable && alreadyOwned) || (item.stock !== undefined && item.stock <= 0);

            html += `
            <tr>
                <td class="shop2-item-name"><label><input type="checkbox" class="shop2-checkbox" data-index="${idx}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}> ${item.name}</label></td>
                <td>${item.stats?.国語 || ''}</td>
                <td>${item.stats?.数学 || ''}</td>
                <td>${item.stats?.理科 || ''}</td>
                <td>${item.stats?.社会 || ''}</td>
                <td>${item.stats?.英語 || ''}</td>
                <td>${item.stats?.音楽 || ''}</td>
                <td>${item.stats?.美術 || ''}</td>
                <td>${item.stats?.体力 || ''}</td>
                <td>${item.stats?.気力 || ''}</td>
                <td>${item.stats?.ルックス || ''}</td>
                <td>${item.stats?.素早さ || ''}</td>
                <td>${item.stats?.面白さ || ''}</td>
                <td>${item.stats?.優しさ || ''}</td>
                <td>${item.stats?.エロさ || ''}</td>
                <td>${item.bodyConsume || ''}</td>
                <td>${item.brainConsume || ''}</td>
                <td>${item.useCount ? item.useCount + '回' : ''}</td>
                <td>${item.cooldown && item.cooldown !== '0分' ? item.cooldown : ''}</td>
                <td>${item.description ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${item.description}</span></span>` : ''}</td>
                <td class="shop2-price">${item.price.toLocaleString()}円</td>
                <td>${stockVal}</td>
            </tr>`;
        });
    });

    tbody.innerHTML = html;

    // チェックボックスイベント設定
    document.querySelectorAll('.shop2-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
            shop2ToggleItem(parseInt(e.target.dataset.index), e.target.checked);
        });
    });

    // 備考ツールチップ設定
    document.querySelectorAll('#shop2TableBody .shop2-desc-symbol').forEach(symbol => {
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

    // ソートインジケーター更新
    updateShop2SortIndicators();

    // stickyヘッダーのtop値を設定
    requestAnimationFrame(() => {
        const table = document.getElementById('shop2Table');
        if (!table) return;
        const headerRows = table.querySelectorAll('thead tr');
        if (headerRows.length >= 2) {
            const firstRowH = headerRows[0].offsetHeight;
            const secondRowH = headerRows[1].offsetHeight;
            headerRows[1].querySelectorAll('th').forEach(th => {
                th.style.top = '31px';
            });
            const totalHeaderH = firstRowH + secondRowH;
            const userRow = table.querySelector('.shop2-user-stats');
            if (userRow) {
                userRow.style.top = '61px';
                const targetRow = table.querySelector('.shop2-target-stats');
                if (targetRow) {
                    targetRow.style.top = '88px';
                }
            }
        }
    });
}

function updateShop2SortIndicators() {
    document.querySelectorAll('#shop2Table .sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.col === shop2SortCol) {
            th.classList.add(shop2SortDir === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });
}

function shop2ToggleItem(idx, checked) {
    const item = shopItems[idx];
    if (!item || item.type === 'separator') return;
    if (checked) {
        if (!shop2CartItems.some(c => c.idx === idx)) {
            shop2CartItems.push({ idx, item });
        }
    } else {
        shop2CartItems = shop2CartItems.filter(c => c.idx !== idx);
    }
    updateShop2Cart();
}

function updateShop2Cart() {
    const cartDiv = document.getElementById('shop2CartItems');
    const totalEl = document.getElementById('shop2TotalPrice');
    const btn = document.getElementById('shop2PurchaseBtn');
    const insufficientEl = document.getElementById('shop2Insufficient');
    document.getElementById('shop2MoneyValue').textContent = gameState.player.money.toLocaleString() + '円';

    if (shop2CartItems.length === 0) {
        cartDiv.innerHTML = '<p class="shop2-cart-empty">アイテムを選んでください</p>';
        totalEl.textContent = '0円';
        btn.disabled = true;
        btn.classList.remove('active');
        insufficientEl.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;
    shop2CartItems.forEach(({ item }) => {
        html += `
        <div class="shop2-cart-item">
            <span class="shop2-cart-name">${item.name}</span>
            <span class="shop2-cart-price">${item.price.toLocaleString()}円</span>
        </div>`;
        total += item.price;
    });

    cartDiv.innerHTML = html;
    totalEl.textContent = total.toLocaleString() + '円';

    const hasEnough = gameState.player.money >= total;
    btn.disabled = !hasEnough;
    btn.classList.toggle('active', hasEnough);
    insufficientEl.style.display = hasEnough ? 'none' : '';
}

function purchaseShop2() {
    if (shop2CartItems.length === 0) return;
    const totalPrice = shop2CartItems.reduce((sum, { item }) => sum + item.price, 0);
    if (gameState.player.money < totalPrice) return;

    changeMoney(-totalPrice);

    shop2CartItems.forEach(({ item }) => {
        if (item.consumable) {
            const existing = gameState.player.possessions.find(p => p.name === item.name);
            if (existing) {
                existing.remainingUses += (item.useCount || 1);
                return;
            }
        } else {
            if (gameState.player.possessions.some(p => p.name === item.name)) return;
        }
        gameState.player.possessions.push({
            name: item.name,
            consumable: item.consumable,
            price: item.price,
            description: item.description,
            effect: item.effect,
            stats: item.stats || {},
            calorie: item.calorie,
            useCount: item.useCount,
            remainingUses: item.useCount || 1,
            cooldown: item.cooldown,
            bodyConsume: item.bodyConsume,
            brainConsume: item.brainConsume,
            purchaseDate: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
        });
    });

    // 購入完了ビュー表示
    document.getElementById('shop2ListView').style.display = 'none';
    document.getElementById('shop2CompleteView').style.display = '';
    document.getElementById('shop2Modal').classList.add('shop2-complete-mode');

    gameState.pendingRandomEvent = true;
    updateStatus();
}

// ============================================
// 温泉コンビニ機能
// ============================================

function getTodayStr() {
    return new Date().toLocaleDateString('ja-JP');
}

function getOnsenShopPurchased() {
    if (gameState.onsenShopPurchaseDate !== getTodayStr()) {
        gameState.onsenShopPurchaseDate = getTodayStr();
        gameState.onsenShopPurchased = [];
    }
    return gameState.onsenShopPurchased;
}

function openOnsenShop() {
    document.getElementById('onsenLobbyView').style.display = 'none';
    document.getElementById('onsenBathView').style.display = 'none';
    document.getElementById('onsenShopView').style.display = '';
    document.getElementById('onsenShopCompleteView').style.display = 'none';
    document.getElementById('onsenLobbyCloseBtn').style.display = 'none';
    const mc = document.querySelector('#onsenModal .modal-content');
    mc.classList.remove('onsen-lobby-mode');
    mc.classList.add('onsen-shop-mode');
    renderOnsenShop();
    document.getElementById('onsenModal').classList.add('active');
}

function closeOnsenShop() {
    document.getElementById('onsenModal').classList.remove('active');
}

function closeOnsenShopAndOpenInventory() {
    closeOnsenShop();
    openInventoryModal();
}

function renderOnsenShop() {
    document.getElementById('onsenShopMoney').textContent = `${gameState.player.money.toLocaleString()}円`;

    const tbody = document.getElementById('onsenShopTableBody');
    const purchased = getOnsenShopPurchased();

    let html = '';
    onsenShopItems.forEach((item, index) => {
        if (item.type === 'separator') {
            html += `<tr class="separator-row"><td colspan="7">${item.name}</td></tr>`;
            return;
        }

        const alreadyBought = purchased.includes(item.name);
        const isDisabled = alreadyBought;
        const stockText = alreadyBought ? '購入済み' : '1日1つまで';
        const descCell = item.description
            ? `<span class="shop2-desc-wrapper"><span class="shop2-desc-symbol">ⓘ</span><span class="shop2-desc-tooltip">${item.description}</span></span>`
            : '';

        html += `
            <tr class="${isDisabled ? 'onsen-shop-sold' : ''}">
                <td class="shop2-item-name">
                    <label>
                        <input type="checkbox" class="onsen-shop-checkbox shop2-checkbox"
                            data-index="${index}" ${isDisabled ? 'disabled' : ''}>
                        ${item.name}
                    </label>
                </td>
                <td>${item.maxHpUp || ''}</td>
                <td>${item.maxIntUp || ''}</td>
                <td>${item.calorie ? item.calorie + 'kcal' : ''}</td>
                <td>${descCell}</td>
                <td class="shop2-price">${item.price.toLocaleString()}円</td>
                <td>${stockText}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // 備考ツールチップ設定
    document.querySelectorAll('#onsenShopTableBody .shop2-desc-symbol').forEach(symbol => {
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

    // チェックボックスにカート更新イベントを設定
    document.querySelectorAll('.onsen-shop-checkbox').forEach(cb => {
        cb.addEventListener('change', updateOnsenShopCart);
    });
    updateOnsenShopCart();
}

function updateOnsenShopCart() {
    const checked = document.querySelectorAll('.onsen-shop-checkbox:checked');
    const cartItemsEl = document.getElementById('onsenShopCartItems');
    const totalPriceEl = document.getElementById('onsenShopTotalPrice');
    const warnEl = document.getElementById('onsenShopWarn');
    const orderBtn = document.getElementById('onsenShopOrderBtn');

    let total = 0;
    let html = '';

    if (checked.length === 0) {
        html = '<p class="shop2-cart-empty">商品を選んでください</p>';
    } else {
        checked.forEach(cb => {
            const item = onsenShopItems[parseInt(cb.dataset.index)];
            if (!item) return;
            total += item.price;
            html += `<div class="shop2-cart-item"><span class="shop2-cart-name">${item.name}</span><span class="shop2-cart-price">${item.price.toLocaleString()}円</span></div>`;
        });
    }

    cartItemsEl.innerHTML = html;
    totalPriceEl.textContent = `${total.toLocaleString()}円`;

    const canAfford = total <= gameState.player.money;
    warnEl.style.display = (checked.length > 0 && !canAfford) ? '' : 'none';

    const canBuy = checked.length > 0 && canAfford;
    orderBtn.disabled = !canBuy;
    orderBtn.classList.toggle('active', canBuy);
}

function purchaseOnsenShop() {
    const checkboxes = document.querySelectorAll('.onsen-shop-checkbox:checked');
    if (checkboxes.length === 0) return;

    const selectedItems = [];
    let totalPrice = 0;

    checkboxes.forEach(cb => {
        const index = parseInt(cb.dataset.index);
        const item = onsenShopItems[index];
        if (item && !item.type) {
            selectedItems.push(item);
            totalPrice += item.price;
        }
    });

    if (gameState.player.money < totalPrice) {
        showToast('所持金が足りません');
        return;
    }

    // お金を減らす
    changeMoney(-totalPrice);

    // 購入記録 & 所持品に追加
    const purchased = getOnsenShopPurchased();
    selectedItems.forEach(item => {
        purchased.push(item.name);

        // 所持品に追加
        gameState.player.possessions.push({
            name: item.name,
            consumable: true,
            price: item.price,
            description: item.description,
            effect: {},
            stats: {},
            calorie: item.calorie || 0,
            useCount: 1,
            remainingUses: 1,
            maxHpUp: item.maxHpUp || 0,
            maxIntUp: item.maxIntUp || 0,
            purchaseDate: new Date().toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
        });
    });

    // 完了画面
    const contentEl = document.getElementById('onsenShopCompleteContent');
    contentEl.innerHTML = `
        <p class="shop2-complete-heading">お買い上げありがとうございます！</p>
        <p class="shop2-complete-subheading">またお越しくださいませ。</p>
    `;

    document.getElementById('onsenShopView').style.display = 'none';
    document.getElementById('onsenShopCompleteView').style.display = 'flex';

    updateStatus();
}

