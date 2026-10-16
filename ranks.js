/**
 * ranks.js - League of Legends (LOL) Ranked System & Member Data Mapping
 * 
 * Rules:
 *  - Sếp Cường: Thách Đấu (Challenger)
 *  - Sếp Hoàn: Cao Thủ (Master)
 *  - < 95 (sinh trước 1995): Kim Cương (Diamond)
 *  - 95 - 2k (sinh 1995 đến 2000): Lục Bảo (Emerald)
 *  - > 2k1 (sinh từ 2001 trở đi): Vàng (Gold)
 *  - Anh Linh (Nguyễn Trọng Linh): Đồng Nát (Iron IV)
 */

(function (window) {
  'use strict';

  // League of Legends Rank Definitions (From Official Loading Screen Frames)
  const LOL_RANKS = {
    challenger: {
      id: 'challenger',
      name: 'Thách Đấu',
      tier: 'Challenger',
      icon: '👑',
      crest: '👑',
      frameImg: 'avatars/ranks/frame_challenger.png',
      borderImg: 'avatars/ranks/border_challenger.png',
      crestImg: 'avatars/ranks/crest_challenger.png',
      color: '#ffd700',
      accent: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.7)',
      borderGradient: 'linear-gradient(135deg, #ffd700 0%, #00e5ff 50%, #e0a96d 100%)',
      badgeClass: 'rank-badge-challenger',
      frameClass: 'rank-frame-challenger',
      subtext: 'Bậc Thách Đấu • Sếp Cường'
    },
    master: {
      id: 'master',
      name: 'Cao Thủ',
      tier: 'Master',
      icon: '🔮',
      crest: '🔮',
      frameImg: 'avatars/ranks/frame_master.png',
      borderImg: 'avatars/ranks/border_master.png',
      crestImg: 'avatars/ranks/crest_master.png',
      color: '#d054ff',
      accent: '#ff4081',
      glow: 'rgba(208, 84, 255, 0.7)',
      borderGradient: 'linear-gradient(135deg, #e040fb 0%, #7c4dff 50%, #ff4081 100%)',
      badgeClass: 'rank-badge-master',
      frameClass: 'rank-frame-master',
      subtext: 'Bậc Cao Thủ • Sếp Hoàn'
    },
    diamond: {
      id: 'diamond',
      name: 'Kim Cương',
      tier: 'Diamond',
      icon: '💎',
      crest: '💎',
      frameImg: 'avatars/ranks/frame_diamond.png',
      borderImg: 'avatars/ranks/border_diamond.png',
      crestImg: 'avatars/ranks/crest_diamond.png',
      color: '#00f0ff',
      accent: '#0088ff',
      glow: 'rgba(0, 240, 255, 0.65)',
      borderGradient: 'linear-gradient(135deg, #a0f4ff 0%, #00b4d8 50%, #0077b6 100%)',
      badgeClass: 'rank-badge-diamond',
      frameClass: 'rank-frame-diamond',
      subtext: 'Bậc Kim Cương • Thế hệ < 95'
    },
    emerald: {
      id: 'emerald',
      name: 'Lục Bảo',
      tier: 'Emerald',
      icon: '🟢',
      crest: '🟢',
      frameImg: 'avatars/ranks/frame_emerald.png',
      borderImg: 'avatars/ranks/border_emerald.png',
      crestImg: 'avatars/ranks/crest_emerald.png',
      color: '#00ff88',
      accent: '#00e676',
      glow: 'rgba(0, 255, 136, 0.65)',
      borderGradient: 'linear-gradient(135deg, #69f0ae 0%, #00c853 50%, #004d20 100%)',
      badgeClass: 'rank-badge-emerald',
      frameClass: 'rank-frame-emerald',
      subtext: 'Bậc Lục Bảo • Thế hệ 95 - 2k'
    },
    gold: {
      id: 'gold',
      name: 'Vàng',
      tier: 'Gold',
      icon: '🟡',
      crest: '🟡',
      frameImg: 'avatars/ranks/frame_gold.png',
      borderImg: 'avatars/ranks/border_gold.png',
      crestImg: 'avatars/ranks/crest_gold.png',
      color: '#ffc107',
      accent: '#ff9100',
      glow: 'rgba(255, 193, 7, 0.65)',
      borderGradient: 'linear-gradient(135deg, #ffe082 0%, #ffb300 50%, #ff6f00 100%)',
      badgeClass: 'rank-badge-gold',
      frameClass: 'rank-frame-gold',
      subtext: 'Bậc Vàng • Thế hệ > 2k1'
    },
    iron: {
      id: 'iron',
      name: 'Đồng Nát',
      tier: 'Iron IV',
      icon: '🔩',
      crest: '🔩',
      frameImg: 'avatars/ranks/frame_iron.png',
      borderImg: 'avatars/ranks/border_iron.png',
      crestImg: 'avatars/ranks/crest_iron.png',
      color: '#bcaaa4',
      accent: '#ff5722',
      glow: 'rgba(141, 110, 99, 0.7)',
      borderGradient: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 40%, #bcaaa4 60%, #3e2723 100%)',
      badgeClass: 'rank-badge-iron',
      frameClass: 'rank-frame-iron',
      subtext: 'Bậc Đồng Nát IV • Anh Linh'
    }
  };

  /**
   * Helper normalize Vietnamese text
   */
  function normText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[0-9]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Detailed Member Birth & Rank Database
   */
  const MEMBER_DATABASE = {
    // 1. Đặc biệt: Sếp Cường -> Thách Đấu
    'nguyen manh cuong': { rank: 'challenger', birthYear: 1985, title: 'Sếp Cường' },

    // 2. Đặc biệt: Sếp Hoàn -> Cao Thủ
    'vu xuan hoan': { rank: 'master', birthYear: 1995, title: 'Sếp Hoàn' },

    // 3. Đặc biệt: Anh Linh -> Đồng Nát
    'nguyen trong linh': { rank: 'iron', birthYear: 1998, title: 'Anh Linh' },

    // 4. Sinh trước 1995 (< 95) -> Kim Cương
    'nguyen thi thuy hang': { birthYear: 1983 },
    'le viet ha': { birthYear: 1983 },
    'do thi kim oanh': { birthYear: 1991 },
    'nguyen dac ngan': { birthYear: 1991 },
    'nguyen quang chien': { birthYear: 1993 },
    'pham thi mo': { birthYear: 1994 },
    'dang thi thu trang': { birthYear: 1994 },
    'le tuan anh': { birthYear: 1994 },
    'trinh thuy trang': { rank: 'diamond' }, // BA Manager -> Kim Cương
    'nguyen thi dao': { rank: 'diamond' },   // Test Lead -> Kim Cương

    // 5. Sinh 1995 - 2000 (95 - 2k) -> Lục Bảo
    'nguyen thi lanh': { birthYear: 1996 },
    'chu van toan': { birthYear: 1996 },
    'tran tang duong': { birthYear: 1996 },
    'pham xuan vinh': { birthYear: 1997 },
    'ha anh nam': { birthYear: 1997 },
    'pham thi ha hanh': { birthYear: 1997 },
    'tran duc manh': { birthYear: 1998 },
    'nguyen diep anh': { birthYear: 1998 },
    'cao tran thien': { birthYear: 1998 },
    'luong duc long': { birthYear: 1998 },
    'bui hoang thai': { birthYear: 1998 },
    'pham ngoc son': { birthYear: 1998 },
    'nguyen thi hoai anh': { birthYear: 1999 },
    'do thi ngoc anh': { birthYear: 1999 },
    'nguyen thanh luan': { birthYear: 1999 },
    'tran duc luong': { birthYear: 1999 },
    'phan huy anh': { birthYear: 1999 },
    'vu phi long': { birthYear: 2000 },
    'tran hoang hai': { birthYear: 2000 },
    'pham duy khai': { birthYear: 2000 },
    'tran anh dung': { birthYear: 2000 },
    'tran quang nam': { birthYear: 1998 },
    'bui huy tu': { birthYear: 1999 },
    'pham huu viet anh': { birthYear: 1998 },
    'nguyen anh tuan': { birthYear: 1999 },
    'pham minh khanh': { birthYear: 2000 },
    'nguyen minh thong': { birthYear: 1998 },
    'nguyen tuan dung': { birthYear: 1999 },
    'nguyen thi minh phuong': { birthYear: 1999 },
    'nguyen van anh': { birthYear: 1998 },
    'dam thi thu': { birthYear: 1999 },
    'nguyen thi tuoi': { birthYear: 1998 },
    'nguyen tuan anh': { birthYear: 1999 },
    'khong the hoc': { birthYear: 1999 },
    'tran manh quoc': { birthYear: 1998 },
    'bui minh hai': { birthYear: 1999 },

    // 6. Sinh từ 2001 trở đi (> 2k1) -> Vàng
    'nguyen anh huy': { birthYear: 2001 },
    'phan trung hung': { birthYear: 2001 },
    'dinh huu dai': { birthYear: 2001 },
    'nguyen thi sinh': { birthYear: 2001 },
    'nguyen thanh dat': { birthYear: 2001 },
    'nguyen trong tung': { birthYear: 2002 },
    'nguyen duc an': { birthYear: 2002 },
    'tran trung hau': { birthYear: 2002 },
    'hoang ha my': { birthYear: 2002 },
    'ha van manh': { birthYear: 2002 },
    'vu tien manh': { birthYear: 2002 },
    'pham quy long': { birthYear: 2003 },
    'nguyen minh hoa': { birthYear: 2003 },
    'phan thi minh thu': { birthYear: 2003 },
    'hoang anh tu': { birthYear: 2003 },
    'kieu xuan khanh': { birthYear: 2003 },
    'nguyen thanh binh': { birthYear: 2003 },
    'pham tung duong': { birthYear: 2003 },
    'bui quang dung': { birthYear: 2003 },
    'nguyen ngoc hieu': { birthYear: 2003 },
    'trinh quang huy': { birthYear: 2003 },
    'pham tuan dung': { birthYear: 2003 },
    'dinh duy tien': { birthYear: 2003 },
    'hoang minh nam': { birthYear: 2003 },
    'chu van thanh': { birthYear: 2003 },
    'pham duc nha': { birthYear: 2003 },
    'nguyen duc trung': { birthYear: 2003 },
    'do thanh hien': { birthYear: 2004 },
    'tran van phuc': { birthYear: 2004 },
    'vu duc quang': { birthYear: 2004 },
    'duong quoc anh': { birthYear: 2004 },
    'vuong sy thang': { birthYear: 2003 },
    'phan trong truong': { birthYear: 2004 },
    'le minh duong': { birthYear: 2004 }
  };

  /**
   * Determine a member's LOL Rank based on user specifications
   */
  function getMemberRank(name) {
    if (!name) return LOL_RANKS.emerald;
    const norm = normText(name);

    // Rule 1: Sếp Cường -> Thách Đấu
    if (norm.includes('cuong') && (norm.includes('nguyen manh') || norm.includes('sep cuong'))) {
      return LOL_RANKS.challenger;
    }
    if (norm === 'nguyen manh cuong') {
      return LOL_RANKS.challenger;
    }

    // Rule 2: Sếp Hoàn -> Cao Thủ
    if (norm.includes('hoan') && (norm.includes('vu xuan') || norm.includes('sep hoan'))) {
      return LOL_RANKS.master;
    }
    if (norm === 'vu xuan hoan') {
      return LOL_RANKS.master;
    }

    // Rule 3: Anh Linh -> Đồng Nát
    if (norm.includes('linh') && (norm.includes('nguyen trong') || norm.includes('anh linh'))) {
      return LOL_RANKS.iron;
    }
    if (norm === 'nguyen trong linh') {
      return LOL_RANKS.iron;
    }

    // Rule 4: Tra cứu theo từ điển thành viên
    for (const [key, info] of Object.entries(MEMBER_DATABASE)) {
      if (norm.includes(key) || key.includes(norm)) {
        if (info.rank && LOL_RANKS[info.rank]) {
          return LOL_RANKS[info.rank];
        }
        if (info.birthYear) {
          if (info.birthYear < 1995) return LOL_RANKS.diamond;
          if (info.birthYear <= 2000) return LOL_RANKS.emerald;
          return LOL_RANKS.gold; // > 2k1
        }
      }
    }

    // Default fallback:
    // Nếu chứa các từ khóa đặc biệt
    return LOL_RANKS.emerald;
  }

  // Export to window
  window.LOL_RANKS = LOL_RANKS;
  window.getMemberRank = getMemberRank;
  window.MEMBER_DATABASE = MEMBER_DATABASE;

})(typeof window !== 'undefined' ? window : this);
