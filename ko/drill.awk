BEGIN {
if (0) {
    usage = "awk -f drill.awk players disc1 disc2 disc3 plots board curcard plotpos=<[1-18][a-l]>"
}
	num["a"] = 1; num["b"] = 2; num["c"] = 3; num["d"] = 4; num["e"] = 5
	num["f"] = 6; num["g"] = 7; num["h"] = 8; num["i"] = 9; num["j"] = 10
	num["k"] = 11; num["l"] = 12
	nplayers = 0
	player = 1
	nplots = 0
	npipes = 0
	disc = -1
	plot = -1
	fplot = -1
        card = 0
	roy = 0
	wellsallowed = 0
	prop = 0
	ndrills = 0
	ncap = 0
	bought = 0
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
	if ($1 == "bought") {
		bought = 1
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
	if ($1 == "disc") {
		disc = $2
		plot = -1; fplot = -1
		next
	}
	if ($1 == "fieldplot") {
		fplot = $2
		fpos = 1
		disc = -1; plot = -1
		next
	}
	if ($1 == "plot") {
		plot = $2
		disc = -1; fplot = -1
		nwells[plot] = 0
		nplots++
		next
	}
	if (disc != -1) {
		spoke = $1
		for (ring = 1; ring <= length($2); ring++) {
			spot[disc, spoke, ring] = substr($2, ring, 1)
		}
		nspokes = spoke
		next
	}
	if (plot != -1) {
		for (pos = 1; pos <= length($1); pos++) {
			boardwell[plot, pos]=substr($1, pos, 1)
			nwells[plot]++
		}
		next
	}
	if (fplot != -1) {
		spoke = $1
		for (i = 1; i <= length($2); i++) {
			wellspoke[fplot, fpos] = spoke
			wellring[fplot, fpos] = substr($2, i, 1)
			fpos++
		}
		next
	}
}
END {
	if (!card) {
		printf("===  must draw wildcat card first  ===\n");
		exit
	}
	if (bought) {
		printf("===  can't drill after buying a plot  ===\n")
		exit
	}
	if (!ndrills) {
		printf("===  no more wells allowed to be drilled  ===\n");
		exit
	}
	if (length(plotpos) < 2) {
		printf("===  enter plot # and well letter  ====\n")
		exit
	}
	plot_tok = substr(plotpos, 1, length(plotpos)-1)
	plot_in = plot_tok + 0
	pos_in = substr(plotpos, length(plotpos), 1)
	if (plot_in < 1 || plot_in > nplots) {
		printf("===  plot %s out of range  ====\n", plot_tok)
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
		printf("===  plot %d not owned by %s  ====\n", plot_in, pname[turn])
		exit
	}
	pos_num = num[pos_in]
	if (pos_num < 1 || pos_num > nwells[plot_in]) {
		printf("===  well %d.%s out of range  ====\n", plot_in, pos_in)
		exit
	}
	if (boardwell[plot_in, pos_num] != ",") {
		printf("===  well %d.%s already drilled  ====\n", plot_in, pos_in)
		exit
	}

	rot[1] = d1 * 4
	rot[2] = d2 * 4
	rot[3] = d3 * 4
	for (plot = 1; plot <= nplots; plot ++) {
		for (pos = 1; pos <= nwells[plot]; pos++) {
			spoke = wellspoke[plot, pos]
			ring = wellring[plot, pos]
			well[plot, pos] = 3
			for (disc = 3; disc >= 1; disc--) {
				rotspoke = spoke - rot[disc]
				if (rotspoke < 1) {
					rotspoke += nspokes
				}

				if (spot[disc, rotspoke, ring] == 1) {
					break
				}
				else {
					well[plot, pos]--
				}
			}
		}
	}

	if (well[plot_in, pos_num] == 3) {
		iswell = 1
		cost = 2000
		printf("===  GUSHER $2000  ===\n")
	}
	else if (well[plot_in, pos_num] == 2) {
		iswell = 1
		cost = 4000
		printf("===  NICE WELL $4000  ===\n")
	}
	else if (well[plot_in, pos_num] == 1) {
		iswell = 1
		cost = 6000
		printf("===  DEEP WELL $6000  ===\n")
	}
	else if (well[plot_in, pos_num] == 0) {
		iswell = 0
		cost = 6000
		printf("===  DRY - CAP $6000  ===\n")
	}
	else {
		printf("ERROR\n")
		exit
	}
	if (iswell) {
		boardwell[plot_in, pos_num] = "!"
	}
	else {
		boardwell[plot_in, pos_num] = "X"
	}
	m = pmoney[turn]
	pmoney[turn] -= cost
	pnwells[turn] += iswell

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
		printf("fire.%d\n", ncap) > "curcard"
	}
	if (card == 2) {
		printf("depletion.0\n") > "curcard"
	}
	if (card == 3) {
		printf("prod.%d.%d.%d.%d\n", roy, wellsallowed, prop, ndrills - 1) > "curcard"
	}
}
