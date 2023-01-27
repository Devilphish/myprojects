BEGIN {
if (0) {
    usage = "awk -f buy.awk players board plot_in=<plot#>" 
}
	nplayers = 0
	npipes = 0
	nplots = 0
	player = 1
	plot = -1
        card = 0
	roy = 0
	wellsallowed = 0
	prop = 0
	ndrills = 0
	initplayer = 0
	fined = 0
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "init") {
		card = 4
		prop = 1
		initplayer = $2
		next
	}
	if ($1 == "fire") {
		card = 1
		next
	}
	if ($1 == "depletion") {
		card = 2
		wellsallowed = 1
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
	if ($1 == "turn") {
		turn = $2
		FS = "."
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
		for (pos = 1; pos <= length($1); pos++) {
			boardwell[plot, pos]=substr($1, pos, 1)
			nwells[plot]++
		}
		next
	}
}
END {
	if (initplayer > nplayers) {
		printf("===  all players already bought initial plots  ===\n")
		exit
	}
	if (!prop) {
		printf("===  no more properties can be bought  ===\n")
		exit
	}
	if (card == 2 || card == 3) {
		drillable = 0
		for (p = 1; p <= pnplots[turn]; p++) {
			plot = pplots[turn, p]
			for (w = 1; w <= nwells[plot]; w++) {
				if (boardwell[plot, w] == ",") {
					drillable = 1
				}
			}
		}
		if (wellsallowed == ndrills) {
			if (!drillable && !fined) {
				printf("===  you must pay fine before buying a plot  ====\n")
				exit 1
			}
			if (drillable) {
				printf("===  you must drill before buying a plot  ===\n")
				exit 1
			}
		}
	}
	if (plot_in < 1 || plot_in > nplots) {
		printf("===  plot %s out of range  ===\n", plot_in)
		exit
	}
	isowned = 0
	for (p = 1; p <= nplayers; p++) {
		for (plot = 1; plot <= pnplots[p]; plot++) {
			if (plot_in == pplots[p, plot]) {
				isowned = 1
				break
			}
		}
		if (isowned == 1) {
			break
		}
	}
	if (isowned == 1) {
		printf("===  plot %d already owned  ===\n", plot_in, pname[turn])
		exit
	}

	cost = nwells[plot_in] * 1000
	m = pmoney[turn]
	pmoney[turn] -= cost
	pnplots[turn]++
	pplots[turn, pnplots[turn]] = plot_in

	printf("===  %s buys plot %d for %d  ===\n", pname[turn], plot_in, cost)


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
	if (card == 4) {
		turn++
		initplayer++
		if (turn > nplayers) {
			turn = 1
		}
		printf("init.%d\n", initplayer) > "curcard"
	}
	printf("turn %d (%s)\n", turn, pname[turn]) > "players"

	if (card == 3) {
		printf("prod.%d.%d.%d.%d\n", roy, wellsallowed, prop - 1, ndrills) > "curcard"
		if (fined) {
			printf("fined\n") > "curcard"
		}
		printf("bought\n") > "curcard"
	}
}
