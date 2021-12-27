BEGIN {
if (0) {
    usage = "awk -f nextplayer.awk players board"
}
	nplayers = 0
	npipes = 0
	nplots = 0
	player = 1
	plot = -1
}
{
	if (NF < 1) {
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

	printf("    %s NEXT\n", pname[turn])


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

