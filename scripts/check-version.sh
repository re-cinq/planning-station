#!/usr/bin/env bash
# The tag says which version it releases; the package must agree.
set -euo pipefail

package_dir="$1"
tagged_version="$2"
package_version="$(node -p "require('./$package_dir/package.json').version")"

if [ "$package_version" != "$tagged_version" ]; then
  echo "tag says $tagged_version but $package_dir/package.json says $package_version" >&2
  exit 1
fi

echo "$package_dir is at $package_version, as the tag says"
