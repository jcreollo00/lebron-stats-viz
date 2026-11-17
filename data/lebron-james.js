// LeBron James. Per-game regular-season stats. FG% and 3P% are stored as percentages (41.7 = 41.7%).
// Stats: Basketball-Reference.com (Per Game, regular season).
registerPlayer({
  id: "lebron-james",
  name: "LeBron James",
  initials: "LJ",
  born: "1984-12-30",
  bref: "https://www.basketball-reference.com/players/j/jamesle01.html",
  seasons: [
    { season: "2003-04", team: "Cleveland Cavaliers", gp: 79, pts: 20.9, reb: 5.5, ast: 5.9, fg: 41.7, tp: 29.0, blk: 0.7 },
    { season: "2004-05", team: "Cleveland Cavaliers", gp: 80, pts: 27.2, reb: 7.4, ast: 7.2, fg: 47.2, tp: 35.1, blk: 0.7 },
    { season: "2005-06", team: "Cleveland Cavaliers", gp: 79, pts: 31.4, reb: 7.0, ast: 6.6, fg: 48.0, tp: 33.5, blk: 0.8 },
    { season: "2006-07", team: "Cleveland Cavaliers", gp: 78, pts: 27.3, reb: 6.7, ast: 6.0, fg: 47.6, tp: 31.9, blk: 0.7 },
    { season: "2007-08", team: "Cleveland Cavaliers", gp: 75, pts: 30.0, reb: 7.9, ast: 7.2, fg: 48.4, tp: 31.5, blk: 1.1 },
    { season: "2008-09", team: "Cleveland Cavaliers", gp: 81, pts: 28.4, reb: 7.6, ast: 7.2, fg: 48.9, tp: 34.4, blk: 1.1 },
    { season: "2009-10", team: "Cleveland Cavaliers", gp: 76, pts: 29.7, reb: 7.3, ast: 8.6, fg: 50.3, tp: 33.3, blk: 1.0 },
    { season: "2010-11", team: "Miami Heat", gp: 79, pts: 26.7, reb: 7.5, ast: 7.0, fg: 51.0, tp: 33.0, blk: 0.6 },
    { season: "2011-12", team: "Miami Heat", gp: 62, pts: 27.1, reb: 7.9, ast: 6.2, fg: 53.1, tp: 36.2, blk: 0.8 },
    { season: "2012-13", team: "Miami Heat", gp: 76, pts: 26.8, reb: 8.0, ast: 7.3, fg: 56.5, tp: 40.6, blk: 0.9 },
    { season: "2013-14", team: "Miami Heat", gp: 77, pts: 27.1, reb: 6.9, ast: 6.3, fg: 56.7, tp: 37.9, blk: 0.3 },
    { season: "2014-15", team: "Cleveland Cavaliers", gp: 69, pts: 25.3, reb: 6.0, ast: 7.4, fg: 48.8, tp: 35.4, blk: 0.7 },
    { season: "2015-16", team: "Cleveland Cavaliers", gp: 76, pts: 25.3, reb: 7.4, ast: 6.8, fg: 52.0, tp: 30.9, blk: 0.6 },
    { season: "2016-17", team: "Cleveland Cavaliers", gp: 74, pts: 26.4, reb: 8.6, ast: 8.7, fg: 54.8, tp: 36.3, blk: 0.6 },
    { season: "2017-18", team: "Cleveland Cavaliers", gp: 82, pts: 27.5, reb: 8.6, ast: 9.1, fg: 54.2, tp: 36.7, blk: 0.9 },
    { season: "2018-19", team: "Los Angeles Lakers", gp: 55, pts: 27.4, reb: 8.5, ast: 8.3, fg: 51.0, tp: 33.9, blk: 0.6 },
    { season: "2019-20", team: "Los Angeles Lakers", gp: 67, pts: 25.3, reb: 7.8, ast: 10.2, fg: 49.3, tp: 34.8, blk: 0.5 },
    { season: "2020-21", team: "Los Angeles Lakers", gp: 45, pts: 25.0, reb: 7.7, ast: 7.8, fg: 51.3, tp: 36.5, blk: 0.6 },
    { season: "2021-22", team: "Los Angeles Lakers", gp: 56, pts: 30.3, reb: 8.2, ast: 6.2, fg: 52.4, tp: 35.9, blk: 1.1 },
    { season: "2022-23", team: "Los Angeles Lakers", gp: 55, pts: 28.9, reb: 8.3, ast: 6.8, fg: 50.0, tp: 32.1, blk: 0.6 },
    { season: "2023-24", team: "Los Angeles Lakers", gp: 71, pts: 25.7, reb: 7.3, ast: 8.3, fg: 54.0, tp: 41.0, blk: 0.5 },
    { season: "2024-25", team: "Los Angeles Lakers", gp: 70, pts: 24.4, reb: 7.8, ast: 8.2, fg: 51.3, tp: 37.6, blk: 0.6 },
    { season: "2025-26", team: "Los Angeles Lakers", gp: 60, pts: 20.9, reb: 6.1, ast: 7.2, fg: 51.5, tp: 31.7, blk: 0.6 }
  ],
   // Playoff per-game stats, one row per season he made the playoffs (source: Land of Basketball).
  playoffs: [
    { season: "2005-06", team: "Cleveland Cavaliers", gp: 13, pts: 30.8, reb: 8.1, ast: 5.8, fg: 47.6, tp: 33.3, blk: 0.7 },
    { season: "2006-07", team: "Cleveland Cavaliers", gp: 20, pts: 25.1, reb: 8.1, ast: 8.0, fg: 41.6, tp: 28.0, blk: 0.5 },
    { season: "2007-08", team: "Cleveland Cavaliers", gp: 13, pts: 28.2, reb: 7.8, ast: 7.6, fg: 41.1, tp: 25.7, blk: 1.3 },
    { season: "2008-09", team: "Cleveland Cavaliers", gp: 14, pts: 35.3, reb: 9.1, ast: 7.3, fg: 51.0, tp: 33.3, blk: 0.9 },
    { season: "2009-10", team: "Cleveland Cavaliers", gp: 11, pts: 29.1, reb: 9.3, ast: 7.6, fg: 50.2, tp: 40.0, blk: 1.8 },
    { season: "2010-11", team: "Miami Heat", gp: 21, pts: 23.7, reb: 8.4, ast: 5.9, fg: 46.6, tp: 35.3, blk: 1.2 },
    { season: "2011-12", team: "Miami Heat", gp: 23, pts: 30.3, reb: 9.7, ast: 5.6, fg: 50.0, tp: 25.9, blk: 0.7 },
    { season: "2012-13", team: "Miami Heat", gp: 23, pts: 25.9, reb: 8.4, ast: 6.6, fg: 49.1, tp: 37.5, blk: 0.8 },
    { season: "2013-14", team: "Miami Heat", gp: 20, pts: 27.4, reb: 7.1, ast: 4.8, fg: 56.5, tp: 40.7, blk: 0.6 },
    { season: "2014-15", team: "Cleveland Cavaliers", gp: 20, pts: 30.1, reb: 11.3, ast: 8.5, fg: 41.7, tp: 22.7, blk: 1.1 },
    { season: "2015-16", team: "Cleveland Cavaliers", gp: 21, pts: 26.3, reb: 9.5, ast: 7.6, fg: 52.5, tp: 34.0, blk: 1.3 },
    { season: "2016-17", team: "Cleveland Cavaliers", gp: 18, pts: 32.8, reb: 9.1, ast: 7.8, fg: 56.5, tp: 41.1, blk: 1.3 },
    { season: "2017-18", team: "Cleveland Cavaliers", gp: 22, pts: 34.0, reb: 9.1, ast: 9.0, fg: 53.9, tp: 34.2, blk: 1.0 },
    { season: "2019-20", team: "Los Angeles Lakers", gp: 21, pts: 27.6, reb: 10.8, ast: 8.8, fg: 56.0, tp: 37.0, blk: 0.9 },
    { season: "2020-21", team: "Los Angeles Lakers", gp: 6, pts: 23.3, reb: 7.2, ast: 8.0, fg: 47.4, tp: 37.5, blk: 0.3 },
    { season: "2022-23", team: "Los Angeles Lakers", gp: 16, pts: 24.5, reb: 9.9, ast: 6.5, fg: 49.8, tp: 26.4, blk: 1.1 },
    { season: "2023-24", team: "Los Angeles Lakers", gp: 5, pts: 27.8, reb: 6.8, ast: 8.8, fg: 56.6, tp: 38.5, blk: 1.0 },
    { season: "2024-25", team: "Los Angeles Lakers", gp: 5, pts: 25.4, reb: 9.0, ast: 5.6, fg: 48.9, tp: 35.7, blk: 1.8 },
    { season: "2025-26", team: "Los Angeles Lakers", gp: 10, pts: 23.2, reb: 6.7, ast: 7.3, fg: 45.9, tp: 32.7, blk: 0.3 }
  ],
  // Seasons in which each honor was earned (the season it belongs to, e.g. the 2012 title is "2011-12").
  accolades: {
    roy: ["2003-04"],
    mvp: ["2008-09", "2009-10", "2011-12", "2012-13"],
    champion: ["2011-12", "2012-13", "2015-16", "2019-20"],
    finals_mvp: ["2011-12", "2012-13", "2015-16", "2019-20"],
    scoring: ["2007-08"],
    assists: ["2019-20"],
    allstar: ["2004-05", "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11", "2011-12", "2012-13", "2013-14", "2014-15", "2015-16", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
    asg_mvp: ["2005-06", "2007-08", "2017-18"],
    cup_mvp: ["2023-24"],
    olympic: ["2007-08", "2011-12", "2023-24"]
  }
});
