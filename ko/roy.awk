BEGIN {
if (0) {
    usage = "awk -f roy.awk players curcard" 
}
	nplayers = 0
	npipes = 0
	player = 1
        card = 0
	roy = 0
	wellsallowed = 0
	prop = 0
	ndrills = 0
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "fire") {
		card = 1
		next
	}
	if ($1 == "depletion") {
		card = 2
		ndrills = $2
		next
	}
	if ($1 == "prod") {
		card = 3
		roy = $2
		wellsallowed = $3
		prop = $4
		ndrills = $5
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
}
END {
	if (card == 1) {
		nwells = pnwells[turn]
		ncap = 0
		if (nwells > 0 && nwells < 6) ncap = 1
		if (nwells > 5 && nwells < 11) ncap = 2
		if (nwells > 10) ncap = 3
		printf("===  fire, must cap %d wells  ===\n", ncap)
	}
	if (card == 2) {
		allow = 500
		m = pmoney[turn]
		pmoney[turn] += allow

		printf("===  depletion  $%d + $%d = $%d  ===\n", m, allow, pmoney[turn])
	}
	if (card == 3) {
		if (roy >= 1 && roy <= 4) {
			royalty = roy * 1000
		}
		else if (roy == 5) {
			royalty = 500
		}
		m = pmoney[turn]
		rtotal = pnwells[turn] * royalty
		pmoney[turn] += rtotal

		printf("===  royalty  %d well%s * %d = %d  ===\n",
				pnwells[turn], pnwells[turn] > 1 ? "s" : "",
				royalty, rtotal)
	}

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

	if (card == 1) {
		printf("fire.%d\n", ncap) > "curcard"
	}
	if (card == 2) {
		printf("depletion.1\n") > "curcard"
	}
	if (card == 3) {
		printf("prod.%d.%d.%d.%d\n", roy, wellsallowed, prop, ndrills) > "curcard"
	}
}
