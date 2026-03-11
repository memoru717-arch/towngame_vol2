// ============================================
// のんびりタウン - ハローワーク機能
// ============================================
// 職業安定所
function openHelloworkModal() {
    const modal = document.getElementById('helloworkModal');

    // ビューをリセット（メイン画面を表示）
    document.querySelector('.hellowork-top').style.display = '';
    document.querySelector('.hellowork-bottom').style.display = '';
    document.querySelector('.hellowork-modal-content > .btn-close').style.display = '';
    document.querySelector('.hellowork-modal-content').classList.remove('complete-view');
    document.getElementById('helloworkCompleteView').style.display = 'none';
    document.querySelector('.hellowork-complete-details').style.display = '';

    // ユーザー名を反映
    document.getElementById('helloworkUserName').textContent = gameState.player.name;
    document.getElementById('helloworkTargetUserName').textContent = gameState.player.name;

    // 職業テーブルを生成（ユーザーの能力値行も含む）
    renderJobTable();

    // 就職可能な職業リストを更新
    updateAvailableJobs();

    // 目標職業の表示を更新
    updateTargetJobDropdown();
    renderTargetJobDisplay();

    modal.classList.add('active');
}

function closeHelloworkModal() {
    document.getElementById('helloworkModal').classList.remove('active');
    // ビューをリセット
    document.querySelector('.hellowork-top').style.display = '';
    document.querySelector('.hellowork-bottom').style.display = '';
    document.querySelector('.hellowork-modal-content > .btn-close').style.display = '';
    document.querySelector('.hellowork-modal-content').classList.remove('complete-view');
    document.getElementById('helloworkCompleteView').style.display = 'none';
    // 就職したときだけランダムイベント判定
    hideRandomEvent();
    if (gameState.pendingRandomEvent) {
        gameState.pendingRandomEvent = false;
        tryShowRandomEvent();
    }
}

