
a = scoreStripGames.awayTeam.abbr;
s = scoreStripGames.awayTeam.scores.pointTotal;
document.write(a + s);
exit

function awayteam(gamestr)
{
	return gamestr.substring(4, gamestr.search("@"));
};
function hometeam(gamestr)
{
	return gamestr.substring(gamestr.search("@") + 1, gamestr.length);
};
function ishome(teamstr)
{
	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g];
		if (teamstr == hometeam(game)) {
			return true;
		}
	};

	return false;
};


document.write("Away&nbsp&nbsp&nbsp&nbsp&nbsp");
for (var g in opmLS.games.nfl) {
	var game = opmLS.games.nfl[g];
	var a = awayteam(game); 
	document.write(a + "&nbsp");
	if (a.length == 2) {
		document.write("&nbsp");
	}
};
document.write("<br>");
document.write("Home&nbsp&nbsp&nbsp&nbsp&nbsp");
for (var g in opmLS.games.nfl) {
	var game = opmLS.games.nfl[g];
	var h = hometeam(game); 
	document.write(h + "&nbsp");
	if (h.length == 2) {
		document.write("&nbsp");
	}
};
document.write("<br><br>");
document.write("WINNERS |");
for (var i = 0; i < opmLS.games.nfl.length; i++) {
	document.write("&nbsp&nbsp&nbsp|");
}
document.write("<br><br>");

for (var i in opmLS.teams) {
	var mnf;
	var t = opmLS.teams[i].name;
	var team = t.replace("&amp;", "&");
	document.write(team.substring(0, 7));
	for (var l = 0; l < (7 - team.length); l++) {
		document.write("&nbsp");
	}
	document.write("&nbsp|");

	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g];
		var winner;
		if (opmLS.teams[i].picks == undefined) {
			winner = "";
		}
		else {
			winner = opmLS.teams[i].picks[game].winner;
		}

		if (ishome(winner)) {
			document.write("&nbsp&nbsp" + winner.substring(0, 1));
			if (winner == "") {
				document.write("&nbsp");
			}
		}
		else {
			if (winner == "") {
				document.write("&nbsp");
			}
			document.write(winner.substring(0, 1) + "&nbsp&nbsp");
		}
		document.write("|");
	}

	if (opmLS.teams[i].picks == undefined) {
		mnf = "";
	}
	else {
		for (var j in opmLS.teams[i].picks) {
			if (j == "mnf") {
				mnf = opmLS.teams[i].picks[j];
			}
		};
	};
	document.write("&nbsp");
	document.write(mnf);
	document.write("<br>");
};
