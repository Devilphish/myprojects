var http = require('http');
var url = require('url');

var p = require('./plots.js');
var plots = p.plots;
var d = require('./discs.js');
var discs = d.discs;
var c = require('./cards.js');
var cards = c.cards;
var p = require('./pipepads.js');
var pipepads = p.pipepads;

var nClients = 0;
var errmsg = [];

var drillDepthCost = [ 0, 6000, 6000, 4000, 2000 ];
var detenterotation = [ 4, 2, 0 ];
var playercolors = [ "blue", "yellow", "red", "white" ];
//var bankStartBalance = 1000000000;  // One BILLLLLIIIIIOOOOOONNNNN dollars
var bankStartBalance = 692000;  // 46 $10000, 34 $5000, 39 $1000, 46 $500
var cardInit = {
    type: "init",
    royalty: 0,
    ndrills: 0,
    plotbuy: 1
};
var cardNone = {
    type: "none",
    royalty: 0,
    ndrills: 0,
    plotbuy: 0
};
var pipepadNone = {
    id: "none"
}

var server = http.createServer(function (req, res)
{
    var wait = false;

    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
    var q = url.parse(req.url, true).query;

//    console.log(req.url);

    if (q.clientId >= nClients) {
        q.status = "request_EUNKNOWNCLIENT";

        console.log(q.status + " unknown client " + q.clientId + " #clients " + nClients + " action " + q.action);

        q.action = "sys_override";  // overrides switch below
    }

    switch (q.action) {
      case "draw":
        printHeader(q);

        drawCard();

        if (game.bankPlayer.bankrupt) {
            q.status = "bankbankrupt_OK";
        }
        else {
            q.status = "draw_OK";
        }
        q.card = game.turn.card;

        processWaitlist(q);

        console.log(q.status + " card: " + JSON.stringify(q.card));

        break;

      case "drill":
        printHeader(q);

        var plotnum = Number(q.plot);
        var holenum = Number(q.hole);
        var plot = game.plots[plotnum];
        var hole = plot.holes[holenum];

        if (hole.drill == -1) {
            q.drillDepth = drillHole(hole);
            q.status = "drill_OK";
        }
        else {
            q.drillDepth = -1;
            q.status = "drill_EALREADYDRILLED";
        }

        processWaitlist(q);

        console.log(q.status + " plot: " + q.plot + " hole: " + q.hole + " drillDepth: " + q.drillDepth);

        break;

      case "cap":
        printHeader(q);

        var plotnum = Number(q.plot);
        var holenum = Number(q.hole);
        var plot = game.plots[plotnum];
        var hole = plot.holes[holenum];

        if (hole.drill > 0) {
            capWell(hole);
            q.status = "cap_OK";
        }
        else {
            q.status = "cap_ENOWELL";
        }

        processWaitlist(q);

        console.log(q.status + " plot: " + q.plot + " hole: " + q.hole);

        break;

      case "pipe":
        printHeader(q);

        var pipepad = game.pipepads[Number(q.pipepadnum)];
        installPipe(pipepad);
        q.status = "pipe_OK";

        processWaitlist(q);

        console.log(q.status);

        break;

      case "piperemove":
        printHeader(q);

        var pipepad = game.pipepads[Number(q.pipepadnum)];
        demolishPipe(pipepad);
        q.status = "piperemove_OK";

        processWaitlist(q);

        console.log(q.status);

        break;

      case "buy":
        printHeader(q);

        var plotnum = Number(q.plot);
        var plot = game.plots[plotnum];

        if (plot.owner == -1) {
            buyPlot(plot);
            q.status = "buy_OK";
        }
        else {
            q.status = "buy_EALREADYOWNED";
        }

        processWaitlist(q);

        console.log(q.status + " plot: " + (plotnum + 1));

        break;

      case "fine":
        printHeader(q);

        transferMoney(game.turn.player, game.bankPlayer, 10000);
        game.turn.fineable = 2;

        q.status = "fine_OK";

        processWaitlist(q);

        console.log(q.status);

        break;

      case "next":
        printHeader(q);

        next();
        q.status = "next_OK";

        processWaitlist(q);

        console.log(q.status + " next player: " + game.turn.playernum + " " + game.turn.player.name);
        printPlayers();

        if (game.turn.player.bot && game.turn.player.clientId == -1) {
            // run bot player in 20 ms
            game.botIId = setInterval(runBot, 20);
        }

        break;

      case "chat":
        printHeader(q);

        q.status = "chat_OK";

        processWaitlist(q);

        if (q.msg.startsWith("ReSeT")) {
            console.log("Resetting game...");

            nClients = 0;
            resetGame(game);
        }
        else if (q.msg.startsWith("GaMe")) {
            printObject(game);
            for (var i = 0; i < game.plots.length; i++) {
                printObject(game.plots[i]);
            }
        }

        console.log(q.status + " clientId: " + q.clientId);

        break;

      case "connect":
        printHeader(q);

        q.status = "connect_OK";
        q.clientId = nClients++;
        game.clientWaits[q.clientId] = false;

        q.players = game.players;
        q.discrotations = game.detenterotation;
if (0) {
        q.plots = [];

        for (var i = 0; i < game.plots.length; i++) {
            var p = game.plots[i];
            var plot = {};
            plot.owner = p.owner;
            plot.nwells = p.nwells;
            plot.pipepadsto = p.pipepadsto;
            plot.pipepadsfrom = p.pipepadsfrom;
            plot.holes = [];
            for (var j = 0; j < p.holes.length; j++) {
                plot.holes[j] = p.holes[j].drill;
            }
            q.plots[i] = plot;
        }
// do turn
// do deck.length
// do pipepads[]
// do detenterotations[]
}

        console.log(q.status + " clientId: " + q.clientId);

        break;

      case "rotation":
        printHeader(q);

        q.status = "rotation_OK";
        game.detenterotation[0] = q.disc0;
        game.detenterotation[1] = q.disc1;
        game.detenterotation[2] = q.disc2;

        processWaitlist(q);

        console.log(q.status + " disc0-2: " + q.disc0 + " " + q.disc1 + " " + q.disc2);

        break;

      case "join":
        printHeader(q);

        addPlayer(q.name, q.clientId, false);
        q.status = "join_OK";
        q.playernum = game.players.length - 1;

        processWaitlist(q);

        console.log(q.status + " player: " + q.playernum + " " + q.name);

        break;

      case "rejoin":

        break;

      case "namechange":
        printHeader(q);

        var playernum = Number(q.player);
        game.players[playernum].name = q.name;
        q.status = "namechange_OK";

        processWaitlist(q);

        console.log(q.status + " player: " + q.player + " name: " + q.name);

        break;

      case "wait":
        wait = true;

        game.clientWaits[q.clientId] = true;
        game.clientWaitsMask |= (1 << q.clientId);
        res.clientId = q.clientId;
        game.waitlist.push(res);

        // if all clients waiting
        if (game.clientWaitsMask == (Math.pow(2, nClients) - 1) &&
            game.rendezvousResponse != null) {
//            console.log("completing rendezvous");

            game.rendezvousResponse.query.status = "rendezvous_OK";
            game.rendezvousResponse.write(JSON.stringify(game.rendezvousResponse.query));
            game.rendezvousResponse.end("");
            game.rendezvousResponse = null;
        }

//        console.log("wait mask " + game.clientWaitsMask);

        break;

      case "rendezvous":
        if (game.clientWaitsMask != (Math.pow(2, nClients) - 1)) {
            wait = true;

            q.status = "rendezvous_NOTREADY";
            res.clientId = q.clientId;
            res.query = q;
            game.rendezvousResponse = res
        }
        else {
            q.status = "rendezvous_OK";
        }

//        console.log(q.status + " wait mask: " + game.clientWaitsMask);

        break;

      default:
        printHeader(q);

        break;
    }

    if (!wait) {
        res.write(JSON.stringify(q));
        res.end("");
    }
});

