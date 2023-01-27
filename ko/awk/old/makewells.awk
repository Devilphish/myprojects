BEGIN {
	nplots = 0
	ntokens = 0
	nmaplines  = 0
	disc = -1
	plot = -1
	map = -1
	dot = -1
	FS = "."
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "disc") {
		disc = $2
		plot = -1; map = -1; dot = -1
		next
	}
	if ($1 == "plot") {
		plot = $2
		pos = 1
		disc = -1; map = -1; dot = -1
		nwells[plot] = 0
		nplots++
		next
	}
	if ($1 == "map") {
		map = 0
		line = 0
		disc = -1; plot = -1; dot = -1
		next
	}
	if ($1 == "pam") {
		map = -1; disc = -1; plot = -1; dot = -1
		nmaplines = line
		next
	}
	if ($1 == "dots") {
		dot = 0
		map = -1; disc = -1; plot = -1
		next
	}
	if (disc != -1) {
		spoke = $1
		for (ring = 1; ring <= length($2); ring++) {
			spot[disc, spoke, ring] = substr($2, ring, 1)
		}
		next
	}
	if (plot != -1) {
		spoke = $1
		for (i = 1; i <= length($2); i++) {
			wellspoke[plot, pos] = spoke
			wellring[plot, pos] = substr($2, i, 1)
			pos++
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
		}
	}
	line = 0
	dot = 0
	ntoken = 0
	for (i = 0; i < nmaplines; i++) {
		for (j = 0; j < (ntokenline[line] - 1); j++) {
			plot = welltokenplot[dot]
			pos = welltokenpos[dot]
			printf("%s%d", token[ntoken++], well[plot, pos])
			dot++
		}
		printf("%s\n", token[ntoken++])
		line++
	}
}
