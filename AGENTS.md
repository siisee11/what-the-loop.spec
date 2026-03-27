# AGENTS.md

## Deployment

- The explanation web app for this repository is deployed to Cloudflare Pages.
- Use the existing Cloudflare Pages project `what-the-loop-spec`.
- Build from `/Users/dev/git/what-the-loop.spec/explanation` with `npm run build`.
- Deploy the built output in `/Users/dev/git/what-the-loop.spec/explanation/dist` with:
  `wrangler pages deploy dist --project-name what-the-loop-spec`
- When code changes are made in this repository, the default follow-through is:
  build, deploy, commit, and push.
