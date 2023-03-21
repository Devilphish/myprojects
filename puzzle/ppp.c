#include <stdio.h>

#define NTILES 9
#define NCMPS 12

#define TILE 0
#define POS  1

int sq[NTILES][4] = {
    {-4, -2, 3, 2},
    {-1, 2, 3, -4},
    {-1, 4, 2, 1},
    {-3, -4, 1, 3},
    {1, -2, -3, 4},
    {1, -4, 3, 2},
    {3, 2, -1, -4},
    {1, 4, 3, -2},
    {-4, -2, -3, -1}
};

int cmps[NCMPS][2][2] = {
    {{0, 1}, {1, 3}},
    {{1, 1}, {2, 3}},

    {{0, 2}, {3, 0}},
    {{1, 2}, {4, 0}},
    {{2, 2}, {5, 0}},

    {{3, 1}, {4, 3}},
    {{4, 1}, {5, 3}},

    {{3, 2}, {6, 0}},
    {{4, 2}, {7, 0}},
    {{5, 2}, {8, 0}},

    {{6, 1}, {7, 3}},
    {{7, 1}, {8, 3}},
};

int count = 0;

void printdeck(int *deck)
{
    int x;

    printf("#%d: ",count);
    for (x = 0; x < NTILES; x++) {
        printf("%d ",deck[x]);
    }
    printf("\n");
}

int test(int ncmps, int *deck, int *rots)
{
    int ncmpsnew = ncmps - 1;
    int p0, p1;
    int r0, r1;
    int t0, t1;
    int t;

    t0 = cmps[ncmpsnew][0][TILE];
    t1 = cmps[ncmpsnew][1][TILE];
    p0 = cmps[ncmpsnew][0][POS];
    p1 = cmps[ncmpsnew][1][POS];
    r0 = (p0 - rots[t0] + 4) % 4;
    r1 = (p1 - rots[t1] + 4) % 4;

    if (sq[deck[t0]][r0] == -sq[deck[t1]][r1]) {
        if (ncmpsnew) {
            test(ncmpsnew, deck, rots);
        }
        else {
            /* GOT IT */
            printf("GOT IT!\n");
            for (t = 0; t < 3; t++) {
                printf("%d%d ", deck[t], rots[t]);
            }
            printf("\n");
            for (t = 3; t < 6; t++) {
                printf("%d%d ", deck[t], rots[t]);
            }
            printf("\n");
            for (t = 6; t < NTILES; t++) {
                printf("%d%d ", deck[t], rots[t]);
            }
            printf("\n");

            return 1;
        }
    }

    return 0;
}

int rotate(int ntiles, int *deck, int *rots)
{
    int ntilesnew = ntiles - 1;
    int r;

    for (r = 0; r < 4; r++) {
        rots[ntilesnew] = r;

        if (ntilesnew) {
            rotate(ntilesnew, deck, rots);
        }
        else {
            test(NCMPS, deck, rots);
        }
    }
}

int permute(int ntiles, int *tiles, int *deck)
{
    int newtiles[NTILES];
    int ntilesnew = ntiles - 1;
    int rots[NTILES];
    int t;
    int x;

    for (t = 0; t < ntiles; t++) {
        deck[ntilesnew] = tiles[t];

        for (x = 0; x < t; x++) {
            newtiles[x] = tiles[x];
        }
        for (x = t; x < ntilesnew; x++) {
            newtiles[x] = tiles[x+1];
        }

        if (ntilesnew) {
            permute(ntilesnew, newtiles, deck);
        }
        else {
            if ((count % 1) == 0) {
                printdeck(deck);
            }
            count++;

            rotate(NTILES, deck, rots);
        }
    }
}

int main(int argc, char *argv[])
{
    int deck[NTILES];
    int tiles[NTILES];
    int t;

    for (t = 0; t < NTILES; t++) {
        tiles[t] = t;
    }

    permute(NTILES, tiles, deck);
}
