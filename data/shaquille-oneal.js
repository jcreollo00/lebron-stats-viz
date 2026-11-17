// Shaquille O'Neal. Per-game regular-season stats. FG% and 3P% are stored as percentages.
// Stats: Basketball-Reference.com (Per Game, regular season and playoffs).
// 3P% is null where he attempted no threes (Basketball-Reference leaves it blank), and for every playoff row.
// 2007-08: he was traded from Miami to Phoenix mid-season. This file uses the combined (2TM) line and lists
// the team as Phoenix, where he finished the year and played his only playoffs that season.
// Note: the 1998-99 lockout season had no All-Star Game.
registerPlayer({
  id: "shaquille-oneal",
  name: "Shaquille O'Neal",
  initials: "SO",
  born: "1972-03-06",
  bref: "https://www.basketball-reference.com/players/o/onealsh01.html",
  seasons: [
    { season: "1992-93", team: "Orlando Magic", gp: 81, pts: 23.4, reb: 13.9, ast: 1.9, fg: 56.2, tp: 0.0, blk: 3.5 },
    { season: "1993-94", team: "Orlando Magic", gp: 81, pts: 29.3, reb: 13.2, ast: 2.4, fg: 59.9, tp: 0.0, blk: 2.9 },
    { season: "1994-95", team: "Orlando Magic", gp: 79, pts: 29.3, reb: 11.4, ast: 2.7, fg: 58.3, tp: 0.0, blk: 2.4 },
    { season: "1995-96", team: "Orlando Magic", gp: 54, pts: 26.6, reb: 11.0, ast: 2.9, fg: 57.3, tp: 50.0, blk: 2.1 },
    { season: "1996-97", team: "Los Angeles Lakers", gp: 51, pts: 26.2, reb: 12.5, ast: 3.1, fg: 55.7, tp: 0.0, blk: 2.9 },
    { season: "1997-98", team: "Los Angeles Lakers", gp: 60, pts: 28.3, reb: 11.4, ast: 2.4, fg: 58.4, tp: null, blk: 2.4 },
    { season: "1998-99", team: "Los Angeles Lakers", gp: 49, pts: 26.3, reb: 10.7, ast: 2.3, fg: 57.6, tp: 0.0, blk: 1.7 },
    { season: "1999-00", team: "Los Angeles Lakers", gp: 79, pts: 29.7, reb: 13.6, ast: 3.8, fg: 57.4, tp: 0.0, blk: 3.0 },
    { season: "2000-01", team: "Los Angeles Lakers", gp: 74, pts: 28.7, reb: 12.7, ast: 3.7, fg: 57.2, tp: 0.0, blk: 2.8 },
    { season: "2001-02", team: "Los Angeles Lakers", gp: 67, pts: 27.2, reb: 10.7, ast: 3.0, fg: 57.9, tp: 0.0, blk: 2.0 },
    { season: "2002-03", team: "Los Angeles Lakers", gp: 67, pts: 27.5, reb: 11.1, ast: 3.1, fg: 57.4, tp: null, blk: 2.4 },
    { season: "2003-04", team: "Los Angeles Lakers", gp: 67, pts: 21.5, reb: 11.5, ast: 2.9, fg: 58.4, tp: null, blk: 2.5 },
    { season: "2004-05", team: "Miami Heat", gp: 73, pts: 22.9, reb: 10.4, ast: 2.7, fg: 60.1, tp: null, blk: 2.3 },
    { season: "2005-06", team: "Miami Heat", gp: 59, pts: 20.0, reb: 9.2, ast: 1.9, fg: 60.0, tp: null, blk: 1.8 },
    { season: "2006-07", team: "Miami Heat", gp: 40, pts: 17.3, reb: 7.4, ast: 2.0, fg: 59.1, tp: null, blk: 1.4 },
    { season: "2007-08", team: "Phoenix Suns", gp: 61, pts: 13.6, reb: 9.1, ast: 1.5, fg: 59.3, tp: null, blk: 1.4 },
    { season: "2008-09", team: "Phoenix Suns", gp: 75, pts: 17.8, reb: 8.4, ast: 1.7, fg: 60.9, tp: 0.0, blk: 1.4 },
    { season: "2009-10", team: "Cleveland Cavaliers", gp: 53, pts: 12.0, reb: 6.7, ast: 1.5, fg: 56.6, tp: 0.0, blk: 1.2 },
    { season: "2010-11", team: "Boston Celtics", gp: 37, pts: 9.2, reb: 4.8, ast: 0.7, fg: 66.7, tp: null, blk: 1.1 }
  ],
  // Playoff per-game stats, one row per season he made the playoffs (source: Basketball-Reference).
  // No playoff rows for 1992-93 and 2008-09: those are the seasons his team missed the playoffs.
  playoffs: [
    { season: "1993-94", team: "Orlando Magic", gp: 3, pts: 20.7, reb: 13.3, ast: 2.3, fg: 51.1, tp: null, blk: 3.0 },
    { season: "1994-95", team: "Orlando Magic", gp: 21, pts: 25.7, reb: 11.9, ast: 3.3, fg: 57.7, tp: null, blk: 1.9 },
    { season: "1995-96", team: "Orlando Magic", gp: 12, pts: 25.8, reb: 10.0, ast: 4.6, fg: 60.6, tp: null, blk: 1.3 },
    { season: "1996-97", team: "Los Angeles Lakers", gp: 9, pts: 26.9, reb: 10.6, ast: 3.2, fg: 51.4, tp: null, blk: 1.9 },
    { season: "1997-98", team: "Los Angeles Lakers", gp: 13, pts: 30.5, reb: 10.2, ast: 2.9, fg: 61.2, tp: null, blk: 2.6 },
    { season: "1998-99", team: "Los Angeles Lakers", gp: 8, pts: 26.6, reb: 11.6, ast: 2.3, fg: 51.0, tp: null, blk: 2.9 },
    { season: "1999-00", team: "Los Angeles Lakers", gp: 23, pts: 30.7, reb: 15.4, ast: 3.1, fg: 56.6, tp: null, blk: 2.4 },
    { season: "2000-01", team: "Los Angeles Lakers", gp: 16, pts: 30.4, reb: 15.4, ast: 3.2, fg: 55.5, tp: null, blk: 2.4 },
    { season: "2001-02", team: "Los Angeles Lakers", gp: 19, pts: 28.5, reb: 12.6, ast: 2.8, fg: 52.9, tp: null, blk: 2.5 },
    { season: "2002-03", team: "Los Angeles Lakers", gp: 12, pts: 27.0, reb: 14.8, ast: 3.7, fg: 53.5, tp: null, blk: 2.8 },
    { season: "2003-04", team: "Los Angeles Lakers", gp: 22, pts: 21.5, reb: 13.2, ast: 2.5, fg: 59.3, tp: null, blk: 2.8 },
    { season: "2004-05", team: "Miami Heat", gp: 13, pts: 19.4, reb: 7.8, ast: 1.9, fg: 55.8, tp: null, blk: 1.5 },
    { season: "2005-06", team: "Miami Heat", gp: 23, pts: 18.4, reb: 9.8, ast: 1.7, fg: 61.2, tp: null, blk: 1.5 },
    { season: "2006-07", team: "Miami Heat", gp: 4, pts: 18.8, reb: 8.5, ast: 1.3, fg: 55.9, tp: null, blk: 1.5 },
    { season: "2007-08", team: "Phoenix Suns", gp: 5, pts: 15.2, reb: 9.2, ast: 1.0, fg: 44.0, tp: null, blk: 2.6 },
    { season: "2009-10", team: "Cleveland Cavaliers", gp: 11, pts: 11.5, reb: 5.5, ast: 1.4, fg: 51.6, tp: null, blk: 1.2 },
    { season: "2010-11", team: "Boston Celtics", gp: 2, pts: 1.0, reb: 0.0, ast: 0.5, fg: 50.0, tp: null, blk: 0.0 }
  ],
  // Seasons in which each honor was earned (e.g. the 2000 title is "1999-00").
  // MVP, ROY, scoring titles, All-Star and Finals MVP seasons come from the Basketball-Reference page.
  // Champion, All-Star Game MVP and Olympic seasons are from memory: verify before publishing.
  accolades: {
    roy: ["1992-93"],
    mvp: ["1999-00"],
    champion: ["1999-00", "2000-01", "2001-02", "2005-06"],
    finals_mvp: ["1999-00", "2000-01", "2001-02"],
    scoring: ["1994-95", "1999-00"],
    allstar: ["1992-93", "1993-94", "1994-95", "1995-96", "1996-97", "1997-98", "1999-00", "2000-01", "2001-02", "2002-03", "2003-04", "2004-05", "2005-06", "2006-07", "2008-09"],
    asg_mvp: ["1999-00", "2003-04", "2008-09"],
    olympic: ["1995-96"]
  }
});
