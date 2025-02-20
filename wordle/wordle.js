var letters = [];
var solutionDivs = [];

for (var i = 0; i < 5; i++) {
  var d = document.createElement("DIV");
  d.style.width = "48px";
  d.style.height = "40px";
  d.style.position = "absolute";
  d.style.left = 100 + (i * 57) + "px";
  d.style.top = "50px";
  d.style.color = "white";
  d.style.backgroundColor = "#00000";
  d.style.border = "2px solid #3a3a3c";
  d.style.font = "32px arial bold";
  d.style.textAlign = "center";
  d.style.paddingTop = "8px";
  d.innerHTML = "";
  document.body.appendChild(d);

  letters[i] = d;
}

var d = document.createElement("DIV");
d.style.width = "200px";
d.style.height = "44px";
d.style.position = "absolute";
d.style.left = "405px";
d.style.top = "50px";
d.style.color = "white";
d.style.backgroundColor = "#00000";
d.style.border = "2px solid #3a3a3c";
d.style.font = "17px arial bold";
d.style.textAlign = "center";
d.style.paddingTop = "4px";
d.style.paddingLeft = "4px";
d.innerHTML = "Use '.' or ' ' (space) for 'any letter'";
document.body.appendChild(d);

var f = document.createElement("IFRAME");
f.style.width = "1000px";
f.style.height = "658px";
f.style.position = "absolute";
f.style.left = "0px";
f.style.top = "12px";
f.style.color = "white";
f.style.backgroundColor = "#00000";
f.style.border = "0px";
document.body.appendChild(f);
var mframedoc = f.contentDocument;
var mframewin = f.contentWindow;

f = document.createElement("IFRAME");
f.style.width = "163px";
f.style.height = "480px";
f.style.position = "absolute";
f.style.left = "420px";
f.style.top = "133px";
f.style.color = "white";
f.style.backgroundColor = "#00000";
f.style.border = "2px solid #3a3a3c";
document.body.appendChild(f);
var oframedoc = f.contentDocument;
var oframewin = f.contentWindow;

var d = document.createElement("DIV");
d.style.width = "100px";
d.style.height = "22px";
d.style.position = "absolute";
d.style.left = "448px";
d.style.top = "110px";
d.style.color = "white";
d.style.backgroundColor = "#00000";
d.style.font = "17px arial bold";
d.style.textAlign = "center";
d.style.paddingTop = "4px";
d.style.paddingLeft = "4px";
d.innerHTML = "OBSCURE";
document.body.appendChild(d);

var t = document.createElement("TABLE");
t.style.width = "300px";
//t.style.height = "22px";
t.style.position = "absolute";
t.style.left = "650px";
t.style.top = "20px";
t.style.color = "white";
t.style.backgroundColor = "#00000";
t.style.font = "17px arial bold";
t.style.textAlign = "center";
//t.style.paddingTop = "4px";
//t.style.paddingLeft = "4px";
document.body.appendChild(t);

var row = t.createTHead().insertRow(-1);
row.insertCell(0).innerHTML = "";
row.insertCell(1).innerHTML = "any";
row.insertCell(2).innerHTML = "1st";
row.insertCell(3).innerHTML = "2nd";
row.insertCell(4).innerHTML = "3rd";
row.insertCell(5).innerHTML = "4th";
row.insertCell(6).innerHTML = "5th";

var n_letter = [];
var n_start = [];
var n_2nd = [];
var n_3rd = [];
var n_4th = [];
var n_end = [];
var alpha = 'abcdefghijklmnopqrstuvwxyz';
for (var l = 0; l < 26; l++) {
    var a = alpha[l];
    n_letter[a] = 0;
    n_start[a] = 0;
    n_2nd[a] = 0;
    n_3rd[a] = 0;
    n_4th[a] = 0;
    n_end[a] = 0;
}

for (var word of Ma) {
    n_start[word[0]]++;
    n_2nd[word[1]]++;
    n_3rd[word[2]]++;
    n_4th[word[3]]++;
    n_end[word[4]]++;

    for (var l = 0; l < 5; l++) {
        n_letter[word[l]]++;
    }
}

for (l = 0; l < 26; l++) {
    var a = alpha[l];
    var row = t.insertRow(-1);
    row.insertCell(0).innerHTML = a;
    row.insertCell(1).innerHTML = n_letter[a];
    row.insertCell(2).innerHTML = n_start[a];
    row.insertCell(3).innerHTML = n_2nd[a];
    row.insertCell(4).innerHTML = n_3rd[a];
    row.insertCell(5).innerHTML = n_4th[a];
    row.insertCell(6).innerHTML = n_end[a];
}

var canvas = document.createElement("canvas");
canvas.style.width = "1000px";
canvas.style.height = "666px";
canvas.style.backgroundColor = "#000000";
document.body.insertBefore(canvas, document.body.childNodes[0]);

window.addEventListener('keydown', keyDownEvent);
window.addEventListener('keyup', keyUpEvent);

var letterIndex = 0;
var guess;
var rowIndex = 110;
var row = 0;

