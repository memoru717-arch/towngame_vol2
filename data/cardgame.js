// ============================================
// のんびりタウン - カードゲーム
// ============================================

function openCardGameModal() {
    const cg = gameState.cardGame;
    // 初回は前のカードをランダムに設定
    if (cg.lastCard === null) {
        cg.lastCard = Math.floor(Math.random() * 7) + 1;
    }
    renderCardGame();
    document.getElementById('cardGameModal').classList.add('active');
}

function closeCardGameModal() {
    document.getElementById('cardGameModal').classList.remove('active');
}

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function hasDrawnToday() {
    return gameState.cardGame.lastDrawDate === todayStr();
}

function renderCardGame() {
    const cg = gameState.cardGame;

    // テーブルのカード表示
    const tableEl = document.getElementById('cardgameTable');
    if (cg.tableCards.length === 0) {
        tableEl.innerHTML = '<span class="cardgame-empty-msg">まだカードはありません</span>';
    } else {
        tableEl.innerHTML = cg.tableCards.map(n =>
            `<div class="cardgame-card">${n}</div>`
        ).join('');
    }

    // 前の人のカード
    document.getElementById('cardgamePrevCard').textContent = cg.lastCard;

    // 賭け金の目安 / 今日引き済みメッセージ
    const chainLen = cg.tableCards.length;
    const nextWin = (chainLen + 1) * 10000;
    const nextLose = Math.max(chainLen, 1) * 10000;
    const stakeEl = document.getElementById('cardgameStake');
    const drawBtn = document.getElementById('cardgameDrawBtn');

    if (hasDrawnToday()) {
        stakeEl.textContent = '本日はすでに引きました。また明日どうぞ！';
        drawBtn.disabled = true;
    } else {
        stakeEl.textContent = `成功: +${nextWin.toLocaleString()}円 ／ 失敗: -${nextLose.toLocaleString()}円`;
        drawBtn.disabled = false;
    }

    // 結果を非表示
    document.getElementById('cardgameResult').style.display = 'none';

    // 履歴を更新
    renderCardGameHistory();
}

function drawCard() {
    const cg = gameState.cardGame;

    if (hasDrawnToday()) {
        showToast('本日はすでにカードを引きました。また明日どうぞ！');
        return;
    }

    const drawn = Math.floor(Math.random() * 7) + 1;
    const prevCard = cg.lastCard;
    const chainLen = cg.tableCards.length;
    const resultEl = document.getElementById('cardgameResult');

    if (drawn !== prevCard) {
        // 成功
        const reward = (chainLen + 1) * 10000;
        changeMoney(reward);
        cg.tableCards.push(drawn);
        cg.lastCard = drawn;

        const text = `${gameState.player.name}さんが${reward / 10000}万円をゲットしました。`;
        cg.history.push({ win: true, text });
        if (cg.history.length > 20) cg.history.shift();

        resultEl.className = 'cardgame-result cardgame-result-win';
        resultEl.innerHTML = `カード「${drawn}」！<br>前のカード「${prevCard}」と違います！<br><strong>+${reward.toLocaleString()}円 ゲット！</strong>`;
    } else {
        // 失敗
        const penalty = Math.max(chainLen, 1) * 10000;
        changeMoney(-penalty);
        cg.tableCards = [];
        cg.lastCard = Math.floor(Math.random() * 7) + 1;

        const text = `${gameState.player.name}さんが${penalty / 10000}万円を支払いました。`;
        cg.history.push({ win: false, text });
        if (cg.history.length > 20) cg.history.shift();

        resultEl.className = 'cardgame-result cardgame-result-lose';
        resultEl.innerHTML = `カード「${drawn}」！<br>前のカード「${prevCard}」と同じです...<br><strong>-${penalty.toLocaleString()}円 テーブルリセット！</strong>`;
    }

    cg.lastDrawDate = todayStr();
    renderCardGame();
    resultEl.style.display = 'block';
    updateStatus();
}

function renderCardGameHistory() {
    const historyEl = document.getElementById('cardgameHistory');
    const cg = gameState.cardGame;

    if (cg.history.length === 0) {
        historyEl.innerHTML = '<span class="cardgame-empty-msg">まだゲーム履歴はありません</span>';
        return;
    }
    historyEl.innerHTML = cg.history.slice().reverse().map(h =>
        `<div class="${h.win ? 'cardgame-history-win' : 'cardgame-history-lose'}">${h.text}</div>`
    ).join('');
}
