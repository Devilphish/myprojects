#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/time.h>

#define TRUE 1
#define FALSE 0

#define PAIR 0x1
#define SET 0x2
#define QUADS 0x4
#define FLUSH 0x8
#define STRAIGHT 0x10
#define TWOPAIR 0x20
#define FULLBOAT (PAIR | SET)
#define STRAIGHTFLUSH (STRAIGHT | FLUSH)

#define CLUBS 0
#define DIAMONDS 1
#define HEARTS 2
#define SPADES 3

#define ACE 1
#define KING 13
#define QUEEN 12
#define JACK 11

char *num_str[14] = {
    "und", "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"
};

char *suit_str[4] = {
    "C", "D", "H", "S"
};

struct card {
    int val;
    int suit;
};

struct card cards[52] = {
    { ACE,  SPADES },
    { 2,    SPADES },
    { 3,    SPADES },
    { 4,    SPADES },
    { 5,    SPADES },
    { 6,    SPADES },
    { 7,    SPADES },
    { 8,    SPADES },
    { 9,    SPADES },
    { 10,    SPADES },
    { JACK,  SPADES },
    { QUEEN, SPADES },
    { KING,  SPADES },

    { ACE,  HEARTS },
    { 2,    HEARTS },
    { 3,    HEARTS },
    { 4,    HEARTS },
    { 5,    HEARTS },
    { 6,    HEARTS },
    { 7,    HEARTS },
    { 8,    HEARTS },
    { 9,    HEARTS },
    { 10,    HEARTS },
    { JACK,  HEARTS },
    { QUEEN, HEARTS },
    { KING,  HEARTS },

    { ACE,  DIAMONDS },
    { 2,    DIAMONDS },
    { 3,    DIAMONDS },
    { 4,    DIAMONDS },
    { 5,    DIAMONDS },
    { 6,    DIAMONDS },
    { 7,    DIAMONDS },
    { 8,    DIAMONDS },
    { 9,    DIAMONDS },
    { 10,    DIAMONDS },
    { JACK,  DIAMONDS },
    { QUEEN, DIAMONDS },
    { KING,  DIAMONDS },

    { ACE,  CLUBS },
    { 2,    CLUBS },
    { 3,    CLUBS },
    { 4,    CLUBS },
    { 5,    CLUBS },
    { 6,    CLUBS },
    { 7,    CLUBS },
    { 8,    CLUBS },
    { 9,    CLUBS },
    { 10,    CLUBS },
    { JACK,  CLUBS },
    { QUEEN, CLUBS },
    { KING,  CLUBS },
};

struct card deck[52];

#define ANSI_COLOR_RED     "\x1b[31m"
#define ANSI_COLOR_GREEN   "\x1b[32m"
#define ANSI_COLOR_YELLOW  "\x1b[33m"
#define ANSI_COLOR_BLUE    "\x1b[34m"
#define ANSI_COLOR_MAGENTA "\x1b[35m"
#define ANSI_COLOR_CYAN    "\x1b[36m"
#define ANSI_COLOR_RESET   "\x1b[0m"

struct playset {
    int card_pos[5];
    int n_pos;
};

#define PI_LO_NCARDS_BOARD 10
char pi_lo_name[] = "PI-LO";

char pi_lo_board_pattern[] = "\
           7   \n\
1  2  3        \n\
           8   \n\
           9   \n\
4  5  6        \n\
           10  \n\
";

struct playset pi_lo_playset[] = {
    { { 4, 5, 6, 9 }, 4 },
    { { 4, 5, 6, 10 }, 4 },
    { { 7, 8, 9, 10 }, 4 },
};

#define H_BOMB_NCARDS_BOARD 12
char h_bomb_name[] = "DOUBLE-H-BOMB";

char h_bomb_board_pattern[] = "\
1      2    \n\
  3  4      \n\
5      6    \n\
7      8    \n\
  9  10     \n\
11      12  \n\
";

struct playset h_bomb_playset[] = {
    { { 1, 3, 4, 2 }, 4 },
    { { 1, 3, 4, 6 }, 4 },
    { { 5, 3, 4, 2 }, 4 },
    { { 5, 3, 4, 6 }, 4 },
    { { 7, 9, 10, 8 }, 4 },
    { { 7, 9, 10, 12 }, 4 },
    { { 11, 9, 10, 8 }, 4 },
    { { 11, 9, 10, 12 }, 4 },
    { { 1, 5, 7, 11 }, 4 },
    { { 2, 6, 8, 12 }, 4 },
    { { 1, 2, 12, 11 }, 4 },
};

#define OMAHA_NCARDS_BOARD 5
char omaha_name[] = "OMAHA";

char omaha_board_pattern[] = "\
1  2  3  4  5  \n\
";

struct playset omaha_playset[] = {
    { { 1, 2, 3, 4, 5 }, 5 },
};

#define SIXPACK_NCARDS_BOARD 18
char sixpack_name[] = "SIXPACK";

char sixpack_board_pattern[] = "\
1  2  3     \n\
4  5  6     \n\
7  8  9     \n\
10  11  12  \n\
13  14  15  \n\
16  17  18  \n\
";

