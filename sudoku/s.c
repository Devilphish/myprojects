#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define getchar()

#if 0
int board[9][9] = {
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },

    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },

    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
    { 0, 0, 0,  0, 0, 0,  0, 0, 0 },
};
#endif

#define NBOARDS 8

#if 1
int boards[NBOARDS][9][9] = {
{
/* very hard solved */
    { 0, 0, 7,  6, 0, 0,  8, 0, 0 },
    { 0, 0, 8,  2, 0, 0,  3, 0, 0 },
    { 0, 0, 2,  0, 0, 3,  0, 0, 6 },

    { 0, 0, 0,  1, 0, 0,  0, 8, 0 },
    { 9, 4, 0,  0, 6, 0,  7, 0, 0 },
    { 0, 0, 0,  0, 0, 7,  0, 1, 0 },

    { 0, 0, 0,  0, 4, 0,  0, 0, 0 },
    { 5, 0, 0,  0, 0, 0,  0, 0, 7 },
    { 7, 1, 4,  0, 0, 0,  0, 0, 2 }
},
{
/* solved evil */
    { 0, 0, 1,  7, 0, 0,  0, 2, 0 },
    { 6, 0, 0,  0, 3, 0,  0, 7, 0 },
    { 0, 0, 0,  8, 2, 0,  0, 1, 0 },

    { 3, 4, 0,  0, 0, 0,  0, 0, 0 },
    { 9, 0, 5,  0, 0, 0,  8, 0, 6 },
    { 0, 0, 0,  0, 0, 0,  0, 9, 4 },

    { 0, 7, 0,  0, 8, 9,  0, 0, 0 },
    { 0, 8, 0,  0, 7, 0,  0, 0, 1 },
    { 0, 6, 0,  0, 0, 4,  9, 0, 0 }
},
{
/* solved evil */
    { 0, 1, 3,  0, 8, 6,  7, 0, 0 },
    { 0, 0, 2,  4, 0, 1,  0, 0, 5 },
    { 0, 0, 0,  0, 9, 0,  0, 0, 0 },

    { 0, 0, 0,  0, 0, 0,  0, 8, 4 },
    { 0, 2, 0,  0, 0, 0,  0, 7, 0 },
    { 3, 7, 0,  0, 0, 0,  0, 0, 0 },

    { 0, 0, 0,  0, 1, 0,  0, 0, 0 },
    { 8, 0, 0,  7, 0, 4,  2, 0, 0 },
    { 0, 0, 9,  3, 2, 0,  4, 6, 0 },
},
{
    { 0, 0, 0,  0, 5, 0,  8, 0, 0 },
    { 0, 9, 0,  7, 0, 0,  0, 3, 0 },
    { 5, 0, 1,  0, 0, 0,  2, 0, 0 },

    { 0, 0, 0,  9, 0, 4,  0, 7, 0 },
    { 6, 0, 0,  0, 0, 0,  0, 0, 4 },
    { 0, 4, 0,  2, 0, 3,  0, 0, 0 },

    { 0, 0, 9,  0, 0, 0,  3, 0, 1 },
    { 0, 5, 0,  0, 0, 1,  0, 9, 0 },
    { 0, 0, 3,  0, 7, 0,  0, 0, 0 },
},
{
/* can't solve w/o montecarlo */
    { 0, 6, 0,  0, 0, 0,  0, 4, 0 },
    { 0, 0, 0,  3, 0, 0,  9, 0, 2 },
    { 9, 0, 0,  0, 1, 0,  0, 3, 8 },

    { 0, 0, 0,  0, 0, 6,  8, 1, 0 },
    { 3, 0, 0,  0, 9, 0,  0, 0, 4 },
    { 0, 4, 7,  8, 0, 0,  0, 0, 0 },

    { 4, 8, 0,  0, 5, 0,  0, 0, 9 },
    { 7, 0, 1,  0, 0, 9,  0, 0, 0 },
    { 0, 2, 0,  0, 0, 0,  0, 7, 0 },
},
{
/* solved */
    { 1, 0, 9,  0, 0, 0,  3, 0, 7 },
    { 0, 5, 0,  7, 0, 0,  0, 8, 0 },
    { 8, 0, 0,  0, 3, 0,  0, 0, 0 },

    { 0, 0, 5,  3, 1, 0,  0, 0, 0 },
    { 0, 0, 6,  0, 0, 0,  9, 0, 0 },
    { 0, 0, 0,  0, 5, 4,  2, 0, 0 },

    { 0, 0, 0,  0, 4, 0,  0, 0, 8 },
    { 0, 4, 0,  0, 0, 3,  0, 9, 0 },
    { 9, 0, 2,  0, 0, 0,  6, 0, 5 },
},
{
/* solved */
    { 0, 0, 0,  0, 0, 1,  9, 8, 0 },
    { 1, 0, 0,  0, 8, 0,  7, 0, 0 },
    { 8, 7, 0,  6, 0, 4,  0, 2, 0 },

    { 0, 0, 0,  0, 0, 8,  6, 4, 7 },
    { 0, 0, 7,  0, 0, 0,  2, 0, 0 },
    { 3, 2, 4,  1, 0, 0,  0, 0, 0 },

    { 0, 3, 0,  9, 0, 7,  0, 1, 6 },
    { 0, 0, 2,  0, 1, 0,  0, 0, 9 },
    { 0, 9, 1,  4, 0, 0,  0, 0, 0 },
},
{
/* solved */
    { 0, 0, 0,  0, 6, 9,  4, 8, 0 },
    { 7, 0, 8,  4, 0, 0,  0, 0, 3 },
    { 0, 0, 0,  7, 3, 0,  9, 0, 2 },

    { 0, 0, 0,  9, 4, 1,  8, 0, 0 },
    { 0, 7, 0,  0, 8, 0,  0, 3, 0 },
    { 0, 0, 4,  3, 7, 5,  0, 0, 0 },

    { 4, 0, 6,  0, 2, 3,  0, 0, 0 },
    { 2, 0, 0,  0, 0, 4,  3, 0, 1 },
    { 0, 1, 3,  6, 5, 0,  0, 0, 0 },
}
};
#endif

