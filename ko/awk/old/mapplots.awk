BEGIN {
if (0) {
    usage = "awk -f mapplots.awk disc1 disc2 disc3 plots d1=<r> d2=<r> d3=<r>" 
}
	nplots = 0
	disc = -1
	plot = -1
	FS = "."
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "disc") {
		disc = $2
		plot = -1
		next
	}
	if ($1 == "plot") {
		plot = $2
		pos = 1
		disc = -1
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
		spoke = $1
		for (i = 1; i <= length($2); i++) {
			wellspoke[plot, pos] = spoke
			wellring[plot, pos] = substr($2, i, 1)
			pos++
			nwells[plot]++
		}
		next
	}
}
END {
	rot[1] = d1 * 4
	rot[2] = d2 * 4
	rot[3] = d3 * 4
	printf("board.%d:%d:%d\n", d1, d2, d3)
	for (plot = 1; plot <= nplots; plot ++) {
		printf("plot.%d\n", plot)
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
			printf("%d", well[plot, pos])
		}
		printf("\n")
		for (pos = 1; pos <= nwells[plot]; pos++) {
			printf("0")
		}
		printf("\n")
	}
}
