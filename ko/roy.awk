BEGIN {
if (0) {
    usage = "awk -f roy.awk players r=<1-5>" 
}
	nplayers = 0
	npipes = 0
	player = 1
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "turn") {
		turn = $2
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
}
END {
	if (r >= 1 && r <= 4) {
		royalty = r * 1000
	}
	else if (r == 5) {
		royalty = 500
	}
	else {
		royalty = r
	}
	m = pmoney[turn]
	rtotal = pnwells[turn] * royalty
	pmoney[turn] += rtotal

	printf("    %s   %d well%s * %d = %d\n", pname[turn], pnwells[turn],
			pnwells[turn] > 1 ? "s" : "", royalty, rtotal)
	printf("         $%d + $%d = $%d\n", m, rtotal, pmoney[turn])


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