// 職業テーブルを動的に生成
function renderJobTable() {
    const tbody = document.getElementById('helloworkTableBody');
    const abilities = gameState.player.abilities;
    const playerBmi = Math.round(gameState.player.weight / ((gameState.player.height / 100) ** 2) * 10) / 10;
    const playerGender = gameState.player.gender || null;
    // ユーザー能力値行を生成
    let userStatsRow = `
        <tr class="hellowork-user-stats">
            <td class="user-stats-label">現在の能力値</td>
            <td id="userStatKokugo">${abilities.国語}</td>
            <td id="userStatSugaku">${abilities.数学}</td>
            <td id="userStatRika">${abilities.理科}</td>
            <td id="userStatShakai">${abilities.社会}</td>
            <td id="userStatEigo">${abilities.英語}</td>
            <td id="userStatOngaku">${abilities.音楽}</td>
            <td id="userStatBijutsu">${abilities.美術}</td>
            <td id="userStatTairyoku">${abilities.体力}</td>
            <td id="userStatKiryoku">${abilities.気力}</td>
            <td id="userStatLooks">${abilities.ルックス}</td>
            <td id="userStatSubayasa">${abilities.素早さ}</td>
            <td id="userStatOmoshirosa">${abilities.面白さ}</td>
            <td id="userStatYasashisa">${abilities.優しさ}</td>
            <td id="userStatErosa">${abilities.エロさ}</td>
            <td id="userStatBMI">${playerBmi.toFixed(1)}</td>
            <td id="userStatGender">${playerGender || '-'}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `;

    // 職業行を生成
    let jobRows = '';
    let rowIndex = 0;
    jobsData.forEach(job => {
        const canApply = checkJobRequirements(job);
        const evenClass = rowIndex % 2 === 0 ? 'row-even' : '';
        const rowClass = (canApply ? 'job-available' : '') + (evenClass ? ' ' + evenClass : '');
        rowIndex++;

        // 能力値のセルを生成（必要値を表示、0の場合は'-'）
        const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
        let abilityCells = '';
        abilityKeys.forEach(key => {
            const required = job.abilities[key];
            const playerVal = abilities[key];
            const isMet = playerVal >= required;
            const cellClass = required > 0 ? (isMet ? 'stat-met' : 'stat-not-met') : '';
            abilityCells += `<td class="${cellClass}">${required > 0 ? required : '-'}</td>`;
        });

        // 条件セルを生成
        let bmiText = '-';
        if (job.conditions.bmi[0] > 0 || job.conditions.bmi[1] < 99) {
            if (job.conditions.bmi[1] >= 99) {
                bmiText = `${job.conditions.bmi[0]}以上`;
            } else if (job.conditions.bmi[0] <= 0) {
                bmiText = `${job.conditions.bmi[1]}以下`;
            } else {
                bmiText = `${job.conditions.bmi[0]}~${job.conditions.bmi[1]}`;
            }
        }
        const bmiMet = playerBmi >= job.conditions.bmi[0] && playerBmi <= job.conditions.bmi[1];
        const bmiClass = bmiText !== '-' ? (bmiMet ? 'stat-met' : 'stat-not-met') : '';

        const genderText = job.conditions.gender || '-';
        const genderMet = !job.conditions.gender || playerGender === job.conditions.gender;
        const genderClass = genderText !== '-' ? (genderMet ? 'stat-met' : 'stat-not-met') : '';

        // ボーナス表示（レベルアップ時）
        const bonusText = job.bonus > 0 ? `×${job.bonus}` : '-';

        const hasUpgrade = !!job.upgrade;
        const jobNameClass = hasUpgrade ? 'job-name job-upgradeable' : 'job-name';
        const jobNameText = job.name;
        const jobNameClick = hasUpgrade ? ` onclick="toggleUpgradeView('${job.id}')"` : '';

        // 通常表示の行
        jobRows += `
            <tr class="${rowClass}" id="job-row-${job.id}">
                <td class="${jobNameClass}"${jobNameClick}>${jobNameText}</td>
                ${abilityCells}
                <td class="${bmiClass}">${bmiText}</td>
                <td class="${genderClass}">${genderText}</td>
                <td>${Math.round((0.05 + job.bodyConsume * 0.01) * 1000)}kcal</td>
                <td class="salary">${job.salary.toLocaleString()}円</td>
                <td>${bonusText}</td>
                <td>${job.bodyConsume}</td>
                <td>${job.brainConsume}</td>
            </tr>
        `;

        // 上位職業表示の行（初期非表示）
        if (hasUpgrade) {
            let upgradeAbilityCells = '';
            abilityKeys.forEach(key => {
                const required = job.upgrade.abilities[key];
                const playerVal = abilities[key];
                const isMet = playerVal >= required;
                const cellClass = required > 0 ? (isMet ? 'stat-met' : 'stat-not-met') : '';
                upgradeAbilityCells += `<td class="${cellClass}">${required > 0 ? required : '-'}</td>`;
            });

            jobRows += `
            <tr class="upgrade-view${evenClass ? ' ' + evenClass : ''}" id="job-upgrade-${job.id}" style="display:none">
                <td class="job-name job-upgradeable job-upgrade-active" onclick="toggleUpgradeView('${job.id}')">▼ ${job.upgrade.name}</td>
                ${upgradeAbilityCells}
                <td class="${bmiClass}">${bmiText}</td>
                <td class="${genderClass}">${genderText}</td>
                <td>${Math.round((0.05 + job.upgrade.bodyConsume * 0.01) * 1000)}kcal</td>
                <td class="salary">${job.upgrade.salary.toLocaleString()}円</td>
                <td>×${job.upgrade.bonus}</td>
                <td>${job.upgrade.bodyConsume}</td>
                <td>${job.upgrade.brainConsume}</td>
            </tr>
            `;
        }
    });

    tbody.innerHTML = userStatsRow + jobRows;
}

// 上位職業の表示を切り替え（元の行 ⇔ 上位職業行）
function toggleUpgradeView(jobId) {
    const baseRow = document.getElementById('job-row-' + jobId);
    const upgradeRow = document.getElementById('job-upgrade-' + jobId);
    if (baseRow && upgradeRow) {
        const showingUpgrade = upgradeRow.style.display !== 'none';
        baseRow.style.display = showingUpgrade ? '' : 'none';
        upgradeRow.style.display = showingUpgrade ? 'none' : '';
    }
}

// 職業の必要条件を満たしているかチェック
function checkJobRequirements(job) {
    const abilities = gameState.player.abilities;
    const playerBmi = Math.round(gameState.player.weight / ((gameState.player.height / 100) ** 2) * 10) / 10;
    const playerGender = gameState.player.gender || null;

    // 能力値チェック
    const abilityKeys = ['国語', '数学', '理科', '社会', '英語', '音楽', '美術', '体力', '気力', 'ルックス', '素早さ', '面白さ', '優しさ', 'エロさ'];
    for (const key of abilityKeys) {
        if (abilities[key] < job.abilities[key]) {
            return false;
        }
    }

    // BMIチェック
    if (playerBmi < job.conditions.bmi[0] || playerBmi > job.conditions.bmi[1]) {
        return false;
    }

    // 性別チェック
    if (job.conditions.gender && playerGender !== job.conditions.gender) {
        return false;
    }

    return true;
}

