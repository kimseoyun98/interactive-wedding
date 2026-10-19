#!/bin/sh
# 공용 PC에서 작업을 마칠 때 실행: 이 PC에 남은 GitHub 접근 수단을 지웁니다.
# 실행 후 GitHub 저장소 Settings → Deploy keys 에서 "interactive-wedding" 키도 삭제하세요.
cd "$(git rev-parse --show-toplevel)" || exit 1
rm -rf .deploy-key
git config --unset core.sshCommand
rm -f .git/hooks/post-commit
echo "로컬 deploy key, sshCommand 설정, 자동 푸시 훅을 삭제했습니다."
echo "남은 단계 1: GitHub → 저장소 Settings → Deploy keys 에서 키 삭제"
echo "남은 단계 2: 이 PC의 gh 로그인도 지우려면 → gh auth logout -h github.com -u kimseoyun98"
