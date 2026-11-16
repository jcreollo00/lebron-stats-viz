// Kobe Bryant. Per-game regular-season stats. FG% and 3P% are stored as percentages.
// Stats: Basketball-Reference.com (Per Game, regular season).
// Note: the 1998-99 lockout season had no All-Star Game.
registerPlayer({
  id: "kobe-bryant",
  name: "Kobe Bryant",
  initials: "KB",
  bref: "https://www.basketball-reference.com/players/b/bryanko01.html",
  seasons: [
    { season: "1996-97", team: "Los Angeles Lakers", gp: 71, pts: 7.6, reb: 1.9, ast: 1.3, fg: 41.7, tp: 37.5, blk: 0.3 },
    { season: "1997-98", team: "Los Angeles Lakers", gp: 79, pts: 15.4, reb: 3.1, ast: 2.5, fg: 42.8, tp: 34.1, blk: 0.5 },
    { season: "1998-99", team: "Los Angeles Lakers", gp: 50, pts: 19.9, reb: 5.3, ast: 3.8, fg: 46.5, tp: 26.7, blk: 1.0 },
    { season: "1999-00", team: "Los Angeles Lakers", gp: 66, pts: 22.5, reb: 6.3, ast: 4.9, fg: 46.8, tp: 31.9, blk: 0.9 },
    { season: "2000-01", team: "Los Angeles Lakers", gp: 68, pts: 28.5, reb: 5.9, ast: 5.0, fg: 46.4, tp: 30.5, blk: 0.6 },
    { season: "2001-02", team: "Los Angeles Lakers", gp: 80, pts: 25.2, reb: 5.5, ast: 5.5, fg: 46.9, tp: 25.0, blk: 0.4 },
    { season: "2002-03", team: "Los Angeles Lakers", gp: 82, pts: 30.0, reb: 6.9, ast: 5.9, fg: 45.1, tp: 38.3, blk: 0.8 },
    { season: "2003-04", team: "Los Angeles Lakers", gp: 65, pts: 24.0, reb: 5.5, ast: 5.1, fg: 43.8, tp: 32.7, blk: 0.4 },
    { season: "2004-05", team: "Los Angeles Lakers", gp: 66, pts: 27.6, reb: 5.9, ast: 6.0, fg: 43.3, tp: 33.9, blk: 0.8 },
    { season: "2005-06", team: "Los Angeles Lakers", gp: 80, pts: 35.4, reb: 5.3, ast: 4.5, fg: 45.0, tp: 34.7, blk: 0.4 },
    { season: "2006-07", team: "Los Angeles Lakers", gp: 77, pts: 31.6, reb: 5.7, ast: 5.4, fg: 46.3, tp: 34.4, blk: 0.5 },
    { season: "2007-08", team: "Los Angeles Lakers", gp: 82, pts: 28.3, reb: 6.3, ast: 5.4, fg: 45.9, tp: 36.1, blk: 0.5 },
    { season: "2008-09", team: "Los Angeles Lakers", gp: 82, pts: 26.8, reb: 5.2, ast: 4.9, fg: 46.7, tp: 35.1, blk: 0.5 },
    { season: "2009-10", team: "Los Angeles Lakers", gp: 73, pts: 27.0, reb: 5.4, ast: 5.0, fg: 45.6, tp: 32.9, blk: 0.3 },
    { season: "2010-11", team: "Los Angeles Lakers", gp: 82, pts: 25.3, reb: 5.1, ast: 4.7, fg: 45.1, tp: 32.3, blk: 0.1 },
    { season: "2011-12", team: "Los Angeles Lakers", gp: 58, pts: 27.9, reb: 5.4, ast: 4.6, fg: 43.0, tp: 30.3, blk: 0.3 },
    { season: "2012-13", team: "Los Angeles Lakers", gp: 78, pts: 27.3, reb: 5.6, ast: 6.0, fg: 46.3, tp: 32.4, blk: 0.3 },
    { season: "2013-14", team: "Los Angeles Lakers", gp: 6, pts: 13.8, reb: 4.3, ast: 6.3, fg: 42.5, tp: 18.8, blk: 0.2 },
    { season: "2014-15", team: "Los Angeles Lakers", gp: 35, pts: 22.3, reb: 5.7, ast: 5.6, fg: 37.3, tp: 29.3, blk: 0.2 },
    { season: "2015-16", team: "Los Angeles Lakers", gp: 66, pts: 17.6, reb: 3.7, ast: 2.8, fg: 35.8, tp: 28.5, blk: 0.2 }
  ],
  accolades: {
    mvp: ["2007-08"],
    champion: ["1999-00", "2000-01", "2001-02", "2008-09", "2009-10"],
    finals_mvp: ["2008-09", "2009-10"],
    scoring: ["2005-06", "2006-07"],
    allstar: ["1997-98", "1999-00", "2000-01", "2001-02", "2002-03", "2003-04", "2004-05", "2005-06", "2006-07", "2007-08", "2008-09", "2009-10", "2010-11", "2011-12", "2012-13", "2013-14", "2014-15", "2015-16"],
    asg_mvp: ["2001-02", "2006-07", "2008-09", "2010-11"],
    olympic: ["2007-08", "2011-12"]
  }
});
