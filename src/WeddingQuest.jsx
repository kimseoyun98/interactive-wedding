/* =====================================================================
 *  2028 WEDDING QUEST — 2D Top-down RPG Prototype (single file)
 *  React + Tailwind CSS + Framer Motion + Lucide-react
 *  모든 그래픽은 인라인 픽셀 SVG(shapeRendering="crispEdges")로만 그립니다.
 * ===================================================================== */
import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RotateCcw, Sparkles } from "lucide-react";

/* =====================================================================
 *  1. QUEST DATA — 실제 기획 텍스트는 여기만 갈아끼우면 됩니다.
 *  x, y      : 바위(2x2 타일 블록)의 좌상단 타일 좌표 (1타일 = 32px)
 *  sign      : 나무 표지판 위치 (x = 중심 타일, y = 바닥 타일), arrow: 'left' | 'right'
 *  dialogs   : speaker 'seoyeon'(=[예비신부]) | 'jaehoon'(=[예비신랑]),  expression 'default' | 'smile' | 'determined' | 'heart'
 *  modal.game: 'timeline' | 'housing' | 'loan' | 'budget' | 'quiz' — 미니게임 종류 (나머지 필드는 각 미니게임 카피)
 * ===================================================================== */
export const QUEST_GATES = [
  {
    id: 1, x: 3, y: 8,
    sign: { x: 5.6, y: 7.7, arrow: "right" },
    dialogs: [
      { speaker: "seoyeon", expression: "default", text: "첫 번째 바위야! '결혼 준비 골든타임'이라고 새겨져 있어." },
      { speaker: "jaehoon", expression: "determined", text: "언제, 어떤 순서로 시작하느냐가 제일 중요하대. 타이밍부터 제대로 잡아보자!" },
      { speaker: "seoyeon", expression: "smile", text: "좋아! 로드맵 퍼즐로 2년 계획을 한 번에 맞춰보자." },
    ],
    modal: {
      game: "timeline",
      subtitle: "GATE 1 / 5 · TIMELINE PUZZLE",
      title: "결혼 준비 골든타임 & 로드맵 퍼즐",
      question: "Q. 가장 이상적인 결혼 준비 첫걸음 타이밍은?",
      choices: [
        { key: "A", correct: true, title: "27년 초 인사 & 웨딩홀 선점", desc: "인기 식장부터 빠르게 선점하고, 1년간 본가 거주하며 시드머니 극대화!", feedback: "✨ 정답! 고정지출 방어력 +1,800만 원 획득!" },
        { key: "B", correct: false, title: "돈 다 모을 때까지 무조건 미루기", desc: "자금이 완벽히 모일 때까지 양가 인사와 식장 예약 무기한 연기", feedback: "💥 삐빅! 어른들의 신뢰도 하락 및 인기 웨딩홀 마감 위기!" },
      ],
      puzzleGuide: "▼ 아래 아이콘 카드를 순서대로 클릭해 2027-2028 로드맵을 완성하세요!",
      phases: [
        { icon: "handshake", label: "Phase 1", text: "27년 1분기 : 양가 정식 인사 & 식장 선점" },
        { icon: "piggy", label: "Phase 2", text: "27년 연중 : 본가 거주 지출 방어 & 본업 올인" },
        { icon: "key", label: "Phase 3", text: "27년 말 : 프로젝트 정산 & 신혼집 입주" },
        { icon: "ring", label: "Phase 4", text: "28년 봄 : 축복 속에 본식 진행" },
      ],
    },
  },
  {
    id: 2, x: 7, y: 13,
    sign: { x: 6.1, y: 12.9, arrow: "right" },
    dialogs: [
      { speaker: "jaehoon", expression: "default", text: "두 번째 관문은 '신혼집'이야. 바위에 매물 카드가 세 장 붙어 있네." },
      { speaker: "seoyeon", expression: "determined", text: "출퇴근 거리랑 미래가치, 둘 다 챙기는 실속파로 골라보자!" },
    ],
    modal: {
      game: "housing",
      subtitle: "GATE 2 / 5 · HOUSING MATCH",
      title: "신혼집 주거 성향 진단 & 타겟 매물 선택",
      ribbon: "🎗️ [ 직주근접 & 미래가치 실속파 타입 ]",
      listings: [
        { area: "마포·공덕 권역", name: "래미안·자이 대단지", size: "24평", price: "전세 7.5억", art: 0 },
        { area: "성동·왕십리 권역", name: "센트라스·텐즈힐", size: "25평", price: "전세 8.0억", art: 1 },
        { area: "강남·과천 접근 권역", name: "준신축 브랜드 단지", size: "24평", price: "전세 8.5억", art: 2 },
      ],
      selectLabel: "이 매물 선택",
      selectedLabel: "✔ 타겟 보금자리 확정!",
    },
  },
  {
    id: 3, x: 12, y: 8,
    sign: { x: 14.6, y: 11.2, arrow: "right" },
    dialogs: [
      { speaker: "seoyeon", expression: "default", text: "세 번째 바위엔 '6억 자금 조달'이라고 쓰여 있어… 금액이 어마어마해." },
      { speaker: "jaehoon", expression: "determined", text: "은행 이자로 새는 돈부터 막아야 해. 저 황금 레버를 끝까지 당겨보자!" },
    ],
    modal: {
      game: "loan",
      subtitle: "GATE 3 / 5 · LOAN SIMULATOR",
      title: "6억 자금 조달 : 은행 대출 vs 가족 간 정식 차용",
      guide: "👉 황금 레버를 오른쪽 끝까지 당겨 증발하는 은행 이자를 방어하세요!",
      planA: { title: "Plan A : 시중 은행 대출 100%", detail: "연 금리 4.5% 기준 · 매년 2,700만 원 은행 소모", warning: "⚠️ 3년간 생돈 8,100만 원 공중 증발!" },
      planB: { title: "Plan B : 양가 3억 정식 차용", detail: "세법 적정금리 비과세 기준 적용 · 가족 내 자산 보존", stamp: "3년간 이자 5,760만 원 방어 성공!" },
      caption: "※ 실제 자금 집행 시점은 내년 초가 아닌 '2027년 말 입주 잔금일' 기준입니다.",
    },
  },
  {
    id: 4, x: 16, y: 3,
    sign: { x: 14.9, y: 2.9, arrow: "left" },
    dialogs: [
      { speaker: "jaehoon", expression: "default", text: "네 번째 관문, 결혼 후 3년 동안의 예산 배분이래." },
      { speaker: "seoyeon", expression: "smile", text: "상환, 생활비, 시드머니까지! 통장 쪼개기 제대로 해보자." },
    ],
    modal: {
      game: "budget",
      subtitle: "GATE 4 / 5 · BUDGET ALLOCATOR",
      title: "결혼 후 3개년 상환 & 자산 배분 시뮬레이터",
      poolLabel: "부부 합산 월 소득 + 연간 프로젝트 인센티브 풀(Pool)",
      units: 10,
      minEach: 2,
      slots: [
        { icon: "houseHand", title: "양가 부모님 원리금 상환", sub: "매월 정기 이자 지급 + 인센티브 원금 중도상환" },
        { icon: "basket", title: "부부 알뜰 생활비", sub: "고정 공과금 및 식비·여가비 예산 방어" },
        { icon: "sprout", title: "내 집 마련 시드머니 저축", sub: "3~5년 후 첫 자가 매수를 위한 종잣돈 적립" },
      ],
      years: [
        { label: "1년 차 (2028)", color: "#48A838" },
        { label: "2년 차 (2029)", color: "#F08A24" },
        { label: "3년 차 (2030)", color: "#2878D8" },
      ],
      doneBadge: "📈 3개년 누적 상환 및 순자산 목표 100% 달성!",
    },
  },
  {
    id: 5, x: 21, y: 9,
    sign: { x: 20.3, y: 8.6, arrow: "left" },
    dialogs: [
      { speaker: "seoyeon", expression: "determined", text: "마지막 바위야! 최종 보스는… 양가 아버님 설득!" },
      { speaker: "jaehoon", expression: "default", text: "두 분 스타일이 완전히 다르셔. 각자에게 맞는 화법으로 가야 해." },
      { speaker: "seoyeon", expression: "smile", text: "할 수 있어! O/X 모의고사로 같이 연습해 보자!" },
    ],
    modal: {
      game: "quiz",
      subtitle: "GATE 5 / 5 · FINAL BOSS QUIZ",
      title: "양가 아버님 맞춤형 설득 화법 O/X 모의고사",
      judges: [
        { name: "자수성가 사업가형 아버님", look: "business" },
        { name: "엘리트 병원장님형 아버님", look: "doctor" },
      ],
      rounds: [
        {
          judge: 0, answer: "O",
          text: "당장 현금이 부족하다고 인사를 1~2년 미루는 것보다, 올해 죽기 살기로 뛰어서 내년 봄에 꼭 결혼하겠다는 '직진과 패기'를 보여드려야 100% 신뢰를 얻는다!",
          hint: "💡 힌트: 사업가형 아버님은 조건보다 '직진하는 태도와 패기'를 먼저 보세요!",
        },
        {
          judge: 1, answer: "O",
          text: "감정적으로 손을 벌리기보다, '사돈댁과의 1:1 지원 균형'과 '세법 기준 정식 차용증 및 3개년 상환 계획서(Plan B)'를 데이터로 제시해야 신뢰를 얻는다!",
          hint: "💡 힌트: 병원장님형 아버님은 감정보다 '균형'과 '숫자로 된 계획서'를 신뢰하세요!",
        },
      ],
      clearText: "🎉 두 아버님 신뢰도 100% · ALL CLEAR!",
    },
  },
];

export const MASTER_REPORT = {
  subtitle: "FINALE · MASTER REPORT",
  title: "2028 웨딩 퀘스트 최종 전략 진단서",
  medal: "🏅 [ 결혼 준비 완료도 : 100% PERFECT ]",
  housingLabel: "선택한 첫 보금자리",
  savedLabel: "총 방어 성공 자금",
  saved: "+7,560만 원 세이브!",
  savedSub: "(월세 방어 1,800만 + 이자 절감 5,760만)",
  persuadeLabel: "양가 부모님 설득 논리",
  persuade: "투트랙 맞춤형 전략 마스터 완료",
  stampTop: "최종 승인",
  stampMain: "PASS",
  nextStage: "🚧 STAGE 2 (실전 브리핑편) 업데이트 예정 중...",
  restart: "🔄 처음부터 다시 플레이하기",
};

export const INTRO_DIALOGS = [
  { speaker: "seoyeon", expression: "smile", text: "드디어 출발이야! 저 끝의 2028 웨딩 아치까지 함께 가보자." },
  { speaker: "jaehoon", expression: "default", text: "길목마다 자물쇠 바위가 5개 있대. 방향키나 WASD로 움직이고, 바위 앞에서 Space를 눌러봐." },
  { speaker: "seoyeon", expression: "determined", text: "우리가 함께라면 어떤 난관도 해결할 수 있어! 조금만 더 힘내자!" },
];

export const WEDDING_DIALOGS = [
  { speaker: "seoyeon", expression: "heart", text: "와아… 드디어 도착했어! 벚꽃 좀 봐, 너무 예쁘다!" },
  { speaker: "jaehoon", expression: "smile", text: "다섯 개의 관문을 전부 함께 넘어줘서 고마워." },
  { speaker: "jaehoon", expression: "determined", text: "앞으로 어떤 바위가 길을 막아도, 내가 옆에서 같이 열게." },
  { speaker: "jaehoon", expression: "heart", text: "나랑… 결혼해 줄래?" },
];

// 대화창 배지 (스프라이트 키 → 화면 표기)
const SPEAKER_NAME = { seoyeon: "예비신부", jaehoon: "예비신랑" };
const SPEAKER_COLOR = { seoyeon: "#B8466E", jaehoon: "#2B3A55" };

/* =====================================================================
 *  2. WORLD CONSTANTS
 * ===================================================================== */
const T = 32;
const COLS = 32;
const ROWS = 17;
const W = COLS * T;
const H = ROWS * T;
// 'ㄹ'자 모래길: 좌상단 출발 → 아래 → 오른쪽 → 위 → 오른쪽 → 아래 → 우하단 골인 (각 점은 2x2 블록의 좌상단)
const PATH_WAYPOINTS = [[3, 0], [3, 13], [12, 13], [12, 3], [21, 3], [21, 13], [30, 13]];
const START = { x: 4 * T, y: 3.6 * T };
const GOAL_X = 27.4 * T;
const ARCH = { x: 29.6 * T, y: 15.05 * T };
const SPEED = 132;
const FOLLOW_GAP = 34;
const GATE_BY_ID = Object.fromEntries(QUEST_GATES.map((g) => [g.id, g]));

const PATH_GRID = (() => {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  for (let i = 0; i < PATH_WAYPOINTS.length - 1; i++) {
    const [ax, ay] = PATH_WAYPOINTS[i];
    const [bx, by] = PATH_WAYPOINTS[i + 1];
    for (let y = Math.min(ay, by); y <= Math.max(ay, by) + 1; y++)
      for (let x = Math.min(ax, bx); x <= Math.max(ax, bx) + 1; x++)
        if (x < COLS && y < ROWS) g[y][x] = true;
  }
  return g;
})();
const isPath = (tx, ty) => tx >= 0 && ty >= 0 && tx < COLS && ty < ROWS && PATH_GRID[ty][tx];

function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* =====================================================================
 *  3. PIXEL SPRITE SYSTEM — 16 x 24 그리드 문자열 (공백은 가독성용, 무시됨)
 * ===================================================================== */
const PAL = {
  k: "#2A1C1C", s: "#FFE0C8", S: "#F0BC9C", e: "#2E1E1A", w: "#FFFFFF", b: "#F7A3A8", m: "#C9504E", R: "#FF4766",
  h: "#8A5634", H: "#6A3E22", l: "#B47A4E",
  c: "#F5E6C8", C: "#D9C49C", o: "#A9845A", j: "#4B6B94", J: "#38557C", x: "#FFFFFF", f: "#6A4028",
  n: "#1C1C26", N: "#3C3E52", v: "#2B3A55", V: "#1C2740", p: "#3C3C46", P: "#2A2A32", g: "#141418",
  d: "#FFFFFF", D: "#DCE2EE", t: "#FFD23F", T: "#F59E0B",
  a: "#D8DCE4", A: "#8C94A2", y: "#FFB800", Y: "#FFE27A", O: "#C98400",
  z: "#FF8820", Z: "#FFC070", X: "#B8540C", r: "#8E1020", G: "#3FA34D", q: "#E0453A",
};
const PAL_TUX = { ...PAL, v: "#1B1B22", V: "#30303C", p: "#1E1E26", P: "#121218" };

const G = (...rows) => rows.map((r) => r.replace(/\s+/g, ""));

const stamp = (grid, row, col, rows) => {
  const out = grid.slice();
  rows.forEach((r, i) => {
    const y = row + i;
    if (y < 0 || y >= out.length) return;
    const chars = out[y].split("");
    for (let k = 0; k < r.length; k++) if (r[k] !== "." && r[k] !== " ") chars[col + k] = r[k];
    out[y] = chars.join("");
  });
  return out;
};