function updateAvailableJobs() {
    const select = document.getElementById('helloworkJobSelect');
    select.innerHTML = '<option value="">-- 職業を選択 --</option>';

    // 就職可能な職業をフィルタリング
    const availableJobs = jobsData.filter(job => checkJobRequirements(job));

    availableJobs.forEach(job => {
        select.innerHTML += `<option value="${job.id}">${job.name}（給料: ${job.salary.toLocaleString()}円）</option>`;
    });

    // 就職可能な職業数を表示
    if (availableJobs.length === 0) {
        select.innerHTML = '<option value="">就職可能な職業がありません</option>';
    }
}

// 目標職業ドロップダウンを更新（全50職業）
function updateTargetJobDropdown() {
    const select = document.getElementById('targetJobSelect');
    select.innerHTML = '<option value="">-- 職業を選択 --</option>';

    for (let lv = 1; lv <= 5; lv++) {
        const levelJobs = jobsData.filter(j => j.level === lv);
        if (levelJobs.length === 0) continue;
        const optgroup = document.createElement('optgroup');
        optgroup.label = `Lv.${lv}`;
        levelJobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.name;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }
}

// 目標職業の表示を切り替え
function renderTargetJobDisplay() {
    const selectArea = document.getElementById('targetJobSelectArea');
    const display = document.getElementById('targetJobDisplay');
    const nameSpan = document.getElementById('targetJobName');

    if (gameState.player.targetJob) {
        const job = jobsData.find(j => j.id === gameState.player.targetJob);
        if (job) {
            nameSpan.textContent = job.name;
            selectArea.style.display = 'none';
            display.style.display = '';
        }
    } else {
        selectArea.style.display = '';
        display.style.display = 'none';
    }
}

// 目標職業を設定
function setTargetJob() {
    const select = document.getElementById('targetJobSelect');
    const jobId = select.value;
    if (!jobId) return;

    gameState.player.targetJob = jobId;
    renderTargetJobDisplay();
}

// 目標職業を解除
function removeTargetJob() {
    gameState.player.targetJob = null;
    renderTargetJobDisplay();
    updateTargetJobDropdown();
}

function applyForJob() {
    const select = document.getElementById('helloworkJobSelect');
    const jobId = select.value;

    if (!jobId) {
        return;
    }

    // 選択した職業を取得
    const job = jobsData.find(j => j.id === jobId);
    if (!job) {
        return;
    }

    // 同じ職業に就いている場合はエラー表示
    if (gameState.player.currentJobId === jobId) {
        document.querySelector('.hellowork-top').style.display = 'none';
        document.querySelector('.hellowork-bottom').style.display = 'none';
        document.querySelector('.hellowork-modal-content > .btn-close').style.display = 'none';
        document.querySelector('.hellowork-modal-content').classList.add('complete-view');
        const msgEl = document.querySelector('.hellowork-complete-message');
        msgEl.innerHTML = '<span class="error-text">ERROR！</span><br>もう既にその職業に就いています！';
        msgEl.classList.add('no-job');
        document.querySelector('.hellowork-complete-details').style.display = 'none';
        document.getElementById('helloworkCompleteView').style.display = 'flex';
        return;
    }

    // 就職処理
    gameState.pendingRandomEvent = true;
    gameState.player.job = job.name;
    gameState.player.jobLevel = 1;
    gameState.player.jobExp = 0;
    gameState.player.workCount = 0;
    gameState.player.currentJobId = job.id;

    // ステータス更新
    updateStatus();

    // 就職完了画面を表示
    document.querySelector('.hellowork-top').style.display = 'none';
    document.querySelector('.hellowork-bottom').style.display = 'none';
    document.querySelector('.hellowork-modal-content > .btn-close').style.display = 'none';
    document.querySelector('.hellowork-modal-content').classList.add('complete-view');
    const msgEl = document.querySelector('.hellowork-complete-message');
    msgEl.innerHTML = `おめでとうございます！<br><span id="helloworkCompleteJobName">${job.name}</span>になりました。`;
    msgEl.classList.remove('no-job');
    document.querySelector('.hellowork-complete-details').style.display = '';
    document.getElementById('helloworkCompleteSalary').textContent = job.salary.toLocaleString();
    document.getElementById('helloworkCompleteBonus').textContent = job.bonus;
    document.getElementById('helloworkCompleteView').style.display = 'flex';
}

