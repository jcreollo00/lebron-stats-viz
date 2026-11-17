// Kareem Abdul-Jabbar (played as Lew Alcindor until 1971). Per-game stats. FG% and 3P% are stored as percentages.
// Stats: Basketball-Reference.com (Per Game, regular season and playoffs).
// Missing data is null, not 0: the NBA did not track blocks until 1973-74 or the 3-point line until 1979-80,
// so blk is null before 1973-74 and tp is null before 1979-80. Playoff tp is null for every row (tiny attempts).
// Note: no playoff rows for 1974-75 and 1975-76, when his teams missed the playoffs.
registerPlayer({
  id: "kareem-abdul-jabbar",
  name: "Kareem Abdul-Jabbar",
  initials: "KA",
  born: "1947-04-16",
  bref: "https://www.basketball-reference.com/players/a/abdulka01.html",
  seasons: [
    { season: "1969-70", team: "Milwaukee Bucks", gp: 82, pts: 28.8, reb: 14.5, ast: 4.1, fg: 51.8, tp: null, blk: null },
    { season: "1970-71", team: "Milwaukee Bucks", gp: 82, pts: 31.7, reb: 16.0, ast: 3.3, fg: 57.7, tp: null, blk: null },
    { season: "1971-72", team: "Milwaukee Bucks", gp: 81, pts: 34.8, reb: 16.6, ast: 4.6, fg: 57.4, tp: null, blk: null },
    { season: "1972-73", team: "Milwaukee Bucks", gp: 76, pts: 30.2, reb: 16.1, ast: 5.0, fg: 55.4, tp: null, blk: null },
    { season: "1973-74", team: "Milwaukee Bucks", gp: 81, pts: 27.0, reb: 14.5, ast: 4.8, fg: 53.9, tp: null, blk: 3.5 },
    { season: "1974-75", team: "Milwaukee Bucks", gp: 65, pts: 30.0, reb: 14.0, ast: 4.1, fg: 51.3, tp: null, blk: 3.3 },
    { season: "1975-76", team: "Los Angeles Lakers", gp: 82, pts: 27.7, reb: 16.9, ast: 5.0, fg: 52.9, tp: null, blk: 4.1 },
    { season: "1976-77", team: "Los Angeles Lakers", gp: 82, pts: 26.2, reb: 13.3, ast: 3.9, fg: 57.9, tp: null, blk: 3.2 },
    { season: "1977-78", team: "Los Angeles Lakers", gp: 62, pts: 25.8, reb: 12.9, ast: 4.3, fg: 55.0, tp: null, blk: 3.0 },
    { season: "1978-79", team: "Los Angeles Lakers", gp: 80, pts: 23.8, reb: 12.8, ast: 5.4, fg: 57.7, tp: null, blk: 4.0 },
    { season: "1979-80", team: "Los Angeles Lakers", gp: 82, pts: 24.8, reb: 10.8, ast: 4.5, fg: 60.4, tp: 0.0, blk: 3.4 },
    { season: "1980-81", team: "Los Angeles Lakers", gp: 80, pts: 26.2, reb: 10.3, ast: 3.4, fg: 57.4, tp: 0.0, blk: 2.9 },
    { season: "1981-82", team: "Los Angeles Lakers", gp: 76, pts: 23.9, reb: 8.7, ast: 3.0, fg: 57.9, tp: 0.0, blk: 2.7 },
    { season: "1982-83", team: "Los Angeles Lakers", gp: 79, pts: 21.8, reb: 7.5, ast: 2.5, fg: 58.8, tp: 0.0, blk: 2.2 },
    { season: "1983-84", team: "Los Angeles Lakers", gp: 80, pts: 21.5, reb: 7.3, ast: 2.6, fg: 57.8, tp: 0.0, blk: 1.8 },
    { season: "1984-85", team: "Los Angeles Lakers", gp: 79, pts: 22.0, reb: 7.9, ast: 3.2, fg: 59.9, tp: 0.0, blk: 2.1 },
    { season: "1985-86", team: "Los Angeles Lakers", gp: 79, pts: 23.4, reb: 6.1, ast: 3.5, fg: 56.4, tp: 0.0, blk: 1.6 },
    { season: "1986-87", team: "Los Angeles Lakers", gp: 78, pts: 17.5, reb: 6.7, ast: 2.6, fg: 56.4, tp: 33.3, blk: 1.2 },
    { season: "1987-88", team: "Los Angeles Lakers", gp: 80, pts: 14.6, reb: 6.0, ast: 1.7, fg: 53.2, tp: 0.0, blk: 1.2 },
    { season: "1988-89", team: "Los Angeles Lakers", gp: 74, pts: 10.1, reb: 4.5, ast: 1.0, fg: 47.5, tp: 0.0, blk: 1.1 }
  ],
  // Playoff per-game stats, one row per season he made the playoffs (source: Basketball-Reference).
  playoffs: [
    { season: "1969-70", team: "Milwaukee Bucks", gp: 10, pts: 35.2, reb: 16.8, ast: 4.1, fg: 56.7, tp: null, blk: null },
    { season: "1970-71", team: "Milwaukee Bucks", gp: 14, pts: 26.6, reb: 17.0, ast: 2.5, fg: 51.5, tp: null, blk: null },
    { season: "1971-72", team: "Milwaukee Bucks", gp: 11, pts: 28.7, reb: 18.2, ast: 5.1, fg: 43.7, tp: null, blk: null },
    { season: "1972-73", team: "Milwaukee Bucks", gp: 6, pts: 22.8, reb: 16.2, ast: 2.8, fg: 42.8, tp: null, blk: null },
    { season: "1973-74", team: "Milwaukee Bucks", gp: 16, pts: 32.2, reb: 15.8, ast: 4.9, fg: 55.7, tp: null, blk: 2.4 },
    { season: "1976-77", team: "Los Angeles Lakers", gp: 11, pts: 34.6, reb: 17.7, ast: 4.1, fg: 60.7, tp: null, blk: 3.5 },
    { season: "1977-78", team: "Los Angeles Lakers", gp: 3, pts: 27.0, reb: 13.7, ast: 3.7, fg: 52.1, tp: null, blk: 4.0 },
    { season: "1978-79", team: "Los Angeles Lakers", gp: 8, pts: 28.5, reb: 12.6, ast: 4.8, fg: 57.9, tp: null, blk: 4.1 },
    { season: "1979-80", team: "Los Angeles Lakers", gp: 15, pts: 31.9, reb: 12.1, ast: 3.1, fg: 57.2, tp: null, blk: 3.9 },
    { season: "1980-81", team: "Los Angeles Lakers", gp: 3, pts: 26.7, reb: 16.7, ast: 4.0, fg: 46.2, tp: null, blk: 2.7 },
    { season: "1981-82", team: "Los Angeles Lakers", gp: 14, pts: 20.4, reb: 8.5, ast: 3.6, fg: 52.0, tp: null, blk: 3.2 },
    { season: "1982-83", team: "Los Angeles Lakers", gp: 15, pts: 27.1, reb: 7.7, ast: 2.8, fg: 56.8, tp: null, blk: 3.7 },
    { season: "1983-84", team: "Los Angeles Lakers", gp: 21, pts: 23.9, reb: 8.2, ast: 3.8, fg: 55.5, tp: null, blk: 2.1 },
    { season: "1984-85", team: "Los Angeles Lakers", gp: 19, pts: 21.9, reb: 8.1, ast: 4.0, fg: 56.0, tp: null, blk: 1.9 },
    { season: "1985-86", team: "Los Angeles Lakers", gp: 14, pts: 25.9, reb: 5.9, ast: 3.5, fg: 55.7, tp: null, blk: 1.7 },
    { season: "1986-87", team: "Los Angeles Lakers", gp: 18, pts: 19.2, reb: 6.8, ast: 2.0, fg: 53.0, tp: null, blk: 1.9 },
    { season: "1987-88", team: "Los Angeles Lakers", gp: 24, pts: 14.1, reb: 5.5, ast: 1.5, fg: 46.4, tp: null, blk: 1.5 },
    { season: "1988-89", team: "Los Angeles Lakers", gp: 15, pts: 11.1, reb: 3.9, ast: 1.3, fg: 46.3, tp: null, blk: 0.7 }
  ],
  // Seasons in which each honor was earned (e.g. the 1971 title is "1970-71").
  // MVP, ROY, scoring, rebounding, blocks, All-Star and Finals MVP seasons come from the Basketball-Reference page.
  // Champion seasons are from memory (the page gives only the count of 6): verify before publishing.
  // 'blocks' and 'rebounds' are new honor keys: add them to ACC_LABELS and ACC_ORDER in app.js.
  accolades: {
    roy: ["1969-70"],
    mvp: ["1970-71", "1971-72", "1973-74", "1975-76", "1976-77", "1979-80"],
    champion: ["1970-71", "1979-80", "1981-82", "1984-85", "1986-87", "1987-88"],
    finals_mvp: ["1970-71", "1984-85"],
    scoring: ["1970-71", "1971-72"],
    rebounds: ["1975-76"],
    blocks: ["1974-75", "1975-76", "1978-79", "1979-80"],
    allstar: ["1969-70", "1970-71", "1971-72", "1972-73", "1973-74", "1974-75", "1975-76", "1976-77", "1978-79", "1979-80", "1980-81", "1981-82", "1982-83", "1983-84", "1984-85", "1985-86", "1986-87", "1987-88", "1988-89"]
  }
});
