# lebron-stats-viz

Interactive split-screen comparison of LeBron James with other NBA greats (ICS/CINE 484 final project).
Pick a player and a season on each side to see per-game stats (PTS, REB, AST, FG%, 3PT%, BLK), the team, and every accolade earned up to that season.

**Live site:** `https://<your-github-username>.github.io/lebron-stats-viz/`

## Run locally
No build step. Open `index.html` in a browser (or run `python3 -m http.server` and visit http://localhost:8000).

## Structure
- `index.html` – page and list of player data files
- `css/style.css`, `js/app.js` – look and behavior
- `data/<player>.js` – one file per player (stats by season + accolades)
- `images/players/` – optional photos (see its README)

## Team workflow
1. Never edit `main` directly. Create a branch: `git checkout -b add-<player>`.
2. Make your change, commit, push, and open a Pull Request.
3. A teammate reviews it and merges. GitHub Pages redeploys automatically.

Adding a player? See [CONTRIBUTING.md](CONTRIBUTING.md).

## Publishing (one time)
Settings → Pages → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
Add teammates under Settings → Collaborators.

## Data notes
Per-game regular-season stats are from landofbasketball.com; honors are from Wikipedia's career-achievement lists. Only completed seasons are included.
