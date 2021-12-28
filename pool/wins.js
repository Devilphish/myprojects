
function awayteam(gamestr)
{
	return gamestr.substring(4, gamestr.search("@"))
}

function hometeam(gamestr)
{
	return gamestr.substring(gamestr.search("@") + 1, gamestr.length)
}

function ishome(teamstr)
{
	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g]
		if (teamstr == hometeam(game)) {
			return true
		}
	}

	return false
}


var printGames = function()
{
	document.write("Away&nbsp&nbsp&nbsp&nbsp&nbsp")
	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g]
		var a = awayteam(game); 
		document.write(a + "&nbsp")
		if (a.length == 2) {
			document.write("&nbsp")
		}
	}
	document.write("<br>")
	document.write("Home&nbsp&nbsp&nbsp&nbsp&nbsp")
	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g]
		var h = hometeam(game); 
		document.write(h + "&nbsp")
		if (h.length == 2) {
			document.write("&nbsp")
		}
	}
}

var printTeams = function(teams)
{
    for (var i in teams) {
	var mnf
	var player = teams[i]
	var t = player.name
	var team = t.replace("&amp;", "&")
	document.write(team.substring(0, 7))
	for (var l = 0; l < (7 - team.length); l++) {
		document.write("&nbsp")
	}
	document.write("&nbsp|")

	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g]
		var winner
		var tagstr

		if (!show[g]) {
			document.write("&nbsp&nbsp&nbsp|")
			continue
		}

		tagstr = "&nbsp"
		if (player.picks == undefined) {
			winner = ""
		}
		else {
			winner = player.picks[game].winner
			if (player.picks[game].tag) {
				tagstr = "*"
			}
		}

		if (ishome(winner)) {
			document.write("&nbsp" + tagstr + winner.substring(0, 1))
			if (winner == "") {
				document.write("&nbsp")
			}
		}
		else {
			if (winner == "") {
				document.write("&nbsp")
			}
			document.write(winner.substring(0, 1) + tagstr + "&nbsp")
		}

		document.write("|")
	}

	if (player.picks == undefined) {
		mnf = ""
	}
	else {
		for (var j in player.picks) {
			if (j == "mnf") {
				mnf = player.picks[j]
			}
		}
	}

	if (player.scoretag) {
		document.write("*")
	}
	else {
		document.write("&nbsp")
	}
	document.write(mnf)
	document.write("<br>")
    }
}

