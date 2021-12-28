#include <stdio.h>
int main(int argc, char *argv[])
{
    int found;
    int count;
    int sq[9][4];
    int deck[9];
    int c1[9], c2[7], c3[6], c4[5], c5[4], c6[3], c7[2], c8[1];
    int r0, r1, r2, r3, r4, r5, r6, r7, r8;
    int a, b, c, d, e, f, g, h, x;

    found = 0;
    count = 0;

    sq[0][0] = -4;
    sq[0][1] = -2;
    sq[0][2] = 3;
    sq[0][3] = 2;

    sq[1][0] = -1;
    sq[1][1] = 2;
    sq[1][2] = 3;
    sq[1][3] = -4;

    sq[2][0] = -1;
    sq[2][1] = 4;
    sq[2][2] = 2;
    sq[2][3] = 1;

    sq[3][0] = -3;
    sq[3][1] = -4;
    sq[3][2] = 1;
    sq[3][3] = 3;

    sq[4][0] = 1;
    sq[4][1] = -2;
    sq[4][2] = -3;
    sq[4][3] = 4;

    sq[5][0] = 1;
    sq[5][1] = -4;
    sq[5][2] = 3;
    sq[5][3] = 2;

    sq[6][0] = 3;
    sq[6][1] = 2;
    sq[6][2] = -1;
    sq[6][3] = -4;

    sq[7][0] = 1;
    sq[7][1] = 4;
    sq[7][2] = 3;
    sq[7][3] = -2;

    sq[8][0] = -4;
    sq[8][1] = -2;
    sq[8][2] = -3;
    sq[8][3] = -1;
    for (a = 0; a < 9; a++) {
        for (x = 0; x < 9; x++) {
            c1[x] = x;
        }
        deck[0] = c1[a];
        for (x = a; x < 8; x++) {
            c1[x] = c1[x+1];
        }
    for (b = 0; b < 8; b++) {
        deck[1] = c1[b];
        for (x = 0; x < b; x++) {
            c2[x] = c1[x];
        }
        for (x = b; x < 7; x++) {
            c2[x] = c1[x+1];
        }
    for (c = 0; c < 7; c++) {
        deck[2] = c2[c];
        for (x = 0; x < c; x++) {
            c3[x] = c2[x];
        }
        for (x = c; x < 6; x++) {
            c3[x] = c2[x+1];
        }
    for (d = 0; d < 6; d++) {
        deck[3] = c3[d];
        for (x = 0; x < d; x++) {
            c4[x] = c3[x];
        }
        for (x = d; x < 5; x++) {
            c4[x] = c3[x+1];
        }
    for (e = 0; e < 5; e++) {
        deck[4] = c4[e];
        for (x = 0; x < e; x++) {
            c5[x] = c4[x];
        }
        for (x = e; x < 4; x++) {
            c5[x] = c4[x+1];
        }
    for (f = 0; f < 4; f++) {
        deck[5] = c5[f];
        for (x = 0; x < f; x++) {
            c6[x] = c5[x];
        }
        for (x = f; x < 3; x++) {
            c6[x] = c5[x+1];
        }
    for (g = 0; g < 3; g++) {
        deck[6] = c6[g];
        for (x = 0; x < g; x++) {
            c7[x] = c6[x];
        }
        for (x = g; x < 2; x++) {
            c7[x] = c6[x+1];
        }
    for (h = 0; h < 2; h++) {
        deck[7] = c7[h];
        for (x = 0; x < h; x++) {
            c8[x] = c7[x];
        }
        for (x = h; x < 1; x++) {
            c8[x] = c7[x+1];
        }
        deck[8] = c8[0];

        if ((count % 1) == 0) {
            fprintf(stderr, "#%d: ",count);
            fprintf(stderr, "%d %d %d ",deck[0], deck[1], deck[2]);
            fprintf(stderr, "%d %d %d ",deck[3], deck[4], deck[5]);
            fprintf(stderr, "%d %d %d ",deck[6], deck[7], deck[8]);
            fprintf(stderr, "\n");
        }
        count++;

    for (r8 = 0; r8 < 4; r8++) {
    for (r7 = 0; r7 < 4; r7++) {
    for (r6 = 0; r6 < 4; r6++) {
    for (r5 = 0; r5 < 4; r5++) {
    for (r4 = 0; r4 < 4; r4++) {
    for (r3 = 0; r3 < 4; r3++) {
    for (r2 = 0; r2 < 4; r2++) {
    for (r1 = 0; r1 < 4; r1++) {
    for (r0 = 0; r0 < 4; r0++) {
        int mr01, mr13, mr11, mr23, mr02, mr30, mr12, mr40;
        int mr22, mr50, mr31, mr43, mr41, mr53, mr32, mr60;
        int mr42, mr70, mr52, mr80, mr61, mr73, mr71, mr83;
        mr01 = (r0 + 1) % 4;
        mr13 = (r1 + 3) % 4;
        if (sq[deck[0]][mr01] == -sq[deck[1]][mr13]) {
        mr11 = (r1 + 1) % 4;
        mr23 = (r2 + 3) % 4;
        if (sq[deck[1]][mr11] == -sq[deck[2]][mr23]) {

        mr02 = (r0 + 2) % 4;
        mr30 = (r3 + 0) % 4;
        if (sq[deck[0]][mr02] == -sq[deck[3]][mr30]) {
        mr12 = (r1 + 2) % 4;
        mr40 = (r4 + 0) % 4;
        if (sq[deck[1]][mr12] == -sq[deck[4]][mr40]) {
        mr22 = (r2 + 2) % 4;
        mr50 = (r5 + 0) % 4;
        if (sq[deck[2]][mr22] == -sq[deck[5]][mr50]) {

        mr31 = (r3 + 1) % 4;
        mr43 = (r4 + 3) % 4;
        if (sq[deck[3]][mr31] == -sq[deck[4]][mr43]) {
        mr41 = (r4 + 1) % 4;
        mr53 = (r5 + 3) % 4;
        if (sq[deck[4]][mr41] == -sq[deck[5]][mr53]) {

        mr32 = (r3 + 2) % 4;
        mr60 = (r6 + 0) % 4;
        if (sq[deck[3]][mr32] == -sq[deck[6]][mr60]) {
        mr42 = (r4 + 2) % 4;
        mr70 = (r7 + 0) % 4;
        if (sq[deck[4]][mr42] == -sq[deck[7]][mr70]) {
        mr52 = (r5 + 2) % 4;
        mr80 = (r8 + 0) % 4;
        if (sq[deck[5]][mr52] == -sq[deck[8]][mr80]) {

        mr61 = (r6 + 1) % 4;
        mr73 = (r7 + 3) % 4;
        if (sq[deck[6]][mr61] == -sq[deck[7]][mr73]) {
        mr71 = (r7 + 1) % 4;
        mr83 = (r8 + 3) % 4;
        if (sq[deck[7]][mr71] == -sq[deck[8]][mr83]) {
            printf("GOT IT!\n");
            fprintf(stderr, "GOT IT!\n");
            printf("#%d:\n",count);
            fprintf(stderr, "#%d:\n",count);
            printf("%d%d\n",deck[0],r0);
            fprintf(stderr, "d%d\n",deck[0],r0);
            printf("%d%d\n",deck[1],r1);
            fprintf(stderr, "d%d\n",deck[1],r1);
            printf("%d%d\n",deck[2],r2);
            fprintf(stderr, "d%d\n",deck[2],r2);
            printf("%d%d\n",deck[3],r3);
            fprintf(stderr, "d%d\n",deck[3],r3);
            printf("%d%d\n",deck[4],r4);
            fprintf(stderr, "d%d\n",deck[4],r4);
            printf("%d%d\n",deck[5],r5);
            fprintf(stderr, "d%d\n",deck[5],r5);
            printf("%d%d\n",deck[6],r6);
            fprintf(stderr, "d%d\n",deck[6],r6);
            printf("%d%d\n",deck[7],r7);
            fprintf(stderr, "d%d\n",deck[7],r7);
            printf("%d%d\n",deck[8],r8);
            fprintf(stderr, "d%d\n",deck[8],r8);
            found=1;
        }
        }
        }
        }
        }
        }
        }
        }
        }
        }
        }
        }
        else {
            continue;
        }
    }
    }
    }
    }
    }
    }
    }
    }
    }

    }
    }
    }
    }
    }
    }
    }
    }
}