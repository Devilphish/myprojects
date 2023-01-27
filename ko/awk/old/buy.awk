BEGIN {
if (0) {
    usage = "awk -f buy.awk players plots pnum=<plot#>" 
}
	nplayers = 0
	player = 1
	nplots = 0
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
			printf("tok '%s'\n", $tok)
			pplots[player, p] = $tok
			p++
			pnplots[player]++
		}
		player++
		nplayers++
		next
	}
	if ($1 == "plot") {
		plot = $2
		state = 1
		nwells[plot] = 0
		nplots++
		next
	}
	if (plot != -1) {
		spoke = $1
		for (i = 1; i <= length($2); i++) {
			wellspoke[plot, pos] = spoke
			wellring[plot, pos] = substr($2, i, 1)
			pos++
			nwells[plot]++
		}
		next
	}
}
END {
	cost = nwells[pnum] * 1000
	printf("pnum %d cost %d nwells %d\n", pnum, cost, nwells[pnum])
	m = pmoney[turn]
	pmoney[turn] -= cost
	pplots[turn, pnplots[turn]] = pnum
	pnplots[turn]++

	printf("    %s buy plot %d for %d\n", pname[turn], pnum, cost)
	printf("       $%d - $%d = $%d\n", m, cost, pmoney[turn])


	for (p = 1; p <= nplayers; p++) {
		printf("player %s money %d nwells %d plots",
				pname[p], pmoney[p], pnwells[p]) > "players"
		for (plot = 0; plot < pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot]) > "players"
		}
		printf("\n") > "players"
	}
	printf("turn %d (%s)\n", turn, pname[turn]) > "players"
}
