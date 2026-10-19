# 2028 Wedding Quest

서연 & 재훈이 자물쇠 바위 5개를 열고 2028 웨딩 아치까지 가는 2D 탑다운 픽셀 RPG 프로토타입.

- 게임 전체: `src/WeddingQuest.jsx` (관문 텍스트는 파일 맨 위 `QUEST_GATES`만 수정)
- 개발 서버: `npm run dev` · 빌드: `npm run build`
- `main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.

## 공용 PC에서 쓰는 경우
- 이 저장소는 저장소 전용 SSH deploy key(`.deploy-key/`, git에 올라가지 않음)로만 푸시합니다.
- 커밋하면 `.git/hooks/post-commit` 훅이 자동으로 푸시합니다.
- 작업을 마치면 `sh scripts/revoke-access.sh` 실행 후 GitHub에서 deploy key를 삭제하세요.
- 이 PC의 `gh` CLI가 계정 전체 권한으로 로그인돼 있다면 `gh auth logout`도 해야 진짜로 접근이 끊깁니다.
