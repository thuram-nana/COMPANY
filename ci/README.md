# CI workflow — activation

`ci.yml.txt` is the GitHub Actions pipeline for this repo (build, HTML
validation, accessibility, contrast, link check, Lighthouse, SBOM, provenance,
deploy, IndexNow, and Search Console submission).

It is parked here as a `.txt` because the initial push used a token without the
`workflow` scope, and GitHub blocks workflow files from such tokens. To activate:

1. Move it into place and rename:
   `mkdir -p .github/workflows && git mv ci/ci.yml.txt .github/workflows/ci.yml`
2. Commit and push with a token that has the **`workflow`** scope (or do the move
   directly in the GitHub web UI, which doesn't need the scope).

Nothing else depends on this move; the site builds and tests locally without it
(`npm install && npm run build && npm test`).