const HEADS = {
  seoyeon: {
    front: G(
      "...k kkkk kkkk k...", "..kh hhhh hhhh hk..", ".khh hlll hhhh hhk.", ".khh llhh hhhh hhk.",
      "khhh hhhh hhhh hhhk", "khhh hhhh hhhs shhk", "khhs hhss ssss shhk", "khss ssss ssss sshk",
      "khss wess ssew sshk", "khss eess ssee sshk", "khsb bssm mssb bshk", "khhs ssss ssss shhk",
      "khhh kkss sskk hhhk"
    ),
    side: G(
      "...k kkkk kkkk ....", "..kh hhhh hhhh k...", ".khh hlll hhhh hk..", "khhh llhh hhhh hhk.",
      "khhh hhhh hhhh hhk.", "khhh hhhh hhss shk.", "khhh hhhh ssss sssk", "khhh hhhs ssss sssk",
      "khhh hhhs ssss wesk", "khhh hhhs ssss eesk", "khhh hhhs sssb bsmk", "khhh hhhh ssss ssk.",
      "khhh hhhh kssk ...."
    ),
    back: G(
      "...k kkkk kkkk k...", "..kh hhhh hhhh hk..", ".khh hlll hhhh hhk.", ".khh llhh hhhh hhk.",
      "khhh hhhh hhhh hhhk", "khhh hhhh hhhh hhhk", "khhh Hhhh hhhH hhhk", "khhh hhhh hhhh hhhk",
      "khhH hhhh hhhh Hhhk", "khhh hhHh hHhh hhhk", "khhh hhhh hhhh hhhk", "khhH hhhh hhhh Hhhk",
      "khhh hhhh hhhh hhhk"
    ),
  },
  jaehoon: {
    front: G(
      "...k kkkk kkkk k...", "..kn nnnn nnnn nk..", ".knn NNnn nnnn nnk.", ".knn nnnn nnnN nnk.",
      "knnn nnnn nnnn nnnk", "knnn nnnn nnnn nnnk", "knns nnns snnn snnk", "knss ssss ssss ssnk",
      "ksss wess ssew sssk", "ksss eess ssee sssk", "ksss sssm msss sssk", ".kss ssss ssss ssk.",
      "..kk kkss sskk kk.."
    ),
    side: G(
      "...k kkkk kkkk ....", "..kn nnnn nnnn k...", ".knn nNNn nnnn nk..", ".knn nnnn nnnn nnk.",
      ".knn nnnn nnnn nnk.", ".knn nnnn nnnn nnk.", ".knn nnnn nsss snk.", ".knn nnss ssss sssk",
      ".knn nsSs ssss wesk", ".knn nsss ssss eesk", "..kn ssss ssss smsk", "...k ssss ssss ssk.",
      ".... kkss skkk ...."
    ),
    back: G(
      "...k kkkk kkkk k...", "..kn nnnn nnnn nk..", ".knn nNNn nnnn nnk.", ".knn nnnn nnnN nnk.",
      "knnn nnnn nnnn nnnk", "knnn Nnnn nnnN nnnk", "knnn nnnn nnnn nnnk", "knnn nnNn nNnn nnnk",
      "knnn nnnn nnnn nnnk", "knnn nnnn nnnn nnnk", "kSnn nnnn nnnn nnSk", ".kSn nnnn nnnn nSk.",
      "..kk kkss sskk kk.."
    ),
  },
};

// 표정 4종: rows 7~10, cols 2~13 (12칸)
const EXPR = {
  default: G("............", "..we....ew..", "..ee....ee..", ".bb..mm..bb."),
  smile: G("............", "..e......e..", ".e.e....e.e.", ".bb.mmmm.bb."),
  determined: G("..kk....kk..", "..ee....ee..", "..ew....we..", ".bb..kk..bb."),
  heart: G("............", ".R.R....R.R.", ".RRR....RRR.", "..R..mm..R.."),
};

const BODIES = {
  seoyeon: {
    front: G(
      "khhk cccw wccc khhk", "khkc ccco cccc ckhk", "kCkc ccco cccc ckCk", "kCkc cccc cccc ckCk",
      "kskc ccco cccc cksk", ".kkj jjjj jjjj jkk.", ".kjj Jjjj Jjjj jjk.", ".kkk kkkk kkkk kkk."
    ),
    back: G(
      "khhh hhhh hhhh hhhk", "khhh hhhh hhhh hhhk", "kCkh hhhh hhhh hkCk", "kCkc cccc cccc ckCk",
      "kskc cccc cccc cksk", ".kkj jjjj jjjj jkk.", ".kjj Jjjj Jjjj jjk.", ".kkk kkkk kkkk kkk."
    ),
    side: G(
      "..kh hhhc ccck ....", "..kh hhcc cccc k...", "..kh hcCC cccc k...", "...k hcCC cccc k...",
      "...k ccss cccc k...", "...k jjjj jjjj k...", "..kj jjjj jjjj jk..", "..kk kkkk kkkk kk.."
    ),
  },
  jaehoon: {
    front: G(
      "kvvv vkww wwkv vvvk", "kvvv vkww wwkv vvvk", "kVvv vvkw wkvv vvVk", "kVkv vvkw wkvv vkVk",
      "kskv vvvw wvvv vksk", ".kkv vvvv vvvv vkk.", "..kp pppp pppp pk..", "..kp ppPk kPpp pk.."
    ),
    back: G(
      "kvvv vvvv vvvv vvvk", "kvvv vvvv vvvv vvvk", "kVvv vvvv vvvv vvVk", "kVkv vvvV Vvvv vkVk",
      "kskv vvvv vvvv vksk", ".kkv vvvv vvvv vkk.", "..kp pppp pppp pk..", "..kp ppPk kPpp pk.."
    ),
    side: G(
      "...k vvvv vwwk ....", "...k vvvv vvwk ....", "...k vVVv vvvk ....", "...k vVVv vvvk ....",
      "...k vssv vvvk ....", "...k vvvv vvvk ....", "...k pppp pppk ....", "...k pppp pppk ...."
    ),
  },
};

const LEGS = {
  seoyeon: {
    front: [
      G("...k ssk. .kss k...", "...k xxk. .kxx k...", "..kf ffk. .kff fk.."),
      G("...k ssk. .kss k...", "..kf ffk. .kxx k...", "...k kk.. .kff fk.."),
    ],
    side: [
      G(".... .kss k... ....", ".... .kxx k... ....", ".... .kff fk.. ...."),
      G(".... kssk ssk. ....", "...k xxk. kxxk ....", "..kf fk.. kffk ...."),
    ],
  },
  jaehoon: {
    front: [
      G("...k pppk kppp k...", "...k pPpk kpPp k...", "..kg ggk. .kgg gk.."),
      G("...k pppk kppp k...", "..kg ggkk kpPp k...", "...k kkk. .kgg gk.."),
    ],
    side: [
      G(".... kppp k... ....", ".... kpPp k... ....", ".... kggg gk.. ...."),
      G("...k ppkp pk.. ....", "..kp pk.k ppk. ....", "..kg gk.k ggk. ...."),
    ],
  },
};

const DRESS_FRONT = G(
  "khhk sddd ddds khhk", "khks dddd dddd skhk", "kwkd dDdd ddDd dkwk", "kwkd dddd dddd dkwk",
  "kskd dDdd ddDd dksk", ".kdd dddd dddd ddk.", ".kdD dddd dddd Ddk.", "kddd Dddd dddD dddk",
  "kdDd ddDd dDdd dDdk", "kDdd dDdd ddDd ddDk", "kkkk kkkk kkkk kkkk"
);
const DRESS_BACK = stamp(DRESS_FRONT, 0, 0, G("khhh hhhh hhhh hhhk", "khhh hhhh hhhh hhhk", "kwkh hhhh hhhh hkwk"));
const DRESS_SIDE = stamp(DRESS_FRONT, 0, 0, G("..kh hhhd dddk ....", "..kh hhdd dddd k...", "..kh hddd dddd k..."));
const TIARA = G(".... ..t. .t.. ....", ".... tYtt ttYt ....");
const BOWTIE = G(".... ...k k... ....");

const LOCK = G(
  "...kkkkkk...", "..kaaaaaak..", ".kaAkkkkAak.", ".kak....kak.", ".kak....kak.", "kkkkkkkkkkkk",
  "kYYyyyyyyyOk", "kYyyyyyyyyOk", "kYyyykkyyyOk", "kyyyykkyyyOk", "kyyyykkyyyOk", "kOyyyyyyyyOk",
  "kOOOOOOOOOOk", "kkkkkkkkkkkk"
);
const LOCK_OPEN = G(
  "...kkkkkk...", "..kaaaaaak..", ".kaAkkkkAak.", ".kak....kak.", ".kak....kak.", ".kak....kkk.",
  ".kak........", "kkkkkkkkkkkk", "kYYyyyyyyyOk", "kYyyykkyyyOk", "kyyyykkyyyOk", "kyyyykkyyyOk",
  "kOyyyyyyyyOk", "kkkkkkkkkkkk"
);
const TRIANGLE = G("kkkkkkkkkk", "kZZzzzzzXk", ".kZzzzzXk.", "..kzzzXk..", "...kzXk...", "....kk....");
const RING_BOX = G("..kkkk..", ".kyYyyk.", ".kykkyk.", "kkkyykkk", "kRRRRRRk", "kRRRRRrk", "krrrrrrk", "kkkkkkkk");
const STAR = G("..Y..", "..Y..", "YYwYY", "..Y..", "..Y..");
const CHECK = G("......kk", ".....kGk", "kk..kGk.", "kGkkGk..", ".kGGk...", "..kk....");
const CROSS = G("kk....kk", "kqk..kqk", ".kqkkqk.", "..kqqk..", ".kqkkqk.", "kqk..kqk", "kk....kk");

const spriteCache = new Map();
function getSprite(who, view, outfit, frame = 0, expr = "default", bustOnly = false) {
  const key = [who, view, outfit, frame, expr, bustOnly].join("|");
  if (spriteCache.has(key)) return spriteCache.get(key);
  let head = HEADS[who][view].slice();
  if (view === "front") {
    head = stamp(head, 7, 2, Array(4).fill("ssssssssssss"));
    const ex = EXPR[expr] || EXPR.default;
    head = stamp(head, 7, 2, who === "jaehoon" ? ex.map((r) => r.replace(/b/g, ".")) : ex);
  }
  let body;
  if (who === "seoyeon" && outfit === "wedding") {
    body = view === "back" ? DRESS_BACK : view === "side" ? DRESS_SIDE : DRESS_FRONT;
    head = stamp(head, 0, 0, TIARA);
  } else {
    const legView = view === "side" ? "side" : "front";
    body = [...BODIES[who][view], ...LEGS[who][legView][frame % 2]];
  }
  let grid = [...head, ...(bustOnly ? body.slice(0, 5) : body)];
  if (who === "jaehoon" && outfit === "wedding" && view === "front") grid = stamp(grid, 13, 0, BOWTIE);
  const palette = who === "jaehoon" && outfit === "wedding" ? PAL_TUX : PAL;
  const res = { grid, palette };
  spriteCache.set(key, res);
  return res;
}

const PixelArt = memo(function PixelArt({ grid, palette = PAL, px = 2, style, className }) {
  const rects = useMemo(() => {
    const out = [];
    grid.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (ch === ".") { x++; continue; }
        let x2 = x + 1;
        while (x2 < row.length && row[x2] === ch) x2++;
        out.push(<rect key={`${y}-${x}`} x={x} y={y} width={x2 - x} height={1.04} fill={palette[ch] || "#f0f"} />);
        x = x2;
      }
    });
    return out;
  }, [grid, palette]);
  const w = Math.max(...grid.map((r) => r.length));
  const h = grid.length;
  return (
    <svg width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible", ...style }} className={className}>
      {rects}
    </svg>
  );
});

/* =====================================================================
 *  4. MAP & PROP ARTWORK (procedural pixel SVG)
 * ===================================================================== */
function useRects(build, deps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    const out = [];
    let k = 0;
    const r = (x, y, w, h, fill) => out.push(<rect key={k++} x={x} y={y} width={w} height={h} fill={fill} />);
    const meta = build(r, out, () => k++) || {};
    return { out, ...meta };
  }, deps);
}

const GRASS = "#90C848";
const GRASS_DARK = "#68A830";
const DIRT = "#E8C898";
const DIRT_EDGE = "#D0A878";
const DIRT_LINE = "#B48A5C";

function hFence(r, x1, x2, y) {
  r(x1, y - 16, x2 - x1, 4, "#8E949C");
  r(x1, y - 15, x2 - x1, 2, "#F4F4F4");
  r(x1, y - 8, x2 - x1, 4, "#8E949C");
  r(x1, y - 7, x2 - x1, 2, "#E4E6EA");
  for (let x = x1 + 10; x < x2 - 12; x += 10) {
    r(x, y - 22, 6, 22, "#8E949C");
    r(x + 2, y - 24, 2, 2, "#8E949C");
    r(x + 1, y - 21, 4, 20, "#F4F4F4");
    r(x + 2, y - 22, 2, 1, "#F4F4F4");
    r(x + 4, y - 20, 1, 18, "#D2D6DC");
  }
  [x1, x2 - 10].forEach((px) => {
    r(px, y - 28, 10, 30, "#4A2C14");
    r(px + 1, y - 27, 8, 28, "#A66B38");
    r(px + 1, y - 27, 3, 28, "#C48650");
    r(px + 1, y - 27, 8, 3, "#7A4A22");
  });
}
function vFence(r, x, y1, y2) {
  r(x - 3, y1, 6, y2 - y1, "#8E949C");
  r(x - 2, y1, 4, y2 - y1, "#F4F4F4");
  for (let y = y1 + 6; y < y2; y += 8) r(x - 2, y, 4, 1, "#C8CCD2");
  [y1, y2 - 14].forEach((py) => {
    r(x - 6, py - 4, 12, 18, "#4A2C14");
    r(x - 5, py - 3, 10, 16, "#A66B38");
    r(x - 5, py - 3, 4, 16, "#C48650");
    r(x - 5, py - 3, 10, 3, "#7A4A22");
  });
}

const Ground = memo(function Ground() {
  const { out } = useRects((r) => {
    const rand = rng(7);
    r(0, 0, W, H, GRASS);
    for (let ty = 0; ty < ROWS; ty++)
      for (let tx = 0; tx < COLS; tx++) if (!isPath(tx, ty) && (tx + ty) % 2 === 0) r(tx * T, ty * T, T, T, "#8DC545");
    // dirt path tiles
    const grassAt = (tx, ty) => tx >= 0 && ty >= 0 && tx < COLS && ty < ROWS && !PATH_GRID[ty][tx];
    for (let ty = 0; ty < ROWS; ty++)
      for (let tx = 0; tx < COLS; tx++) {
        if (!isPath(tx, ty)) continue;
        const x = tx * T, y = ty * T;
        r(x, y, T, T, DIRT);
        for (let i = 0; i < 3; i++) r(x + Math.floor(rand() * 28), y + Math.floor(rand() * 28), 2, 2, "#DDB884");
        if (rand() < 0.12) { const px = x + 6 + Math.floor(rand() * 18), py = y + 6 + Math.floor(rand() * 18); r(px, py, 4, 3, "#C9B79A"); r(px, py, 2, 1, "#F2EAD8"); }
        const up = grassAt(tx, ty - 1), dn = grassAt(tx, ty + 1), lf = grassAt(tx - 1, ty), rt = grassAt(tx + 1, ty);
        if (up) { r(x, y, T, 5, DIRT_EDGE); r(x, y, T, 2, DIRT_LINE); for (let i = 2; i < T; i += 10) r(x + i, y, 5, 3, GRASS_DARK); }
        if (dn) { r(x, y + T - 5, T, 5, DIRT_EDGE); r(x, y + T - 2, T, 2, DIRT_LINE); for (let i = 6; i < T; i += 10) r(x + i, y + T - 3, 5, 3, GRASS_DARK); }
        if (lf) { r(x, y, 5, T, DIRT_EDGE); r(x, y, 2, T, DIRT_LINE); for (let i = 4; i < T; i += 10) r(x, y + i, 3, 5, GRASS_DARK); }
        if (rt) { r(x + T - 5, y, 5, T, DIRT_EDGE); r(x + T - 2, y, 2, T, DIRT_LINE); for (let i = 8; i < T; i += 10) r(x + T - 3, y + i, 3, 5, GRASS_DARK); }
        // rounded outer corners
        const corner = (cx, cy, sx, sy) => { r(cx, cy, 6 * sx, 3 * sy, GRASS); r(cx, cy, 3 * sx, 6 * sy, GRASS); };
        if (up && lf) corner(x, y, 1, 1);
        if (up && rt) { r(x + T - 6, y, 6, 3, GRASS); r(x + T - 3, y, 3, 6, GRASS); }
        if (dn && lf) { r(x, y + T - 3, 6, 3, GRASS); r(x, y + T - 6, 3, 6, GRASS); }
        if (dn && rt) { r(x + T - 6, y + T - 3, 6, 3, GRASS); r(x + T - 3, y + T - 6, 3, 6, GRASS); }
        // inner corners
        if (!up && !lf && grassAt(tx - 1, ty - 1)) { r(x, y, 5, 5, DIRT_EDGE); r(x, y, 3, 3, DIRT_LINE); }
        if (!up && !rt && grassAt(tx + 1, ty - 1)) { r(x + T - 5, y, 5, 5, DIRT_EDGE); r(x + T - 3, y, 3, 3, DIRT_LINE); }
        if (!dn && !lf && grassAt(tx - 1, ty + 1)) { r(x, y + T - 5, 5, 5, DIRT_EDGE); r(x, y + T - 3, 3, 3, DIRT_LINE); }
        if (!dn && !rt && grassAt(tx + 1, ty + 1)) { r(x + T - 5, y + T - 5, 5, 5, DIRT_EDGE); r(x + T - 3, y + T - 3, 3, 3, DIRT_LINE); }
      }
    // grass details: tufts, wild flowers, pebbles
    for (let i = 0; i < 340; i++) {
      const x = Math.floor(rand() * (W - 10)), y = Math.floor(rand() * (H - 10));
      const tx = Math.floor((x + 4) / T), ty = Math.floor((y + 4) / T);
      if (isPath(tx, ty) || isPath(Math.floor((x + 9) / T), Math.floor((y + 8) / T)) || isPath(Math.floor(x / T), Math.floor(y / T))) continue;
      const roll = rand();
      if (roll < 0.72) {
        r(x, y + 2, 2, 4, GRASS_DARK); r(x + 3, y, 2, 6, GRASS_DARK); r(x + 6, y + 2, 2, 4, GRASS_DARK); r(x + 3, y, 2, 1, "#A8D860");
      } else if (roll < 0.9) {
        const c = rand() < 0.5 ? "#FFFFFF" : rand() < 0.5 ? "#FFE15A" : "#F7A6C0";
        r(x + 2, y, 2, 2, c); r(x, y + 2, 2, 2, c); r(x + 4, y + 2, 2, 2, c); r(x + 2, y + 4, 2, 2, c); r(x + 2, y + 2, 2, 2, "#F5B82E"); r(x + 2, y + 6, 2, 2, GRASS_DARK);
      } else {
        r(x, y, 7, 5, "#8E949C"); r(x + 1, y, 5, 4, "#CDD1D6"); r(x + 1, y, 2, 1, "#F4F6F8");
      }
    }
    // fences (외곽 울타리)
    hFence(r, 4, 2.5 * T, 30);
    hFence(r, 5.5 * T, W - 4, 30);
    hFence(r, 4, W - 4, H - 2);
    vFence(r, 8, 36, H - 24);
    vFence(r, W - 8, 36, 12.4 * T);
    vFence(r, W - 8, 15.6 * T, H - 24);
  }, []);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" style={{ position: "absolute", left: 0, top: 0, zIndex: 0 }}>
      {out}
    </svg>
  );
});

