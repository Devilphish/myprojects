BEGIN {
if (0) {
    usage = "awk -f drill.awk players board plot_in=<plot#> pos_in=<pos#>" 
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
	if ($1 == "board") {
		board = $2
	}
	if ($1 == "player") {
		pname[player] = $2
		pmoney[player] = $4
		pnwells[player] = $6
		pnplots[player] = 0
		p = 0
		for (token = 7; token < NF; token++) {
			pplots[player, p] = $token
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
		if (state == 1) {
			for (pos = 1; pos <= length($1); pos++) {
				well[plot, pos]=substr($1, pos, 1)
				nwells[plot]++
			}
			state = 2
		}
		else {
			for (pos = 1; pos <= length($1); pos++) {
				dispwell[plot, pos]=substr($1, pos, 1)
			}
		}
		next
	}
}
END {
	if (well[plot_in, pos_in] == 3) {
		iswell = 1
		cost = 2000
		printf("GUSHER $2K\n")
	}
	else if (well[plot_in, pos_in] == 2) {
		iswell = 1
		cost = 4000
		printf("NICE WELL $4K\n")
	}
	else if (well[plot_in, pos_in] == 1) {
		iswell = 1
		cost = 6000
		printf("DEEP WELL $6K\n")
	}
	else if (well[plot_in, pos_in] == 0) {
		iswell = 0
		cost = 6000
		printf("DRY - CAP $6K\n")
	}
	else {
		printf("ERROR\n")
		exit
	}
	dispwell[plot_in, pos_in] = "1"
	m = pmoney[turn]
	pmoney[turn] -= cost
	pnwells[turn] += iswell

	printf("    %s $%d - $%d = $%d  %d well%s\n",
			pname[turn], m, cost, pmoney[turn], pnwells[turn],
			pnwells[turn] > 1 ? "s" : "")


	for (p = 1; p <= nplayers; p++) {
		printf("player %s money %d nwells %d plots",
				pname[p], pmoney[p], pnwells[p]) > "players"
		for (plot = 0; plot < pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot]) > "players"
		}
		printf("\n") > "players"
	}
	printf("turn %d (%s)\n", turn, pname[turn]) > "players"

	printf("board.%s\n", board) > "board"
	for (plot = 1; plot <= nplots; plot ++) {
		printf("plot.%d\n", plot) > "board"
		for (pos = 1; pos <= nwells[plot]; pos++) {
			printf("%d", well[plot, pos]) > "board"
		}
		printf("\n") > "board"
		for (pos = 1; pos <= nwells[plot]; pos++) {
			printf("%d", dispwell[plot, pos]) > "board"
		}
		printf("\n") > "board"
	}
}
