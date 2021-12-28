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
int *hand;

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
}

int compare(const void *v1, const void *v2)
{
    int n1, n2;

    n1 = *(int *)v1;
    n2 = *(int *)v2;
    if (n1 > n2)
        return 1;
    /* don't bother with ==, same as < for sort */
    return -1;
}

int print_summary(struct card *d, int n)
{
    int vals[14];
    int total;
    int straight;
    int summary;
    int paircard[2];
    int px;
    int setcard;
    int quadcard;
    int straightcard;
    int flushsuit;
    int i, j;

    for (i = 1; i < 14; i++) {
        vals[i] = 0;
    }
    summary = 0;
    px = 0;
    paircard[0] = paircard[1] = setcard = quadcard = 0;
    flushsuit = 0;
    straightcard = 0;

    for (i = 0; i < n; i++) {
        vals[d[i].val]++;
    }
    for (i = 1; i < 14; i++) {
        switch (vals[i]) {
        case 2:
            paircard[px] = i;
            if (px == 0) {
                summary |= PAIR;
                px = 1;
            }
            else if (px == 1) {
                summary &= ~PAIR;
                summary |= TWOPAIR;
            }
            break;
        case 3:
            setcard = i;
            summary |= SET;
            break;
        case 4:
            quadcard = i;
            summary |= QUADS;
            break;
        default:
            break;
        }

    }

    if (summary == 0) {
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
            summary |= FLUSH;
        }

        /* check for straight */

        for (i = 0; i < n; i++) {
            hand[i] = d[i].val;
        }
        qsort(hand, n, sizeof (*hand), compare);

        /* be optimistic */
        straight = TRUE;

        /* check cards 2 -> n (last card) are consecutive */
        for (i = 1; i < (n - 1); i++) {
            if (hand[i + 1] != (hand[i] + 1)) {
                /* nope, di`un't happen */
                straight = FALSE;
                break;
            }
        }

        if (straight) {
            /* so far so good, check cards 1 -> 2 are consecutive */
            if (hand[1] == (hand[0] + 1)) {
                /* yay, winning */
                summary |= STRAIGHT;
                straightcard = hand[n - 1];
            }

            /* or card 1 is ACE and last card is KING */
            if (hand[0] == ACE && hand[n - 1] == KING) {
                /* yay, winning */
                summary |= STRAIGHT;
                straightcard = ACE;
            }
        }
    }

    switch (summary) {
    case PAIR:
        if (n == 2) {
            printf("pocket %ss\n", num_str[paircard[0]]);
        }
        else {
            printf("pair of %ss\n", num_str[paircard[0]]);
        }
        break;
    case TWOPAIR:
        if (paircard[0] == ACE) {
            printf("As up with %ss\n", num_str[paircard[1]]);
        }
        else {
            printf("%ss up with %ss\n",
                  num_str[paircard[1]], num_str[paircard[0]]);
        }
        break;
    case SET:
        printf("set of %ss\n", num_str[setcard]);
        break;
    case STRAIGHT:
        if (n == 2) {
            printf("connected %s\n", num_str[straightcard]);
        }
        else {
            printf("straight to the %s\n", num_str[straightcard]);
        }
        break;
    case FLUSH:
        if (n == 2) {
            printf("%s suited\n", suit_str[flushsuit]);
        }
        else {
            printf("%s flush\n", suit_str[flushsuit]);
        }
        break;
    case FULLBOAT:
        printf("%ss over %ss\n",
              num_str[setcard], num_str[paircard[0]]);
        break;
    case QUADS:
        printf("quad %ss\n", num_str[quadcard]);
        break;
    case STRAIGHTFLUSH:
        if (n == 2) {
            printf("%s suited connector %s\n",
                  suit_str[flushsuit], num_str[straightcard]);
        }
        else {
            if (hand[0] == ACE && hand[n - 1] == KING) {
                printf("%s royalflush\n", suit_str[flushsuit]);
            }
            else {
                printf("%s straightflush to the %s\n",
                      suit_str[flushsuit],
                      num_str[straightcard]);
            }
        }
        break;
    default:
        if (hand[0] == ACE) {
            printf("A high\n");
        }
        else {
            printf("%s high\n", num_str[hand[n - 1]]);
        }
        break;
    }
}

int print_deck(struct card *d, int n, int pr_summary)
{
    int i;

    for (i = 0; i < n; i++) {
        printf("%s%s  ", num_str[d[i].val], suit_str[d[i].suit]);
    }

    if (pr_summary) {
        printf("-  "); 
        print_summary(d, n);
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
    }

    for (j = 0; j < nloops; j++) {
        shuffle(deck, nshow);
        print_deck(&deck[52 - nshow], nshow, TRUE);
        if ((j % 10000000) == 0) {
            fprintf(stderr, "%dth hand\n", j);
            fflush(stderr);
        }
    }

    free(hand);
}