#!/usr/bin/env bash

# Build gh-pages branch, move changes to /doc and commit

current_branch=$(git rev-parse --abbrev-ref HEAD)
[[ "$current_branch" != "gh-pages" ]] && echo "You are not on gh-pages branch" && exit 1

echo "Build project" && pnpm run build
echo "Move dist files to /docs" && mv -v .output/public/* ./docs/
echo "Commit changes" && git add ./docs && git commit -m "doc: release gh-pages"
