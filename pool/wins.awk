BEGIN {
        print ""
        player_index = 0
        winners_index = -1
        losers_index = -1
        n_games = 0
        n_players = 0
        n_gamblers = 0
        n_winners = 0
        scores = 0
        debug = 0
}
{
        if ($1 == "Away") {
                for (i = 2; i <= NF; i++) {
                        away_teams[i-2] = $i
                }
                n_games = NF - 1
                next
        }
        if ($1 == "Home") {
                for (i = 2; i <= NF; i++) {
                        home_teams[i-2] = $i
                }
                FS = "|"
                scores = 1
                next
        }
        if (NF < 2 || scores == 0) {
                next
        }
        name[player_index] = $1
        pick_line[player_index] = $0
        for (i = 2; i < NF; i++) {
                picks[player_index, i-2] = $i
        }
        score[player_index] = $NF
        if (substr($1, 0, 7) == "WINNERS") {
                winners_index = player_index
        }
        if (substr($1, 0, 6) == "LOSERS") {
                losers_index = player_index
        }
        player_index++
        if (substr($1, 0, 7) != "WINNERS" && substr($1, 0 , 6) != "LOSERS" &&
            substr($1, 0, 7) != "JOE FAV") {
                n_gamblers++
        }
}
END {
    n_players = player_index
if (0) {
    if (winners_index == -1) {
        print "No games played"
        exit(1)
    }
}

    tmp_winner = n_players
    tmp_loser = n_players + 1
    save_winners_index = winners_index
    save_losers_index = losers_index
    name[tmp_winner] = "TMPWIN  "
    name[tmp_loser] = "TMPLOSE  "

    for (player = 0; player < n_players; player++) {
        if (name[player] == "WINNERS    " || name[player] == "LOSERS    " ||
            name[player] == "JOE FAV    ") {
                continue
        }
        winners_index = save_winners_index
        losers_index = save_losers_index
        for (game = 0; game < n_games; game++) {
            if (picks[winners_index, game] == "   ") {
                picks[tmp_winner, game] = picks[player, game]
            }
            else {
                picks[tmp_winner, game] = picks[winners_index, game]
            }
            if (substr(picks[tmp_winner, game], 0, 1) == " ") {
                picks[tmp_loser, game] = substr(away_teams[game], 0, 1) "  "
            }
            else {
                picks[tmp_loser, game] = "  " substr(home_teams[game], 0, 1)
            }
        }
        winners_index = tmp_winner
        losers_index = tmp_loser

        for (i = 0; i < n_players + 2; i++) {
                if (name[i] == "WINNERS " || name[i] == "LOSERS " ||
                    name[i] == "TMPWIN  " || name[i] == "TMPLOSE        " ||
                    name[i] == "JOE FAV ") {
                        continue
                }
                n_wins[i] = 0
                n_losses[i] = 0
                print_line = 0
                for (game = 0; game < n_games; game++) {
                        if (picks[winners_index, game] == "   ") {
                                continue
                        }
                        if (picks[i, game] == picks[winners_index, game]) {
                                n_wins[i]++
                        }
                        else {
                                n_losses[i]++
                        }
                }
                if (print_line) {
                        print pick_line[i]
                }
                if (player == i) {
                        n_wins_player[player] = n_wins[player]
                }
        }

        for (i = 0; i < n_players + 2; i++) {
                leaders[i] = i
        }
        keep_sorting = 1
        while (keep_sorting) {
                keep_sorting = 0
                for (i = 0; i < (n_players + 1); i++) {
                        if (n_wins[leaders[i+1]] > n_wins[leaders[i]]) {
                                tmp = leaders[i]
                                leaders[i] = leaders[i+1]
                                leaders[i+1] = tmp
                                keep_sorting = 1
                        }
                }
        }
        winning_score = score[winners_index]
        keep_sorting = 1
        while (keep_sorting) {
                keep_sorting = 0
                for (i = 0; i < (n_players + 1); i++) {
                        if (n_wins[leaders[i+1]] == n_wins[leaders[i]]) {
                                diff_score_now = score[leaders[i]] - winning_score
                                diff_score_next = score[leaders[i+1]] - winning_score
                                if (diff_score_now < 0) {
                                        diff_score_now = -diff_score_now
                                }
                                if (diff_score_next < 0) {
                                        diff_score_next = -diff_score_next
                                }
                                if (diff_score_now > diff_score_next) {
                                        tmp = leaders[i]
                                        leaders[i] = leaders[i+1]
                                        leaders[i+1] = tmp
                                        keep_sorting = 1
                                }
                        }
                }
        }
        if (n_wins[player] == n_wins[leaders[0]]) {
                winners[n_winners] = player
                wins[n_winners] = n_wins[player]
                losses[n_winners] = n_losses[player]
                n_winners++
                if (n_wins[player] == n_wins[leaders[1]]) {
                        tag[player, n_games] = "*"
                }
                else {
                        tag[player, n_games] = " "
                }
        }
    }

    for (i = 0; i < n_winners + 2; i++) {
        leaders[i] = i
    }
    keep_sorting = 1
    while (keep_sorting) {
        keep_sorting = 0
        for (i = 0; i < (n_winners + 1); i++) {
            if (wins[leaders[i+1]] > wins[leaders[i]]) {
                tmp = leaders[i]
                leaders[i] = leaders[i+1]
                leaders[i+1] = tmp
                keep_sorting = 1
            }
        }
    }

    if (n_winners > 0) {
        printf("\nAway     ");
        for (i = 0; i < n_games; i++) {
                printf("%s ", away_teams[i])
                if (length(away_teams[i]) == 2) {
                        printf(" ")
                }
        }
        printf("\nHome     ");
        for (i = 0; i < n_games; i++) {
                printf("%s ", home_teams[i])
                if (length(home_teams[i]) == 2) {
                        printf(" ")
                }
        }
        printf("\nW  L\n")
    }
    for (i = 0; i < n_winners; i++) {
        winner = leaders[i]
        player = winners[winner]
if (0) {
        printf("%d ", wins[winner])
        if (wins[winner] < 10) {
            printf(" ")
        }
        printf("%d ", losses[winner])
        if (losses[winner] < 10) {
            printf(" ")
        }
}
        curname = substr(name[player], 1, length(name[player]) - 1)
        printf("%s", curname)
        for (x = 0; x < (8 - length(curname)); x++) {
                printf(" ")
        }
        printf("|")
        for (game = 0; game < n_games; game++) {
                diff_pick[game] = 0
                tag[player, game] = " "
        }
        for (j = 0; j < n_winners; j++) {
                opponent = winners[j]
                if (player == opponent) {
                        continue
                }
                for (n = 0; n < n_games; n++) {
                        diff_pick_opp[n] = 0
                }
                n_diffs = 0
if (debug) printf("%s vs %s ", player, opponent)
                for (game = 0; game < n_games; game++) {
                        if (picks[save_winners_index, game] == "   ") {
                                if (picks[player, game] != picks[opponent, game]) {
                                        n_diffs++
                                        diff_pick[game] = 1
                                        diff_pick_opp[game] = 1
if (debug) printf("diff %s @ %s ", away_teams[game], home_teams[game])
                                }
                        }
                }
                for (game = 0; game < n_games; game++) {
                        if (diff_pick_opp[game]) {
                                if (((n_wins_player[player] + n_diffs) == n_wins_player[opponent]) || ((n_wins_player[player] + (n_diffs - 1)) == n_wins_player[opponent])) {
                                        tag[player, game] = "*"
                                }
                        }
                }
if (debug) print
        }
        for (game = 0; game < n_games; game++) {
                if (diff_pick[game]) {
                        if (substr(picks[player, game], 0, 1) == " ") {
                                printf(" %s%s|", tag[player, game], substr(picks[player, game], 3, 1))
                        }
                        else {
                                printf("%s%s |", substr(picks[player, game], 1, 1), tag[player, game])
                        }
                }
                else {
                        printf("   |")
                }
        }
        printf("%s%d\n", tag[player, n_games], score[player])
    }
}
