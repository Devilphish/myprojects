BEGIN {
if (0) {
    usage = "awk -f cap.awk players board curcard plotpos=<[1-18][a-l]>"
}
	num["a"] = 1; num["b"] = 2; num["c"] = 3; num["d"] = 4; num["e"] = 5
	num["f"] = 6; num["g"] = 7; num["h"] = 8; num["i"] = 9; num["j"] = 10
	num["k"] = 11; num["l"] = 12
	nplots = 0
	nplayers = 0
	npipes = 0
	player = 1
	plot = -1
        card = 0
	roy = 0
	wellsallowed = 0
	prop = 0
	ndrills = 0
	ncap = 0
	fined = 0
	bought = 0
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "fire") {
		card = 1
		ncap = $2
		next
	}
	if ($1 == "depletion") {
		card = 2
		ndrills = $2
		next
	}
	if ($1 == "prod") {
		card = 3
		roy = $2
		wellsallowed = $3
		prop = $4
		ndrills = $5
		next
	}
	if ($1 == "fined") {
		fined = 1
		next
	}
	if ($1 == "bought") {
		bought = 1
		next
	}
	if ($1 == "turn") {
		turn = $2
		FS = "."
		next
	}
	if ($1 == "board") {
		d1 = $2
		d2 = $3
		d3 = $4
		next
	}
	if ($1 == "player") {
		pname[player] = $2
		pmoney[player] = $4
		pnwells[player] = $6
		pnplots[player] = 0
		p = 1
		for (tok = 8; tok <= NF; tok++) {
			pplots[player, p] = $tok
			p++
			pnplots[player]++
		}
		player++
		nplayers++
		next
	}
	if ($1 == "pipeline") {
		pipefr[npipes] = $2
		pipeto[npipes] = $3
		npipes++
		next
	}
	if ($1 == "plot") {
		plot = $2
		nwells[plot] = 0
		nplots++
		next
	}
	if (plot != -1) {
		noilers[plot] = 0
		for (pos = 1; pos <= length($1); pos++) {
			if (substr($1, pos, 1) == "!") {
				noilers[plot]++
			}
			boardwell[plot, pos]=substr($1, pos, 1)
			nwells[plot]++
		}
		next
	}
}
END {
	if (card == 1) {
		printf("===  no fine needed  ===\n");
		exit
	}

	if (card == 2 || card == 3) {
		if (ndrills < wellsallowed) {
			printf("===  you have already drilled, fine invalid  ===\n");
			exit
		}
		if (fined) {
			printf("===  you have already been fined  ===\n")
			exit
		}
	}

	drillable = 0
	for (p = 1; p <= pnplots[turn]; p++) {
		plot = pplots[turn, p]
		for (w = 1; w <= nwells[plot]; w++) {
			if (boardwell[plot, w] == ",") {
				drillable = 1
			}
		}
	}
	if (drillable) {
		printf("===  you have drillable wells, so drill  ===\n")
		exit
	}

	printf("===  player %s fined $10,000\n", pname[turn])

	pmoney[turn] -= 10000

	for (p = 1; p <= nplayers; p++) {
		printf("player %s money %d nwells %d plots",
				pname[p], pmoney[p], pnwells[p]) > "players"
		for (plot = 1; plot <= pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot]) > "players"
		}
		printf("\n") > "players"
	}
	for (pipe = 0; pipe < npipes; pipe++) {
		printf("pipeline %s %s\n", pipefr[pipe], pipeto[pipe]) > "players"
	}
	printf("turn %d (%s)\n", turn, pname[turn]) > "players"

	if (card == 1) {
		printf("fire.%d\n", ncap) > "curcard"
	}
	if (card == 2) {
		printf("depletion.%d\n", ndrills) > "curcard"
		printf("fined\n") > "curcard"
	}
	if (card == 3) {
		printf("prod.%d.%d.%d.%d\n", roy, wellsallowed, prop, ndrills) > "curcard"
		printf("fined\n") > "curcard"
	}
}
