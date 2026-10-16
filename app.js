/**
 * app.js - CS:GO Romantic Couple Gacha Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // Preset Avatars Generator (SVG DataURI for crisp, reliable avatars)
  // -------------------------------------------------------------
  function generateAvatarSvg(name, bg1, bg2, emoji) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    let initials = 'AV';
    if (words.length >= 2) {
      const firstChar = Array.from(words[0])[0] || '';
      const lastChar = Array.from(words[words.length - 1])[0] || '';
      initials = firstChar + lastChar;
    } else if (words.length === 1) {
      initials = Array.from(words[0]).slice(0, 2).join('');
    }
    // Keep letters and numbers only for initials text
    initials = initials.replace(/[^\p{L}\p{N}]/gu, '').toUpperCase() || '✨';
    const gradId = 'g_' + Math.random().toString(36).substring(2, 9);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bg1}" />
            <stop offset="100%" stop-color="${bg2}" />
          </linearGradient>
        </defs>
        <rect width="160" height="160" rx="30" fill="url(#${gradId})" />
        <circle cx="80" cy="72" r="42" fill="rgba(255,255,255,0.18)" />
        <text x="80" y="80" font-family="'Be Vietnam Pro', sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        <text x="80" y="136" font-family="'Be Vietnam Pro', sans-serif" font-size="14" font-weight="800" fill="rgba(255,255,255,0.9)" text-anchor="middle">${initials}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Initial Sample Candidates
  const defaultMaleCandidates = [
    { name: 'Nguyễn Trọng Linh', avatar: generateAvatarSvg('Nguyễn Trọng Linh', '#0072ff', '#00c6ff', '👑') },
    { name: 'Trần Quang Hải', avatar: generateAvatarSvg('Trần Quang Hải', '#11998e', '#38ef7d', '🎸') },
    { name: 'Lê Hoàng Nam', avatar: generateAvatarSvg('Lê Hoàng Nam', '#8a2387', '#e94057', '🚀') },
    { name: 'Vũ Đức Thắng', avatar: generateAvatarSvg('Vũ Đức Thắng', '#2193b0', '#6dd5ed', '⚡') },
    { name: 'Phạm Minh Tuấn', avatar: generateAvatarSvg('Phạm Minh Tuấn', '#fc4a1a', '#f7b733', '🎯') },
    { name: 'Đặng Thanh Tùng', avatar: generateAvatarSvg('Đặng Thanh Tùng', '#4568dc', '#b06ab3', '🎧') },
    { name: 'Hoàng Quốc Bảo', avatar: generateAvatarSvg('Hoàng Quốc Bảo', '#43cea2', '#185a9d', '⚽') },
    { name: 'Ngô Gia Huy', avatar: generateAvatarSvg('Ngô Gia Huy', '#5f2c82', '#49a09d', '🎮') }
  ];

  const defaultFemaleCandidates = [
    { name: 'Nguyễn Thùy Tiên', avatar: generateAvatarSvg('Nguyễn Thùy Tiên', '#f857a6', '#ff5858', '🌸') },
    { name: 'Trần Khánh Linh', avatar: generateAvatarSvg('Trần Khánh Linh', '#ff758c', '#ff7eb3', '✨') },
    { name: 'Lê Mai Phương', avatar: generateAvatarSvg('Lê Mai Phương', '#ff9a9e', '#fecfef', '🎀') },
    { name: 'Đỗ Thu Hà', avatar: generateAvatarSvg('Đỗ Thu Hà', '#fa709a', '#fee140', '🐱') },
    { name: 'Bùi Lan Anh', avatar: generateAvatarSvg('Bùi Lan Anh', '#a18cd1', '#fbc2eb', '🌷') },
    { name: 'Phan Cẩm Tú', avatar: generateAvatarSvg('Phan Cẩm Tú', '#f093fb', '#f5576c', '💎') },
    { name: 'Trương Mỹ Duyên', avatar: generateAvatarSvg('Trương Mỹ Duyên', '#ff0844', '#ffb199', '🌹') },
    { name: 'Hồ Diệu My', avatar: generateAvatarSvg('Hồ Diệu My', '#b224ef', '#7579ff', '🦋') }
  ];

  // Romantic Quotes
  const romanticQuotes = [
    '"Duyên do trời định, phận do người tạo. Chúc mừng hai bạn đã tìm thấy nhau!"',
    '"Trời sinh một cặp, trăm năm hòa hợp, duyên thắm tình nồng!"',
    '"Gặp gỡ là duyên, đồng hành là nợ. Hãy cùng nhau viết nên chuyện tình đẹp nhé!"',
    '"Chỉ số tương thích đạt đỉnh cao 99.9%! Một kết nối định mệnh hoàn hảo!"',
    '"Vượt qua hàng ngàn cơ hội gacha, ánh mắt đã dừng lại ở người ấy!"'
  ];

  // App State
  let maleList = [];
  let femaleList = [];
  let matchHistory = [];
  let currentActiveManageGender = 'male';
  let tempAvatarData = '';
  let versionClickCount = 0;
  let versionClickTimer = null;

  // Rigging Configuration
  const rigConfig = {
    targetMale: 'Nguyễn Trọng Linh',
    targetFemale: '',
    probability: 0.99, // 99% probability as requested
    active: true,
    forceWinNext: false
  };

  // Initialize Dual Gacha Tracks
  const trackMale = new GachaRollerTrack({
    viewportId: 'viewportMale',
    stripId: 'stripMale',
    gender: 'male'
  });

  const trackFemale = new GachaRollerTrack({
    viewportId: 'viewportFemale',
    stripId: 'stripFemale',
    gender: 'female'
  });

  // DOM Elements
  const btnSpin = document.getElementById('btnSpin');
  const maleCountBadge = document.getElementById('maleCountBadge');
  const femaleCountBadge = document.getElementById('femaleCountBadge');
  const recentMatchesList = document.getElementById('recentMatchesList');

  // Modals
  const romanticModal = document.getElementById('romanticModal');
  const revealMaleAvatar = document.getElementById('revealMaleAvatar');
  const revealMaleName = document.getElementById('revealMaleName');
  const revealFemaleAvatar = document.getElementById('revealFemaleAvatar');
  const revealFemaleName = document.getElementById('revealFemaleName');
  const matchRatePercent = document.getElementById('matchRatePercent');
  const romanticQuote = document.getElementById('romanticQuote');
  const btnCloseRomantic = document.getElementById('btnCloseRomantic');
  const btnSpinAgain = document.getElementById('btnSpinAgain');

  const manageModal = document.getElementById('manageModal');
  const btnManagePeople = document.getElementById('btnManagePeople');
  const btnCloseManage = document.getElementById('btnCloseManage');
  const btnSaveManage = document.getElementById('btnSaveManage');
  const tabManageMale = document.getElementById('tabManageMale');
  const tabManageFemale = document.getElementById('tabManageFemale');
  const manageMaleBadge = document.getElementById('manageMaleBadge');
  const manageFemaleBadge = document.getElementById('manageFemaleBadge');
  const avatarUploadArea = document.getElementById('avatarUploadArea');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const avatarPreviewImg = document.getElementById('avatarPreviewImg');
  const inputPersonName = document.getElementById('inputPersonName');
  const inputPersonAvatarUrl = document.getElementById('inputPersonAvatarUrl');
  const btnAddPerson = document.getElementById('btnAddPerson');
  const membersGridContainer = document.getElementById('membersGridContainer');
  const btnClearCurrentList = document.getElementById('btnClearCurrentList');
  const presetAvatarChips = document.getElementById('presetAvatarChips');

  // Secret Modal Elements
  const secretModal = document.getElementById('secretModal');
  const versionSecretTrigger = document.getElementById('versionSecretTrigger');
  const btnCloseSecret = document.getElementById('btnCloseSecret');
  const btnSaveSecret = document.getElementById('btnSaveSecret');
  const secretTargetMale = document.getElementById('secretTargetMale');
  const secretProbability = document.getElementById('secretProbability');
  const secretProbabilityVal = document.getElementById('secretProbabilityVal');
  const secretTargetFemale = document.getElementById('secretTargetFemale');
  const secretActiveToggle = document.getElementById('secretActiveToggle');
  const btnForceWinNext = document.getElementById('btnForceWinNext');

  // Top Nav Buttons
  const btnSoundToggle = document.getElementById('btnSoundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnResetDefault = document.getElementById('btnResetDefault');

  // -------------------------------------------------------------
  // State Initialization & Persistence
  // -------------------------------------------------------------
  function loadSavedData() {
    // Load candidates
    const savedMale = localStorage.getItem('gacha_male_candidates');
    const savedFemale = localStorage.getItem('gacha_female_candidates');
    maleList = savedMale ? JSON.parse(savedMale) : [...defaultMaleCandidates];
    femaleList = savedFemale ? JSON.parse(savedFemale) : [...defaultFemaleCandidates];

    // Load rig config
    const savedRigTarget = localStorage.getItem('gacha_rig_target_male');
    const savedRigProb = localStorage.getItem('gacha_rig_prob');
    const savedRigActive = localStorage.getItem('gacha_rig_active');
    const savedRigFemale = localStorage.getItem('gacha_rig_target_female');

    if (savedRigTarget) rigConfig.targetMale = savedRigTarget;
    if (savedRigProb) rigConfig.probability = parseFloat(savedRigProb);
    if (savedRigActive !== null) rigConfig.active = savedRigActive === 'true';
    if (savedRigFemale) rigConfig.targetFemale = savedRigFemale;

    // URL Query Params Override
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('target')) rigConfig.targetMale = urlParams.get('target');
      if (urlParams.has('rate')) {
        const r = parseFloat(urlParams.get('rate'));
        if (!isNaN(r)) rigConfig.probability = r > 1 ? r / 100 : r;
      }
      if (urlParams.has('rig')) rigConfig.active = urlParams.get('rig') !== 'false';
    } catch (e) {}

    updateCandidateViews();
  }

  function saveCandidates() {
    localStorage.setItem('gacha_male_candidates', JSON.stringify(maleList));
    localStorage.setItem('gacha_female_candidates', JSON.stringify(femaleList));
    updateCandidateViews();
  }

  function updateCandidateViews() {
    maleCountBadge.textContent = maleList.length;
    femaleCountBadge.textContent = femaleList.length;
    manageMaleBadge.textContent = maleList.length;
    manageFemaleBadge.textContent = femaleList.length;

    trackMale.setCandidates(maleList);
    trackFemale.setCandidates(femaleList);
  }

  loadSavedData();

  // -------------------------------------------------------------
  // Gacha Selection & Rigging Logic (99% for Nguyễn Trọng Linh)
  // -------------------------------------------------------------
  function normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function pickMaleWinner() {
    if (maleList.length === 0) return null;

    const targetNorm = normalizeText(rigConfig.targetMale);
    const targetCandidates = maleList.filter(m => normalizeText(m.name).includes(targetNorm));

    let shouldRig = false;
    if (targetCandidates.length > 0) {
      if (rigConfig.forceWinNext) {
        shouldRig = true;
        rigConfig.forceWinNext = false;
      } else if (rigConfig.active && Math.random() < rigConfig.probability) {
        shouldRig = true; // 99% probability
      }
    }

    if (shouldRig) {
      console.log(`[Rigged Male Winner] Selected "${rigConfig.targetMale}"`);
      return targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
    }

    // 1% random roll
    return maleList[Math.floor(Math.random() * maleList.length)];
  }

  function pickFemaleWinner() {
    if (femaleList.length === 0) return null;

    if (rigConfig.targetFemale && rigConfig.targetFemale.trim().length > 0) {
      const targetNorm = normalizeText(rigConfig.targetFemale);
      const matches = femaleList.filter(f => normalizeText(f.name).includes(targetNorm));
      if (matches.length > 0) {
        return matches[Math.floor(Math.random() * matches.length)];
      }
    }

    // Truly random female
    return femaleList[Math.floor(Math.random() * femaleList.length)];
  }

  // -------------------------------------------------------------
  // Spin Trigger & Coordination
  // -------------------------------------------------------------
  let isSpinning = false;
  let maleFinished = null;
  let femaleFinished = null;

  function triggerSpin() {
    if (isSpinning) return;
    if (maleList.length === 0 || femaleList.length === 0) {
      alert('Vui lòng thêm ít nhất một bạn Nam và một bạn Nữ trong mục "Quản Lý Thành Viên"!');
      return;
    }

    isSpinning = true;
    btnSpin.disabled = true;
    maleFinished = null;
    femaleFinished = null;

    // Pick winners
    const chosenMale = pickMaleWinner();
    const chosenFemale = pickFemaleWinner();

    // Start audio
    if (window.gachaAudio) {
      window.gachaAudio.playWhoosh();
    }

    // Jitter inside the card (+/- 30% of card width for natural realism)
    const jitterMale = (Math.random() - 0.5) * 60;
    const jitterFemale = (Math.random() - 0.5) * 60;

    // Start both tracks
    trackMale.onComplete = (winner) => {
      maleFinished = winner;
      checkBothComplete();
    };

    trackFemale.onComplete = (winner) => {
      femaleFinished = winner;
      checkBothComplete();
    };

    trackMale.startRoll(chosenMale, jitterMale);
    trackFemale.startRoll(chosenFemale, jitterFemale);
  }

  function checkBothComplete() {
    if (maleFinished && femaleFinished) {
      isSpinning = false;
      btnSpin.disabled = false;
      onCoupleMatched(maleFinished, femaleFinished);
    }
  }

  function onCoupleMatched(male, female) {
    // Record match history
    matchHistory.unshift({ male: male.name, female: female.name });
    renderHistory();

    // Sound & Particles
    if (window.gachaAudio) window.gachaAudio.playRomanticChime();
    if (window.romanticParticles) window.romanticParticles.burst();

    // Populate Modal
    revealMaleAvatar.src = male.avatar;
    revealMaleName.textContent = male.name;
    revealFemaleAvatar.src = female.avatar;
    revealFemaleName.textContent = female.name;

    // Generate cute match percentage
    const matchScore = (98.5 + Math.random() * 1.4).toFixed(1);
    matchRatePercent.textContent = `${matchScore}%`;

    // Random romantic quote
    romanticQuote.textContent = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];

    // Show Romantic Modal
    romanticModal.classList.add('active');
    romanticModal.setAttribute('aria-hidden', 'false');
  }

  function renderHistory() {
    if (matchHistory.length === 0) {
      recentMatchesList.innerHTML = '<span class="no-match-text">Chưa có lượt quay nào.</span>';
      return;
    }

    recentMatchesList.innerHTML = matchHistory.slice(0, 5).map(m => `
      <div class="match-history-pill">
        <span class="name-male">${escapeHtml(m.male)}</span>
        <span>❤️</span>
        <span class="name-female">${escapeHtml(m.female)}</span>
      </div>
    `).join('');
  }

  btnSpin.addEventListener('click', triggerSpin);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      triggerSpin();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerSpin();
    }
    // Secret Rig modal: Ctrl + Shift + L
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      openSecretModal();
    }
  });

  // Modal actions
  btnCloseRomantic.addEventListener('click', () => {
    romanticModal.classList.remove('active');
    romanticModal.setAttribute('aria-hidden', 'true');
    if (window.romanticParticles) window.romanticParticles.stop();
  });

  btnSpinAgain.addEventListener('click', () => {
    romanticModal.classList.remove('active');
    romanticModal.setAttribute('aria-hidden', 'true');
    if (window.romanticParticles) window.romanticParticles.stop();
    setTimeout(triggerSpin, 300);
  });

  romanticModal.addEventListener('click', (e) => {
    if (e.target === romanticModal) {
      romanticModal.classList.remove('active');
      romanticModal.setAttribute('aria-hidden', 'true');
      if (window.romanticParticles) window.romanticParticles.stop();
    }
  });

  // -------------------------------------------------------------
  // Member Management Modal (Name & Avatar Upload)
  // -------------------------------------------------------------
  function setupPresetChips() {
    const emojis = currentActiveManageGender === 'male'
      ? ['👑', '🚀', '🎸', '⚡', '🎯', '🎧']
      : ['🌸', '✨', '🎀', '🐱', '🌷', '💎'];

    presetAvatarChips.innerHTML = '';
    emojis.forEach((emoji, idx) => {
      const img = document.createElement('img');
      img.className = 'preset-chip';
      const bg = currentActiveManageGender === 'male' ? ['#0072ff', '#00c6ff'] : ['#f857a6', '#ff5858'];
      img.src = generateAvatarSvg(`Icon ${idx + 1}`, bg[0], bg[1], emoji);
      img.addEventListener('click', () => {
        tempAvatarData = img.src;
        avatarPreviewImg.src = img.src;
      });
      presetAvatarChips.appendChild(img);
    });
  }

  function resetNewPersonForm() {
    inputPersonName.value = '';
    inputPersonAvatarUrl.value = '';
    const initialEmoji = currentActiveManageGender === 'male' ? '👑' : '🌸';
    const bg = currentActiveManageGender === 'male' ? ['#0072ff', '#00c6ff'] : ['#f857a6', '#ff5858'];
    tempAvatarData = generateAvatarSvg('Avatar Mẫu', bg[0], bg[1], initialEmoji);
    avatarPreviewImg.src = tempAvatarData;
    setupPresetChips();
  }

  function renderMembersGrid() {
    const list = currentActiveManageGender === 'male' ? maleList : femaleList;
    membersGridContainer.innerHTML = '';

    if (list.length === 0) {
      membersGridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-dim); padding:20px;">Chưa có thành viên nào. Hãy thêm thành viên bên trên!</div>';
      return;
    }

    list.forEach((person, idx) => {
      const card = document.createElement('div');
      card.className = 'member-item-card';
      card.innerHTML = `
        <img class="member-item-avatar" src="${person.avatar}" alt="${escapeHtml(person.name)}">
        <div class="member-item-info">
          <div class="member-item-name" title="${escapeHtml(person.name)}">${escapeHtml(person.name)}</div>
          <div style="font-size:11px; color:var(--text-dim);">${currentActiveManageGender === 'male' ? 'Bạn Nam' : 'Bạn Nữ'}</div>
        </div>
        <button class="member-delete-btn" title="Xóa">✕</button>
      `;

      card.querySelector('.member-delete-btn').addEventListener('click', () => {
        list.splice(idx, 1);
        saveCandidates();
        renderMembersGrid();
      });

      membersGridContainer.appendChild(card);
    });
  }

  btnManagePeople.addEventListener('click', () => {
    resetNewPersonForm();
    renderMembersGrid();
    manageModal.classList.add('active');
    manageModal.setAttribute('aria-hidden', 'false');
  });

  btnCloseManage.addEventListener('click', () => {
    manageModal.classList.remove('active');
    manageModal.setAttribute('aria-hidden', 'true');
  });

  btnSaveManage.addEventListener('click', () => {
    saveCandidates();
    manageModal.classList.remove('active');
    manageModal.setAttribute('aria-hidden', 'true');
  });

  tabManageMale.addEventListener('click', () => {
    currentActiveManageGender = 'male';
    tabManageMale.classList.add('active');
    tabManageFemale.classList.remove('active');
    resetNewPersonForm();
    renderMembersGrid();
  });

  tabManageFemale.addEventListener('click', () => {
    currentActiveManageGender = 'female';
    tabManageFemale.classList.add('active');
    tabManageMale.classList.remove('active');
    resetNewPersonForm();
    renderMembersGrid();
  });

  // Image Upload Handler
  avatarUploadArea.addEventListener('click', () => {
    avatarFileInput.click();
  });

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        tempAvatarData = event.target.result;
        avatarPreviewImg.src = tempAvatarData;
      };
      reader.readAsDataURL(file);
    }
  });

  inputPersonAvatarUrl.addEventListener('input', () => {
    const url = inputPersonAvatarUrl.value.trim();
    if (url) {
      tempAvatarData = url;
      avatarPreviewImg.src = url;
    }
  });

  // Add Person Action
  btnAddPerson.addEventListener('click', () => {
    const name = inputPersonName.value.trim();
    if (!name) {
      alert('Vui lòng nhập họ và tên của thành viên!');
      return;
    }

    const avatar = tempAvatarData || generateAvatarSvg(name, '#7c4dff', '#e040fb', '✨');
    const newPerson = { name, avatar };

    if (currentActiveManageGender === 'male') {
      maleList.push(newPerson);
    } else {
      femaleList.push(newPerson);
    }

    saveCandidates();
    resetNewPersonForm();
    renderMembersGrid();
  });

  btnClearCurrentList.addEventListener('click', () => {
    if (confirm(`Bạn có chắc muốn xóa tất cả danh sách ${currentActiveManageGender === 'male' ? 'Đàng Trai' : 'Đàng Gái'}?`)) {
      if (currentActiveManageGender === 'male') {
        maleList = [];
      } else {
        femaleList = [];
      }
      saveCandidates();
      renderMembersGrid();
    }
  });

  // -------------------------------------------------------------
  // Secret Rigging Modal
  // -------------------------------------------------------------
  function openSecretModal() {
    secretTargetMale.value = rigConfig.targetMale;
    secretProbability.value = Math.round(rigConfig.probability * 100);
    secretProbabilityVal.textContent = `${secretProbability.value}%`;
    secretTargetFemale.value = rigConfig.targetFemale || '';
    secretActiveToggle.checked = rigConfig.active;

    secretModal.classList.add('active');
    secretModal.setAttribute('aria-hidden', 'false');
  }

  versionSecretTrigger.addEventListener('click', () => {
    versionClickCount++;
    clearTimeout(versionClickTimer);
    versionClickTimer = setTimeout(() => { versionClickCount = 0; }, 800);
    if (versionClickCount >= 3) {
      versionClickCount = 0;
      openSecretModal();
    }
  });

  btnCloseSecret.addEventListener('click', () => {
    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
  });

  secretProbability.addEventListener('input', () => {
    secretProbabilityVal.textContent = `${secretProbability.value}%`;
  });

  btnSaveSecret.addEventListener('click', () => {
    rigConfig.targetMale = secretTargetMale.value.trim() || 'Nguyễn Trọng Linh';
    rigConfig.probability = parseInt(secretProbability.value, 10) / 100;
    rigConfig.targetFemale = secretTargetFemale.value.trim();
    rigConfig.active = secretActiveToggle.checked;

    localStorage.setItem('gacha_rig_target_male', rigConfig.targetMale);
    localStorage.setItem('gacha_rig_prob', rigConfig.probability.toString());
    localStorage.setItem('gacha_rig_active', rigConfig.active.toString());
    localStorage.setItem('gacha_rig_target_female', rigConfig.targetFemale);

    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
    showToast(`Đã cấu hình tỉ lệ ${secretProbability.value}% cho "${rigConfig.targetMale}"!`);
  });

  btnForceWinNext.addEventListener('click', () => {
    rigConfig.forceWinNext = true;
    rigConfig.targetMale = secretTargetMale.value.trim() || 'Nguyễn Trọng Linh';
    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
    showToast(`Lượt quay tiếp theo chắc chắn 100% trúng "${rigConfig.targetMale}"!`);
  });

  // -------------------------------------------------------------
  // Nav Utilities
  // -------------------------------------------------------------
  btnSoundToggle.addEventListener('click', () => {
    const isEnabled = gachaAudio.toggleSound();
    soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    showToast(isEnabled ? '🔊 Âm thanh đã bật' : '🔇 Âm thanh đã tắt');
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  btnResetDefault.addEventListener('click', () => {
    if (confirm('Khôi phục lại danh sách thành viên Nam & Nữ mẫu ban đầu?')) {
      maleList = [...defaultMaleCandidates];
      femaleList = [...defaultFemaleCandidates];
      saveCandidates();
      showToast('Đã khôi phục dữ liệu mẫu thành công!');
    }
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showToast(message) {
    const existing = document.getElementById('appToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'appToast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(28, 20, 54, 0.95)',
      color: '#ffffff',
      padding: '10px 22px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '700',
      border: '1px solid rgba(255, 64, 129, 0.4)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
      zIndex: '2000',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    });

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
});
