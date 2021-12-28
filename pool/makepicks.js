
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
	var t = teams[i].name
	var team = t.replace("&amp;", "&")
	document.write(team.substring(0, 7))
	for (var l = 0; l < (7 - team.length); l++) {
		document.write("&nbsp")
	}
	document.write("&nbsp|")

	for (var g in opmLS.games.nfl) {
		var game = opmLS.games.nfl[g]
		var winner
		if (teams[i].picks == undefined) {
			winner = ""
		}
		else {
			winner = teams[i].picks[game].winner
		}

		if (ishome(winner)) {
			document.write("&nbsp&nbsp" + winner.substring(0, 1))
			if (winner == "") {
				document.write("&nbsp")
			}
		}
		else {
			if (winner == "") {
				document.write("&nbsp")
			}
			document.write(winner.substring(0, 1) + "&nbsp&nbsp")
		}
		document.write("|")
	}

	if (teams[i].picks == undefined) {
		mnf = ""
	}
	else {
		for (var j in teams[i].picks) {
			if (j == "mnf") {
				mnf = teams[i].picks[j]
			}
		}
	}
	document.write("&nbsp")
	document.write(mnf)
	document.write("<br>")
    }
}


$(document).ready(function(){
		document.write("You clicked me!");
		jQuery.get('crap.html', "foo", function(data) {
		    alert(data)
		})
		document.write("blahblahblah")
	})

//var mnfGame =
//    opmLS.games.nfl[opmLS.games.nfl.length - 1]
var winpicks = {}
winpicks.name = "WINNERS"
winpicks.picks = {}
winpicks.picks["mnf"] = 0

//fetch("http://www.nfl.com/scores")
	.then(function(data)
	{
		data.text().then(function(str)
		{
document.documentElement.style.fontFamily = "courier"
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
			var winpicksarray = {winpicks}
			printTeams(winpicksarray)
			document.write("<br>")
			printTeams(opmLS.teams)
		})
	})