function runBot()
{
    console.log("runBot");

    clearInterval(game.botIId);
}

function printPlayers()
{
    var line = "";

    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i];
        line += p.name + "\t\t";
        if (p.name.length < 8) {
            line += "\t";
        }
    }
    console.log(line);
    line = "";
    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i];
        line += "$" + p.money + "\t\t\t";
    }
    console.log(line);
    line = "";
    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i];
        var tmpline = "";
        tmpline += "plots: ";
        for (var j = 0; j < p.plots.length; j++) {
            tmpline += p.plots[j].plotnum + " ";
        }
        if (tmpline.length < 8) {
            tmpline += "\t";
        }
        if (tmpline.length < 16) {
            tmpline += "\t";
        }
        tmpline += "\t";
        line += tmpline;
    }
    console.log(line);
    line = "";
    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i];
        line += "nwells: " + p.nwells + "\t\t";
    }
    console.log(line);

    console.log(game.bankPlayer.name + " $" + game.bankPlayer.money + (game.bankPlayer.bankrupt ? " BANKRUPT" : ""));
}

function printHeader(q)
{
    var playername = "";

    if (q.action == "sys_override") {
        return;
    }

    if (q.player != -1) {
        playername = game.players[q.player].name;
    }
    console.log("\n" + q.action + "\nclientId: " + q.clientId + " player: " + q.player + " " + playername);
}