function drawWord(word, type)
{
    var rowInc;
    var divs = [];

    for (var i = 0; i < 5; i++) {
        var doc;
        var d = document.createElement("DIV");

        if (type == "main") {
            d.style.width = "52px";
            d.style.height = "44px";
            d.style.left = 100 + (i * 57) + "px";
            d.style.top = rowIndex + "px";
            d.style.paddingTop = "8px";
            d.style.font = "32px arial bold";
            rowInc = 57;
            d.doc = mframedoc;
        }
        else {  // "obscure"
            d.style.width = "26px";
            d.style.height = "22px";
            d.style.left = 10 + (i * 29) + "px";
            d.style.top = rowIndex + "px";
            d.style.paddingTop = "4px";
            d.style.font = "16px arial bold";
            rowInc = 29;
            d.doc = oframedoc;
        }
        d.style.transform = "scaleY(0.0)";
        d.style.position = "absolute";
        d.style.color = "white";
        if (guess[i] == '.' || guess[i] == ' ') {
            d.style.backgroundColor = "#000000";  // black
        }
        else if (true) {
            d.style.backgroundColor = "#538d4e";  // green
        }
        else {
            d.style.backgroundColor = "#b59f3b";  // yellow
        }
d.style.backgroundColor = "#538d4e";  // green
        d.style.textAlign = "center";
        d.innerHTML = word[i];

        d.doc.body.appendChild(d);

        divs[i] = d;

        var animation = d.animate([
            { transform: "scaleY(0.0)" },
            { transform: "scaleY(1.0)" },
        ], {
            duration: 500,
            delay: 100 * (row + i),
        });
        animation.onfinish = (event) => {
            event.target.element.style.transform = "scaleY(1.0)";
        };
        animation.element = d;

        animation.play();
    }

    row++;
    rowIndex += rowInc;

    return divs;
}

var shift = false;

function keyDownEvent(e)
{
    console.log("key: " + e.code);

    switch (e.code) {
      case "Backspace":
        if (shift) {
            letterIndex = 0;
            for (var i = 0; i < 5; i++) {
                letters[i].innerHTML = "";
            }
        }
        else {
            letterIndex--;
            if (letterIndex < 0) {
               letterIndex = 0;
            }
            letters[letterIndex].innerHTML = "";
        }

        while (solutionDivs.length > 0) {
           var divs = solutionDivs.pop();
           for (var i = 0; i < 5; i++) {
               var d = divs[i];
               d.doc.body.removeChild(d);
           }
        }

        break;

      case "Enter":
        if (letterIndex != 5) {
            break;
        }

        while (solutionDivs.length > 0) {
           var divs = solutionDivs.pop();
           for (var i = 0; i < 5; i++) {
               var d = divs[i];
               d.doc.body.removeChild(d);
           }
        }
        rowIndex = 110;
        row = 0;

        guess = "";
        for (var i = 0; i < 5; i++) {
            guess += letters[i].innerHTML;
        }
        guess = guess.toLowerCase();

        console.log("guess '" + guess + "'");

        searchWordles(guess);
     
        break;

      case "ShiftLeft":
      case "ShiftRight":
        shift = true;

        break;

      default:
        if (e.code.startsWith("Key") ||
            e.code == "Period" ||
            e.code == "Space") {
            if (letterIndex == 5) {
                break;
            }
            var letter;
            if (e.code == "Period") {
                letter = '.';
            }
            else if (e.code == "Space") {
                letter = ' ';
            }
            else {
                letter = e.code[3];
            }

            var div = letters[letterIndex++];
            div.innerHTML = letter;
            if (shift) {
                div.placeType = "misplaced";
                div.style.color = "#b59f3b";
            }
            else {
                div.placeType = "exact";
                div.style.color = "#538d4e";
            }
            if (letter == '.' || letter == ' ') {
                div.placeType = "wildcard";
                div.style.color = "white";
            }
        }

        break;
    }
}

function keyUpEvent(e)
{
    console.log("key: " + e.code);

    switch (e.code) {
      case "ShiftLeft":
      case "ShiftRight":
        shift = false;

        break;
    }
}

function checkWord(word)
{
    var wordAttrs = [
        { notLetters: [], checked: false },
        { notLetters: [], checked: false },
        { notLetters: [], checked: false },
        { notLetters: [], checked: false },
        { notLetters: [], checked: false },
    ];
    var misplacedLetters = [];

    for (var l = 0; l < 5; l++) {
        wordAttrs[l].checked = false;

        var div = letters[l];
        if (div.placeType == "exact") {
            wordAttrs[l].checked = true;

            if (word[l] != guess[l]) {
                return false;
            }
        }
        else if (div.placeType == "misplaced") {
            wordAttrs[l].notLetters.push(guess[l]);
            misplacedLetters.push({ letter: guess[l], found: false });
        }
    }
    for (var l = 0; l < 5; l++) {
        if (!wordAttrs[l].checked) {
            var notLetters = wordAttrs[l].notLetters;
            while (notLetters.length > 0) {
                var notLetter = notLetters.pop();
                if (word[l] == notLetter) {
                    return false;
                }
            }
        }
    }
    for (var l = 0; l < 5; l++) {
        if (!wordAttrs[l].checked) {
            for (var m = 0; m < misplacedLetters.length; m++) {
                if (!wordAttrs[l].checked && !misplacedLetters[m].found &&
                    word[l] == misplacedLetters[m].letter) {
                    wordAttrs[l].checked = true;
                    misplacedLetters[m].found = true;
                }
            }
        }
    }
    while (misplacedLetters.length > 0) {
        var m = misplacedLetters.pop();
        if (m.found == false) {
            return false;
        }
    }

    return true;
}

function searchWordles(guess)
{
//    var guess = prompt("Enter guess (with . for unknown letter)");

    if (guess == undefined) {
        alert("guess undefined");
        return;
    }
    if (guess != null && guess.length != 5) {
        alert("guess must be 5 characters");
        return;
    }

    for (var word of Ma) {
        if (checkWord(word)) {
            solutionDivs.push(drawWord(word.toUpperCase(), "main"));

            console.log(word);
        }
    }

    rowIndex = 10;
    row = 0;
    for (var word of Oa) {
        if (checkWord(word)) {
            solutionDivs.push(drawWord(word.toUpperCase(), "obscure"));

            console.log(word + '*');
        }
    }
}