int masks[9][9];
int board[9][9];

int twoof3 = 0;
int sqrowcol = 0;
int masking = 0;
int blindguess = 0;
int debug = 0;


int rowcol2sq(int r, int c)
{
    int sq;

    sq = (r / 3) * 3 + c / 3;

    return sq;
}

int sqn2row(int sq, int n)
{
    int r;

    r = ((sq / 3) * 3) + (n / 3);

    return r;
}

int sqn2col(int sq, int n)
{
    int c;

    c = ((sq % 3) * 3) + (n % 3);

    return c;
}

int n_in_col(int b[9][9], int n, int col)
{
    int cell;
    int r;

    for (r = 0; r < 9; r++) {
        cell = b[r][col];

        if (cell == n) {
            return 1;
        }
    }

    return 0;
}

int n_in_row(int b[9][9], int n, int row)
{
    int cell;
    int c;

    for (c = 0; c < 9; c++) {
        cell = b[row][c];

        if (cell == n) {
            return 1;
        }
    }

    return 0;
}

int n_in_sq(int b[9][9], int n, int sq)
{
    int cell;
    int i;

    for (i = 0; i < 9; i++) {
        cell = b[sqn2row(sq, i)][sqn2col(sq, i)];

        if (cell == n) {
            return 1;
        }
    }

    return 0;
}

void print_board(int b[9][9], int hilite_row, int hilite_col, int num, int mode)
{
    int c, r;
    int in_sq;
    int sq;
    int n;

    in_sq = rowcol2sq(hilite_row, hilite_col);

    for (r = 0; r < 9; r++) {
        if (r % 3 == 0) {
            printf("  -----------------------\n");
        }
        for (c = 0; c < 9; c++) {
            if (c % 3 == 0) {
                printf(" |");
            }
            if (num) {
              switch (mode) {
                case 1: /* sq filter */
                sq = rowcol2sq(r, c);
                if (sq != in_sq && n_in_sq(b, num, sq)) {
                    printf("  ");
                    continue;
                }
                break;

                case 2: /* row filter */
                if (r != hilite_row && n_in_row(b, num, r)) {
                    printf("  ");
                    continue;
                }
                break;

                case 3: /* col filter */
                if (c != hilite_col && n_in_col(b, num, c)) {
                    printf("  ");
                    continue;
                }
                break;
                }
            }

            n = b[r][c];
            if (n < 0) {
                printf("-%c", n ? '0' + -n : ' ');
                continue;
            }
            if (n > 10) {
                printf("+%c", n ? '0' + (n - 10) : ' ');
                continue;
            }
            if (r == hilite_row && c == hilite_col) {
                printf("*%c", n ? '0' + n : ' ');
            }
            else {
                printf(" %c", n ? '0' + n : ' ');
            }
        }
        printf(" |\n");
    }
    printf("  -----------------------\n");

    getchar();
}

