/**
 * app.js - Main Application Controller for Random Wheel
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const entriesTextarea = document.getElementById('entriesTextarea');
  const entriesCountBadge = document.getElementById('entriesCountBadge');
  const resultsCountBadge = document.getElementById('resultsCountBadge');
  const tabEntries = document.getElementById('tabEntries');
  const tabResults = document.getElementById('tabResults');
  const tabContentEntries = document.getElementById('tabContentEntries');
  const tabContentResults = document.getElementById('tabContentResults');
  const resultsListContainer = document.getElementById('resultsListContainer');
  const resultsSummaryText = document.getElementById('resultsSummaryText');
  const btnClearResults = document.getElementById('btnClearResults');
  
  const btnShuffle = document.getElementById('btnShuffle');
  const btnSort = document.getElementById('btnSort');
  const btnCollapseToggle = document.getElementById('btnCollapseToggle');
  const sidebarSection = document.getElementById('sidebarSection');
  const centerCta = document.getElementById('centerCta');
  const wheelCanvas = document.getElementById('wheelCanvas');

  // Nav Buttons
  const btnCustomize = document.getElementById('btnCustomize');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnMore = document.getElementById('btnMore');
  const moreDropdown = document.getElementById('moreDropdown');
  const menuSoundToggle = document.getElementById('menuSoundToggle');
  const menuReset = document.getElementById('menuReset');

  // Modals
  const winnerModal = document.getElementById('winnerModal');
  const winnerNameText = document.getElementById('winnerNameText');
  const btnCloseWinnerModal = document.getElementById('btnCloseWinnerModal');
  const btnRemoveWinnerModal = document.getElementById('btnRemoveWinnerModal');

  const customizeModal = document.getElementById('customizeModal');
  const btnCloseCustomize = document.getElementById('btnCloseCustomize');
  const btnSaveCustomize = document.getElementById('btnSaveCustomize');
  const spinDurationInput = document.getElementById('spinDuration');
  const spinDurationVal = document.getElementById('spinDurationVal');
  const soundToggle = document.getElementById('soundToggle');

  // Secret Modal & Triggers
  const versionSecretTrigger = document.getElementById('versionSecretTrigger');
  const secretModal = document.getElementById('secretModal');
  const btnCloseSecret = document.getElementById('btnCloseSecret');
  const btnSaveSecret = document.getElementById('btnSaveSecret');
  const secretTargetName = document.getElementById('secretTargetName');
  const secretProbability = document.getElementById('secretProbability');
  const secretProbabilityVal = document.getElementById('secretProbabilityVal');
  const secretActiveToggle = document.getElementById('secretActiveToggle');
  const btnForceWinNext = document.getElementById('btnForceWinNext');

  // Application State
  const resultsHistory = [];
  let currentWinningInfo = { name: '', index: -1 };
  let versionClickCount = 0;
  let versionClickTimer = null;

  // Initial Sample Entries with "Nguyễn Trọng Linh"
  const defaultEntries = [
    'Nguyễn Trọng Linh',
    'Trần Thị Mai',
    'Lê Hoàng Nam',
    'Phạm Minh Tuấn',
    'Nguyễn Trọng Linh',
    'Đỗ Thu Hà',
    'Vũ Đức Thắng',
    'Bùi Lan Anh',
    'Hoàng Quốc Bảo',
    'Nguyễn Trọng Linh',
    'Đặng Thanh Tùng',
    'Phan Cẩm Tú',
    'Ngô Gia Huy',
    'Dương Thùy Linh',
    'Nguyễn Trọng Linh',
    'Võ Thành Đạt',
    'Trương Mỹ Duyên',
    'Hồ Hải Đăng',
    'Nguyễn Trọng Linh',
    'Lý Quang Sáng'
  ];

  // Initialize Wheel Engine
  const wheel = new RandomWheel('wheelCanvas', {
    duration: 8000,
    soundEnabled: true,
    riggedTarget: 'Nguyễn Trọng Linh',
    rigProbability: 0.99, // 99% probability as requested!
    rigActive: true,
    palette: 'rainbow'
  });

  // Load configuration from URL Query Params, LocalStorage, or Server API
  async function loadAppConfig() {
    let target = 'Nguyễn Trọng Linh';
    let probability = 0.99;
    let rigActive = true;

    // 1. Load from localStorage if previously set
    const savedTarget = localStorage.getItem('rig_target');
    const savedProb = localStorage.getItem('rig_probability');
    const savedActive = localStorage.getItem('rig_active');
    if (savedTarget) target = savedTarget;
    if (savedProb) probability = parseFloat(savedProb);
    if (savedActive !== null) rigActive = savedActive === 'true';

    // 2. Fetch server config if available (Node server)
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const config = await res.json();
        if (config.targetName) target = config.targetName;
        if (typeof config.probability === 'number') {
          probability = config.probability > 1 ? config.probability / 100 : config.probability;
        }
        if (typeof config.rigActive === 'boolean') rigActive = config.rigActive;
        if (Array.isArray(config.defaultEntries) && config.defaultEntries.length > 0) {
          entriesTextarea.value = config.defaultEntries.join('\n');
          updateEntriesFromTextarea();
        }
      }
    } catch {
      // Running statically (e.g. GitHub Pages) - ignore
    }

    // 3. URL Query Params override (e.g. ?target=Nguyễn+Trọng+Linh&rate=99)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('target')) target = urlParams.get('target');
      if (urlParams.has('rate')) {
        const r = parseFloat(urlParams.get('rate'));
        if (!isNaN(r)) probability = r > 1 ? r / 100 : r;
      }
      if (urlParams.has('rig')) {
        rigActive = urlParams.get('rig') !== 'false' && urlParams.get('rig') !== '0';
      }
    } catch (e) {
      console.warn('URL parsing error', e);
    }

    // Apply to Wheel Engine
    wheel.options.riggedTarget = target;
    wheel.options.rigProbability = probability;
    wheel.options.rigActive = rigActive;

    // Update Secret Modal fields
    if (secretTargetName) secretTargetName.value = target;
    if (secretProbability) {
      secretProbability.value = Math.round(probability * 100);
      if (secretProbabilityVal) secretProbabilityVal.textContent = `${secretProbability.value}%`;
    }
    if (secretActiveToggle) secretActiveToggle.checked = rigActive;
  }

  // Populate Default Entries
  const savedEntries = localStorage.getItem('wheel_entries');
  if (savedEntries && savedEntries.trim().length > 0) {
    entriesTextarea.value = savedEntries;
  } else {
    entriesTextarea.value = defaultEntries.join('\n');
  }
  updateEntriesFromTextarea();
  loadAppConfig();


  // -------------------------------------------------------------
  // Textarea & Entries Management
  // -------------------------------------------------------------
  function getLinesFromTextarea() {
    return entriesTextarea.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  function updateEntriesFromTextarea() {
    const list = getLinesFromTextarea();
    entriesCountBadge.textContent = list.length;
    wheel.setEntries(list);

    if (list.length === 0) {
      centerCta.style.display = 'none';
    } else {
      centerCta.style.display = 'flex';
    }
  }

  entriesTextarea.addEventListener('input', updateEntriesFromTextarea);

  // Shuffle
  btnShuffle.addEventListener('click', () => {
    const list = getLinesFromTextarea();
    if (list.length <= 1) return;
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    entriesTextarea.value = list.join('\n');
    updateEntriesFromTextarea();
  });

  // Sort
  btnSort.addEventListener('click', () => {
    const list = getLinesFromTextarea();
    if (list.length <= 1) return;
    list.sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));
    entriesTextarea.value = list.join('\n');
    updateEntriesFromTextarea();
  });

  // -------------------------------------------------------------
  // Spin Trigger (Click or Ctrl+Enter)
  // -------------------------------------------------------------
  function triggerSpin() {
    if (wheel.isSpinning) return;
    const entries = getLinesFromTextarea();
    if (entries.length === 0) {
      alert('Vui lòng nhập ít nhất một tên vào danh sách trước khi quay!');
      return;
    }

    centerCta.style.opacity = '0.35';
    wheel.spin();
  }

  wheelCanvas.addEventListener('click', triggerSpin);
  centerCta.addEventListener('click', triggerSpin);

  document.addEventListener('keydown', (e) => {
    // Ctrl + Enter to spin
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerSpin();
    }
    // Secret shortcut: Ctrl + Shift + L to open Rig Modal
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      openSecretModal();
    }
  });

  // Wheel Spin Callbacks
  wheel.onSpinStart = () => {
    centerCta.style.opacity = '0';
    centerCta.style.pointerEvents = 'none';
  };

  wheel.onSpinComplete = (winnerName, winnerIndex) => {
    centerCta.style.opacity = '1';
    centerCta.style.pointerEvents = 'auto';

    currentWinningInfo = { name: winnerName, index: winnerIndex };

    // Add to Results History
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    resultsHistory.unshift({ name: winnerName, time: timeStr });
    renderResults();

    // Trigger Audio & Confetti
    if (window.wheelAudio) window.wheelAudio.playFanfare();
    if (window.confettiCannon) window.confettiCannon.fire(4500);

    // Open Winner Modal
    winnerNameText.textContent = winnerName;
    winnerModal.classList.add('active');
    winnerModal.setAttribute('aria-hidden', 'false');
  };

  // -------------------------------------------------------------
  // Winner Modal Handlers
  // -------------------------------------------------------------
  btnCloseWinnerModal.addEventListener('click', () => {
    winnerModal.classList.remove('active');
    winnerModal.setAttribute('aria-hidden', 'true');
    if (window.confettiCannon) window.confettiCannon.stop();
  });

  btnRemoveWinnerModal.addEventListener('click', () => {
    const list = getLinesFromTextarea();
    if (currentWinningInfo.index >= 0 && currentWinningInfo.index < list.length) {
      list.splice(currentWinningInfo.index, 1);
      entriesTextarea.value = list.join('\n');
      updateEntriesFromTextarea();
    }
    winnerModal.classList.remove('active');
    winnerModal.setAttribute('aria-hidden', 'true');
    if (window.confettiCannon) window.confettiCannon.stop();
  });

  // Close modal on outside click
  winnerModal.addEventListener('click', (e) => {
    if (e.target === winnerModal) {
      winnerModal.classList.remove('active');
      winnerModal.setAttribute('aria-hidden', 'true');
      if (window.confettiCannon) window.confettiCannon.stop();
    }
  });

  // -------------------------------------------------------------
  // Tabs Navigation (Entries / Results)
  // -------------------------------------------------------------
  tabEntries.addEventListener('click', () => {
    tabEntries.classList.add('active');
    tabResults.classList.remove('active');
    tabContentEntries.classList.add('active');
    tabContentResults.classList.remove('active');
  });

  tabResults.addEventListener('click', () => {
    tabResults.classList.add('active');
    tabEntries.classList.remove('active');
    tabContentResults.classList.add('active');
    tabContentEntries.classList.remove('active');
  });

  function renderResults() {
    resultsCountBadge.textContent = resultsHistory.length;
    if (resultsHistory.length === 0) {
      resultsSummaryText.textContent = 'Chưa có kết quả quay';
      resultsListContainer.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding:30px 10px; font-size:13.5px;">Quay bánh xe để lưu kết quả vào đây</div>';
      return;
    }

    resultsSummaryText.textContent = `Tổng cộng ${resultsHistory.length} kết quả`;
    resultsListContainer.innerHTML = resultsHistory.map((item, idx) => `
      <div class="result-item">
        <span class="item-name">${idx + 1}. ${escapeHtml(item.name)}</span>
        <span class="item-time">${item.time}</span>
      </div>
    `).join('');
  }

  btnClearResults.addEventListener('click', () => {
    resultsHistory.length = 0;
    renderResults();
  });

  renderResults();

  // -------------------------------------------------------------
  // Sidebar Collapse Toggle
  // -------------------------------------------------------------
  btnCollapseToggle.addEventListener('click', () => {
    sidebarSection.classList.toggle('collapsed');
    setTimeout(() => {
      wheel.setupCanvas();
    }, 320);
  });

  // -------------------------------------------------------------
  // Customize Modal
  // -------------------------------------------------------------
  btnCustomize.addEventListener('click', () => {
    customizeModal.classList.add('active');
    customizeModal.setAttribute('aria-hidden', 'false');
  });

  btnCloseCustomize.addEventListener('click', () => {
    customizeModal.classList.remove('active');
    customizeModal.setAttribute('aria-hidden', 'true');
  });

  customizeModal.addEventListener('click', (e) => {
    if (e.target === customizeModal) {
      customizeModal.classList.remove('active');
      customizeModal.setAttribute('aria-hidden', 'true');
    }
  });

  spinDurationInput.addEventListener('input', () => {
    spinDurationVal.textContent = `${spinDurationInput.value}s`;
    wheel.options.duration = parseInt(spinDurationInput.value, 10) * 1000;
  });

  soundToggle.addEventListener('change', () => {
    wheelAudio.toggleSound(soundToggle.checked);
  });

  btnSaveCustomize.addEventListener('click', () => {
    customizeModal.classList.remove('active');
    customizeModal.setAttribute('aria-hidden', 'true');
  });

  // Palette buttons
  const paletteBtns = document.querySelectorAll('.palette-btn');
  paletteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const palette = btn.getAttribute('data-palette');
      wheel.setPalette(palette);
    });
  });

  // -------------------------------------------------------------
  // Secret Rigging Modal (Triple click Version 437 or Ctrl+Shift+L)
  // -------------------------------------------------------------
  function openSecretModal() {
    secretTargetName.value = wheel.options.riggedTarget;
    secretProbability.value = Math.round(wheel.options.rigProbability * 100);
    secretProbabilityVal.textContent = `${secretProbability.value}%`;
    secretActiveToggle.checked = wheel.options.rigActive;

    secretModal.classList.add('active');
    secretModal.setAttribute('aria-hidden', 'false');
  }

  versionSecretTrigger.addEventListener('click', () => {
    versionClickCount++;
    clearTimeout(versionClickTimer);

    versionClickTimer = setTimeout(() => {
      versionClickCount = 0;
    }, 800);

    if (versionClickCount >= 3) {
      versionClickCount = 0;
      openSecretModal();
    }
  });

  btnCloseSecret.addEventListener('click', () => {
    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
  });

  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) {
      secretModal.classList.remove('active');
      secretModal.setAttribute('aria-hidden', 'true');
    }
  });

  secretProbability.addEventListener('input', () => {
    secretProbabilityVal.textContent = `${secretProbability.value}%`;
  });

  btnSaveSecret.addEventListener('click', () => {
    const target = secretTargetName.value.trim() || 'Nguyễn Trọng Linh';
    const prob = parseInt(secretProbability.value, 10) / 100;
    const active = secretActiveToggle.checked;

    wheel.options.riggedTarget = target;
    wheel.options.rigProbability = prob;
    wheel.options.rigActive = active;

    // Persist to localStorage
    localStorage.setItem('rig_target', target);
    localStorage.setItem('rig_probability', prob.toString());
    localStorage.setItem('rig_active', active.toString());

    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
    showToast(`Đã áp dụng tỉ lệ ${secretProbability.value}% cho "${target}"!`);
  });

  btnForceWinNext.addEventListener('click', () => {
    wheel.options.forceWinNext = true;
    wheel.options.riggedTarget = secretTargetName.value.trim() || 'Nguyễn Trọng Linh';
    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
    showToast(`Lượt quay tiếp theo chắc chắn 100% trúng "${wheel.options.riggedTarget}"!`);
  });

  // -------------------------------------------------------------
  // Fullscreen & Navbar Dropdowns
  // -------------------------------------------------------------
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  btnMore.addEventListener('click', (e) => {
    e.stopPropagation();
    moreDropdown.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    moreDropdown.classList.remove('show');
  });

  menuSoundToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const enabled = wheelAudio.toggleSound();
    soundToggle.checked = enabled;
    showToast(enabled ? '🔊 Âm thanh đã bật' : '🔇 Âm thanh đã tắt');
  });

  menuReset.addEventListener('click', (e) => {
    e.preventDefault();
    entriesTextarea.value = defaultEntries.join('\n');
    updateEntriesFromTextarea();
    showToast('Đã đặt lại danh sách mặc định');
  });

  // Top action buttons placeholder handlers
  document.getElementById('btnNew').addEventListener('click', () => {
    if (confirm('Xóa sạch danh sách để tạo mới?')) {
      entriesTextarea.value = '';
      updateEntriesFromTextarea();
    }
  });

  document.getElementById('btnSave').addEventListener('click', () => {
    localStorage.setItem('wheel_entries', entriesTextarea.value);
    showToast('Đã lưu danh sách vào trình duyệt!');
  });

  document.getElementById('btnOpen').addEventListener('click', () => {
    const saved = localStorage.getItem('wheel_entries');
    if (saved) {
      entriesTextarea.value = saved;
      updateEntriesFromTextarea();
      showToast('Đã mở danh sách đã lưu!');
    } else {
      showToast('Chưa có danh sách nào được lưu trước đó.');
    }
  });

  document.getElementById('btnShare').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
  });

  document.getElementById('btnAddWheel').addEventListener('click', () => {
    showToast('Chế độ nhiều bánh xe (Multi-wheel)');
  });

  document.getElementById('btnAddImage').addEventListener('click', () => {
    showToast('Tính năng thêm hình ảnh vào ô quay');
  });

  // -------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------
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
      background: 'rgba(32, 23, 64, 0.95)',
      color: '#ffffff',
      padding: '10px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(124, 77, 255, 0.4)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
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
