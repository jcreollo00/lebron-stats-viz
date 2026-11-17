// Michael Jordan. Per-game regular-season stats (he did not play in 1993-94 or 1998-99 to 2000-01).
// FG% and 3P% are stored as percentages. Source: Basketball-Reference.com. Honors: Wikipedia, "List of career achievements by Michael Jordan".
registerPlayer({
  id: "michael-jordan",
  name: "Michael Jordan",
    initials: "MJ",
  born: "1963-02-17",
  bref: "https://www.basketball-reference.com/players/j/jordami01.html",
  seasons: [
    { season: "1984-85", team: "Chicago Bulls", gp: 82, pts: 28.2, reb: 6.5, ast: 5.9, fg: 51.5, tp: 17.3, blk: 0.8 },
    { season: "1985-86", team: "Chicago Bulls", gp: 18, pts: 22.7, reb: 3.6, ast: 2.9, fg: 45.7, tp: 16.7, blk: 1.2 },
    { season: "1986-87", team: "Chicago Bulls", gp: 82, pts: 37.1, reb: 5.2, ast: 4.6, fg: 48.2, tp: 18.2, blk: 1.5 },
    { season: "1987-88", team: "Chicago Bulls", gp: 82, pts: 35.0, reb: 5.5, ast: 5.9, fg: 53.5, tp: 13.2, blk: 1.6 },
    { season: "1988-89", team: "Chicago Bulls", gp: 81, pts: 32.5, reb: 8.0, ast: 8.0, fg: 53.8, tp: 27.6, blk: 0.8 },
    { season: "1989-90", team: "Chicago Bulls", gp: 82, pts: 33.6, reb: 6.9, ast: 6.3, fg: 52.6, tp: 37.6, blk: 0.7 },
    { season: "1990-91", team: "Chicago Bulls", gp: 82, pts: 31.5, reb: 6.0, ast: 5.5, fg: 53.9, tp: 31.2, blk: 1.0 },
    { season: "1991-92", team: "Chicago Bulls", gp: 80, pts: 30.1, reb: 6.4, ast: 6.1, fg: 51.9, tp: 27.0, blk: 0.9 },
    { season: "1992-93", team: "Chicago Bulls", gp: 78, pts: 32.6, reb: 6.7, ast: 5.5, fg: 49.5, tp: 35.2, blk: 0.8 },
    { season: "1994-95", team: "Chicago Bulls", gp: 17, pts: 26.9, reb: 6.9, ast: 5.3, fg: 41.1, tp: 50.0, blk: 0.8 },
    { season: "1995-96", team: "Chicago Bulls", gp: 82, pts: 30.4, reb: 6.6, ast: 4.3, fg: 49.5, tp: 42.7, blk: 0.5 },
    { season: "1996-97", team: "Chicago Bulls", gp: 82, pts: 29.6, reb: 5.9, ast: 4.3, fg: 48.6, tp: 37.4, blk: 0.5 },
    { season: "1997-98", team: "Chicago Bulls", gp: 82, pts: 28.7, reb: 5.8, ast: 3.5, fg: 46.5, tp: 23.8, blk: 0.5 },
    { season: "2001-02", team: "Washington Wizards", gp: 60, pts: 22.9, reb: 5.7, ast: 5.2, fg: 41.6, tp: 18.9, blk: 0.4 },
    { season: "2002-03", team: "Washington Wizards", gp: 82, pts: 20.0, reb: 6.1, ast: 3.8, fg: 44.5, tp: 29.1, blk: 0.5 }
  ],
    // Playoff per-game stats, one row per season he made the playoffs (source: Land of Basketball).
  playoffs: [
    { season: "1984-85", team: "Chicago Bulls", gp: 4, pts: 29.3, reb: 5.8, ast: 8.5, fg: 43.6, tp: 12.5, blk: 1.0 },
    { season: "1985-86", team: "Chicago Bulls", gp: 3, pts: 43.7, reb: 6.3, ast: 5.7, fg: 50.5, tp: 100.0, blk: 1.3 },
    { season: "1986-87", team: "Chicago Bulls", gp: 3, pts: 35.7, reb: 7.0, ast: 6.0, fg: 41.7, tp: 40.0, blk: 2.3 },
    { season: "1987-88", team: "Chicago Bulls", gp: 10, pts: 36.3, reb: 7.1, ast: 4.7, fg: 53.1, tp: 33.3, blk: 1.1 },
    { season: "1988-89", team: "Chicago Bulls", gp: 17, pts: 34.8, reb: 7.0, ast: 7.6, fg: 51.0, tp: 28.6, blk: 0.8 },
    { season: "1989-90", team: "Chicago Bulls", gp: 16, pts: 36.7, reb: 7.2, ast: 6.8, fg: 51.4, tp: 32.0, blk: 0.9 },
    { season: "1990-91", team: "Chicago Bulls", gp: 17, pts: 31.1, reb: 6.4, ast: 8.4, fg: 52.4, tp: 38.5, blk: 1.4 },
    { season: "1991-92", team: "Chicago Bulls", gp: 22, pts: 34.5, reb: 6.2, ast: 5.8, fg: 49.9, tp: 38.6, blk: 0.7 },
    { season: "1992-93", team: "Chicago Bulls", gp: 19, pts: 35.1, reb: 6.7, ast: 6.0, fg: 47.5, tp: 38.9, blk: 0.9 },
    { season: "1994-95", team: "Chicago Bulls", gp: 10, pts: 31.5, reb: 6.5, ast: 4.5, fg: 48.4, tp: 36.7, blk: 1.4 },
    { season: "1995-96", team: "Chicago Bulls", gp: 18, pts: 30.7, reb: 4.9, ast: 4.1, fg: 45.9, tp: 40.3, blk: 0.3 },
    { season: "1996-97", team: "Chicago Bulls", gp: 19, pts: 31.1, reb: 7.9, ast: 4.8, fg: 45.6, tp: 19.4, blk: 0.9 },
    { season: "1997-98", team: "Chicago Bulls", gp: 21, pts: 32.4, reb: 5.1, ast: 3.5, fg: 46.2, tp: 30.2, blk: 0.6 }
  ],
  accolades: {
    roy: ["1984-85"],
    mvp: ["1987-88", "1990-91", "1991-92", "1995-96", "1997-98"],
    dpoy: ["1987-88"],
    champion: ["1990-91", "1991-92", "1992-93", "1995-96", "1996-97", "1997-98"],
    finals_mvp: ["1990-91", "1991-92", "1992-93", "1995-96", "1996-97", "1997-98"],
    scoring: ["1986-87", "1987-88", "1988-89", "1989-90", "1990-91", "1991-92", "1992-93", "1995-96", "1996-97", "1997-98"],
    steals: ["1987-88", "1989-90", "1992-93"],
    allstar: ["1984-85", "1985-86", "1986-87", "1987-88", "1988-89", "1989-90", "1990-91", "1991-92", "1992-93", "1995-96", "1996-97", "1997-98", "2001-02", "2002-03"],
    asg_mvp: ["1987-88", "1995-96", "1997-98"],
    olympic: ["1984-85", "1991-92"]
  }
});