const Shadow = ({ cx, cy, rx, ry = 5 }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(20,40,10,0.22)" />;

const Tree = memo(function Tree({ r: R, seed }) {
  const { out, w, h } = useRects((r, list, key) => {
    const rand = rng(seed);
    const c = 4;
    const n = Math.ceil((2 * R) / c) + 1;
    const w = n * c;
    const trunkH = Math.round(R * 0.5);
    const h = w + trunkH;
    list.push(<Shadow key={key()} cx={w / 2} cy={h - 5} rx={R * 0.85} ry={6} />);
    const tw = Math.max(10, Math.round(R * 0.2) * 2), tx = w / 2 - tw / 2, ty = w - 14;
    r(tx - 2, ty, tw + 4, trunkH + 10, "#3E2410");
    r(tx, ty, tw, trunkH + 8, "#8B5A2B"); r(tx, ty, 3, trunkH + 8, "#A8723C"); r(tx + tw - 3, ty, 3, trunkH + 8, "#6A4220");
    r(tx - 7, h - 10, 7, 5, "#3E2410"); r(tx - 5, h - 9, 5, 3, "#8B5A2B");
    r(tx + tw, h - 10, 7, 5, "#3E2410"); r(tx + tw, h - 9, 5, 3, "#8B5A2B");
    const ph = seed * 1.7;
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const cx = (i + 0.5) * c - w / 2, cy = (j + 0.5) * c - w / 2;
        const d = Math.hypot(cx, cy);
        const wob = Math.sin(Math.atan2(cy, cx) * 9 + ph) * 2.6;
        if (d > R + wob) continue;
        const edge = d > R + wob - c;
        const shade = (-cx * 0.55 - cy * 0.85) / R;
        let col = "#3E9A34";
        if (shade > 0.45) col = "#7ACB52"; else if (shade > 0.05) col = "#55B23E"; else if (shade < -0.5) col = "#2B7429";
        const rr = rand();
        if (!edge && rr < 0.1) col = shade > 0 ? "#92DA66" : "#347F2E";
        if (edge) col = "#1E521F";
        r(i * c, j * c, c, c, col);
        if (!edge && rr > 0.93 && shade > -0.2) r(i * c, j * c + c, c, 2, "#2E7A2A");
      }
    return { w, h };
  }, [R, seed]);
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const Bush = memo(function Bush({ r: R, seed, flowers = true }) {
  const { out, w, h } = useRects((r, list, key) => {
    const rand = rng(seed);
    const c = 4, n = Math.ceil((2 * R) / c) + 1, w = n * c, h = Math.round(w * 0.78) + 4;
    list.push(<Shadow key={key()} cx={w / 2} cy={h - 4} rx={R} ry={5} />);
    const cyc = h - 4 - R * 0.72;
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * c - w / 2, y = (j + 0.5) * c - cyc;
        const d = Math.hypot(x, y / 0.72);
        const wob = Math.sin(Math.atan2(y, x) * 7 + seed) * 2.4;
        if (d > R + wob) continue;
        const edge = d > R + wob - c;
        const shade = (-x * 0.5 - y * 0.9) / R;
        let col = shade > 0.35 ? "#6CC548" : shade > -0.3 ? "#46A836" : "#2E7E2A";
        if (edge) col = "#1E521F";
        r(i * c, j * c, c, c, col);
        if (flowers && !edge && rand() < 0.13) { r(i * c, j * c, 4, 4, "#F59AB8"); r(i * c + 1, j * c + 1, 2, 2, "#FFF0F5"); }
      }
    return { w, h };
  }, [R, seed, flowers]);
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const Log = memo(function Log() {
  const { out } = useRects((r, list, key) => {
    list.push(<Shadow key={key()} cx={34} cy={28} rx={30} ry={4} />);
    r(4, 8, 54, 20, "#3E2410"); r(6, 10, 50, 16, "#9A6A3A"); r(6, 10, 50, 4, "#B8854C"); r(6, 22, 50, 4, "#74482A");
    for (let i = 0; i < 4; i++) r(12 + i * 11, 15, 7, 2, "#74482A");
    r(54, 6, 12, 24, "#3E2410"); r(56, 8, 8, 20, "#D9A866"); r(58, 12, 4, 12, "#B07A40"); r(59, 16, 2, 4, "#8B5A2B");
    r(10, 5, 16, 6, "#1E521F"); r(11, 6, 14, 4, "#6DB33F"); r(12, 6, 6, 2, "#9AD86A");
    r(32, 6, 12, 5, "#1E521F"); r(33, 7, 10, 3, "#6DB33F");
    r(22, 0, 6, 10, "#3E2410"); r(23, 1, 4, 9, "#9A6A3A");
    r(2, 24, 4, 5, GRASS_DARK); r(44, 26, 4, 4, GRASS_DARK);
  }, []);
  return <svg width={68} height={32} viewBox="0 0 68 32" shapeRendering="crispEdges" style={{ display: "block" }}>{out}</svg>;
});

const Mushrooms = memo(function Mushrooms() {
  const { out } = useRects((r, list, key) => {
    list.push(<Shadow key={key()} cx={16} cy={22} rx={14} ry={3} />);
    const shroom = (x, y, s, cap) => {
      r(x + s, y + s * 2, s * 2, s * 3, "#4A2C14"); r(x + s + 1, y + s * 2, s * 2 - 2, s * 3 - 1, "#F3E2C4");
      r(x - 1, y - 1, s * 4 + 2, s * 2 + 2, "#4A2C14"); r(x, y, s * 4, s * 2, cap); r(x + 1, y, s, 2, "#FFFFFF"); r(x + s * 3 - 1, y + 2, 2, 2, "#FFFFFF");
    };
    shroom(2, 8, 3, "#C8743A");
    shroom(16, 4, 4, "#B8582E");
    shroom(24, 14, 2, "#D08A50");
  }, []);
  return <svg width={36} height={26} viewBox="0 0 36 26" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const FlowerPatch = memo(function FlowerPatch({ seed = 1 }) {
  const { out } = useRects((r) => {
    const rand = rng(seed);
    for (let i = 0; i < 9; i++) {
      const x = 2 + Math.floor(rand() * 40), y = 6 + Math.floor(rand() * 14);
      r(x + 2, y + 5, 2, 6, "#3E8E2E"); r(x + 4, y + 8, 3, 2, "#55B23E");
      const c = rand() < 0.65 ? "#FFE04A" : "#FFFFFF";
      r(x + 2, y, 2, 2, c); r(x, y + 2, 2, 2, c); r(x + 4, y + 2, 2, 2, c); r(x + 2, y + 4, 2, 2, c); r(x + 2, y + 2, 2, 2, "#E88A1A");
    }
    for (let i = 0; i < 4; i++) { const x = Math.floor(rand() * 40), y = 14 + Math.floor(rand() * 8); r(x, y, 2, 5, GRASS_DARK); r(x + 3, y - 2, 2, 7, GRASS_DARK); }
  }, [seed]);
  return <svg width={48} height={32} viewBox="0 0 48 32" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const SignPost = memo(function SignPost({ num, arrow }) {
  const { out } = useRects((r, list, key) => {
    list.push(<ellipse key={key()} cx={20} cy={39} rx={13} ry={4} fill="#B88A5A" />);
    list.push(<ellipse key={key()} cx={20} cy={38} rx={9} ry={2.5} fill="#8E6236" />);
    r(16, 16, 8, 24, "#3A200C"); r(17, 16, 6, 23, "#9E6334"); r(17, 16, 2, 23, "#B87A44");
    const flip = arrow === "left";
    const X = (x, w) => (flip ? 40 - x - w : x);
    const rr = (x, y, w, h, f) => r(X(x, w), y, w, h, f);
    rr(1, 2, 30, 18, "#3A200C");
    rr(31, 4, 3, 14, "#3A200C"); rr(34, 6, 2, 10, "#3A200C"); rr(36, 8, 2, 6, "#3A200C"); rr(38, 10, 1, 2, "#3A200C");
    rr(2, 3, 29, 16, "#B07440"); rr(31, 5, 2, 12, "#B07440"); rr(33, 7, 2, 8, "#B07440"); rr(35, 9, 1, 4, "#B07440");
    rr(2, 3, 29, 3, "#CC8C52"); rr(2, 15, 29, 4, "#8E5A2C"); rr(5, 9, 6, 1, "#8E5A2C"); rr(22, 12, 7, 1, "#8E5A2C");
    list.push(
      <text key={key()} x={flip ? 23 : 17} y={16} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="10" fill="#3A200C">{num}</text>
    );
    r(10, 37, 4, 3, GRASS_DARK); r(27, 36, 3, 4, GRASS_DARK);
  }, [num, arrow]);
  return <svg width={40} height={42} viewBox="0 0 40 42" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const StartBanner = memo(function StartBanner() {
  const { out } = useRects((r, list, key) => {
    [0, 92].forEach((x) => {
      r(x + 1, 74, 10, 6, "#5C626C"); r(x + 2, 75, 8, 4, "#8A9099");
      r(x + 3, 4, 6, 72, "#4A5058"); r(x + 4, 4, 4, 71, "#C4CAD4"); r(x + 4, 4, 2, 71, "#EEF1F5");
      r(x + 2, 0, 8, 6, "#4A5058"); r(x + 3, 1, 6, 4, "#DDE2E8");
    });
    r(9, 8, 86, 32, "#0E2E66"); r(10, 9, 84, 30, "#2868C8"); r(10, 9, 84, 4, "#4C8CEB"); r(10, 34, 84, 5, "#1C50A0");
    r(9, 6, 4, 4, "#0E2E66"); r(91, 6, 4, 4, "#0E2E66");
    list.push(<text key={key()} x={53} y={30} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="11" fill="#0E2E66">START »</text>);
    list.push(<text key={key()} x={52} y={29} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="11" fill="#FFFFFF">START »</text>);
  }, []);
  return <svg width={104} height={82} viewBox="0 0 104 82" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const WeddingArch = memo(function WeddingArch() {
  const { out } = useRects((r, list, key) => {
    const rand = rng(28);
    const c = 4, w = 124, h = 176, cx = 62, cy = 66, ro = 58, ri = 42;
    list.push(<Shadow key={key()} cx={cx} cy={h - 5} rx={58} ry={5} />);
    const cells = [];
    for (let j = 0; j < h / c; j++)
      for (let i = 0; i < w / c; i++) {
        const x = i * c + 2, y = j * c + 2;
        let inside = false, edge = false, right = false;
        if (y <= cy) {
          const d = Math.hypot(x - cx, y - cy);
          inside = d <= ro && d >= ri;
          edge = inside && (d > ro - c || d < ri + c);
          right = x > cx;
        } else if (y < h - 10) {
          inside = (x >= cx - ro && x <= cx - ri) || (x >= cx + ri && x <= cx + ro);
          edge = inside && (x < cx - ro + c || x > cx + ro - c || Math.abs(x - (cx - ri)) < c || Math.abs(x - (cx + ri)) < c);
          right = x > cx;
        }
        if (!inside) continue;
        r(i * c, j * c, c, c, edge ? "#9AA2B0" : right ? "#E2E6EE" : "#FAFBFD");
        cells.push([i * c, j * c]);
      }
    // blossoms + leaves wrapped around the arch
    cells.forEach(([x, y]) => {
      const p = rand();
      if (p < 0.2) { r(x - 2, y, 6, 6, "#4E9A3E"); r(x - 1, y + 1, 4, 3, "#6CC04A"); }
      else if (p < 0.5) {
        const pc = rand() < 0.5 ? "#F7B7CB" : "#EE8FB0";
        r(x - 2, y - 2, 8, 8, "#C25A80"); r(x - 1, y - 1, 6, 6, pc); r(x + 1, y + 1, 2, 2, "#FFE8F0");
      }
    });
    // base planters
    [cx - ro - 4, cx + ri - 4].forEach((x) => { r(x, h - 14, ro - ri + 8, 10, "#3E2410"); r(x + 1, h - 13, ro - ri + 6, 8, "#A66B38"); r(x + 1, h - 13, ro - ri + 6, 2, "#C48650"); });
    // hanging sign 2028 WEDDING
    r(cx - 20, cy - 20, 2, 26, "#5A3A1E"); r(cx + 18, cy - 20, 2, 26, "#5A3A1E");
    r(cx - 28, cy + 4, 56, 30, "#3A200C"); r(cx - 27, cy + 5, 54, 28, "#B07440"); r(cx - 27, cy + 5, 54, 3, "#CC8C52"); r(cx - 27, cy + 29, 54, 4, "#8E5A2C");
    list.push(<text key={key()} x={cx} y={cy + 18} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="8" fill="#3A200C">2028</text>);
    list.push(<text key={key()} x={cx} y={cy + 28} textAnchor="middle" fontFamily="'Press Start 2P', monospace" fontSize="6.5" fill="#3A200C">WEDDING</text>);
    // fallen petals
    for (let i = 0; i < 9; i++) r(8 + Math.floor(rand() * 108), h - 8 + Math.floor(rand() * 6), 3, 2, "#F7B7CB");
  }, []);
  return <svg width={124} height={180} viewBox="0 0 124 180" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

const Rock = memo(function Rock() {
  const { out } = useRects((r, list, key) => {
    const rand = rng(91);
    const c = 4, w = 68, h = 56, cx = 34, cy = 30, rx = 31, ry = 24;
    list.push(<Shadow key={key()} cx={cx} cy={h - 4} rx={30} ry={5} />);
    for (let j = 0; j < h / c; j++)
      for (let i = 0; i < w / c; i++) {
        const x = i * c + 2 - cx, y = j * c + 2 - cy;
        const d = Math.hypot(x / rx, y / ry);
        const wob = 0.06 * Math.sin(Math.atan2(y, x) * 5 + 1.3);
        if (d > 1 + wob || j * c + 2 > h - 6) continue;
        const edge = d > 1 + wob - 0.13 || j * c + 2 > h - 10;
        const facet = Math.floor((Math.atan2(y, x) + Math.PI) / (Math.PI / 3));
        const shade = (-x / rx) * 0.5 + (-y / ry) * 0.9 + (facet % 2 ? 0.12 : -0.05);
        let col = shade > 0.55 ? "#B4B8C2" : shade > 0.15 ? "#989CA8" : shade > -0.35 ? "#787C88" : "#4E525A";
        if (edge) col = "#2E3036";
        r(i * c, j * c, c, c, col);
      }
    r(14, 22, 2, 8, "#4E525A"); r(16, 28, 2, 6, "#4E525A"); r(50, 18, 2, 8, "#4E525A"); r(48, 24, 2, 4, "#4E525A");
    for (let i = 0; i < 4; i++) { const x = 4 + Math.floor(rand() * 60); r(x, h - 8, 2, 5, GRASS_DARK); r(x + 3, h - 10, 2, 7, GRASS_DARK); }
  }, []);
  return <svg width={68} height={56} viewBox="0 0 68 56" shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>{out}</svg>;
});

// 환경 프롭 배치 (x = 중심 타일, y = 바닥 타일)
const PROPS = [
  { type: "tree", r: 40, x: 8.4, y: 6.1, seed: 3 },
  { type: "tree", r: 24, x: 10.7, y: 2.9, seed: 5 },
  { type: "tree", r: 30, x: 1.5, y: 6.3, seed: 8 },
  { type: "tree", r: 22, x: 1.4, y: 12.6, seed: 11 },
  { type: "tree", r: 40, x: 17.4, y: 13.9, seed: 13 },
  { type: "tree", r: 24, x: 19.6, y: 2.75, seed: 17 },
  { type: "tree", r: 42, x: 27.2, y: 6.6, seed: 19 },
  { type: "tree", r: 22, x: 30.5, y: 9.3, seed: 23 },
  { type: "bush", r: 18, x: 10.2, y: 9.6, seed: 2 },
  { type: "bush", r: 16, x: 15.6, y: 6.6, seed: 4 },
  { type: "bush", r: 18, x: 19.3, y: 11.4, seed: 6 },
  { type: "bush", r: 18, x: 24.9, y: 11.6, seed: 9 },
  { type: "bush", r: 14, x: 13.8, y: 2.7, seed: 12 },
  { type: "bush", r: 16, x: 25.2, y: 16.4, seed: 14, flowers: false },
  { type: "log", x: 17.4, y: 8.3 },
  { type: "log", x: 25.0, y: 2.6 },
  { type: "mush", x: 6.4, y: 6.3 },
  { type: "mush", x: 24.2, y: 7.3 },
  { type: "mush", x: 15.2, y: 16.1 },
  { type: "flowers", x: 9.6, y: 12.0, seed: 1 },
  { type: "flowers", x: 29.2, y: 3.4, seed: 2 },
  { type: "flowers", x: 15.3, y: 12.6, seed: 3 },
  { type: "flowers", x: 10.2, y: 16.3, seed: 4 },
  { type: "flowers", x: 1.5, y: 16.2, seed: 5 },
];

function PropNode({ p }) {
  let el;
  if (p.type === "tree") el = <Tree r={p.r} seed={p.seed} />;
  else if (p.type === "bush") el = <Bush r={p.r} seed={p.seed} flowers={p.flowers !== false} />;
  else if (p.type === "log") el = <Log />;
  else if (p.type === "mush") el = <Mushrooms />;
  else el = <FlowerPatch seed={p.seed} />;
  return (
    <div style={{ position: "absolute", left: p.x * T, top: p.y * T, zIndex: Math.round(p.y * T), transform: "translate(-50%, -100%)", pointerEvents: "none" }}>
      {el}
    </div>
  );
}

/* =====================================================================
 *  5. CHARACTERS
 * ===================================================================== */
const VEIL = "rgba(255,255,255,0.62)";
const Veil = ({ view, layer }) => {
  // sprite px = 2, grid 16x24 → 32x48
  if (view === "back" && layer === "front")
    return (
      <svg width={40} height={44} viewBox="0 0 20 22" shapeRendering="crispEdges" style={{ position: "absolute", left: -4, top: 2, pointerEvents: "none" }}>
        <rect x={3} y={0} width={14} height={20} fill={VEIL} />
        <rect x={2} y={6} width={16} height={15} fill={VEIL} />
        {[5, 8, 11, 14].map((x) => <rect key={x} x={x} y={1} width={1} height={19} fill="rgba(220,228,240,0.7)" />)}
        <rect x={2} y={20} width={16} height={1} fill="rgba(200,210,226,0.8)" />
      </svg>
    );
  if (layer !== "back") return null;
  if (view === "side")
    return (
      <svg width={40} height={44} viewBox="0 0 20 22" shapeRendering="crispEdges" style={{ position: "absolute", left: -6, top: 2, pointerEvents: "none" }}>
        <rect x={2} y={1} width={6} height={8} fill={VEIL} /><rect x={1} y={8} width={7} height={8} fill={VEIL} /><rect x={0} y={15} width={8} height={6} fill={VEIL} />
      </svg>
    );
  return (
    <svg width={44} height={44} viewBox="0 0 22 22" shapeRendering="crispEdges" style={{ position: "absolute", left: -6, top: 2, pointerEvents: "none" }}>
      <rect x={2} y={1} width={3} height={7} fill={VEIL} /><rect x={1} y={7} width={4} height={8} fill={VEIL} /><rect x={0} y={14} width={5} height={7} fill={VEIL} />
      <rect x={17} y={1} width={3} height={7} fill={VEIL} /><rect x={17} y={7} width={4} height={8} fill={VEIL} /><rect x={17} y={14} width={5} height={7} fill={VEIL} />
    </svg>
  );
};

const Character = memo(function Character({ who, x, y, dir, frame, bob, outfit }) {
  const view = dir === "up" ? "back" : dir === "down" ? "front" : "side";
  const flip = dir === "left";
  const { grid, palette } = getSprite(who, view, outfit, frame);
  const bride = who === "seoyeon" && outfit === "wedding";
  const ring = who === "jaehoon" && outfit === "wedding" && view === "front";
  return (
    <div style={{ position: "absolute", left: x - 16, top: y - 48, width: 32, height: 48, zIndex: Math.round(y) + 1, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 4, top: 43, width: 24, height: 7, borderRadius: "50%", background: "rgba(20,40,10,0.25)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${bob}px) scaleX(${flip ? -1 : 1})` }}>
        {bride && <Veil view={view} layer="back" />}
        <PixelArt grid={grid} palette={palette} px={2} />
        {bride && <Veil view={view} layer="front" />}
        {ring && (
          <motion.div style={{ position: "absolute", left: 26, top: 22 }} animate={{ y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <PixelArt grid={RING_BOX} px={1.6} />
          </motion.div>
        )}
      </div>
    </div>
  );
});

/* =====================================================================
 *  6. GATE (rock + lock + bouncing marker)
 * ===================================================================== */
function Burst({ count = 12, radius = 52, grid = STAR, px = 2, duration = 0.9 }) {
  return Array.from({ length: count }).map((_, i) => {
    const a = (i / count) * Math.PI * 2 + 0.3;
    const rr = radius * (0.7 + ((i * 37) % 10) / 30);
    return (
      <motion.div key={i} style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -5, marginTop: -5 }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
        animate={{ x: Math.cos(a) * rr, y: Math.sin(a) * rr, opacity: 0, scale: 1.2, rotate: 90 }}
        transition={{ duration, ease: "easeOut" }}>
        <PixelArt grid={grid} px={px} />
      </motion.div>
    );
  });
}

const PUFF = G("..kkkk..", ".kwwwwk.", "kwwwwDwk", "kwwwwwDk", "kwDwwwDk", ".kDDDDk.", "..kkkk..");

function Gate({ gate, state }) {
  const left = gate.x * T;
  const base = (gate.y + 2) * T;
  if (state === "open") return null;
  const opening = state === "opening";
  const poof = state === "poof";
  return (
    <div style={{ position: "absolute", left, top: base - 58, width: 64, height: 58, zIndex: base - 8, pointerEvents: "none" }}>
      <motion.div style={{ position: "absolute", left: -2, top: 0, originY: 1 }}
        animate={poof ? { scale: [1, 1.18, 0], opacity: [1, 1, 0] } : opening ? { x: [0, -2, 2, -2, 2, 0] } : { scale: 1 }}
        transition={poof ? { duration: 0.45 } : opening ? { duration: 0.5, repeat: 1 } : {}}>
        <Rock />
        <motion.div style={{ position: "absolute", left: 21, top: opening ? 8 : 12 }}
          animate={opening ? { y: [0, -10, -6], scale: [1, 1.25, 1.15] } : {}} transition={{ duration: 0.5 }}>
          <PixelArt grid={opening || poof ? LOCK_OPEN : LOCK} px={2.2} />
        </motion.div>
      </motion.div>
      {!opening && !poof && (
        <motion.div style={{ position: "absolute", left: 22, top: -22 }} animate={{ y: [0, -7, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
          <PixelArt grid={TRIANGLE} px={2} />
        </motion.div>
      )}
      {opening && <div style={{ position: "absolute", left: 32, top: 26 }}><Burst count={12} radius={56} /></div>}
      {poof && <div style={{ position: "absolute", left: 32, top: 30 }}><Burst count={9} radius={34} grid={PUFF} px={3} duration={0.6} /></div>}
    </div>
  );
}

/* =====================================================================
 *  7. HUD — progress bar / controls / dialog / modal
 * ===================================================================== */
function ProgressBar({ gates }) {
  const done = gates.filter((g) => g.state !== "locked").length;
  return (
    <div className="absolute left-1/2 z-40 select-none pointer-events-none" style={{ top: "max(10px, env(safe-area-inset-top, 0px))", transform: "translateX(-50%)" }}>
      <div className="wq-wood-frame">
        <div className="flex items-center gap-2 mb-1">
          <span className="wq-pixel text-[9px] text-[#FFE6B0] tracking-wider">QUEST</span>
          <span className="wq-pixel text-[9px] text-[#FFC24A] ml-auto">{done}/5</span>
        </div>
        <div className="relative" style={{ width: "min(360px, 58vw)", height: 18, background: "#3A2414", border: "2px solid #1E0F06", boxShadow: "inset 0 2px 0 #1E0F06" }}>
          <motion.div initial={false} animate={{ width: `${done * 20}%` }} transition={{ type: "spring", stiffness: 90, damping: 16 }}
            style={{ height: "100%", background: "linear-gradient(#FFD27A 0 25%, #FF9A1F 25% 75%, #D9700C 75%)" }} />
          {gates.map((g, i) => (
            <div key={g.id} style={{ position: "absolute", left: `${i * 20 + 17}%`, top: "50%", transform: "translate(-50%,-55%)" }}>
              <motion.div animate={g.state !== "locked" ? { scale: [1, 1.5, 1], rotate: [0, -12, 0] } : {}} transition={{ duration: 0.5 }}>
                <PixelArt grid={g.state !== "locked" ? LOCK_OPEN : LOCK} px={1.6} />
              </motion.div>
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: 12, marginTop: 3 }}>
          {gates.map((g, i) => (
            <span key={g.id} className="wq-pixel absolute text-[8px]" style={{ left: `${i * 20 + 17}%`, transform: "translateX(-50%)", color: g.state !== "locked" ? "#FFC24A" : "#E8D2AE" }}>{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Controls({ dpadRef, onA, visible }) {
  const bind = (dir) => ({
    onPointerDown: (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); dpadRef.current[dir] = true; },
    onPointerUp: () => { dpadRef.current[dir] = false; },
    onPointerCancel: () => { dpadRef.current[dir] = false; },
    onLostPointerCapture: () => { dpadRef.current[dir] = false; },
  });
  const Arrow = ({ rot }) => (
    <svg width="18" height="18" viewBox="0 0 9 9" shapeRendering="crispEdges" style={{ transform: `rotate(${rot}deg)` }}>
      <rect x="4" y="1" width="1" height="1" fill="#F2F2F2" /><rect x="3" y="2" width="3" height="1" fill="#F2F2F2" /><rect x="2" y="3" width="5" height="1" fill="#F2F2F2" /><rect x="1" y="4" width="7" height="1" fill="#F2F2F2" /><rect x="3" y="5" width="3" height="3" fill="#F2F2F2" />
    </svg>
  );
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="absolute z-40 flex items-end gap-3 select-none"
          style={{ right: "max(16px, env(safe-area-inset-right, 0px))", bottom: "max(16px, env(safe-area-inset-bottom, 0px))", touchAction: "none" }}>
          <div className="wq-dpad">
            <button aria-label="위" className="wq-dbtn" style={{ left: 44, top: 6 }} {...bind("up")}><Arrow rot={0} /></button>
            <button aria-label="아래" className="wq-dbtn" style={{ left: 44, top: 82 }} {...bind("down")}><Arrow rot={180} /></button>
            <button aria-label="왼쪽" className="wq-dbtn" style={{ left: 6, top: 44 }} {...bind("left")}><Arrow rot={-90} /></button>
            <button aria-label="오른쪽" className="wq-dbtn" style={{ left: 82, top: 44 }} {...bind("right")}><Arrow rot={90} /></button>
            <div style={{ position: "absolute", left: 50, top: 50, width: 26, height: 26, borderRadius: 999, background: "rgba(0,0,0,0.35)" }} />
          </div>
          <motion.button whileTap={{ scale: 0.88 }} aria-label="상호작용 A" className="wq-abtn wq-pixel" onPointerDown={(e) => { e.preventDefault(); onA(); }}>A</motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Avatar({ who, outfit, expression, px }) {
  const { grid, palette } = getSprite(who, "front", outfit, 0, expression, true);
  return (
    <div style={{ position: "relative" }}>
      {who === "seoyeon" && outfit === "wedding" && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${px / 2})`, transformOrigin: "0 0" }}><Veil view="front" layer="back" /></div>
      )}
      <PixelArt grid={grid} palette={palette} px={px} />
      <AnimatePresence>
        {expression === "heart" && (
          <motion.div key="h" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: -6 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            style={{ position: "absolute", right: -px * 2, top: -px * 2, color: "#FF4766" }}>
            <Heart size={px * 4} fill="#FF4766" strokeWidth={0} />
          </motion.div>
        )}
        {expression === "determined" && (
          <motion.div key="d" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: [1, 1.2, 1] }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{ position: "absolute", left: -px * 3, top: px, color: "#FFB800" }}>
            <Sparkles size={px * 4} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DialogBox({ line, typed, onNext, outfit, compact }) {
  const done = typed >= line.text.length;
  const px = compact ? 5 : 7;
  return (
    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="absolute left-1/2 z-50"
      style={{ bottom: "max(14px, env(safe-area-inset-bottom, 0px))", width: "min(880px, calc(100% - 32px))", x: "-50%" }}>
      <div className="wq-dialog" onClick={onNext} role="button" tabIndex={0} aria-label="다음 대사">
        {["tl", "tr", "bl", "br"].map((c) => <span key={c} className={`wq-corner wq-${c}`} />)}
        <div className="wq-nameplate" style={{ background: SPEAKER_COLOR[line.speaker] }}>[{SPEAKER_NAME[line.speaker]}]</div>
        <p className="wq-dialog-text" style={{ paddingRight: px * 16 + 18 }}>
          {line.text.slice(0, typed)}
          <span style={{ opacity: 0 }}>{line.text.slice(typed)}</span>
        </p>
        {done && (
          <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 0.7, repeat: Infinity }} className="absolute" style={{ right: px * 16 + 24, bottom: 12 }}>
            <PixelArt grid={G("kkkkkkk", ".kzzzk.", "..kzk..", "...k...")} px={2.5} />
          </motion.div>
        )}
        <AnimatePresence mode="popLayout">
          <motion.div key={line.speaker} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="absolute" style={{ right: 16, bottom: 5 }}>
            <motion.div key={line.expression} initial={{ scale: 0.92 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }} style={{ originY: 1 }}>
              <Avatar who={line.speaker} outfit={outfit} expression={line.expression} px={px} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ---------- 미니게임용 픽셀 아이콘 ---------- */
const K = "#2A1C1C";
const ICONS = {
  handshake: {
    pal: { k: K, b: "#4B7BD0", s: "#FFD8B0", S: "#E0A878" },
    grid: G("kk..........kk", "bbk.kkkkkk.kbb", "bbkkssssssskbb", "bbksSsSsSssskb", "bbksssssssskbb", "bbk.kssssssk..", "kk...kkkkkk..."),
  },
  piggy: {
    pal: { k: K, p: "#F7A6C0", P: "#D9789A", e: K },
    grid: G("...kkkkkkkk...", "..kppppppppk..", ".kppppppppppk.", "kppeppppppppPk", "kPPkpppppppppk", "kPPkppppppppPk", ".kpppppppppPk.", "..kpkkkkkkpk..", "..kk......kk.."),
  },
  goldPiggy: {
    pal: { k: "#5A3406", p: "#FFC21F", P: "#C98400", e: "#5A3406" },
    grid: G("......kk......", "...kkkYYkkk...", "..kppppppppk..", ".kppppppppppk.", "kppeppppppppPk", "kPPkpppppppppk", "kPPkppppppppPk", ".kpppppppppPk.", "..kpkkkkkkpk..", "..kk......kk..").map((r) => r.replace(/Y/g, "k")),
  },
  key: {
    pal: { k: K, y: "#FFC21F", Y: "#FFE27A", O: "#C98400" },
    grid: G(".kkkk.........", "kYyyOk........", "ky..ykkkkkkkkk", "ky..yyyyyyyyyk", "kYyyOkkkkOkOkk", ".kkkk....kk.k."),
  },
  ring: {
    pal: { k: K, c: "#BFE8FF", C: "#7CC8F0", y: "#FFC21F" },
    grid: G("....kkkk....", "...kcCCck...", "....kcck....", "...kkyykk...", "..kyykkyyk..", ".kyk....kyk.", ".ky......yk.", ".ky......yk.", ".kyk....kyk.", "..kyykkyyk..", "...kkkkkk..."),
  },
  wingCoin: {
    pal: { k: K, w: "#FFFFFF", y: "#FFC21F", Y: "#FFE27A", O: "#C98400" },
    grid: G("k.....kkkk.....k", "kwk..kYyyOk..kwk", "kwwkkYyOyyOkkwwk", ".kwwkyyOyyOkwwk.", "..kkkyOOOyOkkk..", ".....kyyyyOk....", "......kkkkk....."),
  },
  houseHand: {
    pal: { k: K, r: "#D84A3A", c: "#F5E6C8", b: "#7CC8F0", f: "#8B5A2B", s: "#FFD8B0" },
    grid: G("......kk......", ".....krrk.....", "....krrrrk....", "...krrrrrrk...", "..krrrrrrrrk..", "...kcccccck...", "...kcbbcfck...", "...kccccfck...", "kk.kkkkkkkk.kk", "kssksssssssssk", ".ksssssssssk..", "..kkkkkkkkk..."),
  },
  basket: {
    pal: { k: K, G: "#4FAE3A", R: "#E0453A", T: "#C8955A", t: "#A87440" },
    grid: G("....kkkkkk....", "...k......k...", "..kGGkRRkGGk..", ".kGGGkRRRkGGk.", "kkkkkkkkkkkkkk", "kTtTtTtTtTtTtk", ".ktTtTtTtTtTk.", ".kTtTtTtTtTtk.", "..kkkkkkkkkk.."),
  },
  sprout: {
    pal: { k: K, G: "#4FAE3A", T: "#D07A4A", t: "#A85A30", Y: "#FFE27A", y: "#FFC21F", O: "#C98400" },
    grid: G("...kk..kk.....", "..kGGkkGGk....", "...kGkGGk.....", ".....kGk......", "..kkkkkkkk.kkk", "..kTTTTTTkkYyk", "...kTtTTk.kyOk", "...kTTTTk..kk.", "....kkkk......"),
  },
  moneyBag: {
    pal: { k: K, T: "#8B5A2B", b: "#F2C14E", B: "#A8701A" },
    grid: G("...kk..kk...", "....kTTk....", "....kkkk....", "...kbbbbk...", "..kbbBBbbk..", ".kbbBbbbbbk.", ".kbbbBBbbbk.", ".kbbbbbBbbk.", ".kbbBBBbbbk.", ".kBbbbbbbBk.", "..kkkkkkkk.."),
  },
  apt: {
    pal: { k: K, A: "#D9B07A", w: "#8FD0F8", f: "#8B5A2B" },
    grid: G("kkkkkkkkkkkk", "kAwAwAAwAwAk", "kAAAAAAAAAAk", "kAwAwAAwAwAk", "kAAAAAAAAAAk", "kAwAwAAwAwAk", "kAAAAAAAAAAk", "kAwAwAAwAwAk", "kAAAAffAAAAk", "kAAAAffAAAAk", "kkkkkkkkkkkk"),
  },
  heart: {
    pal: { k: K, r: "#D83838", R: "#FF7A7A" },
    grid: G(".kk.kk.", "kRrkrrk", "krrrrrk", ".krrrk.", "..krk..", "...k..."),
  },
};
const Icon = ({ name, px = 2, style }) => <PixelArt grid={ICONS[name].grid} palette={ICONS[name].pal} px={px} style={style} />;

function ApartmentArt({ variant = 0 }) {
  const v = [
    { wall: "#E07848", shade: "#B85A30", roof: "#7A3A20" },
    { wall: "#A8B4CC", shade: "#7C88A2", roof: "#4A5468" },
    { wall: "#F0D8B0", shade: "#C8A878", roof: "#C04838" },
  ][variant % 3];
  const { out } = useRects((r) => {
    r(0, 0, 64, 48, "#8FD0F8"); r(0, 0, 64, 10, "#B8E4FC");
    r(6, 6, 10, 3, "#FFFFFF"); r(8, 4, 6, 2, "#FFFFFF"); r(44, 9, 12, 3, "#FFFFFF"); r(47, 7, 6, 2, "#FFFFFF");
    r(2, 22, 12, 22, "#9DB8D8"); r(50, 18, 12, 26, "#9DB8D8");
    for (let y = 24; y < 42; y += 5) { r(5, y, 2, 2, "#D8E8F8"); r(9, y, 2, 2, "#D8E8F8"); r(53, y - 2, 2, 2, "#D8E8F8"); r(57, y - 2, 2, 2, "#D8E8F8"); }
    r(17, 9, 30, 36, K); r(18, 10, 28, 35, v.wall); r(18, 10, 28, 3, v.roof); r(40, 13, 6, 32, v.shade);
    for (let row = 0; row < 6; row++) for (let col = 0; col < 3; col++) { const x = 21 + col * 8, y = 15 + row * 5; r(x, y, 5, 3, K); r(x + 1, y, 3, 2, "#CFEFFF"); }
    r(29, 39, 6, 6, K); r(30, 40, 4, 5, "#8B5A2B");
    r(0, 44, 64, 4, "#7CC04A"); r(0, 44, 64, 1, "#5BA03A");
    [[4, 38], [52, 38]].forEach(([x, y]) => { r(x, y, 10, 7, "#2E7A2A"); r(x + 1, y + 1, 8, 5, "#4FAE3A"); r(x + 2, y + 1, 3, 2, "#7ACB52"); });
  }, [variant]);
  return <svg viewBox="0 0 64 48" shapeRendering="crispEdges" style={{ display: "block", width: "100%", height: "auto" }}>{out}</svg>;
}

function GaugeArt({ level = 1 }) {
  const { out } = useRects((r) => {
    const c = 2, cx = 20, cy = 21, ro = 18, ri = 11;
    for (let y = 0; y < 22; y += c)
      for (let x = 0; x < 40; x += c) {
        const d = Math.hypot(x + 1 - cx, y + 1 - cy);
        if (d > ro || d < ri || y + 1 > cy) continue;
        const a = Math.atan2(cy - (y + 1), x + 1 - cx); // π(left) → 0(right)
        const edge = d > ro - c || d < ri + c;
        const col = a > (Math.PI * 2) / 3 ? "#48A838" : a > Math.PI / 3 ? "#FFC21F" : "#D83838";
        r(x, y, c, c, edge ? K : col);
      }
    const ang = Math.PI - level * Math.PI * 0.85 - 0.08;
    for (let t = 0; t < 15; t += 1) r(Math.round(cx + Math.cos(ang) * t) - 1, Math.round(cy - Math.sin(ang) * t) - 1, 2, 2, K);
    r(cx - 3, cy - 3, 6, 4, K); r(cx - 2, cy - 2, 4, 2, "#8E949C");
  }, [Math.round(level * 20)]);
  return <svg width={80} height={44} viewBox="0 0 40 22" shapeRendering="crispEdges" style={{ display: "block" }}>{out}</svg>;
}

function CoinStacks() {
  const { out } = useRects((r) => {
    [[2, 4], [14, 6], [26, 3]].forEach(([x, n]) => {
      for (let i = 0; i < n; i++) { const y = 30 - i * 4; r(x, y - 1, 12, 5, K); r(x + 1, y, 10, 3, "#FFC21F"); r(x + 1, y, 10, 1, "#FFE27A"); r(x + 9, y, 2, 3, "#C98400"); }
    });
  }, []);
  return <svg width={80} height={70} viewBox="0 0 40 35" shapeRendering="crispEdges" style={{ display: "block" }}>{out}</svg>;
}

function Bills() {
  const { out } = useRects((r) => {
    [[0, 10], [4, 6], [8, 2]].forEach(([x, y]) => {
      r(x, y, 32, 16, "#1E5A20"); r(x + 1, y + 1, 30, 14, "#58B848"); r(x + 3, y + 3, 26, 10, "#7ACB52"); r(x + 12, y + 4, 8, 8, "#2E8B3A"); r(x + 14, y + 6, 4, 4, "#9AD86A");
    });
  }, []);
  return <svg width={84} height={56} viewBox="0 0 42 28" shapeRendering="crispEdges" style={{ display: "block" }}>{out}</svg>;
}

function MedalArt() {
  const { out } = useRects((r) => {
    r(6, 0, 8, 18, K); r(7, 0, 6, 17, "#D83838"); r(26, 0, 8, 18, K); r(27, 0, 6, 17, "#2878D8");
    const c = 2, cx = 20, cy = 32;
    for (let y = 16; y < 50; y += c)
      for (let x = 4; x < 36; x += c) {
        const d = Math.hypot(x + 1 - cx, y + 1 - cy);
        if (d > 15) continue;
        r(x, y, c, c, d > 13 ? K : d > 11 ? "#C98400" : (x < cx && y < cy) ? "#FFE27A" : "#FFC21F");
      }
  }, []);
  return (
    <div style={{ position: "relative", width: 80, height: 100 }}>
      <svg width={80} height={100} viewBox="0 0 40 50" shapeRendering="crispEdges" style={{ display: "block" }}>{out}</svg>
      <div style={{ position: "absolute", left: 25, top: 49 }}><PixelArt grid={G(".....k.....", "....kYk....", "kkkkYYYkkkk", "kYYYYwYYYYk", ".kYYYYYYYk.", "..kYYYYYk..", "..kYYkYYk..", ".kYk...kYk.", ".kk.....kk.")} palette={{ k: "#8A5A10", Y: "#FFF3B0", w: "#FFFFFF" }} px={2.7} /></div>
    </div>
  );
}

function Portrait({ look, px = 4 }) {
  const base = getSprite("jaehoon", "front", "casual", 0, "default", true).grid;
  let grid, palette;
  if (look === "doctor") {
    grid = stamp(base, 7, 3, G("kkkk..kkkk", "k..kkkk..k", "k..k..k..k", "kkkk..kkkk"));
    palette = { ...PAL, n: "#A4A8B0", N: "#D4D8DE", v: "#F4F6F8", V: "#C8CED8", w: "#8FC4F0" };
  } else {
    grid = stamp(base, 10, 6, ["nnnn"]);
    grid = stamp(grid, 13, 7, ["qq", "qq", "qq", "qq"]);
    palette = { ...PAL, v: "#2B2B33", V: "#1A1A20" };
  }
  return <PixelArt grid={grid} palette={palette} px={px} />;
}

/* ---------- Gate 1 : 타이밍 밸런스 & 로드맵 퍼즐 ---------- */
function TimelineGame({ data, onClear }) {
  const [choice, setChoice] = useState(null);
  const [shake, setShake] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(null);
  const tray = useMemo(() => [2, 0, 3, 1].filter((i) => i < data.phases.length), [data]);
  const picked = data.choices.find((c) => c.key === choice);
  const correct = !!picked?.correct;
  const done = correct && placed.length === data.phases.length;
  useEffect(() => onClear(done), [done]);

  const pick = (c) => { setChoice(c.key); if (!c.correct) setShake((s) => s + 1); };
  const place = (i) => {
    if (placed.includes(i)) return;
    if (i === placed.length) setPlaced([...placed, i]);
    else { setWrong(i); setTimeout(() => setWrong(null), 500); }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="wq-ko text-[16px] text-[#3A2414] text-center">{data.question}</p>
      <div className="grid grid-cols-2 gap-3">
        {data.choices.map((c) => {
          const sel = choice === c.key;
          return (
            <motion.button key={c.correct ? c.key : `${c.key}-${shake}`} type="button" onClick={() => pick(c)} className={`wq-card text-left ${sel ? "is-sel" : ""}`}
              animate={sel && !c.correct ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
              <span className="wq-tag" style={{ background: c.key === "A" ? "#48A838" : "#D83838" }}>{c.key}</span>
              <div className="wq-ko text-[15px] text-[#3A2414] leading-tight mt-1">[{c.key}] {c.title}</div>
              <div className="wq-ko text-[12.5px] text-[#7A5530] leading-snug mt-1">"{c.desc}"</div>
              <AnimatePresence>
                {sel && (
                  <motion.span key={`st${shake}`} className="wq-stamp" style={{ borderColor: c.correct ? "#2E8B57" : "#D83838" }}
                    initial={{ scale: 2.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                    <PixelArt grid={c.correct ? CHECK : CROSS} px={4} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {picked && (
          <motion.div key={picked.key + shake} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
            className="wq-ko text-center text-[14px] px-3 py-2" style={{ background: picked.correct ? "#E3F4DC" : "#FBE0DC", border: `2px solid ${picked.correct ? "#2E8B57" : "#D83838"}`, color: picked.correct ? "#1E6A3A" : "#A8261E" }}>
            {picked.feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="wq-ko text-[13px] text-[#8A6640] text-center mt-1">{data.puzzleGuide}</p>
      <div className="flex justify-center gap-3 min-h-[58px] flex-wrap">
        {tray.map((i) => !placed.includes(i) && (
          <motion.button key={i} type="button" onClick={() => place(i)} className="wq-piece" aria-label={`${data.phases[i].label} 카드`}
            layout animate={wrong === i ? { x: [0, -6, 6, -4, 4, 0], borderColor: "#D83838" } : { x: 0 }} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
            <Icon name={data.phases[i].icon} px={2.4} />
          </motion.button>
        ))}
        {placed.length === data.phases.length && <div className="wq-pixel text-[9px] text-[#2E8B57] self-center">ROADMAP COMPLETE!</div>}
      </div>
      <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${data.phases.length}, minmax(0, 1fr))` }}>
        <span className="wq-chain" />
        {data.phases.map((p, i) => {
          const filled = placed.includes(i);
          return (
            <div key={i} className="flex flex-col items-center gap-1 min-w-0">
              <div className={`wq-slot ${filled ? "is-filled" : ""} ${i === placed.length ? "is-next" : ""}`}>
                <AnimatePresence>
                  {filled && (
                    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
                      <Icon name={p.icon} px={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="wq-pixel text-[8px] text-[#5C4028]">{p.label}</span>
              <span className="wq-ko text-[11.5px] leading-tight text-center" style={{ color: filled ? "#3A2414" : "#B49A70", minHeight: 30 }}>{filled ? p.text : "?"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Gate 2 : 신혼집 매물 카드 ---------- */
function HousingGame({ data, onClear, selected, onSelect }) {
  const selIdx = selected ? data.listings.findIndex((l) => l.name === selected.name) : -1;
  useEffect(() => onClear(selIdx >= 0), [selIdx]);
  return (
    <div className="flex flex-col gap-4">
      <div className="wq-ribbon wq-ko">{data.ribbon}</div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {data.listings.map((l, i) => {
          const sel = selIdx === i;
          return (
            <motion.div key={i} className="wq-house" animate={{ y: sel ? -6 : 0, opacity: selIdx >= 0 && !sel ? 0.6 : 1 }}
              style={{ borderColor: sel ? "#FFB800" : "#5C4028", boxShadow: sel ? "0 0 0 3px #FFE27A, 0 6px 0 rgba(0,0,0,.25)" : "0 3px 0 rgba(0,0,0,.2)" }}>
              <div style={{ border: "2px solid #3A2414" }}><ApartmentArt variant={l.art} /></div>
              <div className="wq-ko text-[12px] text-[#5C4028] leading-tight">📍 {l.area}</div>
              <div className="wq-ko text-[13px] text-[#3A2414] leading-tight">{l.name} <span className="text-[#8A6640]">({l.size})</span></div>
              <div className="wq-price wq-ko">🪙 {l.price}</div>
              <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => onSelect(l)} className="wq-select wq-ko" style={{ background: sel ? "#2E7A2A" : "#48A838" }}>
                {sel ? data.selectedLabel : data.selectLabel}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Gate 3 : 이자 방어 슬라이더 ---------- */
function LoanGame({ data, onClear }) {
  const [v, setV] = useState(0);
  const trackRef = useRef(null);
  const done = v >= 100;
  useEffect(() => onClear(done), [done]);
  const setFrom = (clientX) => {
    if (done) return;
    const r = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setV(p >= 96 ? 100 : p);
  };
  const onKey = (e) => {
    if (done) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); setV((x) => (x + 10 >= 96 ? 100 : x + 10)); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); e.stopPropagation(); setV((x) => Math.max(0, x - 10)); }
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="wq-ko text-[14px] text-[#8A6640] text-center">{data.guide}</p>
      <div className="px-3">
        <div ref={trackRef} className="wq-track" role="slider" tabIndex={0} aria-label="이자 방어 레버" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)}
          onKeyDown={onKey}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); }}
          onPointerMove={(e) => { if (e.buttons) setFrom(e.clientX); }}>
          <div className="wq-track-fill" style={{ width: `${v}%` }} />
          <motion.div className="wq-lever" style={{ left: `${v}%` }} animate={done ? { scale: [1, 1.2, 1] } : {}} />
        </div>
        <div className="flex justify-between mt-1 wq-pixel text-[8px] text-[#8A6640]"><span>0%</span><span>{Math.round(v)}%</span><span>100%</span></div>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-center gap-2 pr-2 text-center" style={{ opacity: 1 - (v / 100) * 0.55, borderRight: "2px solid #B89A6A" }}>
          <div className="wq-ko text-[14px] text-[#3A2414] leading-tight">{data.planA.title}</div>
          <div className="relative flex items-end gap-1" style={{ height: 50 }}>
            {[0, 1].map((i) => (
              <motion.div key={i} animate={{ y: [0, -8 - i * 3, 0], x: done ? (i ? 40 : -40) : 0, opacity: done ? 0 : 1 }} transition={{ y: { duration: 1 + i * 0.3, repeat: Infinity }, x: { duration: 0.8 }, opacity: { duration: 0.8 } }}>
                <Icon name="wingCoin" px={2} />
              </motion.div>
            ))}
          </div>
          <GaugeArt level={1 - v / 100} />
          <div className="wq-ko text-[12px] text-[#7A5530] leading-snug">{data.planA.detail}</div>
          <div className="wq-ko text-[13px] text-[#C0302A] leading-snug">{data.planA.warning}</div>
        </div>
        <div className="relative flex flex-col items-center gap-2 pl-2 text-center">
          <div className="wq-ko text-[14px] text-[#3A2414] leading-tight">{data.planB.title}</div>
          <motion.div style={{ filter: done ? "none" : `grayscale(${1 - v / 100}) brightness(${0.75 + v / 400})`, marginTop: 6 }}
            animate={done ? { y: [0, -6, 0], filter: ["drop-shadow(0 0 0px #FFC21F)", "drop-shadow(0 0 10px #FFC21F)", "drop-shadow(0 0 0px #FFC21F)"] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
            <Icon name="goldPiggy" px={4} />
          </motion.div>
          <div className="wq-ko text-[12px] text-[#7A5530] leading-snug">{data.planB.detail}</div>
          <AnimatePresence>
            {done && (
              <motion.div className="wq-green-stamp wq-ko" initial={{ scale: 3, opacity: 0, rotate: 10 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}>
                [ {data.planB.stamp} ]
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className="wq-ko text-[11.5px] text-[#9A7A54] text-center">{data.caption}</p>
    </div>
  );
}

/* ---------- Gate 4 : 3개년 예산 배분 ---------- */
function BudgetGame({ data, onClear }) {
  const [alloc, setAlloc] = useState(() => data.slots.map(() => 0));
  const used = alloc.reduce((a, b) => a + b, 0);
  const left = data.units - used;
  const done = left === 0 && alloc.every((a) => a >= data.minEach);
  useEffect(() => onClear(done), [done]);
  const change = (i, d) => setAlloc((a) => a.map((x, j) => (j === i ? x + d : x)));
  const inc = (i) => { if (left > 0) change(i, 1); };
  const dec = (i) => { if (alloc[i] > 0) change(i, -1); };
  const fill = used / data.units;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3">
        <CoinStacks />
        <Bills />
      </div>
      <p className="wq-ko text-[13px] text-[#8A6640] text-center -mt-1">{data.poolLabel}</p>
      <div className="flex items-center justify-center gap-1 flex-wrap" aria-label={`남은 예산 칩 ${left}개`}>
        <span className="wq-ko text-[13px] text-[#5C4028] mr-1">남은 예산 칩</span>
        {Array.from({ length: data.units }).map((_, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: 99, border: "2px solid #5A3406", background: i < left ? "#FFC21F" : "#E3D2AE" }} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {data.slots.map((s, i) => (
          <div key={i} className="wq-alloc">
            <div className="shrink-0"><Icon name={s.icon} px={2.4} /></div>
            <div className="min-w-0 flex-1">
              <div className="wq-ko text-[14px] text-[#3A2414] leading-tight">{s.title}</div>
              <div className="wq-ko text-[11.5px] text-[#8A6640] leading-tight">{s.sub}</div>
              <div className="flex gap-[2px] mt-1">
                {Array.from({ length: data.units }).map((_, j) => (
                  <span key={j} style={{ flex: 1, height: 8, background: j < alloc[i] ? data.years[i % data.years.length].color : "#E3D2AE", border: "1px solid #5C4028" }} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" className="wq-pm" style={{ background: "#C8A878" }} onClick={() => dec(i)} aria-label={`${s.title} 줄이기`}>−</button>
              <span className="wq-pixel text-[9px] w-8 text-center text-[#3A2414]">{alloc[i] * 10}%</span>
              <button type="button" className="wq-pm" style={{ background: "#48A838", color: "#fff" }} onClick={() => inc(i)} aria-label={`${s.title} 늘리기`}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-center gap-4 flex-wrap">
        <div>
          <div className="flex items-end gap-2 px-2" style={{ height: 96, borderLeft: "3px solid #3A2414", borderBottom: "3px solid #3A2414" }}>
            {data.years.map((y, i) => (
              <div key={i} className="flex justify-center" style={{ width: 64 }}>
                <motion.div animate={{ height: 6 + fill * [36, 58, 80][i] }} transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  style={{ width: 26, background: y.color, border: "3px solid #3A2414", boxShadow: "inset -4px 0 0 rgba(0,0,0,.2)" }} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 px-2 mt-1" style={{ marginLeft: 3 }}>
            {data.years.map((y, i) => <span key={i} className="wq-ko text-[10.5px] text-[#5C4028] text-center leading-tight" style={{ width: 64 }}>{y.label}</span>)}
          </div>
        </div>
        <AnimatePresence>
          {done && (
            <motion.div className="wq-ko text-[13px] px-3 py-2 max-w-[220px]" style={{ background: "#E3F4DC", border: "2px solid #2E8B57", color: "#1E6A3A" }}
              initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
              {data.doneBadge}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!done && left === 0 && <p className="wq-ko text-[12.5px] text-[#C0302A] text-center mt-3">모든 항목에 최소 {data.minEach * 10}%씩 배분해 주세요!</p>}
      {!done && left > 0 && <p className="wq-ko text-[12.5px] text-[#8A6640] text-center mt-3">[+] 버튼으로 예산 칩 {left}개를 모두 배분하세요.</p>}
    </div>
  );
}

/* ---------- Gate 5 : 두 아버님 O/X 퀴즈 ---------- */
function QuizGame({ data, onClear }) {
  const [round, setRound] = useState(0);
  const [trust, setTrust] = useState(() => data.judges.map(() => 0));
  const [hint, setHint] = useState(null);
  const [lock, setLock] = useState(false);
  const done = round >= data.rounds.length;
  useEffect(() => onClear(done), [done]);
  const q = data.rounds[Math.min(round, data.rounds.length - 1)];
  const answer = (a) => {
    if (done || lock) return;
    if (a === q.answer) {
      setHint(null);
      setTrust((t) => t.map((x, i) => (i === q.judge ? 100 : x)));
      setLock(true);
      setTimeout(() => { setRound((r) => r + 1); setLock(false); }, 800);
    } else setHint({ text: q.hint, key: Date.now() });
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {data.judges.map((j, i) => {
          const active = !done && q.judge === i;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <motion.div className="wq-portrait" style={{ background: j.look === "doctor" ? "#BFE0F0" : "#C8A06A", boxShadow: active ? "0 0 0 3px #FFC21F, 0 0 16px rgba(255,194,31,.7)" : "none" }}
                animate={trust[i] === 100 ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.5 }}>
                <Portrait look={j.look} px={4} />
              </motion.div>
              <div className="wq-ko text-[12.5px] text-[#3A2414] text-center leading-tight">[ {j.name} ]</div>
              <div className="flex items-center gap-1 w-full max-w-[150px]">
                <Icon name="heart" px={2} />
                <div className="flex-1 relative" style={{ height: 12, background: "#5C2A2A", border: "2px solid #3A2414" }}>
                  <motion.div animate={{ width: `${trust[i]}%` }} transition={{ duration: 0.6 }} style={{ height: "100%", background: "#D83838" }} />
                </div>
                <span className="wq-pixel text-[7px] text-[#D83838] w-8 text-right">{trust[i]}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={round} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="flex flex-col gap-3">
            <div className="wq-pixel text-[9px] text-[#9A6A3A] text-center">ROUND {round + 1} / {data.rounds.length}</div>
            <p className="wq-ko text-[14.5px] text-[#3A2414] leading-relaxed px-3 py-2" style={{ background: "#FFF6E0", border: "2px dashed #B89A6A", wordBreak: "keep-all" }}>"{q.text}"</p>
            <div className="grid grid-cols-2 gap-3">
              {["O", "X"].map((a) => (
                <motion.button key={a} type="button" whileTap={{ y: 4 }} onClick={() => answer(a)} className="wq-ox wq-pixel"
                  style={{ background: a === "O" ? "#2878D8" : "#D83838", boxShadow: `inset 0 -8px 0 ${a === "O" ? "#1A4E98" : "#8E1E1E"}, inset 0 4px 0 rgba(255,255,255,.3), 0 4px 0 #3A2414` }}>
                  [ {a} ]
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="clear" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="wq-ko text-center text-[16px] py-3" style={{ background: "#E3F4DC", border: "2px solid #2E8B57", color: "#1E6A3A" }}>
            {data.clearText}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hint && (
          <motion.div key={hint.key} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1, x: [0, -5, 5, 0] }} exit={{ opacity: 0 }}
            className="wq-ko text-[13px] text-center px-3 py-2" style={{ background: "#3A2414", color: "#FFE6B0" }}>
            ✖ 오답! {hint.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const GAMES = { timeline: TimelineGame, housing: HousingGame, loan: LoanGame, budget: BudgetGame, quiz: QuizGame };

function QuestModal({ gate, cleared, onClear, onUnlock, selectedHousing, onSelectHousing }) {
  const Game = GAMES[gate.modal.game];
  return (
    <motion.div className="absolute inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(20,12,6,0.6)", padding: 12 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.5, y: 40, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }} className="wq-board" style={{ width: "min(660px, 100%)" }} role="dialog" aria-label={gate.modal.title}>
        {["tl", "tr", "bl", "br"].map((c) => <span key={c} className={`wq-bracket wq-${c}`} />)}
        <div className="wq-parchment">
          <div className="wq-pixel text-[9px] text-[#9A6A3A] text-center mb-1">{gate.modal.subtitle}</div>
          <h2 className="wq-title">{gate.modal.title}</h2>
          <div className="mt-3">
            <Game data={gate.modal} onClear={onClear} selected={selectedHousing} onSelect={onSelectHousing} />
          </div>
          <div className="flex justify-center mt-6 relative">
            {cleared && [[-110, -6], [100, -10], [-90, 26], [110, 22]].map(([x, y], i) => (
              <motion.span key={i} className="absolute" style={{ left: "50%", top: 6, x, y, color: "#FFC21F" }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.35 }}>
                <Sparkles size={16} strokeWidth={2.5} />
              </motion.span>
            ))}
            <motion.button className="wq-unlock" disabled={!cleared} onClick={onUnlock} whileHover={cleared ? { scale: 1.05 } : {}} whileTap={cleared ? { scale: 0.94 } : {}}
              animate={cleared
                ? { boxShadow: ["0 0 0 0 rgba(255,194,31,0), 0 5px 0 #7A4A08", "0 0 26px 6px rgba(255,194,31,.8), 0 5px 0 #7A4A08", "0 0 0 0 rgba(255,194,31,0), 0 5px 0 #7A4A08"] }
                : { boxShadow: "0 5px 0 #6A5A40" }}
              transition={cleared ? { duration: 1.4, repeat: Infinity } : { duration: 0.2 }}>
              {cleared ? (
                <><span className="wq-ko text-[17px]">관문 잠금 해제</span><PixelArt grid={LOCK_OPEN} px={1.6} /></>
              ) : (
                <><PixelArt grid={LOCK} px={1.6} /><span className="wq-ko text-[16px]">미션을 먼저 클리어하세요</span></>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Petals({ count = 34 }) {
  const petals = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const r = rng(i * 13 + 5);
    return { left: r() * 100, delay: r() * 4, dur: 4 + r() * 4, drift: (r() - 0.5) * 160, size: 4 + Math.floor(r() * 3) * 2, c: r() < 0.5 ? "#F7B7CB" : "#FFD6E2" };
  }), [count]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[45]">
      {petals.map((p, i) => (
        <motion.div key={i} style={{ position: "absolute", left: `${p.left}%`, top: -20, width: p.size, height: p.size * 0.7, background: p.c, boxShadow: `${p.size / 2}px ${p.size / 2}px 0 #EE8FB0` }}
          animate={{ y: ["0vh", "110vh"], x: [0, p.drift], rotate: [0, 360] }} transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }} />
      ))}
    </div>
  );
}

function heartPolygon(cx, cy, size) {
  const pts = [];
  for (let i = 0; i < 64; i++) {
    const t = (i / 64) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push(`${(cx + (x / 17) * size).toFixed(1)}px ${(cy + (y / 17) * size + size * 0.12).toFixed(1)}px`);
  }
  return `polygon(${pts.join(",")})`;
}

/* ---------- Finale : MASTER REPORT ---------- */
function MasterReport({ housing, onRestart }) {
  const R = MASTER_REPORT;
  const rows = [
    { icon: "apt", label: R.housingLabel, value: housing ? `${housing.area} ${housing.name} (${housing.size}) · ${housing.price}` : "아직 선택하지 않았어요" },
    { icon: "moneyBag", label: R.savedLabel, value: R.saved, sub: R.savedSub },
    { icon: "moneyBag", label: R.persuadeLabel, value: R.persuade, heart: true },
  ];
  return (
    <motion.div className="absolute inset-0 z-[80] flex items-center justify-center" style={{ background: "#120A10", padding: 12 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Petals count={22} />
      <div className="absolute inset-0 pointer-events-none">
        {[[12, 18], [86, 14], [8, 78], [90, 72], [50, 6]].map(([l, t], i) => (
          <motion.span key={i} className="absolute" style={{ left: `${l}%`, top: `${t}%`, color: "#FFD23F" }}
            animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}>
            <Sparkles size={20} />
          </motion.span>
        ))}
      </div>
      <motion.div initial={{ scale: 0.3, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.25 }}
        className="wq-board relative z-[2]" style={{ width: "min(560px, 100%)" }} role="dialog" aria-label={R.title}>
        {["tl", "tr", "bl", "br"].map((c) => <span key={c} className={`wq-bracket wq-${c}`} />)}
        <div className="wq-parchment">
          <div className="wq-pixel text-[9px] text-[#9A6A3A] text-center mb-1">{R.subtitle}</div>
          <h2 className="wq-title">{R.title}</h2>
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-2 flex-wrap">
            <div className="flex items-end gap-1">
              <Avatar who="seoyeon" outfit="casual" expression="smile" px={4} />
              <Avatar who="jaehoon" outfit="casual" expression="smile" px={4} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <motion.div animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2.4, repeat: Infinity }}><MedalArt /></motion.div>
              <div className="wq-ko text-[13px] text-[#8A5A10] text-center">{R.medal}</div>
            </div>
          </div>
          <div className="relative flex flex-col gap-2 mt-4">
            {rows.map((row, i) => (
              <motion.div key={i} className="wq-report-row" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + i * 0.15 }}>
                <div className="shrink-0 relative">
                  <Icon name={row.icon} px={2.6} />
                  {row.heart && <div className="absolute -right-2 -bottom-1"><Icon name="heart" px={1.6} /></div>}
                </div>
                <div className="min-w-0 flex-1 pr-16">
                  <div className="wq-ko text-[12px] text-[#8A6640]">{row.label}</div>
                  <div className="wq-ko text-[15px] text-[#3A2414] leading-tight">{row.value}</div>
                  {row.sub && <div className="wq-ko text-[11.5px] text-[#8A6640]">{row.sub}</div>}
                </div>
              </motion.div>
            ))}
            <motion.div className="wq-pass" initial={{ scale: 3.2, opacity: 0, rotate: 10 }} animate={{ scale: 1, opacity: 1, rotate: -14 }} transition={{ delay: 1.3, type: "spring", stiffness: 380, damping: 13 }}>
              <span className="wq-ko text-[11px]">{R.stampTop}</span>
              <span className="wq-pixel text-[15px]">{R.stampMain}</span>
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-2 mt-6">
            <button type="button" disabled className="wq-next wq-ko cursor-not-allowed">[ {R.nextStage} ]</button>
            <button type="button" onClick={onRestart} className="wq-ko text-[13.5px] text-[#7A5530] underline underline-offset-4 hover:text-[#3A2414] inline-flex items-center gap-1">
              <RotateCcw size={14} strokeWidth={2.5} /> {R.restart.replace(/^🔄\s*/, "")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================================
 *  8. GAME ENGINE
 * ===================================================================== */
function canStand(x, y, gates) {
  const pts = [[x - 9, y - 1], [x + 9, y - 1], [x - 9, y - 10], [x + 9, y - 10]];
  for (const [px, py] of pts) {
    if (px < 2 || px > W - 2 || py < 0 || py > H - 1) return false;
    if (!isPath(Math.floor(px / T), Math.floor(py / T))) return false;
    for (const g of gates) {
      if (g.state === "open") continue;
      const d = GATE_BY_ID[g.id];
      if (px >= d.x * T + 1 && px <= (d.x + 2) * T - 1 && py >= d.y * T + 8 && py <= (d.y + 2) * T - 6) return false;
    }
  }
  return true;
}
function findNearGate(x, y, gates) {
  for (const g of gates) {
    if (g.state !== "locked") continue;
    const d = GATE_BY_ID[g.id];
    const pad = 26;
    if (x >= d.x * T - pad && x <= (d.x + 2) * T + pad && y - 5 >= d.y * T - pad && y - 5 <= (d.y + 2) * T + pad) return g.id;
  }
  return null;
}
const dirFrom = (dx, dy, fallback) => {
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return fallback;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
};
const freshSim = () => ({
  lx: START.x, ly: START.y, ldir: "down", lwalk: 0,
  fx: START.x, fy: START.y - FOLLOW_GAP, fdir: "down", fwalk: 0,
  trail: [{ x: START.x, y: START.y - FOLLOW_GAP }, { x: START.x, y: START.y }],
  moving: false, goal: false, t: 0,
});
const freshGates = () => QUEST_GATES.map((g) => ({ id: g.id, state: "locked" }));

export default function WeddingQuestGame() {
  const rootRef = useRef(null);
  const layerRef = useRef(null);
  const simRef = useRef(freshSim());
  const keysRef = useRef(new Set());
  const dpadRef = useRef({ up: false, down: false, left: false, right: false });
  const phaseRef = useRef("dialog");
  const gatesRef = useRef(freshGates());
  const nearRef = useRef(null);
  const actionsRef = useRef({});
  const heartCenterRef = useRef({ x: 0, y: 0 });
  const timersRef = useRef([]);

  const [phase, setPhaseState] = useState("dialog"); // dialog | play | modal | cutscene | propose | iris | finale
  const [dialog, setDialog] = useState({ kind: "intro", lines: INTRO_DIALOGS, index: 0 });
  const [typed, setTyped] = useState(0);
  const [modalGate, setModalGate] = useState(null);
  const [modalCleared, setModalCleared] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState(null);
  const [gates, setGates] = useState(gatesRef.current);
  const [near, setNear] = useState(null);
  const [outfit, setOutfit] = useState("casual");
  const [flash, setFlash] = useState(0);
  const [petals, setPetals] = useState(false);
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  const [, setTick] = useState(0);

  const setPhase = (p) => { phaseRef.current = p; setPhaseState(p); };
  const later = (fn, ms) => timersRef.current.push(setTimeout(fn, ms));
  const updateGate = (id, state) => {
    gatesRef.current = gatesRef.current.map((g) => (g.id === id ? { ...g, state } : g));
    setGates(gatesRef.current);
  };

  // viewport size
  useEffect(() => {
    const el = rootRef.current;
    const measure = () => setVp({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // typing effect
  useEffect(() => {
    if (phase !== "dialog") return;
    const len = dialog.lines[dialog.index].text.length;
    setTyped(0);
    const id = setInterval(() => setTyped((t) => (t >= len ? t : t + 1)), 34);
    return () => clearInterval(id);
  }, [dialog, phase]);

  const openDialog = (d) => { setTyped(0); setDialog({ ...d, index: 0 }); setPhase("dialog"); };

  const advance = () => {
    const line = dialog.lines[dialog.index];
    if (typed < line.text.length) { setTyped(line.text.length); return; }
    if (dialog.index < dialog.lines.length - 1) { setTyped(0); setDialog({ ...dialog, index: dialog.index + 1 }); return; }
    if (dialog.kind === "gate") { setModalCleared(false); setModalGate(dialog.gateId); setPhase("modal"); }
    else if (dialog.kind === "wedding") setPhase("propose");
    else setPhase("play");
  };

  const unlock = () => {
    const id = modalGate;
    if (id == null || !modalCleared) return;
    setModalGate(null);
    setPhase("play");
    updateGate(id, "opening");
    later(() => updateGate(id, "poof"), 1000);
    later(() => updateGate(id, "open"), 1500);
  };

  const reachGoal = () => {
    setPhase("cutscene");
    setFlash((f) => f + 1);
    setPetals(true);
    later(() => {
      const s = simRef.current;
      setOutfit("wedding");
      Object.assign(s, { lx: 28.95 * T, ly: 14.55 * T, ldir: "down", fx: 30.05 * T, fy: 14.55 * T, fdir: "down", moving: false });
      setTick((t) => t + 1);
    }, 260);
    later(() => openDialog({ kind: "wedding", lines: WEDDING_DIALOGS }), 1500);
  };

  const interact = () => {
    const ph = phaseRef.current;
    if (ph === "play" && nearRef.current != null) {
      const g = GATE_BY_ID[nearRef.current];
      openDialog({ kind: "gate", gateId: g.id, lines: g.dialogs });
    } else if (ph === "dialog") advance();
    else if (ph === "modal") unlock();
    else if (ph === "propose") accept();
  };

  const accept = () => { if (phaseRef.current === "propose") setPhase("iris"); };

  const restart = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    simRef.current = freshSim();
    gatesRef.current = freshGates();
    nearRef.current = null;
    setGates(gatesRef.current);
    setNear(null);
    setOutfit("casual");
    setPetals(false);
    setModalGate(null);
    setModalCleared(false);
    setSelectedHousing(null);
    if (layerRef.current) layerRef.current.style.clipPath = "";
    openDialog({ kind: "intro", lines: INTRO_DIALOGS });
  };

  actionsRef.current = { interact, reachGoal };

  // keyboard
  useEffect(() => {
    const MOVE = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"];
    const down = (e) => {
      if (MOVE.includes(e.code)) { keysRef.current.add(e.code); e.preventDefault(); }
      if (["Space", "Enter", "KeyE", "KeyZ"].includes(e.code)) {
        e.preventDefault();
        if (!e.repeat) actionsRef.current.interact();
      }
    };
    const up = (e) => keysRef.current.delete(e.code);
    const blur = () => keysRef.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  // main loop (requestAnimationFrame)
  useEffect(() => {
    let raf;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = simRef.current;
      let changed = false;
      if (phaseRef.current === "play") {
        const k = keysRef.current, d = dpadRef.current;
        let dx = (k.has("ArrowRight") || k.has("KeyD") || d.right ? 1 : 0) - (k.has("ArrowLeft") || k.has("KeyA") || d.left ? 1 : 0);
        let dy = (k.has("ArrowDown") || k.has("KeyS") || d.down ? 1 : 0) - (k.has("ArrowUp") || k.has("KeyW") || d.up ? 1 : 0);
        if (dx || dy) {
          const len = Math.hypot(dx, dy);
          dx /= len; dy /= len;
          const gs = gatesRef.current;
          let nx = s.lx, ny = s.ly;
          if (canStand(s.lx + dx * SPEED * dt, s.ly, gs)) nx = s.lx + dx * SPEED * dt;
          if (canStand(nx, s.ly + dy * SPEED * dt, gs)) ny = s.ly + dy * SPEED * dt;
          s.ldir = dirFrom(dx, dy, s.ldir);
          const moved = Math.hypot(nx - s.lx, ny - s.ly);
          s.lx = nx; s.ly = ny; s.lwalk += moved;
          if (moved > 0.01) {
            s.trail.push({ x: nx, y: ny });
            if (s.trail.length > 500) s.trail.splice(0, 100);
            // follower: point FOLLOW_GAP behind along the leader's trail
            let dist = 0, px = s.lx, py = s.ly;
            for (let i = s.trail.length - 1; i >= 0; i--) {
              const p = s.trail[i];
              const seg = Math.hypot(p.x - px, p.y - py);
              if (dist + seg >= FOLLOW_GAP && seg > 0) {
                const t = (FOLLOW_GAP - dist) / seg;
                const fx = px + (p.x - px) * t, fy = py + (p.y - py) * t;
                const fdx = fx - s.fx, fdy = fy - s.fy;
                s.fdir = dirFrom(fdx, fdy, s.fdir);
                s.fwalk += Math.hypot(fdx, fdy);
                s.fx = fx; s.fy = fy;
                break;
              }
              dist += seg; px = p.x; py = p.y;
            }
          }
          s.moving = moved > 0.01;
          changed = true;
        } else if (s.moving) { s.moving = false; changed = true; }
        const n = findNearGate(s.lx, s.ly, gatesRef.current);
        if (n !== nearRef.current) { nearRef.current = n; setNear(n); }
        if (!s.goal && s.lx > GOAL_X && gatesRef.current.every((g) => g.state === "open")) {
          s.goal = true;
          actionsRef.current.reachGoal();
        }
      } else if (s.moving) { s.moving = false; changed = true; }
      if (changed) setTick((t) => (t + 1) % 1e6);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // heart iris-out (CSS clip-path)
  useEffect(() => {
    if (phase !== "iris") return;
    const el = layerRef.current;
    const { x: cx, y: cy } = heartCenterRef.current;
    const maxR = Math.hypot(el.clientWidth, el.clientHeight) * 1.25;
    const small = Math.max(70, Math.min(el.clientWidth, el.clientHeight) * 0.16);
    const t0 = performance.now();
    const ease = (p) => 1 - Math.pow(1 - p, 3);
    let raf;
    const tick = (now) => {
      const t = (now - t0) / 1000;
      let size;
      if (t < 1.1) size = maxR + (small - maxR) * ease(t / 1.1);
      else if (t < 1.9) size = small * (1 + 0.08 * Math.sin((t - 1.1) * Math.PI * 2.5));
      else size = small * Math.max(0, 1 - Math.pow((t - 1.9) / 0.45, 2));
      el.style.clipPath = heartPolygon(cx, cy, size);
      if (t < 2.35) raf = requestAnimationFrame(tick);
      else { el.style.clipPath = heartPolygon(cx, cy, 0); later(() => setPhase("finale"), 400); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  /* ---------- camera ---------- */
  const s = simRef.current;
  const portrait = vp.w < vp.h;
  const scale = Math.max(Math.min(vp.w / W, vp.h / H), portrait ? Math.min(1.2, (vp.h / H) * 0.85) : 0);
  const axis = (view, world, focus) => (world * scale <= view ? (view - world * scale) / 2 : Math.min(0, Math.max(view - world * scale, view / 2 - focus * scale)));
  const offX = axis(vp.w, W, s.lx);
  const offY = axis(vp.h, H, s.ly - 40);
  heartCenterRef.current = { x: offX + ((s.lx + s.fx) / 2) * scale, y: offY + (Math.min(s.ly, s.fy) - 30) * scale };

  const bobL = s.moving ? -Math.abs(Math.sin(s.lwalk / 7)) * 2.5 : 0;
  const bobF = s.moving ? -Math.abs(Math.sin(s.fwalk / 7 + 1)) * 2.5 : 0;
  const frameL = s.moving ? Math.floor(s.lwalk / 11) % 2 : 0;
  const frameF = s.moving ? Math.floor(s.fwalk / 11) % 2 : 0;

  const currentLine = phase === "dialog" ? dialog.lines[dialog.index] : null;
  const compact = vp.w < 640;

  return (
    <div ref={rootRef} className="wq-root relative w-full h-full overflow-hidden select-none" style={{ background: "#0E0A0C" }}>
      <style>{CSS}</style>
      <div ref={layerRef} className="absolute inset-0" style={{ background: "#2E5418" }}>
        {/* ---------- WORLD ---------- */}
        <div className="absolute" style={{ left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${offX}px, ${offY}px) scale(${scale})` }}>
          <Ground />
          <div style={{ position: "absolute", left: 2.5 * T - 4, top: 2.45 * T - 82, zIndex: Math.round(2.45 * T) }}><StartBanner /></div>
          <div style={{ position: "absolute", left: ARCH.x - 62, top: ARCH.y - 180, zIndex: Math.round(13.6 * T) }}><WeddingArch /></div>
          {PROPS.map((p, i) => <PropNode key={i} p={p} />)}
          {QUEST_GATES.map((g) => (
            <div key={`s${g.id}`} style={{ position: "absolute", left: g.sign.x * T - 20, top: g.sign.y * T - 40, zIndex: Math.round(g.sign.y * T) }}>
              <SignPost num={g.id} arrow={g.sign.arrow} />
            </div>
          ))}
          {QUEST_GATES.map((g) => (
            <Gate key={g.id} gate={g} state={gates.find((x) => x.id === g.id).state} />
          ))}
          <AnimatePresence>
            {near != null && phase === "play" && (
              <motion.div key={`tip${near}`} initial={{ opacity: 0, y: 8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.8 }}
                style={{ position: "absolute", left: s.lx, top: s.ly - 86, x: "-50%", zIndex: 5000, pointerEvents: "none" }}>
                <div className="wq-bubble">Space 또는 <b className="wq-akey">A</b> 버튼으로 열기!</div>
              </motion.div>
            )}
          </AnimatePresence>
          <Character who="jaehoon" x={s.fx} y={s.fy} dir={s.fdir} frame={frameF} bob={bobF} outfit={outfit} />
          <Character who="seoyeon" x={s.lx} y={s.ly} dir={s.ldir} frame={frameL} bob={bobL} outfit={outfit} />
        </div>

        {/* ---------- HUD ---------- */}
        <ProgressBar gates={gates} />
        <div className="absolute z-40 hidden sm:flex items-center gap-2 wq-hint" style={{ left: "max(16px, env(safe-area-inset-left, 0px))", top: "max(14px, env(safe-area-inset-top, 0px))" }}>
          <span className="wq-key">←↑↓→</span><span className="wq-key">WASD</span><span>이동</span>
          <span className="wq-key">Space</span><span>상호작용</span>
        </div>
        <Controls dpadRef={dpadRef} onA={() => actionsRef.current.interact()} visible={phase === "play"} />

        {petals && <Petals />}
        <AnimatePresence>
          {flash > 0 && phase === "cutscene" && (
            <motion.div key={`f${flash}`} className="absolute inset-0 z-[55] bg-white pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.7 }} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentLine && (
            <DialogBox key="dlg" line={currentLine} typed={typed} onNext={() => actionsRef.current.interact()} outfit={outfit} compact={compact} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "modal" && modalGate != null && <QuestModal key="modal" gate={GATE_BY_ID[modalGate]} cleared={modalCleared} onClear={setModalCleared} onUnlock={unlock} selectedHousing={selectedHousing} onSelectHousing={setSelectedHousing} />}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "propose" && (
            <motion.div key="yes" className="absolute left-1/2 z-[60] flex flex-col items-center gap-3" style={{ bottom: "max(48px, env(safe-area-inset-bottom, 0px))", x: "-50%" }}
              initial={{ y: 60, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 240, damping: 14 }}>
              <div className="wq-bubble" style={{ fontSize: 15 }}>[예비신랑]의 프로포즈에 대답해 주세요!</div>
              <motion.button className="wq-yes" onClick={accept} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
                animate={{ boxShadow: ["0 0 0 0 rgba(255,71,102,0), 0 6px 0 #8E1030", "0 0 34px 10px rgba(255,71,102,.7), 0 6px 0 #8E1030", "0 0 0 0 rgba(255,71,102,0), 0 6px 0 #8E1030"] }}
                transition={{ duration: 1.3, repeat: Infinity }}>
                <span className="wq-pixel">YES!</span>
                <Heart size={22} fill="#fff" strokeWidth={0} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{phase === "finale" && <MasterReport key="fin" housing={selectedHousing} onRestart={restart} />}</AnimatePresence>
    </div>
  );
}

/* =====================================================================
 *  9. STYLES (fonts + pixel UI chrome)
 * ===================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Jua&family=Press+Start+2P&display=swap');
.wq-root { font-family: 'Jua', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; -webkit-tap-highlight-color: transparent; }
.wq-pixel { font-family: 'Press Start 2P', 'Courier New', monospace; letter-spacing: .02em; }
.wq-ko { font-family: 'Jua', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; }
.wq-wood-frame { background: #6E472B; border: 3px solid #2E1A0C; box-shadow: inset 0 0 0 2px #A8743E, inset 0 0 0 4px #4A2E18, 0 4px 0 rgba(0,0,0,.45); padding: 7px 14px 4px; border-radius: 4px; }
.wq-hint { color: #F4F1E4; font-size: 13px; background: rgba(20,14,8,.55); padding: 6px 10px; border-radius: 4px; border: 2px solid rgba(0,0,0,.4); }
.wq-key { font-family: 'Press Start 2P', monospace; font-size: 8px; background: #F5EBD6; color: #3A2414; padding: 3px 5px; border-radius: 2px; box-shadow: 0 2px 0 #8A6A44; }
.wq-bubble { position: relative; font-family: 'Jua', sans-serif; font-size: 13px; color: #3A2414; background: #FFF8E8; border: 3px solid #3A2414; padding: 6px 10px; box-shadow: 0 3px 0 rgba(0,0,0,.3); white-space: nowrap; }
.wq-bubble::after { content: ''; position: absolute; left: 50%; bottom: -9px; width: 10px; height: 10px; background: #FFF8E8; border-right: 3px solid #3A2414; border-bottom: 3px solid #3A2414; transform: translateX(-50%) rotate(45deg); }
.wq-akey { display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 99px; background: #3A3A3A; color: #fff; font-family: 'Press Start 2P', monospace; font-size: 8px; vertical-align: middle; }
.wq-dpad { position: relative; width: 126px; height: 126px; border-radius: 999px; background: rgba(40,40,44,.55); border: 3px solid rgba(255,255,255,.18); box-shadow: inset 0 0 0 6px rgba(0,0,0,.18); backdrop-filter: blur(2px); }
.wq-dbtn { position: absolute; width: 38px; height: 38px; display: grid; place-items: center; background: rgba(90,90,96,.85); border: 3px solid #1E1E22; border-radius: 6px; box-shadow: inset 0 -4px 0 rgba(0,0,0,.35), inset 0 3px 0 rgba(255,255,255,.18); cursor: pointer; touch-action: none; }
.wq-dbtn:active { transform: translateY(2px); box-shadow: inset 0 -1px 0 rgba(0,0,0,.35); }
.wq-dbtn:focus-visible, .wq-abtn:focus-visible, .wq-unlock:focus-visible, .wq-yes:focus-visible { outline: 3px solid #FFC21F; outline-offset: 3px; }
.wq-abtn { width: 64px; height: 64px; border-radius: 999px; background: radial-gradient(circle at 35% 30%, #8C8C94, #4A4A52 70%); color: #F2F2F2; font-size: 18px; border: 3px solid #1E1E22; box-shadow: inset 0 -5px 0 rgba(0,0,0,.35), 0 4px 0 rgba(0,0,0,.4); cursor: pointer; touch-action: none; margin-bottom: 30px; }
.wq-dialog { position: relative; background: #F5EBD6; border: 4px solid #5C4028; box-shadow: inset 0 0 0 3px #F5EBD6, inset 0 0 0 6px #8A6440, 0 6px 0 rgba(0,0,0,.4); padding: 34px 22px 18px; min-height: 132px; cursor: pointer; outline: none; }
.wq-dialog:focus-visible { box-shadow: inset 0 0 0 3px #F5EBD6, inset 0 0 0 6px #8A6440, 0 0 0 3px #FFC21F; }
.wq-corner { position: absolute; width: 12px; height: 12px; background: #C8955A; border: 3px solid #3A2414; }
.wq-tl { left: -8px; top: -8px; } .wq-tr { right: -8px; top: -8px; } .wq-bl { left: -8px; bottom: -8px; } .wq-br { right: -8px; bottom: -8px; }
.wq-nameplate { position: absolute; left: 18px; top: -16px; background: #6E472B; color: #FFF1D6; border: 3px solid #3A2414; padding: 3px 12px; font-size: 16px; box-shadow: 0 3px 0 rgba(0,0,0,.3); }
.wq-dialog-text { margin: 0; color: #3A2414; font-size: clamp(16px, 2.2vw, 20px); line-height: 1.65; word-break: keep-all; }
.wq-board { position: relative; width: min(560px, 100%); max-height: calc(100% - 16px); display: flex; background: #6E472B; border: 4px solid #2E1A0C; padding: 12px; box-shadow: inset 0 0 0 3px #A8743E, inset 0 0 0 6px #4A2E18, 0 10px 0 rgba(0,0,0,.45); }
.wq-bracket { position: absolute; width: 22px; height: 22px; border: 5px solid #C8A060; z-index: 2; }
.wq-board .wq-tl { left: -6px; top: -6px; border-right: none; border-bottom: none; }
.wq-board .wq-tr { right: -6px; top: -6px; border-left: none; border-bottom: none; }
.wq-board .wq-bl { left: -6px; bottom: -6px; border-right: none; border-top: none; }
.wq-board .wq-br { right: -6px; bottom: -6px; border-left: none; border-top: none; }
.wq-parchment { flex: 1; min-width: 0; overflow-y: auto; overflow-x: hidden; background: radial-gradient(ellipse at 50% 40%, #F8EDD4 0%, #F3E5C8 60%, #E6D2A8 100%); border: 3px solid #3A2414; padding: 18px 18px 20px; box-shadow: inset 0 0 18px rgba(120,80,30,.25); }
.wq-title { font-family: 'Jua', sans-serif; font-size: clamp(20px, 3vw, 26px); color: #3A2414; text-align: center; margin: 4px 0 8px; line-height: 1.4; text-wrap: balance; }
.wq-unlock { display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px; background: linear-gradient(#FFE88A 0 30%, #FFC21F 30% 75%, #E8A100 75%); color: #5A3406; border: 3px solid #5A3406; border-radius: 4px; font-size: 13px; cursor: pointer; }
.wq-yes { display: inline-flex; align-items: center; gap: 12px; padding: 16px 30px; background: linear-gradient(#FF8CA2 0 30%, #FF4766 30% 75%, #D92A4E 75%); color: #fff; border: 3px solid #6A0A22; border-radius: 4px; font-size: 18px; cursor: pointer; text-shadow: 0 2px 0 #8E1030; }
.wq-unlock:disabled { filter: grayscale(.85); opacity: .8; cursor: not-allowed; }
.wq-card { position: relative; background: #FFF8E8; border: 3px solid #5C4028; padding: 24px 12px 12px; box-shadow: 0 4px 0 rgba(0,0,0,.2); cursor: pointer; min-width: 0; }
.wq-card.is-sel { background: #FFFDF4; }
.wq-tag { position: absolute; left: -3px; top: -3px; color: #fff; font-family: 'Press Start 2P', monospace; font-size: 10px; padding: 4px 7px; border: 3px solid #3A2414; }
.wq-stamp { position: absolute; right: -10px; top: -16px; width: 50px; height: 50px; z-index: 2; display: grid; place-items: center; border: 4px solid; border-radius: 8px; background: rgba(255,255,255,.8); }
.wq-piece { position: relative; background: #FFF8E8; border: 3px solid #5C4028; padding: 6px 8px; box-shadow: 0 3px 0 rgba(0,0,0,.25); cursor: pointer; }
.wq-piece::after { content: ''; position: absolute; left: 50%; bottom: -8px; width: 8px; height: 8px; background: #FFF8E8; border-right: 3px solid #5C4028; border-bottom: 3px solid #5C4028; transform: translateX(-50%) rotate(45deg); }
.wq-slot { width: 100%; max-width: 70px; aspect-ratio: 1; display: grid; place-items: center; position: relative; z-index: 1; background: #A8743E; border: 3px solid #4A2E18; box-shadow: inset 0 -5px 0 rgba(0,0,0,.25), inset 0 3px 0 rgba(255,255,255,.2); }
.wq-slot.is-filled { background: #C8955A; }
.wq-slot.is-next { outline: 3px dashed #FFB800; outline-offset: 2px; }
.wq-chain { position: absolute; left: 12%; right: 12%; top: 28px; height: 8px; z-index: 0; background: repeating-linear-gradient(90deg, #8E949C 0 8px, transparent 8px 12px); border-top: 2px solid #3A3E46; border-bottom: 2px solid #3A3E46; }
.wq-ribbon { position: relative; z-index: 0; align-self: center; max-width: calc(100% - 40px); background: #8A5A30; color: #FFE6B0; border: 3px solid #3A2414; padding: 8px 16px; font-size: 15px; text-align: center; box-shadow: inset 0 0 0 2px #B07A44, 0 4px 0 rgba(0,0,0,.25); }
.wq-ribbon::before, .wq-ribbon::after { content: ''; position: absolute; top: 6px; bottom: -8px; width: 16px; background: #2B4A8A; border: 3px solid #3A2414; z-index: -1; }
.wq-ribbon::before { left: -16px; } .wq-ribbon::after { right: -16px; }
.wq-house { display: flex; flex-direction: column; gap: 6px; background: #FFF8E8; border: 3px solid; padding: 6px; min-width: 0; }
.wq-price { background: #1E68D0; color: #fff; border: 2px solid #0E3A80; text-align: center; font-size: 13px; padding: 3px 4px; box-shadow: inset 0 -3px 0 rgba(0,0,0,.25); }
.wq-select { color: #fff; border: 2px solid #1E5A20; font-size: 12px; padding: 6px 4px; line-height: 1.2; box-shadow: inset 0 -3px 0 rgba(0,0,0,.25); cursor: pointer; }
.wq-track { position: relative; height: 30px; background: #6E472B; border: 3px solid #2E1A0C; box-shadow: inset 0 4px 0 rgba(0,0,0,.35); cursor: pointer; touch-action: none; }
.wq-track:focus-visible, .wq-card:focus-visible, .wq-piece:focus-visible, .wq-select:focus-visible, .wq-pm:focus-visible, .wq-ox:focus-visible { outline: 3px solid #FFB800; outline-offset: 3px; }
.wq-track-fill { position: absolute; left: 0; top: 0; bottom: 0; background: linear-gradient(#FFE27A 0 30%, #FFB800 30% 75%, #D99600 75%); }
.wq-lever { position: absolute; top: -12px; width: 28px; height: 48px; margin-left: -14px; background: linear-gradient(90deg, #FFE27A 0 30%, #FFB800 30% 72%, #C98400 72%); border: 3px solid #5A3406; box-shadow: 0 4px 0 rgba(0,0,0,.35); }
.wq-green-stamp { max-width: 210px; border: 4px solid #2E8B57; box-shadow: inset 0 0 0 2px #2E8B57; color: #2E8B57; background: rgba(235,250,238,.9); padding: 6px 10px; font-size: 14px; line-height: 1.3; }
.wq-alloc { display: flex; align-items: center; gap: 10px; background: #EAD7B0; border: 2px solid #B89A6A; padding: 8px 10px; }
.wq-pm { width: 30px; height: 30px; display: grid; place-items: center; border: 3px solid #3A2414; font-family: 'Press Start 2P', monospace; font-size: 12px; color: #3A2414; box-shadow: inset 0 -3px 0 rgba(0,0,0,.25); cursor: pointer; }
.wq-portrait { border: 4px solid #5C4028; padding: 6px 12px 0; box-shadow: inset 0 0 0 2px #E8D2AE; }
.wq-ox { border: 3px solid #3A2414; color: #fff; font-size: clamp(18px, 4vw, 26px); padding: 18px 0; cursor: pointer; text-shadow: 0 3px 0 rgba(0,0,0,.35); }
.wq-report-row { display: flex; align-items: center; gap: 12px; background: #EAD7B0; border: 2px solid #B89A6A; padding: 8px 12px; }
.wq-pass { position: absolute; right: 4px; top: 50%; margin-top: -46px; width: 92px; height: 92px; border-radius: 999px; border: 5px double #D0302A; color: #D0302A; background: rgba(255,240,236,.6); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.5; pointer-events: none; }
.wq-next { background: #58B848; color: #fff; border: 3px solid #1E5A20; padding: 12px 16px; font-size: 15px; opacity: .55; box-shadow: inset 0 -4px 0 rgba(0,0,0,.25); }
@media (prefers-reduced-motion: reduce) { .wq-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
`;
