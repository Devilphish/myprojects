BEGIN {
if (0) {
    usage = "awk -f nextplayer.awk players board curcard"
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
	ncap = 0
	fined = 0
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "fire") {
		card = 1
		ncap = $2
	}
	if ($1 == "depletion") {
		card = 2
		wellsallowed = 1
		ndrills = $2
	}
	if ($1 == "prod") {
		card = 3
		roy = $2
		wellsallowed = $3
		prop = $4
		ndrills = $5
	}
	if ($1 == "fined") {
		fined = 1
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
		p = 0
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
		for (i = 1; i <= length($1); i++) {
			if (substr($1, i, 1) == "!") {
				noilers[plot]++
			}
		}
		nwells[plot] = length($1)
		next
	}
}
END {
	if (card == 2 || card == 3) {
		drillable = 0
		for (p = 0; p < pnplots[turn]; p++) {
			for (w = 0; w < pplots[turn, p]; w++) {
				if (boardwell[p, w] == ",") {
					drillable = 1
				}
			}
		}
		if (wellsallowed == ndrills) {
			if (!drillable && !fined) {
				printf("===  you must pay fine before ending turn  ====\n")
				exit 1
			}
			if (drillable) {
				printf("===  you must drill before ending turn  ===\n")
				exit 1
			}
		}
	}

	if (card == 1) {
		if (ncap > 0) {
			printf("===  you must cap %d more wells before ending turn  ===\n", ncap)
			exit 1
		}
	}

	oldturn = turn
	turn++
	if (turn > nplayers) {
		turn = 1
	}

	nfees = 0
	for (pipe = 0; pipe < npipes; pipe++) {
		pfr = pipefr[pipe]
		pto = pipeto[pipe]
		nlines[pfr]++
		for (plot = 0; plot < pnplots[turn]; plot++) {
			if (pto == pplots[turn, plot]) {
				if (fee[pfr, pto] == 0) {
					fee[pfr, pto] = 1000
					feefr[nfees] = pfr
					feeto[nfees] = pto
					nfees++
				}
				else {
					fee[pfr, pto] += 2000
				}
			}
		}
	}
	for (plot = 0; plot < pnplots[oldturn]; plot++) {
		p = pplots[oldturn, plot]
		if (nlines[p] > 0) {
			minoilers = nlines[p] + 3
			if (noilers[p] < minoilers) {
				printf("not enough wells in plot %d for %d pipeline%s, remove one\n",
						p, nlines[p],
						nlines[p] == 1 ? "" : "s")
				exit
			}
		}
	}
	for (f = 0; f < nfees; f++) {
		pfr = feefr[f]
		pto = feeto[f]
		found = 0
		for (p = 1; p <= nplayers; p++) {
			for (plot = 0; plot < pnplots[p]; plot++) {
				if (pplots[p, plot] == pfr) {
					found = 1
					break
				}
			}
			if (found == 1) {
				break
			}
		}
		owner = p
		cost = fee[pfr, pto] * noilers[pto]
		pmoney[turn] -= cost
		pmoney[owner] += cost
		printf("    %s pays %s $%d for pipeline %d|%d\n",
				pname[turn], pname[owner], cost, pfr, pto)
	}

	printf("===  %s NEXT  ===\n", pname[turn])


	for (p = 1; p <= nplayers; p++) {
		printf("player %s money %d nwells %d plots",
				pname[p], pmoney[p], pnwells[p]) > "players"
		for (plot = 0; plot < pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot]) > "players"
		}
		printf("\n") > "players"
	}
	for (pipe = 0; pipe < npipes; pipe++) {
		printf("pipeline %s %s\n", pipefr[pipe], pipeto[pipe]) > "players"
	}
	printf("turn %d (%s)\n", turn, pname[turn]) > "players"
}

