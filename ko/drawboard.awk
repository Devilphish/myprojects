BEGIN {
if (0) {
    usage = "awk -f drawboard.awk players board map dots" 
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
	for (i = 0; i < nmaplines; i++) {
		for (j = 0; j < (ntokenline[line] - 1); j++) {
			t = token[ntoken++]
			if (length(t) == 1) {
				if (t == "a" || t == "b" || t == "c" || t == "d" || t == "e" || t == "f" || t == "g" || t == "h" || t == "i" || t == "j" || t == "k" || t == "l") {
					letplot = welltokenplot[letdot]
					letpos = welltokenpos[letdot]
					letdot++
					isowner = 0
					for (p = 0; p < pnplots[turn]; p++) {
						if (pplots[turn, p] == letplot) {
							isowner = 1
						}
					}
					if (isowner == 1) {
						printf(" %s ", t)
					}
					else {
						printf("   ")
					}
				}
				else if (t == ",") {
					plot = welltokenplot[dot]
					pos = welltokenpos[dot]
					dot++
					printf(" %s ", well[plot, pos] == "," ? "." : well[plot, pos])
				}
				else {
					printf("%s", t)
				}
			}
			else {
				printf("%s", t)
			}
		}
		line++
		printf("%s\n", token[ntoken++])
	}

	for (p = 1; p <= nplayers; p++) {
		format1 = " %s%s: $%s  #wells %d plots"
		printf(format1, p == turn ? "*" : " ",
			pname[p], pmoney[p], pnwells[p])
		for (plot = 0; plot < pnplots[p]; plot++) {
			printf(" %d", pplots[p, plot])
			for (pipe = 0; pipe < npipes; pipe++) {
				if (pipefr[pipe] == pplots[p, plot]) {
					printf("|%d", pipeto[pipe])
				}
			}
		}
		printf("\n")
	}
}
