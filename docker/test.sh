
sudo docker build -t test-mono:latest docker/  \
  --build-arg GITHUB_ACCESS_TOKEN="a" \
  --build-arg MONOREPO_TARGET_REPO="workspace-nest" \
  --build-arg MONOREPO_TARGET_BRANCH="master" \
  --build-arg APP_TARGET_REPO="api-control-test-with-mono" \
  --build-arg APP_TARGET_BRANCH="master"

sudo docker run test-mono 