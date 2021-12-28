#include <stdio.h>
#include <stdlib.h>
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

#define ACE 14
#define KING 13
#define QUEEN 12
#define JACK 11

char *num_str[15] = {
    "und", "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"
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
struct card test[52];
int *hand;

int shuffle_test(struct card *d, int n)
{
    struct card pick;
    int ncards = 52;
    int c;
    int i;
    int j;

    for (i = 0; i < n; i++) {
        c = rand() % ncards;
        pick = d[c];

        if (!(pick.val == deck[i].val && pick.suit == deck[i].suit)) {
            return 0;
        }
        if (i > 2) {
            for (j = 0; j < i; j++) {
                printf("%s%s  ", num_str[deck[j].val],
                      suit_str[deck[j].suit]);
            }
            printf("\n");
        }
        for (j = c; j < (ncards - 1); j++) {
            d[j] = d[j + 1];
        }
        d[ncards - 1] = pick;
        ncards--;
    }

    return 1;
}

int shuffle(struct card *d, int n)
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
    return 1;
}

int compare(const void *v1, const void *v2)
{
    int n1, n2;

    n1 = *(int *)v1;
    n2 = *(int *)v2;
    if (n1 < n2) return -1;
    if (n1 > n2) return 1;
    return 0;
}

int print_summary(struct card *d, int n)
{
    int total;
    int flushsuit;
    int i, j;

    /* check for flush */

    /* we already have 1 of the 1st card's suit */
    total = 1;

    /* check if cards 2 -> n (last card) match 1st card's suit */
    for (i = 1; i < n; i++) {
        if (d[i].suit == d[0].suit) {
            total++;
        }
    }
    if (total == n) {
        flushsuit = d[0].suit;

        for (i = 0; i < n; i++) {
            hand[i] = d[i].val;
        }
        qsort(hand, n, sizeof (*hand), compare);

        if (hand[0] == 10 &&
            hand[1] == JACK &&
            hand[2] == QUEEN &&
            hand[3] == KING &&
            hand[4] == ACE) {
            /* yay, winning */
            for (i = 0; i < n; i++) {
                printf("%s%s  ", num_str[d[i].val],
                      suit_str[d[i].suit]);
            }
            printf("-  %s royalflush\n",
                  suit_str[flushsuit]);
        }
    }

}

int print_deck(struct card *d, int n)
{
    int i;

    for (i = 0; i < n; i++) {
        printf("%s%s  ", num_str[d[i].val],
              suit_str[d[i].suit]);
    }
}

int main(int argc, char *argv[])
{
    struct timeval tv;
    unsigned int nloops;
    int nshow;
    unsigned int i, j;

    if (argc < 3) {
        printf("usage: %s <num_loops> <num_cards_to_show>\n", argv[0]);
        exit(1);
    }

    gettimeofday(&tv, NULL);
    srand((unsigned)(tv.tv_sec + tv.tv_usec));

    hand = malloc(nshow * sizeof (*hand));

    nloops = (unsigned int)atoi(argv[1]);
    nshow = atoi(argv[2]);

    for (i = 0; i < 52; i++) {
        deck[i] = cards[i];
        test[i] = cards[i];
    }

    shuffle(deck, 52);
    print_deck(deck, 52);
    printf("\n");

    for (j = 0; j < nloops; j++) {
        if (shuffle_test(test, 52)) {
            printf("HOLY SHIT\n");
            print_deck(&deck[52 - nshow], nshow);
        }
        if ((j % 10000000) == 0) {
            fprintf(stderr, "%dth hand\n", j);
            fflush(stderr);
        }
    }

    free(hand);
}