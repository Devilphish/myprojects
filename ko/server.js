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

var errmsg = [];

var nClients = 0;
var clientWaits = [];
var clientWaitsMask = 0;

var drillDepthCost = [ 0, 6000, 6000, 4000, 2000 ];
var detenterotation = [ 4, 2, 0 ];

var players = [
//    {
//        name: "UNIT",
//        money: 80000,
//        plots: [],
//        nwells: 0,
//    }
];
var playercolors = [ "blue", "yellow", "red", "white" ];

var bankPlayer = {
    name: "the BANK",
    money: 1000000000,  // One BILLLLLIIIIIOOOOOONNNNN dollars
    plots: [],
    nwells: 0,
};

var deck = [];

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

var turn = {
    playernum: -1,
    player: {},
    card: cardInit,
    drillsused: 0,
    propertybought: false,
    capsrequired: 0,
    npiperemove: 0,
    fineable: 0,
    removedpipepad: pipepadNone,
    removedpipe: {},
}

var waitlist = [];
var rendezvousResponse = null;

var botIId;

var server = http.createServer(function (req, res)
{
    var wait = false;

    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
    var q = url.parse(req.url, true).query;

//    console.log(req.url);

// playing around
//    for (let key in req) {
//      console.log(key, req[key]);
//    }
//    for (i = 0; i < req.socket.parser.incoming.rawHeaders.length; i++) {
//      console.log(req.socket.parser.incoming.rawHeaders[i]);
//    }

    switch (q.action) {
      case "draw":
        printHeader(q);

        drawCard();
        q.status = "draw_OK";
        q.card = turn.card;

        processWaitlist(q);

        console.log("status: " + q.status + " card: " + JSON.stringify(q.card));

        break;

      case "drill":
        printHeader(q);

        var plotnum = Number(q.plot);
        var holenum = Number(q.hole);
        var plot = plots[plotnum];
        var hole = plot.holes[holenum];

        if (hole.drill == -1) {
            q.drillDepth = drillHole(hole);
            q.status = "drill_OK";
//            q.turn = turn;
        }
        else {
            q.drillDepth = -1;
            q.status = "drill_EALREADYDRILLED";
        }

        processWaitlist(q);

        console.log("status: " + q.status + " plot: " + q.plot + " hole: " + q.hole + " drillDepth: " + q.drillDepth);

        break;

      case "cap":
        printHeader(q);

        var plotnum = Number(q.plot);
        var holenum = Number(q.hole);
        var plot = plots[plotnum];
        var hole = plot.holes[holenum];

        if (hole.drill > 0) {
            capWell(hole);
            q.status = "cap_OK";
//            q.turn = turn;
        }
        else {
            q.status = "cap_ENOWELL";
        }

        processWaitlist(q);

        console.log("status: " + q.status + " plot: " + q.plot + " hole: " + q.hole);

        break;

      case "pipe":
        printHeader(q);

        var pipepad = pipepads[Number(q.pipepadnum)];
        installPipe(pipepad);
        q.status = "pipe_OK";

        processWaitlist(q);

        console.log("status: " + q.status);

        break;

      case "piperemove":
        printHeader(q);

        var pipepad = pipepads[Number(q.pipepadnum)];
        demolishPipe(pipepad);
        q.status = "piperemove_OK";

        processWaitlist(q);

        console.log("status: " + q.status);

        break;

      case "buy":
        printHeader(q);

        var plotnum = Number(q.plot);
        var plot = plots[plotnum];

        if (plot.owner == -1) {
            buyPlot(plot);
            q.status = "buy_OK";
//            q.turn = turn;
        }
        else {
            q.status = "buy_EALREADYOWNED";
        }

        processWaitlist(q);

        console.log("status: " + q.status + " plot: " + (plotnum + 1));

        break;

      case "fine":
        printHeader(q);

        transferMoney(turn.player, bankPlayer, 10000);
        turn.fineable = 2;

        q.status = "fine_OK";

        processWaitlist(q);

        console.log("status: " + q.status);

        break;

      case "next":
        printHeader(q);

        next();
        q.status = "next_OK";

        processWaitlist(q);

        console.log("status: " + q.status + " next player: " + turn.playernum + " " + turn.player.name);
        printPlayers();

        if (turn.player.bot && turn.player.clientId == -1) {
            // run bot player in 20 ms
            botIId = setInterval(runBot, 20);
        }

        break;

      case "chat":
        printHeader(q);

        q.status = "chat_OK";

        processWaitlist(q);

        console.log("status: " + q.status + " clientId: " + q.clientId);

        break;

      case "connect":
        printHeader(q);

        q.status = "connect_OK";
        q.clientId = nClients++;
        clientWaits[q.clientId] = false;

        q.players = players;
        q.discrotations = detenterotation;

        console.log("status: " + q.status + " clientId: " + q.clientId);

        break;

      case "rotation":
        printHeader(q);

        q.status = "rotation_OK";
        detenterotation[0] = q.disc0;
        detenterotation[1] = q.disc1;
        detenterotation[2] = q.disc2;

        processWaitlist(q);

        console.log("status: " + q.status + " disc0-2: " + q.disc0 + " " + q.disc1 + " " + q.disc2);

        break;

      case "join":
        printHeader(q);

        addPlayer(q.name, q.clientId, false);
        q.status = "join_OK";
        q.playernum = players.length - 1;

        processWaitlist(q);

        console.log("status: " + q.status + " player: " + q.playernum + " " + q.name);

        break;

      case "rejoin":

        break;

      case "namechange":
        printHeader(q);

        var playernum = Number(q.player);
        players[playernum].name = q.name;
        q.status = "namechange_OK";

        processWaitlist(q);

        console.log("status: " + q.status + " player: " + q.player + " name: " + q.name);

        break;

      case "wait":
        wait = true;

        clientWaits[q.clientId] = true;
        clientWaitsMask |= (1 << q.clientId);
        res.clientId = q.clientId;
        waitlist.push(res);

        // if all clients waiting
        if (clientWaitsMask == (Math.pow(2, nClients) - 1) &&
                rendezvousResponse != null) {
//            console.log("completing rendezvous");

            rendezvousResponse.query.status = "rendezvous_OK";
            rendezvousResponse.write(JSON.stringify(rendezvousResponse.query));
            rendezvousResponse.end("");
            rendezvousResponse = null;
        }

//        console.log("wait mask " + clientWaitsMask);

        break;

      case "rendezvous":
        if (clientWaitsMask != (Math.pow(2, nClients) - 1)) {
            wait = true;

            q.status = "rendezvous_NOTREADY";
            res.clientId = q.clientId;
            res.query = q;
            rendezvousResponse = res
        }
        else {
            q.status = "rendezvous_OK";
        }

//        console.log("status: " + q.status + " wait mask: " + clientWaitsMask);

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

//const host = '192.168.5.171';
//server.listen(8080, host);
server.listen(8080);

startGame();

function runBot()
{
    console.log("runBot");

    clearInterval(botIId);
}

function printPlayers()
{
    var line = "";

    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        line += p.name + "\t\t";
        if (p.name.length < 8) {
            line += "\t";
        }
    }
    console.log(line);
    line = "";
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        line += "$" + p.money + "\t\t\t";
    }
    console.log(line);
    line = "";
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
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
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        line += "nwells: " + p.nwells + "\t\t";
    }
    console.log(line);
}