function processWaitlist(query)
{
    var saveWait = null;

//    console.log("waitlist.length " + game.waitlist.length);

    while (game.waitlist.length > 0) {
        var wait = game.waitlist.pop();

        if (wait.clientId == query.clientId) {
//            console.log("processWait() bypassing clientId " + query.clientId);
            saveWait = wait;
        }
        else {
            game.clientWaits[wait.clientId] = false;
            game.clientWaitsMask &= ~(1 << wait.clientId);

            wait.write(JSON.stringify(query));
            wait.end("");

//            console.log("processWait() sending " + query.action + " to clientId " + wait.clientId);
        }
    }

    if (saveWait != null) {
        game.waitlist.push(saveWait);
    }
}

function addPlayer(name, clientId, bot)
{
    // 'new Object()' example, should use Object literal (they be same)
    var player = new Object();
    player.clientId = clientId;
    player.bot = bot;
    player.name = name;
    player.color = playercolors[game.players.length];
    player.plots = [];
    player.money = 0;
    player.nwells = 0;
    player.bankrupt = false;

    if (game.players.length == 0) {
        game.turn.player = player;
        game.turn.playernum = 0;
    }

    game.players.push(player);

    transferMoney(game.bankPlayer, player, 80000);

    return player;
}

function transferMoney(from, to, amount)
{
    if (from.money < amount) {
        amount = from.money;
        from.bankrupt = true;
    }

    from.money -= amount;
    to.money += amount;

    if (from.bankrupt) {
        errmsg.push(from.name + " has gone BANKRUPT");
    }
    errmsg.push(from.name + " pays $" + amount + " to " + to.name);
}

function payCardRoyalty()
{
    var royalty;

    if (game.turn.card.type != "fire") {
        if (game.turn.card.type == "depletion") {
            royalty = 500;
        }
        else {
            royalty = game.turn.player.nwells * game.turn.card.royalty;
        }
        transferMoney(game.bankPlayer, game.turn.player, royalty);
    }
}

function payPipeRoyalty()
{
    for (var i = 0; i < game.turn.player.plots.length; i++) {
        var royalty;
        var p = game.turn.player.plots[i];

        for (var j = 0; j < p.pipepadsfrom.length; j++) {
            var pipepad = p.pipepadsfrom[j];
            var ownerFrom = pipepad.owner;

            royalty = p.nwells * (1000 + ((pipepad.pipes.length - 1) * 2000));
            transferMoney(game.turn.player, game.players[ownerFrom], royalty);

            errmsg[errmsg.length - 1] += " for " + p.id;
        }
    }
}

