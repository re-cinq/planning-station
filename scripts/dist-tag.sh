#!/usr/bin/env bash
# Tags a built package as <name>-dist-v<version>: a commit whose root is the
# package, so a host can install it from git before it is on a registry.
# Sibling packages are pinned to their own dist tags. Run after `npm run build`;
# an existing tag is left alone, so re-running is safe.
set -euo pipefail

package_dir="$1"
repo_url="${2:-git+https://github.com/re-cinq/planning-station.git}"

name="$(basename "$package_dir")"
version="$(jq -r .version "$package_dir/package.json")"
tag="$name-dist-v$version"

if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
  echo "$tag already exists"
  exit 0
fi

versions="$(jq -n '[inputs | {(.name): .version}] | add' packages/*/package.json)"
tree="$(mktemp -d)"
cp -r "$package_dir/dist" "$package_dir/README.md" "$tree/"
jq --arg repo "$repo_url" --argjson versions "$versions" '
  del(.scripts, .devDependencies)
  | .dependencies |= with_entries(
      if $versions[.key] then
        .value = "\($repo)#\(.key | ltrimstr("@re-cinq/"))-dist-v\($versions[.key])"
      else . end)
' "$package_dir/package.json" >"$tree/package.json"

git -C "$tree" init -q
git -C "$tree" add -A
git -C "$tree" -c user.name="planning-station" -c user.email="noreply@re-cinq.com" \
  commit -q -m "$name $version, built from $(git rev-parse --short HEAD)"
git fetch -q "$tree" HEAD
git tag "$tag" FETCH_HEAD
echo "tagged $tag"