void copy_board(int src[9][9], int dst[9][9])
{
    int i, j;

    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            dst[i][j] = src[i][j];
        }
    }
}

void set_mask(int mask[9][9], int n, int mode)
{
    int row, col;
    int sq;
    int s;
    int r, c;

    switch (mode) {
      case 1: /* sq filter */
        for (sq = 0; sq < 9; sq++) {
        for (s = 0; s < 9; s++) {
            row = sqn2row(sq, s);
            col = sqn2col(sq, s);
            if (mask[row][col] == n) {
                break;
            }
        }
        if (s != 9) {
            for (s = 0; s < 9; s++) {
                row = sqn2row(sq, s);
                col = sqn2col(sq, s);
                if (mask[row][col] == 0) {
                    mask[row][col] = n + 10;
                }
            }
        }
        }

        break;

      case 2: /* row filter */
        for (r = 0; r < 9; r++) {
        for (c = 0; c < 9; c++) {
            if (mask[r][c] == n) {
                break;
            }
        }
        if (c != 9) {
            for (c = 0; c < 9; c++) {
                if (mask[r][c] == 0) {
                    mask[r][c] = n + 10;
                }
            }
        }
        }

        break;
    }

    //print_board(mask, -1, -1, 0, 0);
    for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
            if (mask[row][col] == n) {
                sq = rowcol2sq(row, col);
                for (r = 0; r < 9; r++) {
                    if (rowcol2sq(r, col) == sq) {
                        continue;
                    }
                    if (mask[r][col] == 0 ||
                        mask[r][col] == (n + 10)) {
                        mask[r][col] = -n;
                    }
                }
                for (c = 0; c < 9; c++) {
                    if (rowcol2sq(row, c) == sq) {
                        continue;
                    }
                    if (mask[row][c] == 0 ||
                        mask[row][c] == (n + 10)) {
                        mask[row][c] = -n;
                    }
                }
            }
        }
    }
}