function initDeck(deck)
{
    deck.length = 0;
    for (var i = 0; i < cards.length; i++) {
        deck[i] = cards[i];
    }
}

function arrayRemove(array, element)
{
    for (var i = array.indexOf(element); i < (array.length - 1); i++) {
        array[i] = array[i + 1];
    }
    array.length--;
}

function drawCard()
{
    var cardnum = Math.floor((Math.random() * game.deck.length) + 1) - 1;
    game.turn.card = game.deck[cardnum];
    arrayRemove(game.deck, game.turn.card);

    if (game.turn.card.type == "fire") {
        // wells = 0: cap 0, 1-5: cap 1, 6-10: cap 2, 11 or more: cap 3
        game.turn.capsrequired = Math.floor((game.turn.player.nwells + 4) / 5);
        if (game.turn.capsrequired > 3) {
            game.turn.capsrequired = 3;
        }
    }
    else { // game.turn.card.type == "depletion" or "production"
        // player must drill, check player has any empty holes
        var emptyfound = false;
        for (var i = 0; i < game.turn.player.plots.length; i++) {
            var p = game.turn.player.plots[i];
            for (var j = 0; j < p.holes.length; j++) {
                if (p.holes[j].drill == -1) {
                    emptyfound = true;
                    break;
                }
            }
            if (emptyfound) {
                break;
            }
        }
        if (!emptyfound) {
            game.turn.fineable = 1;
        }

        payCardRoyalty();
    }
}

function buyPlot(plot)
{
    game.turn.propertybought = true;
    plot.owner = game.turn.playernum;
    game.turn.player.plots.push(plot);
    transferMoney(game.turn.player, game.bankPlayer, plot.price);
}

function drillHole(hole)
{
    var curwell = 3;
    for (var disc = 2; disc >= 0; disc--) {
        var rotatedspoke = hole.spoke - (game.detenterotation[disc] * 4);
        if (rotatedspoke < 0) {
            rotatedspoke += 48;
        }
        if (discs[disc][rotatedspoke][hole.ring] == 1) {
            break;
        }
        else {
            curwell--;
        }
    }
    hole.drill = curwell;

    if (hole.drill > 0) {
        game.turn.player.nwells++;
        game.plots[hole.plot - 1].nwells++;
    }

    var cost = drillDepthCost[hole.drill + 1];
    transferMoney(game.turn.player, game.bankPlayer, cost);

    game.turn.drillsused++;

    return hole.drill;
}

function capWell(hole)
{
    hole.drill = 0;
    game.turn.player.nwells--;
    game.turn.capsrequired--;

    var plot = game.plots[hole.plot - 1];
    plot.nwells--;
}

function installPipe(pipepad)
{
    var pipefrom;
    var pipeto;

    if (game.plots[pipepad.plotnumA - 1].owner == game.turn.playernum) {
        pipefrom = pipepad.plotnumB;
        pipeto = pipepad.plotnumA;
    }
    else {
        pipefrom = pipepad.plotnumA;
        pipeto = pipepad.plotnumB;
    }

    transferMoney(game.turn.player, game.bankPlayer, 25000);

    var pipe = new Object();
    pipe.from = pipefrom;
    pipe.to = pipeto;

    pipepad.pipes.push(pipe);

    if (pipepad.pipes.length == 1) {
        // this is the 1st pipe on this pipepad
        var pipepadsfrom = game.plots[pipe.from - 1].pipepadsfrom;
        var pipepadsto = game.plots[pipe.to - 1].pipepadsto;
        pipepadsfrom[pipepadsfrom.length++] = pipepad;
        pipepadsto[pipepadsto.length++] = pipepad;

        pipepad.owner = game.turn.playernum;
    }

    console.log("placed pipeline from " + game.plots[pipe.from - 1].id + " to " + game.plots[pipe.to - 1].id);
}

