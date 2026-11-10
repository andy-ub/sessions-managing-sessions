#!/usr/bin/env bash
# Phase 10 Track B: builds the input folder for the blind evidence review.
#
# Usage:
#   bash phase10-review-prep.sh -e <evidence-dir> -r <review-dir> -p <plan-file> \
#        [-s <plan-start-regex>] [-x <plan-stop-regex>] [-b <brief-file>]
#
#   -e  evidence folder: the run's PNGs (one of them `decoy-*.png`) and `signals.jsonl`
#   -r  review folder, e.g. <item folder>/phase-10-review (one per product version if
#       you verify several); gets input/, mapping.txt and prep-time.txt
#   -p  the Phase 2 plan file (phase-2-plan.md / investigation.md)
#   -s  regex for the heading that starts the plan section (default: '^## Phase 10 test plan')
#   -x  regex for the line that ends it, excluded (default: the next '## ' heading)
#   -b  brief (default: <review-dir>/brief.md)
#
# What it does:
#   - copies every PNG, decoy included, into input/images/ under shuffled neutral names
#     (img-01.png ...) and writes the mapping to <review-dir>/mapping.txt, outside input/;
#   - copies signals.jsonl without its "signal":"screenshot" lines (they name the files);
#   - copies the plan section verbatim and the brief;
#   - fails if there is no decoy, no signals, an empty plan section, or if any real
#     evidence file name appears in the input;
#   - writes the prep time and the plan section's SHA-256 to <review-dir>/prep-time.txt.
#
# Requires: bash 4 or later (mapfile; macOS ships bash 3.2, so use a newer bash there),
# and sha256sum or, if that is missing, shasum -a 256.
set -euo pipefail

start=$(date +%s)
E= R= PLAN= BRIEF= START_RE='^## Phase 10 test plan' STOP_RE=
while getopts 'e:r:p:s:x:b:' o; do
  case $o in
    e) E=$OPTARG ;; r) R=$OPTARG ;; p) PLAN=$OPTARG ;;
    s) START_RE=$OPTARG ;; x) STOP_RE=$OPTARG ;; b) BRIEF=$OPTARG ;;
    *) sed -n '2,15p' "$0"; exit 2 ;;
  esac
done
fail() { echo "prep: $*" >&2; exit 1; }
[ -n "$E" ] && [ -n "$R" ] && [ -n "$PLAN" ] || { sed -n '2,15p' "$0"; exit 2; }
BRIEF=${BRIEF:-$R/brief.md}
[ -d "$E" ] || fail "no evidence folder: $E"
[ -f "$E/signals.jsonl" ] || fail "no signals.jsonl in $E (signals come from the test script)"
[ -f "$PLAN" ] || fail "no plan file: $PLAN"
[ -f "$BRIEF" ] || fail "no brief: $BRIEF"

shopt -s nullglob
pngs=("$E"/*.png)
decoys=("$E"/decoy-*.png)
[ ${#pngs[@]} -gt 0 ] || fail "no PNGs in $E"
[ ${#decoys[@]} -gt 0 ] || fail "no decoy-*.png in $E (capture one shot that proves no plan row)"

IN=$R/input
mkdir -p "$R"
rm -rf "$IN"
mkdir -p "$IN/images"

# Images: shuffled neutral names; the mapping stays outside input/.
if command -v shuf >/dev/null 2>&1; then SHUF=(shuf); else SHUF=(sort -R); fi
mapfile -t files < <(printf '%s\n' "${pngs[@]}" | "${SHUF[@]}")
: > "$R/mapping.txt"
i=1
for f in "${files[@]}"; do
  n=$(printf 'img-%02d.png' "$i")
  cp "$f" "$IN/images/$n"
  echo "$n $(basename "$f")" >> "$R/mapping.txt"
  i=$((i + 1))
done

# Signals: script-written lines only, minus the screenshot lines.
grep -v '"signal":"screenshot"' "$E/signals.jsonl" > "$IN/signals.jsonl" || true
[ -s "$IN/signals.jsonl" ] || fail "signals.jsonl has no lines besides screenshots"

# Plan: the Phase 10 section, verbatim.
awk -v s="$START_RE" -v x="$STOP_RE" '
  !p && $0 ~ s { p = 1; print; next }
  p && x != "" && $0 ~ x { exit }
  p && x == "" && /^## / { exit }
  p { print }' "$PLAN" > "$IN/plan.md"
[ -s "$IN/plan.md" ] || fail "no plan section matching '$START_RE' in $PLAN"

cp "$BRIEF" "$IN/brief.md"

# Leak check: no real evidence file name may appear in the input.
for f in "${pngs[@]}"; do
  b=$(basename "$f")
  if grep -rqF -- "$b" "$IN"/*.md "$IN/signals.jsonl"; then
    fail "real file name '$b' appears in the input; remove it and rerun"
  fi
done

end=$(date +%s)
if command -v sha256sum >/dev/null 2>&1; then SHA=(sha256sum); else SHA=(shasum -a 256); fi
sha=$("${SHA[@]}" "$IN/plan.md" | cut -d' ' -f1)
{ echo "prep seconds: $((end - start))"; echo "plan section sha256: $sha"; } | tee "$R/prep-time.txt"
echo "input: $(ls "$IN" | tr '\n' ' ')| images: ${#files[@]} (decoys: ${#decoys[@]})"
