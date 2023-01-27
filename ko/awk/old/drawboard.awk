BEGIN {
if (0) {
    usage = "awk -f board.awk players board map dots" 
}
	nplots = 0
	nplayers = 0
	ntokens = 0
	nmaplines  = 0
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
		for (tok = 7; tok < NF; tok++) {
			pplots[player, p] = $tok
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
	ntoken = 0
	for (i = 0; i < nmaplines; i++) {
		for (j = 0; j < (ntokenline[line] - 1); j++) {
			plot = welltokenplot[dot]
			pos = welltokenpos[dot]
			if (dispwell[plot, pos] == "1") {
				printf("%s%d", token[ntoken], well[plot, pos])
			}
			else {
				printf("%s.", token[ntoken])
			}
			ntoken++
			dot++
		}
		printf("%s\n", token[ntoken++])
		line++
	}

	for (p = 1; p <= nplayers; p++) {
		format1 = "%s: $%s  #wells %d\n"
		printf(format1, pname[p], pmoney[p], pnwells[p])
	}
}