function printWins()
{
	var winners = []
	var leaders = []
	var tmp_winner = {}
	var tmp_loser = {}
	tmp_winner.picks = {}
	tmp_loser.picks = {}

if (false) {
winpicks.picks["NFL_GB@PIT"].winner = ""
winpicks.picks["NFL_DEN@OAK"].winner = ""
winpicks.picks["NFL_NO@LAR"].winner = ""
winpicks.picks["NFL_JAC@ARI"].winner = ""
winpicks.picks["NFL_SEA@SF"].winner = ""
winpicks.picks["NFL_BUF@KC"].winner = ""
winpicks.picks["NFL_CAR@NYJ"].winner = ""
winpicks.picks["NFL_CHI@PHI"].winner = ""
winpicks.picks["NFL_CLE@CIN"].winner = ""
winpicks.picks["NFL_MIA@NE"].winner = ""
winpicks.picks["NFL_TB@ATL"].winner = ""
winpicks.picks["NFL_TEN@IND"].winner = ""
winpicks.picks["NFL_HOU@BAL"].winner = ""
}

	for (g in opmLS.games.nfl) {
		show[g] = false
	}

	for (i in opmLS.teams) {
		var player = opmLS.teams[i]

		for (g in opmLS.games.nfl) {
			var game = opmLS.games.nfl[g]
			tmp_winner.picks[game] = {}
			tmp_loser.picks[game] = {}

			player.picks[game].tag = false
			player.picks[game].diff = false

			if (winpicks.picks[game].winner == "") {
				tmp_winner.picks[game].winner = player.picks[game].winner
			}
			else {
				tmp_winner.picks[game].winner = winpicks.picks[game].winner
			}

			if (ishome(tmp_winner.picks[game].winner)) {
				tmp_loser.picks[game].winner = awayteam(game)
			}
		}

		for (j in opmLS.teams) {
			var p = opmLS.teams[j]

			p.wins = 0
			p.losses = 0

			for (g in opmLS.games.nfl) {
				var game = opmLS.games.nfl[g]

//				if (winpicks.picks[game].winner == "") {
//					continue
//				}

				if (p.picks[game].winner ==
				    tmp_winner.picks[game].winner) {
					p.wins++
				}
				else {
					p.losses++
				}
			}

			if (player.name == p.name) {
				player.maxwins = p.wins
			}
		}

		for (j in opmLS.teams) {
			leaders[j] = opmLS.teams[j]
		}

		var keepsorting = true
		while (keepsorting) {
			keepsorting = false
			for (j = 0; j < (opmLS.teams.length - 1); j++) {
				if (leaders[j+1].wins > leaders[j].wins) {
					var tmp = leaders[j]
					leaders[j] = leaders[j+1]
					leaders[j+1] = tmp
					keepsorting = true
				}
			}
		}

		var winningscore = winpicks.picks["mnf"]

		keepsorting = true
		while (keepsorting) {
			keepsorting = false
			for (j = 0; j < (opmLS.teams.length - 1); j++) {
				if (leaders[j+1].wins == leaders[j].wins) {
					dscorenow = leaders[j].picks["mnf"] - winningscore
					dscorenext = leaders[j+1].picks["mnf"] - winningscore
					if (dscorenow < 0) {
						dscorenow = -dscorenow
					}
					if (dscorenext < 0) {
						dscorenext = -dscorenext
					}
					if (dscorenow > dscorenext) {
						var tmp = leaders[j]
						leaders[j] = leaders[j+1]
						leaders[j+1] = tmp
						keepsorting = true
					}
				}
			}
		}

		if (player.wins == leaders[0].wins) {
			winners[winners.length] = player
			if (player.wins == leaders[1].wins) {
				player.scoretag = true
			}
			else {
				player.scoretag = false
			}
		}
	}

	for (i = 0; i < winners.length; i++) {
		leaders[i] = winners[i]
	}
	leaders[winners.length] = {}
	leaders[winners.length+1] = {}
	leaders[winners.length].wins = 0
	leaders[winners.length+1].wins = 0
	leaders[winners.length].losses = 0
	leaders[winners.length+1].losses = 0

	var keepsorting = true
	while (keepsorting) {
		keepsorting = false
		for (i = 0; i < (winners.length + 1); i++) {
			if (leaders[i+1].wins > leaders[i].wins) {
				var tmp = leaders[i]
				leaders[i] = leaders[i+1]
				leaders[i+1] = tmp
				keepsorting = true
			}
		}
	}

	for (i = 0; i < winners.length; i++) {
		var player = leaders[i]

		for (j = 0; j < winners.length; j++) {
			var opponent = winners[j]
			var opp_diff = []

			if (player.name == opponent.name) {
				continue
			}

			for (g in opmLS.games.nfl) {
				opp_diff[g] = false
			}

			var ndiffs = 0
			for (g in opmLS.games.nfl) {
				var game = opmLS.games.nfl[g]

				if (winpicks.picks[game].winner == "") {
					if (player.picks[game].winner !=
					    opponent.picks[game].winner) {
						ndiffs++
						player.picks[game].diff = true
						opp_diff[g] = true
					}
				}
			}
			for (g in opmLS.games.nfl) {
				var game = opmLS.games.nfl[g]

				if (opp_diff[g]) {
					if (((player.maxwins + ndiffs) ==
					     opponent.maxwins) ||
					    ((player.maxwins + (ndiffs - 1)) ==
					     opponent.maxwins)) {
						player.picks[game].tag = true
					}
				}
			}
		}

		for (g in opmLS.games.nfl) {
			var game = opmLS.games.nfl[g]

			if (player.picks[game].diff) {
				show[g] = true
			}
		}
	}

	leaders.length = winners.length
	printTeams(leaders)
}


var show = []
var mnfGame =
    opmLS.games.nfl[opmLS.games.nfl.length - 1]
var winpicks = {}
winpicks.name = "WINNERS"
winpicks.picks = {}
winpicks.picks["mnf"] = 0

fetch("http://www.nfl.com/scores")
	.then(function(data)
	{
		data.text().then(function(str)
		{
//document.documentElement.style.fontFamily = "Courier New"
//document.body.style.fontFamily = "courier"
document.body.style.fontFamily = "Courier New"
			var start = str.indexOf("scoreStripGames")
			var end = str.indexOf("schema")
			var games = '{"' +
				str.substr(start, end - start - 2) +
			'}'
			var gamesObj = JSON.parse(games)

			for (var i in gamesObj.scoreStripGames) {
				var game = gamesObj.scoreStripGames[i]
				var a = game.awayTeam.abbr
				var h = game.homeTeam.abbr
				if (a == "JAX") a = "JAC"
				if (h == "JAX") h = "JAC"
				if (a == "LA") a = "LAR"
				if (h == "LA") h = "LAR"
				var gameStr = "NFL_" + a + "@" + h
				winpicks.picks[gameStr] = {}
				winpicks.picks[gameStr].winner = ""

				if (game.homeTeam.scores == undefined) {
					continue
				}
				var curGameTime = game.status.currentGameTime
				if (curGameTime.match(/FINAL/) != "FINAL") {
					continue
				}

				var hs = game.homeTeam.scores.pointTotal
				var as = game.awayTeam.scores.pointTotal
				if (hs > as) {
					winpicks.picks[gameStr].winner = h
				}
				else {
					winpicks.picks[gameStr].winner = a
				}

				if (awayteam(mnfGame) == a) {
					winpicks.picks["mnf"] = as + hs
				}
			}

			printGames()
			document.write("<br>")
			document.write("<br>")
			printWins()
			document.write("<br>")
			var winpicksarray = {winpicks}
			printTeams(winpicksarray)
			document.write("<br>")
			printTeams(opmLS.teams)
		})
	})

