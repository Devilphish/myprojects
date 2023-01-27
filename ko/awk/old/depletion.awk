BEGIN {
if (0) {
    usage = "awk -f depletion.awk players" 
}
	nplayers = 0
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
		for (token = 7; token < NF; token++) {
			pplots[player, p] = $token
			p++
			pnplots[player]++
		}
		player++
		nplayers++
		next
	}
}
END {
	allow = 500
	m = pmoney[turn]
	pmoney[turn] += allow

	printf("    %s  $%d + $%d = $%d\n", pname[turn], m, allow, pmoney[turn])


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
