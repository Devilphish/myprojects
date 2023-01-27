BEGIN {
if (0) {
    usage = "awk -f drawboard.awk players board map dots curcard" 
}
	nplots = 0
	nplayers = 0
	ntokens = 0
	nmaplines  = 0
	npipes = 0
	player = 1
	plot = -1
	map = -1
	dot = -1
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
		wellsallowed = 1
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
	if ($1 == "plot") {
		plot = $2
		map = -1; dot = -1
		nwells[plot] = 0
		nplots++
		next
	}
	if ($1 == "map") {
		map = 0
		line = 0
		plot = -1; dot = -1
		next
	}
	if ($1 == "pam") {
		map = -1; plot = -1; dot = -1
		nmaplines = line
		next
	}
	if ($1 == "dots") {
		dot = 0
		map = -1; plot = -1
		next
	}
	if (plot != -1) {
		for (pos = 1; pos <= length($1); pos++) {
			well[plot, pos]=substr($1, pos, 1)
			nwells[plot]++
		}
		next
	}
	if (map != -1) {
		ntokenline[line] = 0
		for (i = 1; i <= NF; i++) {
			token[ntokens++] = $i
			ntokenline[line]++
		}
		line++
		next
	}
	if (dot != -1) {
		welltokenplot[dot] = $1
		welltokenpos[dot] = $2
		dot++
		next
	}
}
END {
	line = 0
	dot = 0
	letdot = 0
	ntoken = 0
	color = 42
	rando = 420
	printf("\x1b[42m")
	printf("\x1b[1m")
	for (i = 0; i < nmaplines; i++) {
		for (j = 0; j < (ntokenline[line] - 1); j++) {
			t = token[ntoken++]
			if (length(t) == 1) {
				if (t == "a" || t == "b" || t == "c" || t == "d" || t == "e" || t == "f" || t == "g" || t == "h" || t == "i" || t == "j" || t == "k" || t == "l") {
					letplot = welltokenplot[letdot]
					letdot++
					isowner = 0
					for (p = 1; p <= pnplots[turn]; p++) {
						if (pplots[turn, p] == letplot) {
							isowner = 1
						}
					}
					if (isowner == 1) {
						printf("\x1b[30m")
						printf(" %s ", t)
						printf("\x1b[39m")
					}
					else {
						printf("   ")
					}
				}
				else if (t == ",") {
					plot = welltokenplot[dot]
					pos = welltokenpos[dot]
					dot++
					isowner = 0
					for (p = 1; p <= pnplots[turn]; p++) {
						if (pplots[turn, p] == plot) {
							isowner = 1
						}
					}
					if (isowner == 1) {
						printf("\x1b[34m")
					}
					printf(" %s ", well[plot, pos] == "," ? "." : well[plot, pos])
					if (isowner == 1) {
						printf("\x1b[39m")
					}

					if (((rando * plot * pos * dot * line) % 3) == 0) {
						rando *= 7;
						if (color == 42) {
							color = 43
						}
						else {
							color = 42
						}
						printf("\x1b[%dm", color)
					}

				}
				else {
					printf("%s", t)

					if (((rando * plot * pos * dot * line) % 3) == 0) {
						rando *= 7;
						if (color == 42) {
							color = 43
						}
						else {
							color = 42
						}
						printf("\x1b[%dm", color)
					}
				}
			}
			else {
				printf("%s", t)
			}
		}
		line++
		printf("%s\n", token[ntoken++])
	}

	printf("\x1b[100m")

	for (p = 1; p <= nplayers; p++) {
		if (p == turn) {
			printf("\x1b[96m")
		}
		format1 = " %s%8s: $%s  #wells %d plots"
		printf(format1, p == turn ? "*" : " ",
			pname[p], pmoney[p], pnwells[p])
		for (plot = 1; plot <= pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot])
			for (pipe = 0; pipe < npipes; pipe++) {
				if (pipefr[pipe] == pplots[p, plot]) {
					printf("|%d", pipeto[pipe])
				}
			}
		}
		printf("\n")
		printf("\x1b[39m")
	}

	if (card == 1) {
		printf("FIRE\n")
	}
	if (card == 2) {
		printf("DEPLETION - %d drills allowed (%d used)\n", wellsallowed, wellsallowed - ndrills)
	}
	if (card == 3) {
		if (roy == 5)
			royalty = 500
		else
			royalty = roy * 1000

		printf("PRODUCTION - royaly %d, %d drills allowed (%d used), %s buy a plot\n", royalty, wellsallowed, wellsallowed - ndrills, prop == 1 ? "can" : "cannot")
	}

	printf("\x1b[0m")
}
