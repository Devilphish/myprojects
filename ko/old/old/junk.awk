BEGIN {
	FS = "."
	s = 1
}
{
	if ($1 == "disc") {
		disc = $2
		next
	}
	spoke[s] = $2
	s++
}
END {
	printf("disc.%s\n", disc)
	printf("1.%s\n", spoke[1])
	s = 2
	for (i = 48; i >= 2; i--) {
		printf("%d.%s\n", s, spoke[i])
		s++
	}
}
