BEGIN {
if (0) {
    usage = "awk -f cap.awk players board plotpos=<[1-18][a-l]>"
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
		ndrills = $2
	}
	if ($1 == "prod") {
		card = 3
		roy = $2
		wellsallowed = $3
		prop = $4
		ndrills = $5
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
	if (length(plotpos) < 2) {
		printf("enter plot # and well letter\n")
		exit
	}
	plot_tok = substr(plotpos, 1, length(plotpos)-1)
	plot_in = plot_tok + 0
	pos_in = substr(plotpos, length(plotpos), 1)
	if (plot_in < 1 || plot_in > nplots) {
		printf("plot %s out of range\n", plot_tok)
		exit
	}
	isowner = 0
	for (p = 0; p < pnplots[turn]; p++) {
		if (plot_in == pplots[turn, p]) {
			isowner = 1
			break
		}
	}
	if (isowner == 0) {
		printf("plot %d not owned by %s\n", plot_in, pname[turn])
		exit
	}
	pos_num = num[pos_in]
	if (pos_num < 1 || pos_num > nwells[plot_in]) {
		printf("plot %d well %s out of range\n", plot_in, pos_in)
		exit
	}
	if (boardwell[plot_in, pos_num] == ",") {
		printf("well %d.%s not drilled\n", plot_in, pos_in)
		exit
	}
	if (boardwell[plot_in, pos_num] == "X") {
		printf("well %d.%s already capped\n", plot_in, pos_in)
		exit
	}

	if (card == 1) {
		if (ncap == 0) {
			printf("===  no more caps needed  ===\n");
			exit
		}
	}

	printf("CAP well %d.%s\n", plot_in, pos_in)

	boardwell[plot_in, pos_num] = "X"
	pnwells[turn]--

	for (pipe = 0; pipe < npipes; pipe++) {
		pfr = pipefr[pipe]
		nlines[pfr]++
	}
	if (nlines[plot_in] > 0) {
		minoilers = nlines[plot_in] + 3
		noilers[plot_in]--
		if (noilers[plot_in] < minoilers) {
			printf("not enough wells in plot %d for %d pipeline%s, remove one\n",
					plot_in, nlines[plot_in],
					nlines[plot_in] == 1 ? "" : "s")
		}
	}

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

	printf("board.%d.%d.%d\n", d1, d2, d3) > "board"
	for (plot = 1; plot <= nplots; plot++) {
		printf("plot.%d\n", plot) > "board"
		for (pos = 1; pos <= nwells[plot]; pos++) {
			printf("%s", boardwell[plot, pos]) > "board"
		}
		printf("\n") > "board"
	}

	if (card == 1) {
		printf("fire.%d\n", ncap - 1) > "curcard"
	}
	if (card == 2) {
		printf("depletion.1\n") > "curcard"
	}
	if (card == 3) {
		printf("prod.%d.%d.%d.%d\n", roy, wellsallowed, prop, ndrills) > "curcard"
	}
}