int solve(void)
{
    int cell;
    int cells[9];
    int need[9];
    int needs[9];
    int nneeded;
    int n_possible;
    int missing_sq;
    int un_col, un_row;
    int missing_col, missing_row;
    int sq_col, sq_row;
    int col, row;
    int nc, nr;
    int c, r;
    int nsq;
    int sqs;
    int sq;
    int cn, rn;
    int celln;
    int cl;
    int n;
    int i;
    int new_assign;
    int bad;

  do {
    do {
      new_assign = 0;

      if (twoof3) {
    /* don't need this "2/3 squares in a row/col w/ a number" part */
    for (n = 1; n <= 9; n++) {
        for (sq_col = 0; sq_col < 3; sq_col++) {
            nsq = 0;
            sqs = 0;
            for (sq_row = 0; sq_row < 3; sq_row++) {
                if (n_in_sq(board, n, sq_row * 3 + sq_col)) {
                    nsq++;
                    sqs += sq_row;
                }
            }

            if (nsq == 2) {
                missing_sq = (3 - sqs) * 3 + sq_col;
                for (c = 0; c < 3; c++) {
                    if (!n_in_col(board, n,
                                  sq_col * 3 + c)) {
                        missing_col = c;
                    }
                }
                n_possible = 0;
                for (r = 0; r < 3; r++) {
                    cn = missing_col + r * 3;
                    row = sqn2row(missing_sq, cn);
                    col = sqn2col(missing_sq, cn);
                    cell = board[row][col];
                    if (!cell) {
                        if (!n_in_row(board, n, row)) {
                            n_possible++;
                            un_row = row;
                            un_col = col;
                        }
                    }
                }
                if (n_possible == 1) {
                    new_assign = 1;
                    board[un_row][un_col] = n;

                    if (debug) {
                    printf("2of3sqcol\n");
                    print_board(board, un_row, un_col,
                                0, 0);
                    }
                }
            }
        }

        for (sq_row = 0; sq_row < 3; sq_row++) {
            nsq = 0;
            sqs = 0;
            for (sq_col = 0; sq_col < 3; sq_col++) {
                if (n_in_sq(board, n, sq_row * 3 + sq_col)) {
                    nsq++;
                    sqs += sq_col;
                }
            }

            if (nsq == 2) {
                missing_sq = (3 - sqs) + sq_row * 3;
                for (r = 0; r < 3; r++) {
                    if (!n_in_row(board, n,
                                  sq_row * 3 + r)) {
                        missing_row = r;
                    }
                }
                n_possible = 0;
                for (c = 0; c < 3; c++) {
                    cn = missing_row * 3 + c;
                    row = sqn2row(missing_sq, cn);
                    col = sqn2col(missing_sq, cn);
                    cell = board[row][col];
                    if (!cell) {
                        if (!n_in_col(board, n, col)) {
                            n_possible++;
                            un_row = row;
                            un_col = col;
                        }
                    }
                }
                if (n_possible == 1) {
                    new_assign = 1;
                    board[un_row][un_col] = n;

                    if (debug) {
                    printf("2of3sqrow\n");
                    print_board(board, un_row, un_col,
                                0, 0);
                    }
                }
            }
        }
    }
      }

      if (sqrowcol) {
    for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
            cells[col] = board[row][col];
            need[col] = 1;
        }
        for (cn = 0; cn < 9; cn++) {
            if (cells[cn]) {
                need[cells[cn] - 1] = 0;
            }
        }
        nneeded = 0;
        for (n = 0; n < 9; n++) {
            if (need[n]) {
                needs[nneeded] = n + 1;
                nneeded++;
            }
        }
        for (i = 0; i < nneeded; i++) {
            n = needs[i];
            n_possible = 0;
            for (cn = 0; cn < 9; cn++) {
                if (cells[cn]) {
                    continue;
                }
                if (n_in_sq(board, n, rowcol2sq(row, cn))) {
                    continue;
                }
                if (n_in_col(board, n, cn)) {
                    continue;
                }
                n_possible++;
                un_row = row;
                un_col = cn;
            }
            if (n_possible == 1) {
                new_assign = 1;
                cells[cn] = n;
                board[un_row][un_col] = n;

                if (debug) {
                printf("rowneed\n");
                print_board(board, un_row, un_col, 0, 0);
                }
            }
        }
    }

    for (col = 0; col < 9; col++) {
        for (row = 0; row < 9; row++) {
            cells[row] = board[row][col];
            need[row] = 1;
        }
        for (rn = 0; rn < 9; rn++) {
            if (cells[rn]) {
                need[cells[rn] - 1] = 0;
            }
        }
        nneeded = 0;
        for (n = 0; n < 9; n++) {
            if (need[n]) {
                needs[nneeded] = n + 1;
                nneeded++;
            }
        }
        for (i = 0; i < nneeded; i++) {
            n = needs[i];
            n_possible = 0;
            for (rn = 0; rn < 9; rn++) {
                if (cells[rn]) {
                    continue;
                }
                if (n_in_sq(board, n, rowcol2sq(rn, col))) {
                    continue;
                }
                if (n_in_row(board, n, rn)) {
                    continue;
                }
                n_possible++;
                un_row = rn;
                un_col = col;
            }
            if (n_possible == 1) {
                new_assign = 1;
                cells[rn] = n;
                board[un_row][un_col] = n;

                if (debug) {
                printf("colneed\n");
                print_board(board, un_row, un_col, 0, 0);
                }
            }
        }
    }

    for (sq = 0; sq < 9; sq++) {
        for (cl = 0; cl < 9; cl++) {
            row = sqn2row(sq, cl);
            col = sqn2col(sq, cl);
            cells[cl] = board[row][col];
            need[cl] = 1;
        }
        for (cl = 0; cl < 9; cl++) {
            if (cells[cl]) {
                need[cells[cl] - 1] = 0;
            }
        }
        nneeded = 0;
        for (n = 0; n < 9; n++) {
            if (need[n]) {
                needs[nneeded] = n + 1;
                nneeded++;
            }
        }
        for (i = 0; i < nneeded; i++) {
            n = needs[i];
            n_possible = 0;
            for (cl = 0; cl < 9; cl++) {
                if (cells[cl]) {
                    continue;
                }
                row = sqn2row(sq, cl);
                if (n_in_row(board, n, row)) {
                    continue;
                }
                col = sqn2col(sq, cl);
                if (n_in_col(board, n, col)) {
                    continue;
                }
                n_possible++;
                un_row = row;
                un_col = col;
                celln = cl;
            }
            if (n_possible == 1) {
                new_assign = 1;
                cells[celln] = n;
                board[un_row][un_col] = n;

                if (debug) {
                printf("sqneed\n");
                print_board(board, un_row, un_col, 0, 0);
                }
            }
        }
    }
      }
    } while (new_assign);

    if (masking) {
      for (row = 0; row < 9; row++) {
    for (col = 0; col < 9; col++) {
        if (board[row][col]) {
            continue;
        }

        /* row/col is empty */
        for (n = 1; n <= 9; n++) {
            if (n_in_sq(board, n, rowcol2sq(row, col))) {
                continue;
            }
            if (n_in_row(board, n, row)) {
                continue;
            }
            if (n_in_col(board, n, col)) {
                continue;
            }

            /* n can go in row/col */
            bad = 0;
            copy_board(board, masks);
            masks[row][col] = n;
            set_mask(masks, n, 1);

            for (sq = 0; sq < 9; sq++) {
                if (n_in_sq(masks, n, sq)) {
                    continue;
                }
                for (cl = 0; cl < 9; cl++) {
                    r = sqn2row(sq, cl);
                    c = sqn2col(sq, cl);
                    if (masks[r][c] == 0) {
                        break;
                    }
                }
                if (cl == 9) {
                    bad = 1;
                    break;
                }
            }
            if (bad) {
                if (debug) {
                print_board(masks, row, col, n, 1);
                }

                sq = rowcol2sq(row, col);
                n_possible = 0;
                for (cl = 0; cl < 9; cl++) {
                    r = sqn2row(sq, cl);
                    c = sqn2col(sq, cl);
                    if (masks[r][c] == (n + 10)) {
                        n_possible++;
                        un_row = r;
                        un_col = c;
                    }
                }
                if (n_possible == 1) {
                    new_assign = 1;
                    board[un_row][un_col] = n;

                    if (debug) {
                    printf("masking\n");
                    print_board(board, un_row, un_col,
                            0, 0);
                    }
                }
            }

            bad = 0;
            copy_board(board, masks);
            masks[row][col] = n;
            set_mask(masks, n, 2);

            if (debug) {
            print_board(masks, row, col, n, 2);
            }

            for (r = 0; r < 9; r++) {
                if (n_in_row(masks, n, r)) {
                    continue;
                }
                for (c = 0; c < 9; c++) {
                    if (masks[r][c] == 0) {
                        break;
                    }
                }
                if (c == 9) {
                    bad = 1;
                    break;
                }
            }
            if (bad) {
                if (debug) {
                print_board(masks, row, col, n, 2);
                }

                sq = rowcol2sq(row, col);
                n_possible = 0;
                for (cl = 0; cl < 9; cl++) {
                    r = sqn2row(sq, cl);
                    c = sqn2col(sq, cl);
                    if (masks[r][c] == (n + 10)) {
                        n_possible++;
                        un_row = r;
                        un_col = c;
                    }
                }
                if (n_possible == 1) {
                    new_assign = 1;
                    board[un_row][un_col] = n;

                    if (debug) {
                    printf("masking\n");
                    print_board(board, un_row, un_col,
                            0, 0);
                    }
                }
            }

            bad = 0;
            copy_board(board, masks);
            masks[row][col] = n;
            set_mask(masks, n, 1);

            for (c = 0; c < 9; c++) {
                if (n_in_col(masks, n, c)) {
                    continue;
                }
                for (r = 0; r < 9; r++) {
                    if (masks[r][c] == 0) {
                        break;
                    }
                }
                if (r == 9) {
                    bad = 1;
                    break;
                }
            }
            if (bad) {
                if (debug) {
                print_board(masks, row, col, n, 3);
                }

                sq = rowcol2sq(row, col);
                n_possible = 0;
                for (cl = 0; cl < 9; cl++) {
                    r = sqn2row(sq, cl);
                    c = sqn2col(sq, cl);
                    if (masks[r][c] == (n + 10)) {
                        n_possible++;
                        un_row = r;
                        un_col = c;
                    }
                }
                if (n_possible == 1) {
                    new_assign = 1;
                    board[un_row][un_col] = n;

                    if (debug) {
                    printf("masking\n");
                    print_board(board, un_row, un_col,
                            0, 0);
                    }
                }
            }
        }
    }
      }
    }
  } while (new_assign);

    for (row = 0; row < 9; row++) {
        for (col = 0; col < 9; col++) {
            if (board[row][col] == 0) {
                return 0;
            }
        }
    }

    return 1;
}

