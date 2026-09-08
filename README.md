# Naxosv2

Naxosv2 is the course-builder and source-of-truth for the apprenticeship course structure used by Evia.

## Approved structure

The detailed course mapping remains inside Naxos as a 5×5×5 internal model. Learners should not be asked to work through every atomic KSB/facet as a separate job. Evia should instead show recognisable **main tasks** and let Naxos map those tasks to the detailed KSB/facet structure underneath.

Current learner-facing courses:

- Bricklayer — ST0095 — 12 main tasks
- Site Carpenter — ST0264 — 16 main tasks
- Architectural Joiner — ST0264 — 13 main tasks

The exact approved task catalogue and capture contract are stored in `naxosv2-main-task-structure.json`.

## Internal course rules

Each course retains the detailed 5×5×5 Naxos mapping structure. Packs should support top navigation for:

- Knowledge
- Skills
- Behaviours

Relevant Knowledge and Skills should be attached together. Behaviours should be mapped where they naturally occur across real work.

Any KSB/facet not naturally covered by the learner's main practical evidence is treated as a later gap/top-up rather than becoming another learner-facing job.

## Evia evidence contract

When Evia is rebuilt, the intended evidence experience is:

1. Learner chooses a main task.
2. Evia opens photo capture directly — no intermediate “Start evidence” page.
3. Top quarter: Evia appears at the top-left with one natural speech-bubble sentence explaining useful evidence to capture.
4. Middle: live camera view.
5. Bottom quarter: collected photo thumbnails.
6. Photo collection is a natural start-to-finish photo dump rather than one photo per KSB.
7. After photos, show **“What else is shown?”** as Evia-style selectable pills.
8. The learner selects only extra areas actually demonstrated in the evidence.
9. Any separate **Explain** requirement is completed afterwards by Written or Audio and is not counted as another photo.
10. The assessor still decides whether the submitted evidence meets the mapped criteria.

## Mapping rule

The JSON deliberately leaves `ksbTargets` and `facets` arrays empty where the detailed official mapping has not yet been reloaded into Naxosv2. Those mappings must be populated from the official course data; they must not be guessed or inferred.
