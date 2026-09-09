# Naxosv2

Naxosv2 is the clean course source for the next Evia rebuild.

## Learner-facing packs
- Bricklayer ST0095 v1.2 — 12 packs
- Site Carpenter ST0264 v1.4 — 16 packs
- Architectural Joiner ST0264 v1.4 — 13 packs
- City & Guilds Level 3 NVQ Diploma in Trowel Occupations 6570-05 — 8 mandatory packs + 1 selected optional pack

The learner sees these packs. Detailed KSB or NVQ AC mapping remains behind the scenes.

## 6570-05
The NVQ source retains the official unit structure, Learning Outcomes, Assessment Criteria and lettered sub-elements such as a, b, c through aa, bb where present.

Naxos treats holistic cross-unit links as candidate mappings only. Evidence is not automatically awarded against an AC. Partially met ACs stay partial and only unmet requirements should appear as gap/top-up evidence.

Source files:
- `data/6570-05/config.json` — qualification metadata, unit metadata, learner capture guidance and cross-unit candidates
- `data/6570-05/source/` — complete unit source wording
- `data/6570-05/normalise.js` — normalises every lettered sub-element for individual tracking

## PWA
This repository is a GitHub Pages progressive web app. It includes a web manifest, service worker and an installable app icon.

## Current data
`naxosv2-main-task-structure.json` contains the approved learner-facing Standard pack structure and capture contract.

`data/course-metadata.json` contains the current course/qualification metadata used by the app.

Official KSB/AC source data must never be guessed.