function printHeader(q)
{
    var playername = "";

    if (q.player != -1) {
        playername = players[q.player].name;
    }
    console.log("\n" + q.action + "\nclientId: " + q.clientId + " player: " + q.player + " " + playername);
}

function processWaitlist(query)
{
    var saveWait = null;

//    console.log("waitlist.length " + waitlist.length);

    while (waitlist.length > 0) {
        var wait = waitlist.pop();

        if (wait.clientId == query.clientId) {
//            console.log("processWait() bypassing clientId " + query.clientId);
            saveWait = wait;
        }
        else {
            clientWaits[wait.clientId] = false;
            clientWaitsMask &= ~(1 << wait.clientId);

            wait.write(JSON.stringify(query));
            wait.end("");

//            console.log("processWait() sending " + query.action + " to clientId " + wait.clientId);
        }
    }

    if (saveWait != null) {
        waitlist.push(saveWait);
    }
}

function addPlayer(name, clientId, bot)
{
    // 'new Object()' example, should use Object literal (they be same)
    var player = new Object();
    player.clientId = clientId;
    player.bot = bot;
    player.name = name;
    player.color = playercolors[players.length];
    player.plots = [];
    player.money = 80000;
    player.nwells = 0;
    player.msg = [];
    player.display = {};

    if (players.length == 0) {
        turn.player = player;
        turn.playernum = 0;
    }

    players.push(player);

    return player;
}

function transferMoney(from, to, amount)
{
    var bankrupt = false;

    if (from.money < amount) {
        amount = from.money;
        bankrupt = true;
    }

    from.money -= amount;
    to.money += amount;

    if (bankrupt) {
        errmsg.push("player " + from.name + " has gone BANKRUPT");
    }
    errmsg.push(from.name + " pays $" + amount + " to " + to.name);
}

function payCardRoyalty()
{
    var royalty;

    if (turn.card.type != "fire") {
        if (turn.card.type == "depletion") {
            royalty = 500;
        }
        else {
            royalty = turn.player.nwells * turn.card.royalty;
        }
        transferMoney(bankPlayer, turn.player, royalty);
    }
}

