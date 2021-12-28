#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    char *buf;
    char *dwords[24000], *jwords[5000];
    int dcount = 1, jcount = 1;
    int d, j;
    int len;


    dwords[0] = "";
    jwords[0] = "";

    buf = malloc(64);

    while (gets(buf)) {
        if (buf[0] == 'D' || buf[0] == 'd') {
            buf[0] = 'D';
            if (strcmp(dwords[dcount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    dwords[dcount++] = buf;
                }
                else {
                    if (strncmp(buf, dwords[dcount-1], len)) {
                        dwords[dcount++] = buf;
                    }
                }
            }
        }
        if (buf[0] == 'J' || buf[0] == 'j') {
            buf[0] = 'J';
            if (strcmp(jwords[jcount-1], buf)) {
                len = strlen(buf) - 1;
                if (buf[len] != 's') {
                    jwords[jcount++] = buf;
                }
                else {
                    if (strncmp(buf, jwords[jcount-1], len)) {
                        jwords[jcount++] = buf;
                    }
                }
            }
        }

        buf = malloc(64);
    }

    for (d = 1; d < dcount; d++) {
        if (strlen(dwords[d]) == 0)
            continue;
        for (j = 1; j < jcount; j++) {
            printf("%s %s\n", dwords[d], jwords[j]);
        }
    }
}