# Adding a player

1. Copy `data/_TEMPLATE.js.txt` to `data/first-last.js`.
2. Fill in `id`, `name`, `initials`, one row per season, and the `accolades` lists.
   - Season labels must look like `2014-15`.
   - FG% and 3P% are percentages (`47.2`).
   - An honor's season is the season it belongs to (the 2012 title is `2011-12`).
3. Add `<script src="data/first-last.js"></script>` to `index.html` next to the others.
4. Add the team's color in `TEAM_COLORS` in `js/app.js` if it's a new team.
5. Open `index.html` and check both dropdowns work for the new player.
6. Optional: add photos (see `images/players/README.md`).
7. Open a Pull Request.

Please cite where the numbers came from in the PR description, and double-check at least a few rows against Basketball-Reference.
