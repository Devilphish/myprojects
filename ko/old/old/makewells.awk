BEGIN {
	nplots = 0
	ntokens = 0
	nmaplines  = 0
	disc = -1
	plot = -1
	map = -1
	dot = -1
	FS = "."
	debug = 0
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "disc") {
		disc = $2
		plot = -1
		map = -1
		dot = -1
		if (debug) {
			printf("disc %s\n", disc)
		}
		next
	}
	if ($1 == "plot") {
		plot = $2
		disc = -1
		map = -1
		dot = -1
		if (debug) {
			printf("plot %s\n", plot)
		}
		position = 1
		nwells[plot] = 0
		nplots++
		next
	}
	if ($1 == "map") {
		map = 0
		line = 0
		disc = -1
		plot = -1
		dot = -1
		next
	}
	if ($1 == "pam") {
		map = -1
		disc = -1
		plot = -1
		dot = -1
		nmaplines = line
		next
	}
	if ($1 == "dots") {
		dot = 0
		map = -1
		disc = -1
		plot = -1
		next
	}
	if (disc != -1) {
		spoke = $1
		if (debug) {
			printf("spoke %s\n", spoke)
		}
		for (ring = 1; ring <= length($2); ring++) {
			if (debug) {
			    printf("ring %d %s\n", ring, substr($2, ring, 1))
			}
			spot[disc, spoke, ring] = substr($2, ring, 1)
		}
		next
	}
	if (plot != -1) {
		spoke = $1
		if (debug) {
			printf("spoke %s\n", spoke)
		}
		for (i = 1; i <= length($2); i++) {
			wellspoke[plot, position] = spoke
			wellring[plot, position] = substr($2, i, 1)
			position++
			nwells[plot]++
		}
		next
	}
	if (map != -1) {
		ntokenline[line] = 0
		for (i = 1; i <= NF; i++) {
			token[ntokens] = $i
			ntokenline[line]++
			ntokens++
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
	for (plot = 1; plot <= nplots; plot ++) {
		for (pos = 1; pos <= nwells[plot]; pos++) {
			spoke = wellspoke[plot, pos]
			ring = wellring[plot, pos]
			well[plot, pos] = 3
			for (disc = 3; disc >= 1; disc--) {
				if (spot[disc, spoke, ring] == 1) {
					break
				}
				else {
					well[plot, pos]--
				}
			}
			if (debug) {
				printf("w[%d, %d]=%d\n", plot, pos, well[plot, pos])
			}
		}
	}
	line = 0
	dot = 0
	ntoken = 0
	for (i = 0; i < nmaplines; i++) {
		for (j = 0; j < (ntokenline[line] - 1); j++) {
			printf("%s%d", token[ntoken], well[welltokenplot[dot], welltokenpos[dot]])
			ntoken++
			dot++
		}
		printf("%s\n", token[ntoken])
		ntoken++
		line++
	}
}
