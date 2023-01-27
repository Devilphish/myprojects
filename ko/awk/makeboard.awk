BEGIN {
if (0) {
    usage = "awk -f makeboard.awk plots d1=<r> d2=<r> d3=<r>" 
}
	nplots = 0
	fplot = -1
	FS = "."
}
{
	if (NF < 1) {
		next
	}
	if ($1 == "fieldplot") {
		fplot = $2
		disc = -1
		nwells[fplot] = 0
		nplots++
		next
	}
	if (fplot != -1) {
		spoke = $1
		for (i = 1; i <= length($2); i++) {
			nwells[fplot]++
		}
		next
	}
}
END {
	if (d1 < 0 || d1 > 11) {
		printf("d1=%d out of range (0-11)\n", d1)
		exit
	}
	if (d2 < 0 || d2 > 11) {
		printf("d2=%d out of range (0-11)\n", d2)
		exit
	}
	if (d3 < 0 || d3 > 11) {
		printf("d3=%d out of range (0-11)\n", d3)
		exit
	}
	printf("board.%d.%d.%d\n", d1, d2, d3) > "board"
	for (plot = 1; plot <= nplots; plot++) {
		printf("plot.%d\n", plot) > "board"
		for (i = 1; i <= nwells[plot]; i++) {
			printf(",") > "board"
		}
		printf("\n") > "board"
	}
}