function payPipeRoyalty()
{
    for (var i = 0; i < turn.player.plots.length; i++) {
        var royalty;
        var p = turn.player.plots[i];

        for (var j = 0; j < p.pipepadsfrom.length; j++) {
            var pipepad = p.pipepadsfrom[j];
            var ownerFrom = pipepad.owner;

            royalty = p.nwells * (1000 + ((pipepad.pipes.length - 1) * 2000));
            transferMoney(turn.player, players[ownerFrom], royalty);

            errmsg[errmsg.length - 1] += " for " + p.id;
        }
    }
}

function initDeck()
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
    var cardnum = Math.floor((Math.random() * deck.length) + 1) - 1;
    turn.card = deck[cardnum];
    arrayRemove(deck, turn.card);

    if (turn.card.type == "fire") {
        // wells = 0: cap 0, 1-5: cap 1, 6-10: cap 2, 11 or more: cap 3
        turn.capsrequired = Math.floor((turn.player.nwells + 4) / 5);
        if (turn.capsrequired > 3) {
            turn.capsrequired = 3;
        }
    }
    else { // turn.card.type == "depletion" or "production"
        // player must drill, check player has any empty holes
        var emptyfound = false;
        for (var i = 0; i < turn.player.plots.length; i++) {
            var p = turn.player.plots[i];
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
            turn.fineable = 1;
        }

        payCardRoyalty();
    }
}

function buyPlot(plot)
{
    turn.propertybought = true;
    plot.owner = turn.playernum;
    turn.player.plots.push(plot);
    transferMoney(turn.player, bankPlayer, plot.price);
}

function drillHole(hole)
{
    var curwell = 3;
    for (var disc = 2; disc >= 0; disc--) {
        var rotatedspoke = hole.spoke - (detenterotation[disc] * 4);
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
        turn.player.nwells++;
        plots[hole.plot - 1].nwells++;
    }

    var cost = drillDepthCost[hole.drill + 1];
    transferMoney(turn.player, bankPlayer, cost);

    turn.drillsused++;

    return hole.drill;
}

function capWell(hole)
{
    hole.drill = 0;
    turn.player.nwells--;
    turn.capsrequired--;

    var plot = plots[hole.plot - 1];
    plot.nwells--;
}

function installPipe(pipepad)
{
    var pipefrom;
    var pipeto;

    if (plots[pipepad.plotnumA - 1].owner == turn.playernum) {
        pipefrom = pipepad.plotnumB;
        pipeto = pipepad.plotnumA;
    }
    else {
        pipefrom = pipepad.plotnumA;
        pipeto = pipepad.plotnumB;
    }

    transferMoney(turn.player, bankPlayer, 25000);

    var pipe = new Object();
    pipe.from = pipefrom;
    pipe.to = pipeto;

    pipepad.pipes.push(pipe);

    if (pipepad.pipes.length == 1) {
        // this is the 1st pipe on this pipepad
        var pipepadsfrom = plots[pipe.from - 1].pipepadsfrom;
        var pipepadsto = plots[pipe.to - 1].pipepadsto;
        pipepadsfrom[pipepadsfrom.length++] = pipepad;
        pipepadsto[pipepadsto.length++] = pipepad;

        pipepad.owner = turn.playernum;
    }

    console.log("placed pipeline from " + plots[pipe.from - 1].id + " to " + plots[pipe.to - 1].id);
}

function demolishPipe(pipepad)
{
    var pipe = pipepad.pipes.pop();
    if (pipepad.pipes.length == 0) {
        arrayRemove(plots[pipe.to - 1].pipepadsto, pipepad);
        arrayRemove(plots[pipe.from - 1].pipepadsfrom, pipepad);

        pipepad.owner = -1;
    }
    turn.npiperemove--;

    console.log("removed pipeline from " + plots[pipe.from - 1].id + " to " + plots[pipe.to - 1].id);
}

function next()
{
// validate start && prop bought
// validate card drawn
// validate min drills
// validate possible fire damage caps
// validate possible pipe removal due to well capping
// validate possible fine paid
    turn.playernum++;
    if (turn.playernum == players.length) {
        turn.playernum = 0;
    }
    if (deck.length == 0) {
//        startShuffleAnimation();
        console.log("shuffling deck ...");
        initDeck();
    }
    turn.card = cardNone;
    turn.player = players[turn.playernum];
    turn.propertybought = false;
    turn.drillsused = 0;
    turn.capsrequired = 0;
    turn.npiperemove = 0;
    turn.fineable = 0;

    payPipeRoyalty();
}

function startGame()
{
    for (var i = 0; i < plots.length; i++) {
        var p = plots[i];
        p.owner = -1;

        for (var j = 0; j < p.holes.length; j++) {
            var h = p.holes[j];
            h.drill = -1;
            h.well = {};
        }

        p.pipepadsfrom = [];
        p.pipepadsto = [];
    }

    console.log("shuffling deck ...");
    initDeck();
}
