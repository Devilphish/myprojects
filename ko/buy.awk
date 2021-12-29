BEGIN {
if (0) {
    usage = "awk -f buy.awk players board plot_in=<plot#>" 
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
		nwells[plot] = length($1)
		next
	}
}
END {
	if (plot_in < 1 || plot_in > nplots) {
		printf("===  plot %s out of range  ===\n", plot_in)
		exit
	}
	isowned = 0
	for (p = 1; p <= nplayers; p++) {
		for (plot = 0; plot < pnplots[p]; plot++) {
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
	pplots[turn, pnplots[turn]] = plot_in
	pnplots[turn]++

	printf("===  %s buys plot %d for %d  ===\n", pname[turn], plot_in, cost)


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
