# planning-station

## Shell commands

- Never `cd`. Use absolute paths, or a tool's own directory flag (`git -C <dir>`, `npm --prefix <dir>`, `npx vitest run --root <dir>`). The shell already starts in the repo root, so `npx vitest run` needs no `cd` at all.
- Never edit files from the shell: no `python3 - <<EOF`, `sed -i`, `perl -pi`, `cat >`, or `tee`. Use the Edit tool, one call per file. It is allowlisted, shows a diff, and fails when the target string is missing instead of silently doing nothing.
- Single-quote every inline program (`jq`, `awk`, `sed -n`, `node -e`, `grep -E`). Double quotes let the shell expand `$name` to an empty string, which breaks the program, and any unquoted `$var`, `$(...)`, or backtick makes the command impossible to match against the allowlist, so it prompts. If the program needs a literal single quote, write it to a file in the scratchpad with the Write tool and pass it with `jq -f` / `awk -f`.
- Keep each Bash call to one allowlisted command plus an optional read-only pipe (`| head`, `| tail`, `| grep`). Do not chain an edit step and a test step with `&&`; make the edits with Edit, then run the tests as a separate call.

Every part of a compound command must match a rule in `.claude/settings.json`, so a single `cd`, redirect, or `rm` turns an otherwise pre-approved command into a permission prompt.

## Temporary files

Create throwaway files (type probes, scratch scripts, fixtures) with the Write tool in the session scratchpad directory, never with shell heredocs or `>` redirects, and never in the repo root. Run the check against the scratchpad path and leave the file there; do not `rm` it.

Shell redirects and `rm` are not on the permission allowlist in `.claude/settings.json`, so a compound command containing either one triggers a permission prompt even when every other part is allowed.

To type-check a probe against this repo's sources, import them by absolute path, with `<repo>` standing for this checkout's root:

```ts
import type { PlanBlock } from "<repo>/packages/planning-document/src/blocks/plan-blocks.js";
```

then run `npx tsc --noEmit --target ES2023 --module nodenext --moduleResolution nodenext --strict <scratchpad>/probe.ts` on its own, without piping into a cleanup step.