struct playset sixpack_playset[] = {
    { { 1, 2, 3 }, 3 },
    { { 4, 5, 6 }, 3 },
    { { 7, 8, 9 }, 3 },
    { { 10, 11, 12 }, 3 },
    { { 13, 14, 15 }, 3 },
    { { 16, 17, 18 }, 3 },
};

struct game {
    char *name;
    int ncards_board;
    char *board_pattern;
    struct playset *playset;
    int n_playsets;
};

struct game games[] = {
    {  /* 0 */
        pi_lo_name,
        PI_LO_NCARDS_BOARD,
        pi_lo_board_pattern,
        pi_lo_playset,
        sizeof (pi_lo_playset) / sizeof (struct playset)
    },
    {  /* 1 */
        h_bomb_name,
        H_BOMB_NCARDS_BOARD,
        h_bomb_board_pattern,
        h_bomb_playset,
        sizeof (h_bomb_playset) / sizeof (struct playset)
    },
    {  /* 2 */
        omaha_name,
        OMAHA_NCARDS_BOARD,
        omaha_board_pattern,
        omaha_playset,
        sizeof (omaha_playset) / sizeof (struct playset)
    },
    {  /* 3 */
        sixpack_name,
        SIXPACK_NCARDS_BOARD,
        sixpack_board_pattern,
        sixpack_playset,
        sizeof (sixpack_playset) / sizeof (struct playset)
    },
};

struct game *game;

int tty;

void print_deck_pattern(struct card *d, char *pattern)
{
    char c;
    int card;

    for (c = 0; c < strlen(pattern); c++) {
        if (pattern[c] >= '0' && pattern[c] <= '9') {
            card = atoi(&pattern[c]);
            if (pattern[c + 1] >= '0' && pattern[c + 1] <= '9') {
		c++;
            }

            if (tty && (d[card - 1].val < 9)) {
                printf(ANSI_COLOR_RED);
                printf("%s%s", num_str[d[card - 1].val],
                               suit_str[d[card - 1].suit]);
                printf(ANSI_COLOR_RESET);
            }
            else {
                printf("%s%s", num_str[d[card - 1].val],
                               suit_str[d[card - 1].suit]);
            }
        }
        else {
            printf("%c", pattern[c]);
        }
    }
}

int check_lo(struct card *d)
{
    struct card card;
    int n_sets = game->n_playsets;
    int cardval_scoreboard[13];
    int num_lo;
    int i, j, c;

    for (i = 0; i < n_sets; i++) {
        for (j = 0; j < 13; j++) {
            cardval_scoreboard[j] = 0;
        }

        for (c = 0; c < game->playset[i].n_pos; c++) {
            card = d[game->playset[i].card_pos[c] - 1];
            cardval_scoreboard[card.val - 1] = 1;
        }

        num_lo = 0;
        for (j = 0; j < 8; j++) {
            num_lo += cardval_scoreboard[j];
        }

	if (num_lo > 2) {
            return 1;
        }
    }

    return 0;
}

void shuffle(struct card *d, int n)
{
    struct card pick;
    int ncards = 52;
    int c;
    int i;

    while (n) {
        c = rand() % ncards;
        pick = d[c];

        for (i = c; i < (ncards - 1); i++) {
            d[i] = d[i + 1];
        }
        d[ncards - 1] = pick;
        ncards--;
        n--;
    }
}

void print_deck(struct card *d, int n)
{
    int i;

    for (i = 0; i < n; i++) {
        printf("%s%s  ", num_str[d[i].val], suit_str[d[i].suit]);
    }
}

int main(int argc, char *argv[])
{
    struct timeval tv;
    unsigned int nloops;
    unsigned int game_num;;
    unsigned int n_games;;
    int nshow;
    unsigned int i, j;

    n_games = sizeof (games) / sizeof (struct game);

    if (argc < 3) {
        printf("usage: %s <game_num> <num_loops>\n", argv[0]);
        printf("       game_num:\n");
        for (i = 0; i < n_games; i++) {
            printf("           %d = %s\n", i, games[i].name);
        }
        return 1;
    }

    tty = isatty(1);

    gettimeofday(&tv, NULL);
    srand((unsigned)(tv.tv_sec + tv.tv_usec));

    game_num = (unsigned int)atoi(argv[1]);
    nloops = (unsigned int)atoi(argv[2]);

    if (game_num >= n_games) {
        printf("game number too high (%d available)\n", n_games);
        return 2;
    }

    game = &games[game_num];
    nshow = game->ncards_board;;

    for (i = 0; i < 52; i++) {
        deck[i] = cards[i];
    }

    printf("Game: %s\n\n", game->name);
    for (j = 0; j < nloops; j++) {
        shuffle(deck, nshow);
        print_deck_pattern(&deck[52 - nshow], game->board_pattern);

        if (!check_lo(&deck[52 - nshow])) {
            printf("NOLO **********************\n");
        }
        printf("\n");

        if ((j % 100000) == 0) {
            if (j) {
                fprintf(stderr, "%dth hand\n", j);
                fflush(stderr);
            }
        }
    }

    return 0;
}
