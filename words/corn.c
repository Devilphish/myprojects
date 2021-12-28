#include <stdio.h>
#include <string.h>
#include <sys/time.h>

int main(int argc, char *argv[])
{
    char *buf;
    char *cwords[40000], *owords[40000];
    char *rwords[40000], *nwords[40000];
    int ccount = 1, ocount = 1;
    int rcount = 1, ncount = 1;
    int c, o;
    int r, n;
    int len;
    struct timeval tv;


    gettimeofday(&tv, NULL);
    srand((unsigned)(tv.tv_sec + tv.tv_usec));

    cwords[0] = "";
    owords[0] = "";
    rwords[0] = "";
    nwords[0] = "";

    buf = malloc(64);

    while (gets(buf)) {
        if (buf[0] == 'C' || buf[0] == 'c') {
            buf[0] = 'C';
            if (strcmp(cwords[ccount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    cwords[ccount++] = buf;
                }
                else {
                    if (strncmp(buf, cwords[ccount-1], len)) {
                        cwords[ccount++] = buf;
                    }
                }
            }
        }
        if (buf[0] == 'O' || buf[0] == 'o') {
            buf[0] = 'O';
            if (strcmp(owords[ocount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    owords[ocount++] = buf;
                }
                else {
                    if (strncmp(buf, owords[ocount-1], len)) {
                        owords[ocount++] = buf;
                    }
                }
            }
        }
        if (buf[0] == 'R' || buf[0] == 'r') {
            buf[0] = 'R';
            if (strcmp(rwords[rcount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    rwords[rcount++] = buf;
                }
                else {
                    if (strncmp(buf, rwords[rcount-1], len)) {
                        rwords[rcount++] = buf;
                    }
                }
            }
        }
        if (buf[0] == 'N' || buf[0] == 'n') {
            buf[0] = 'N';
            if (strcmp(nwords[ncount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    nwords[ncount++] = buf;
                }
                else {
                    if (strncmp(buf, nwords[ncount-1], len)) {
                        nwords[ncount++] = buf;
                    }
                }
            }
        }

        buf = malloc(64);
    }

    while (1) {
        c = rand() % ccount;
        o = rand() % ocount;
        r = rand() % rcount;
        n = rand() % ncount;
        printf("%s %s %s %s\n", cwords[c], owords[o], rwords[r], nwords[n]);
    }

    for (c = 1; c < ccount; c++) {
        if (strlen(cwords[c]) == 0)
            continue;
        for (o = 1; o < ocount; o++) {
            if (strlen(owords[o]) == 0)
                continue;
            for (r = 1; r < rcount; r++) {
                if (strlen(rwords[r]) == 0)
                    continue;
                for (n = 1; n < ncount; n++) {
                    printf("%s %s %s %s\n", cwords[c], owords[o], rwords[r], nwords[n]);
                }
            }
        }
    }
}