int board_save[9][9];
int board_display[9][9];

int main(int argc, char *argv[])
{
    int cells[9];
    int need[9];
    int needs[9];
    int nneeded;
    int n_possible;
    int nsolved;
    int col, row;
    int sq;
    int cl;
    int n;
    int i;
    int b;
    char *board_str;
    int nboards;
    int r;
    int c;
    int method_option = 0;
    int find_all_guesses = 0;

    opterr = 0;
    while ((c = getopt (argc, argv, "2smgndf")) != -1)
    {
    switch (c)
    {
      case '2':
        /* use 2-out-of-3-squares-w-number mehtod */
        twoof3 = 1;
        method_option = 1;
        break;
      case 's':
        /* use sq/row/col need method */
        sqrowcol = 1;
        method_option = 1;
        break;
      case 'm':
        /* use number masking method */
        masking = 1;
        method_option = 1;
        break;
      case 'g':
        /* use montecarlo trial for guessing one cell */
        blindguess = 1;
        method_option = 1;
        break;
      case 'n':
        /* use no methods (disable default enable of them all below) */
        method_option = 1;
        break;
      case 'd':
        /* print cell finds and tries */
        debug = 1;
        break;
      case 'f':
        /* keep looking for all guessed cells that allow solving */
        find_all_guesses = 1;
        break;
      case '?':
        if (isprint (optopt))
          fprintf (stderr, "Unknown option `-%c'.\n", optopt);
        else
          fprintf (stderr,
              "Unknown option character `\\x%x'.\n",
              optopt);
        return 1;
      default:
        abort();
    }
    }

    if (!method_option) {
    blindguess = 1;
    masking = 1;
    sqrowcol = 1;
/*
* this one is useless when sqrowcol is use
    twoof3 = 1;
*/
    }

    if (optind < argc) {
    board_str = argv[optind];

    if (strlen(board_str) != 81) {
        printf("error: not 81 cells\n");

        exit(0);
    }

    i = 0;
    for (r = 0; r < 9; r++) {
        for (c = 0; c < 9; c++) {
            boards[0][r][c] = board_str[i++] - '0';
        }
    }
    nboards = 1;
    }
    else {
    nboards = NBOARDS;
    }

    for (b = 0; b < nboards; b++) {
    printf("BOARD #%d\n", b + 1);

    copy_board(boards[b], board);

    print_board(board, -1, -1, 0, 0);

    nsolved = 0;

    if (solve()) {
        printf("solved without blind stabs\n");
        print_board(board, -1, -1, 0, 0);

        nsolved++;

        goto again;

        exit(0);
    }

    if (!blindguess) {
        goto unsolved;
    }

    print_board(board, -1, -1, 0, 0);

    copy_board(board, board_save);

    for (sq = 0; sq < 9; sq++) {
        for (cl = 0; cl < 9; cl++) {
            row = sqn2row(sq, cl);
            col = sqn2col(sq, cl);
            cells[cl] = board[row][col];
            need[cl] = 1;
        }
        for (cl = 0; cl < 9; cl++) {
            if (cells[cl]) {
                need[cells[cl] - 1] = 0;
            }
        }
        nneeded = 0;
        for (n = 0; n < 9; n++) {
            if (need[n]) {
                needs[nneeded] = n + 1;
                nneeded++;
            }
        }
        for (i = 0; i < nneeded; i++) {
            n = needs[i];
            n_possible = 0;
            for (cl = 0; cl < 9; cl++) {
                if (cells[cl]) {
                    continue;
                }
                row = sqn2row(sq, cl);
                if (n_in_row(board, n, row)) {
                    continue;
                }
                col = sqn2col(sq, cl);
                if (n_in_col(board, n, col)) {
                    continue;
                }

                printf("trying %d in r %d c %d\n", n, row, col);

                board[row][col] = n;
                if (solve()) {
                    printf("solved\n");

                    nsolved++;

                    copy_board(board_save, board_display);
                    board_display[row][col] = n;
                    print_board(board_display, row, col,
                                0, 0);
                    print_board(board, -1, -1, 0, 0);

                    if (find_all_guesses) {
                        copy_board(board_save, board);
                        continue;
                    }

                    goto again;

                    exit(0);
                }
                else {
                    copy_board(board_save, board);
                }
            }
        }
    }

unsolved:
    if (nsolved == 0) {
        printf("unsolved\n");
        print_board(board, -1, -1, 0, 0);
    }
again:
    printf("\n");
    }

    exit(nsolved);
}