function demolishPipe(pipepad)
{
    var pipe = pipepad.pipes.pop();
    if (pipepad.pipes.length == 0) {
        arrayRemove(game.plots[pipe.to - 1].pipepadsto, pipepad);
        arrayRemove(game.plots[pipe.from - 1].pipepadsfrom, pipepad);

        pipepad.owner = -1;
    }
    game.turn.npiperemove--;

    console.log("removed pipeline from " + game.plots[pipe.from - 1].id + " to " + game.plots[pipe.to - 1].id);
}

function next()
{
// validate start && prop bought
// validate card drawn
// validate min drills
// validate possible fire damage caps
// validate possible pipe removal due to well capping
// validate possible fine paid
    game.turn.playernum++;
    if (game.turn.playernum == game.players.length) {
        game.turn.playernum = 0;
    }
    if (game.deck.length == 0) {
//        startShuffleAnimation();
        console.log("shuffling deck ...");
        initDeck(game.deck);
    }
    game.turn.card = cardNone;
    game.turn.player = game.players[game.turn.playernum];
    game.turn.propertybought = false;
    game.turn.drillsused = 0;
    game.turn.capsrequired = 0;
    game.turn.npiperemove = 0;
    game.turn.fineable = 0;

    payPipeRoyalty();
}

function printObject(obj)
{
    for (let key in obj) {
      console.log(key, obj[key]);
    }
}

var game = {
    players: [],
    bankPlayer: {},
    plots: [],
    pipepads: [],
    turn: {},
    deck: [],
    detenterotation: [],
    clientWaits: [],
    clientWaitsMask: 0,
    waitlist: [],
    rendezvousResponse: null,
    botIId: -1,

};

//const host = '192.168.5.171';
//server.listen(31428, host);

server.listen(31428);

resetGame(game);

function resetGame(gameState)
{
    gameState.players.length = 0;
    gameState.bankPlayer.name = "the BANK",
    gameState.bankPlayer.money = bankStartBalance;
    gameState.bankPlayer.bankrupt = false;

    for (var i = 0; i < plots.length; i++) {
        var psrc = plots[i];
        var p = {};
        p.id = psrc.id;
        p.plotnum = psrc.plotnum;
        p.price = psrc.price;
        p.owner = -1;
        p.nwells = 0;
        p.pipepadsto = [];
        p.pipepadsfrom = [];
        p.holes = [];

        gameState.plots[i] = p;

        for (var j = 0; j < psrc.holes.length; j++) {
            var hsrc = psrc.holes[j];
            var h = {};
            h.id = hsrc.id;
            h.plot = hsrc.plot;
            h.spoke = hsrc.spoke;
            h.ring = hsrc.ring;
            h.drill = -1;

            p.holes[j] = h;
        }
    }

    for (var i = 0; i < pipepads.length; i++) {
        var ppsrc = pipepads[i];
        var pp = {};
        pp.id = ppsrc.id;
        pp.owner = -1;
        pp.plotnumA = ppsrc.plotnumA
        pp.plotnumB = ppsrc.plotnumB
        pp.pipes = [];

        gameState.pipepads[i] = pp;
    }

    var turn = gameState.turn;
    turn.playernum = -1;
    turn.player = {};
    turn.card = cardInit;
    turn.drillsused = 0;
    turn.propertybought = false;
    turn.capsrequired = 0;
    turn.npiperemove = 0;
    turn.fineable = 0;
    turn.removedpipepad = pipepadNone;
    turn.removedpipe = {};

    var dr = gameState.detenterotation;
    dr[0] = detenterotation[0];
    dr[1] = detenterotation[1];
    dr[2] = detenterotation[2];

    gameState.clientWaits.length = 0;
    gameState.clientWaitsMask = 0;

    gameState.waitlist.length = 0;
    gameState.rendezvousResponse = null;
    gameState.botIId = -1;

    console.log("shuffling deck ...");
    initDeck(gameState.deck);
}
