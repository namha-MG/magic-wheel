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

  // Initial Default Lists provided by User (Số đã được loại bỏ hoàn toàn)
  const rawFemaleNames = [
    'Nguyễn Thị Thúy Hằng', 'Nguyễn Thị Lành', 'Phạm Thị Mơ', 'Nguyễn Thị Hoài Anh',
    'Nguyễn Diệp Anh', 'Đỗ Thị Ngọc Ánh', 'Đặng Thị Thu Trang', 'Trịnh Thùy Trang',
    'Phạm Thị Hà Hạnh', 'Nguyễn Thị Sinh', 'Nguyễn Minh Hòa', 'Phan Thị Minh Thư',
    'Nguyễn Thị Minh Phương', 'Nguyễn Vân Anh', 'Đàm Thị Thu', 'Nguyễn Thị Tươi',
    'Đỗ Thị Kim Oanh', 'Nguyễn Thị Đào'
  ];

  const rawMaleNames = [
    'Nguyễn Mạnh Cường', 'Vũ Xuân Hoàn', 'Nguyễn Quang Chiến', 'Phạm Xuân Vinh',
    'Phạm Quý Long', 'Hà Anh Nam', 'Vũ Phi Long', 'Nguyễn Anh Huy',
    'Trần Đức Mạnh', 'Phan Trung Hưng', 'Nguyễn Đắc Ngàn', 'Cao Trần Thiên',
    'Nguyễn Thành Luân', 'Trần Hoàng Hải', 'Trần Đức Lương', 'Lương Đức Long',
    'Chu Văn Toàn', 'Bùi Hoàng Thái', 'Trần Quang Nam', 'Nguyễn Trọng Tùng',
    'Nguyễn Đức An', 'Nguyễn Trọng Linh', 'Bùi Huy Tú', 'Phạm Hữu Việt Anh',
    'Nguyễn Anh Tuấn', 'Đinh Hữu Đại', 'Trần Trung Hậu', 'Lê Tuấn Anh',
    'Phan Huy Anh', 'Phạm Minh Khánh', 'Hoàng Hà My', 'Đỗ Thanh Hiển',
    'Phạm Duy Khải', 'Hà Văn Mạnh', 'Nguyễn Minh Thông', 'Nguyễn Tuấn Dũng',
    'Trần Tăng Dương', 'Nguyễn Tuấn Anh', 'Hoàng Anh Tú', 'Kiều Xuân Khánh',
    'Nguyễn Thanh Bình', 'Phạm Tùng Dương', 'Nguyễn Thành Đạt', 'Phạm Ngọc Sơn',
    'Trần Anh Dũng', 'Trịnh Quang Huy', 'Phạm Tuấn Dũng', 'Khổng Thế Học',
    'Trần Mạnh Quốc'
  ];

  const femaleColorPalettes = [
    ['#f857a6', '#ff5858'], ['#ff758c', '#ff7eb3'], ['#ff9a9e', '#fecfef'],
    ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'], ['#f093fb', '#f5576c'],
    ['#ff0844', '#ffb199'], ['#b224ef', '#7579ff'], ['#ff6a88', '#ff99ac']
  ];
  const femaleEmojis = ['🌸', '✨', '🎀', '🐱', '🌷', '💎', '🌹', '🦋', '🍓', '🌺', '💖', '🕊️'];

  const maleColorPalettes = [
    ['#0072ff', '#00c6ff'], ['#11998e', '#38ef7d'], ['#8a2387', '#e94057'],
    ['#2193b0', '#6dd5ed'], ['#fc4a1a', '#f7b733'], ['#4568dc', '#b06ab3'],
    ['#43cea2', '#185a9d'], ['#5f2c82', '#49a09d'], ['#00c6ff', '#0072ff']
  ];
  const maleEmojis = ['👑', '🚀', '🎸', '⚡', '🎯', '🎧', '⚽', '🎮', '🏆', '🔥', '🌟', '🌊'];

  const defaultFemaleCandidates = rawFemaleNames.map((name, idx) => {
    const pal = femaleColorPalettes[idx % femaleColorPalettes.length];
    const emoji = femaleEmojis[idx % femaleEmojis.length];
    return { name, avatar: generateAvatarSvg(name, pal[0], pal[1], emoji) };
  });

  const defaultMaleCandidates = rawMaleNames.map((name, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    // Đường dẫn ảnh Teams thực tế tương ứng với từng thành viên trong xem-avatar.html
    const avatar = `avatars/male-${num}.jpg`;
    return { name, avatar };
  });

  // Kho câu chúc ngọt ngào, ấm áp, tình cảm (Mỗi cặp đôi 1 câu độc nhất không lặp lại)
  const sweetWishes = [
    '“Gặp được nhau giữa bao nhiêu người đã là duyên lành. Chúc hai bạn luôn gắn kết và ấm áp bên nhau! 💖”',
    '“Trời sinh một cặp, duyên thắm tình nồng! Chúc chàng và nàng luôn tìm thấy niềm vui và sự ngọt ngào bên cạnh nhau! 🌸”',
    '“Chúc hai bạn luôn có nhau trong những ngày vui vẻ, quan tâm nhau những lúc mệt nhoài và cùng viết nên kỷ niệm thật đẹp! ✨”',
    '“Một nụ cười bằng mười thang thuốc bổ, ở cạnh người này đảm bảo tim bạn lúc nào cũng ấm áp và hạnh phúc! 🥰”',
    '“Duyên phận thật khéo sắp đặt! Chúc chàng luôn là chỗ dựa vững vàng, nàng luôn dịu dàng rạng rỡ bên chàng! 🌷”',
    '“Từ hôm nay có người cùng sẻ chia ly trà sữa ngọt ngào, cùng đi ăn trưa và lắng nghe tâm sự mỗi ngày rồi nhé! 🧋”',
    '“Có những cuộc gặp gỡ là tình cờ, nhưng được ở cạnh nhau chính là định mệnh. Chúc hai bạn luôn gắn kết bền chặt! 💫”',
    '“Chúc hai bạn một đời an yên, bên ngoài sóng gió mặc kệ, chỉ cần ở cạnh nhau là thấy bình yên ngập tràn! 🍃”',
    '“Mong rằng ánh mắt hai bạn nhìn nhau hôm nay sẽ mãi luôn lấp lánh sự dịu dàng và ấm áp như ngày đầu tiên! 🌟”',
    '“Đôi khi hạnh phúc đơn giản chỉ là tìm thấy một người luôn hiểu ý mình. Chúc mừng cặp đôi trai tài gái sắc! 🌹”',
    '“Chúc chàng và nàng luôn tay trong tay, cùng nhau đi qua những ngày tháng thật rực rỡ và ngọt ngào! 🎀”',
    '“Nhìn hai bạn đứng cạnh nhau thôi cũng thấy ngọt ngào lan tỏa cả khán phòng rồi! Chúc hai bạn luôn hạnh phúc! 🍯”',
    '“Vũ trụ đã se duyên khéo léo, chúc hai bạn sớm có những buổi hẹn hò cà phê ấm áp và ngập tràn tiếng cười! ☕”',
    '“Một người dịu dàng, một người chu đáo — đúng là mảnh ghép hoàn hảo mà bấy lâu nay đối phương hằng tìm kiếm! 🧩”',
    '“Chúc cho tình cảm của hai bạn luôn nồng ấm như nắng sớm, dịu ngọt như gió chiều và bền bỉ theo thời gian! ☀️”',
    '“Gặp đúng người vào đúng khoảnh khắc chính là món quà kỳ diệu nhất. Hãy trân trọng mối lương duyên này nhé! 🎁”',
    '“Chúc hai bạn luôn biết lắng nghe, sẻ chia và là chốn bình yên dịu dàng nhất của nhau sau những bộn bề cuộc sống! 🌙”',
    '“Có một người để quan tâm, có một người để nhớ về — chúc hai bạn mở đầu một hành trình mới ngập tràn yêu thương! 💌”',
    '“Chúc chàng trai luôn nâng niu nụ cười của cô gái, chúc cô gái luôn cảm nhận được sự ấm áp từ chàng trai! 💖”',
    '“Duyên đã bén, tình đã nồng, mong hai bạn cùng nhau vẽ nên những tháng ngày thật rực rỡ và đong đầy yêu thương! 🎨”',
    '“Chúc hai bạn mỗi ngày trôi qua đều có thêm nhiều lý do để mỉm cười khi nghĩ về nhau! 😊”',
    '“Khoảnh khắc vòng quay dừng lại cũng là lúc hai trái tim tìm thấy nhịp đập đồng điệu. Chúc hai bạn mãi gắn kết! 💓”',
    '“Đẹp đôi như chim liền cánh, như cây liền cành. Chúc hai bạn luôn thương mến và đồng hành cùng nhau trên mọi nẻo đường! 🕊️”',
    '“Chúc cho những câu chuyện giữa hai bạn sẽ luôn kéo dài mãi không dứt, ngọt ngào từ ánh mắt đến nụ cười! 💬”',
    '“Mỗi ngày sẽ vui hơn biết bao khi có một người bạn đặc biệt luôn quan tâm và đồng hành bên cạnh! 🌼”',
    '“Duyên trời định sẵn, mong hai bạn hãy cùng nhau vun đắp để mối quan hệ này ngày càng thắm thiết và sâu sắc nhé! 🌳”',
    '“Chúc hai bạn luôn là niềm vui, là động lực và là sự vỗ về ấm áp nhất dành cho nhau mỗi ngày! 🌈”',
    '“Cả hội trường đều đang gửi gắm những lời chúc ngọt ngào nhất tới cặp đôi tuyệt vời của ngày hôm nay! 🎉”',
    '“Chúc tình cảm của hai bạn nhẹ nhàng như mây trời, sâu lắng như đại dương và ngọt ngào như viên kẹo socola! 🍫”',
    '“Chúc hai bạn luôn giữ trọn vẹn sự rung động chân thành này, cùng nhau tạo nên thật nhiều kỷ niệm khó quên! 📸”',
    '“Một người biết lắng nghe, một người biết thấu hiểu — chúc hai bạn luôn trân trọng mối duyên lành này nhé! 💕”',
    '“Mong rằng mỗi sáng thức dậy, nghĩ về nhau là cả hai đều thấy lòng mình tràn ngập niềm vui và ấm áp! 🌻”',
    '“Chúc hai bạn sớm chung đôi trên mọi hành trình, luôn là chỗ dựa tình cảm ấm áp nhất của nhau! ⛵”',
    '“Chúc cho nụ cười trên môi hai bạn hôm nay sẽ luôn rạng rỡ và hạnh phúc như chính khoảnh khắc này! ✨”',
    '“Dù ngày nắng hay ngày mưa, chúc hai bạn luôn tìm thấy hơi ấm và sự chở che khi ở bên cạnh nhau! ☂️”',
    '“Chúc hai bạn mãi là ngọn lửa sưởi ấm tâm hồn nhau, cùng nhau đón nhận những điều ngọt ngào nhất của cuộc sống! 🔥”'
  ];

  // Quản lý kho câu chúc không lặp lại cho mỗi cặp đôi
  let unusedQuotes = [...sweetWishes];

  function getUniqueSweetWish() {
    if (unusedQuotes.length === 0) {
      unusedQuotes = [...sweetWishes];
    }
    const idx = Math.floor(Math.random() * unusedQuotes.length);
    const chosen = unusedQuotes.splice(idx, 1)[0];
    return chosen;
  }

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
    // Helper to sanitize any name by removing numbers and ensuring avatar paths
    function sanitizeList(list, defaultRefList) {
      if (!Array.isArray(list)) return [];
      return list.map(item => {
        if (!item || !item.name) return item;
        const cleanName = item.name.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
        let avatar = item.avatar;
        if (defaultRefList) {
          const found = defaultRefList.find(d => d.name === cleanName);
          if (found && found.avatar && (!avatar || avatar.startsWith('data:image/svg'))) {
            avatar = found.avatar;
          }
        }
        return { ...item, name: cleanName, avatar: avatar || item.avatar };
      });
    }

    // Load candidates with version check (v6 uses real photo avatars)
    const isV6 = localStorage.getItem('gacha_candidates_v6') === 'true';
    const savedMale = localStorage.getItem('gacha_male_candidates');
    const savedFemale = localStorage.getItem('gacha_female_candidates');

    if (isV6 && savedMale && savedFemale) {
      try {
        maleList = sanitizeList(JSON.parse(savedMale), defaultMaleCandidates);
        femaleList = sanitizeList(JSON.parse(savedFemale), defaultFemaleCandidates);
      } catch (e) {
        maleList = [...defaultMaleCandidates];
        femaleList = [...defaultFemaleCandidates];
      }
    } else {
      maleList = [...defaultMaleCandidates];
      femaleList = [...defaultFemaleCandidates];
      localStorage.setItem('gacha_male_candidates', JSON.stringify(maleList));
      localStorage.setItem('gacha_female_candidates', JSON.stringify(femaleList));
      localStorage.setItem('gacha_candidates_v6', 'true');
    }

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
    if (maleList.length === 0) {
      alert('Danh sách bạn Nam đang trống! Vui lòng thêm thành viên trong mục "Quản Lý Thành Viên"!');
      return;
    }
    if (femaleList.length === 0) {
      alert('Tất cả các bạn Nữ đã được ghép đôi hết! Vui lòng bấm nút "Dữ Liệu Mẫu" ở góc trên để bắt đầu lại lượt mới.');
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

  const femaleRemovedNotice = document.getElementById('femaleRemovedNotice');

  function onCoupleMatched(male, female) {
    // Record match history
    matchHistory.unshift({ male: male.name, female: female.name });
    renderHistory();

    // Phía nữ quay trúng ai thì sẽ remove khỏi danh sách
    const femaleIdx = femaleList.findIndex(f => f.name === female.name);
    if (femaleIdx !== -1) {
      femaleList.splice(femaleIdx, 1);
      localStorage.setItem('gacha_female_candidates', JSON.stringify(femaleList));
      femaleCountBadge.textContent = femaleList.length;
      manageFemaleBadge.textContent = femaleList.length;
      console.log(`[Removed Female] Đã loại "${female.name}". Còn lại: ${femaleList.length}`);
    }

    if (femaleRemovedNotice) {
      femaleRemovedNotice.innerHTML = `<span>✨ Đã se duyên & loại <strong>${escapeHtml(female.name)}</strong> khỏi danh sách (Còn lại ${femaleList.length} bạn Nữ)</span>`;
    }

    // Sound & Particles (Ngọt ngào, lung linh)
    if (window.gachaAudio) window.gachaAudio.playCelebrationFanfare();
    if (window.romanticParticles) window.romanticParticles.burst();

    // Populate Modal
    revealMaleAvatar.src = male.avatar;
    revealMaleName.textContent = male.name;
    revealFemaleAvatar.src = female.avatar;
    revealFemaleName.textContent = female.name;

    // Mỗi cặp 1 câu chúc ngọt ngào, ấm áp độc nhất không lặp lại
    romanticQuote.textContent = getUniqueSweetWish();

    // Show Romantic Match Modal
    romanticModal.classList.add('active');
    romanticModal.setAttribute('aria-hidden', 'false');
  }

  function renderHistory() {
    if (matchHistory.length === 0) {
      recentMatchesList.innerHTML = '<span class="no-match-text">Chưa có lượt quay nào. Hãy bấm "QUAY GHÉP CẶP ĐÔI" ngay!</span>';
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
  function closeRomanticModal() {
    romanticModal.classList.remove('active');
    romanticModal.setAttribute('aria-hidden', 'true');
    if (window.romanticParticles) window.romanticParticles.stop();

    // Cập nhật lại dải cuộn phía nữ với danh sách còn lại
    trackFemale.setCandidates(femaleList);
  }

  btnCloseRomantic.addEventListener('click', closeRomanticModal);

  romanticModal.addEventListener('click', (e) => {
    if (e.target === romanticModal) {
      closeRomanticModal();
    }
  });

  btnSpinAgain.addEventListener('click', () => {
    closeRomanticModal();
    if (femaleList.length === 0) {
      alert('Tất cả các bạn Nữ đã được ghép đôi thành công! Vui lòng bấm nút "Dữ Liệu Mẫu" ở góc trên để bắt đầu lại lượt mới.');
      return;
    }
    setTimeout(triggerSpin, 350);
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
          <div style="font-size:11px; color:var(--text-dim);">${currentActiveManageGender === 'male' ? 'Đàng Trai' : 'Đàng Gái'}</div>
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
    const rawName = inputPersonName.value.trim();
    const name = rawName.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
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
      unusedQuotes = [...sweetWishes];
      saveCandidates();
      showToast('Đã khôi phục dữ liệu mẫu và làm mới kho câu chúc!');
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
