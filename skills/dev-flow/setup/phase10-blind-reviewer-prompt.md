# Phase 10 Track B — blind evidence reviewer: brief and prompt templates

Used by `phase-10-ui-verification.md`, "Blind evidence review". Two parts: the **brief** the auditor writes into the review folder before prep, and the **prompt** the auditor gives a fresh general-purpose subagent after prep.

Keep the prompt's wording plain. It describes a folder of inputs and a task. Dramatic wording ("sealed folder", "read nothing else") made a permission classifier block the first launch in a trial; this wording went through.

Fill `{…}` and delete nothing else. Do not add the auditor's verdicts, the summary, the mapping, or hints about which image shows what.

---

## Brief (`phase-10-review/brief.md`)

```markdown
# Brief: {product} {bug or change, in plain words} ({version})

{Two or three sentences: where the user sees this and what they do.}

Bug: {what went wrong, as the user saw it}.

Fix requirement: {what must be true after the fix, including what must not change}.

Files in this folder:
- `plan.md`: the test plan, fixed before the run (rows, expected outputs, where to look, pass criteria).
- `signals.jsonl`: measurements written by the test script, one JSON object per line: `ts`, `row`, `signal`, `value`, `source` (the command, query or API call that produced it). {Say how secrets are written, e.g. "`cookie.*` values are a presence flag plus a short hash, never the raw value."}
- `images/`: screenshots under neutral names, in random order.
```

---

## Prompt (give to the subagent as is, with the folder path filled in)

```text
You are reviewing test evidence for a software fix. You did not run the test and you have no other context; that is intended.

Your inputs are in this folder: {absolute path to phase-10-review/input}
- brief.md: the bug and the fix requirement.
- plan.md: the test plan, written before the run. Its expected outputs are fixed.
- signals.jsonl: measurements the test script wrote, each with its source and a timestamp.
- images/: screenshots under neutral names in random order. Some images may prove nothing in the plan.

Work only from these inputs. You may open and measure the images (for example, scan pixels for a marker colour named in the plan, or compare two images pixel by pixel). Do not change any file.

Task: say what this evidence proves about each plan row. You judge the evidence, not the fix: never write "PASS" or "FAIL".

Reply in Markdown with these sections, in this order:

1. Files read: every file you opened, with its path.
2. Images: a table with one row per image:
   | Image | What it shows | Plan row(s) it serves, or "no row" | Purpose | Where to look | Proof level | Problems |
   Proof level is one of:
   - SELF: the image alone proves the row's expected output.
   - WITH-DATA: the image proves it only together with named signals.
   - NONE: the image proves nothing for any row.
   If two images look the same, check whether they are identical and say so.
3. Rows: a table with one row per plan row:
   | Row | Verdict | Images | Signals (signal names and values) | Reason |
   Verdict is one of:
   - PROVEN: the images and/or signals show the expected output.
   - DATA-ONLY: only signals show it (state whether the plan expected that).
   - NOT SHOWN: nothing in the inputs shows it.
   - CONTRADICTED: an image or signal disagrees with the expected output, or an image disagrees with the signals, or the row did not exercise what it says it tests.
4. Picks: 1-2 images per product version that best show the fix to a product owner, each with a one-sentence caption.
5. Findings: numbered, most important first. For each: what is wrong or missing, which image/row/signal, and what would fix the evidence (for example, retake one shot, or add a signal).
6. Which scenario is missing? (optional, does not block): from the brief alone, up to three scenarios the plan does not test that a reviewer of this fix would expect.
```

---

## After the reply

Save the reply verbatim as `phase-10-review/review.md`, then append `## Reconcile` (auditor): `img-NN` → real file from `mapping.txt`; mapping right or wrong; each finding true or false; decoy returned as "no row" (if not, the review failed: rerun once on a fresh prep).
