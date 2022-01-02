BEGIN {
if (0) {
    usage = "awk -f pipe.awk players board plot_fr=<plot#> plot_to=<plot#>" 
}
	nplayers = 0
	player = 1
	nplots = 0
	npipes = 0
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
	if (plot_fr < 1 || plot_fr > nplots) {
		printf("plot %s out of range\n", plot_fr)
		exit
	}
	if (plot_to < 1 || plot_to > nplots) {
		printf("plot %s out of range\n", plot_to)
		exit
	}
	isowned = 0
	for (plot = 1; plot <= pnplots[turn]; plot++) {
		if (plot_fr == pplots[turn, plot]) {
			isowned = 1
			break
		}
	}
	if (isowned != 1) {
		printf("plot %d isn't owned by %s\n", plot_fr, pname[turn])
		exit
	}
	found = 0
	for (pipe = 0; pipe < npipes; pipe++) {
		if (found == 0) {
			if (pipefr[pipe] == plot_fr &&
			    pipeto[pipe] == plot_to) {
				npipes--
				found = 1
			}
		}
		else {
			pipefr[pipe - 1] = pipefr[pipe]
			pipeto[pipe - 1] = pipeto[pipe]
		}
	}
	if (found == 0) {
		printf("there is no pipeline from %d to %d\n",
				plot_fr, plot_to)
		exit
	}

	printf("    %s removes pipeline from %s to %s\n", pname[turn],
			plot_fr, plot_to)


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
}
