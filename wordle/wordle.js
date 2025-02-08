var letters = [];
var solutionDivs = [];

for (var i = 0; i < 5; i++) {
  var d = document.createElement("DIV");
  d.style.width = "48px";
  d.style.height = "40px";
  d.style.position = "absolute";
  d.style.left = 100 + (i * 58) + "px";
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

var canvas = document.createElement("canvas");
canvas.style.width = "1000px";
canvas.style.height = "666px";
canvas.style.backgroundColor = "#000000";
document.body.insertBefore(canvas, document.body.childNodes[0]);

window.addEventListener('keydown', keyDownEvent);

var letterIndex = 0;
var guess;
var rowIndex = 110;

function drawWord(word)
{
    var divs = [];

    for (var i = 0; i < 5; i++) {
        var d = document.createElement("DIV");
        d.style.transform = "scaleY(0.0)";
        d.style.width = "52px";
        d.style.height = "44px";
        d.style.position = "absolute";
        d.style.left = 100 + (i * 58) + "px";
        d.style.top = rowIndex + "px";
        d.style.color = "white";
        if (guess[i] == ".") {
            d.style.backgroundColor = "#b59f3b";
        }
        else {
            d.style.backgroundColor = "#538d4e";
        }
        d.style.font = "32px arial bold";
        d.style.textAlign = "center";
        d.style.paddingTop = "7px";
        d.innerHTML = word[i];

        document.body.appendChild(d);

        divs[i] = d;

        var animation = d.animate([
            { transform: "scaleY(0.0)" },
            { transform: "scaleY(1.0)" },
        ], {
            duration: 500,
            delay: 200 * i,
        });
        animation.onfinish = (event) => {
            event.target.element.style.transform = "scaleY(1.0)";
        };
        animation.element = d;

        animation.play();
    }

    rowIndex += 58;

    return divs;
}

function keyDownEvent(e)
{
    console.log("key: " + e.code);

    switch (e.code) {
      case "Backspace":
        letterIndex--;
        if (letterIndex < 0) {
           letterIndex = 0;
        }
        letters[letterIndex].innerHTML = "";
        break;

      case "Enter":
        if (letterIndex != 5) {
            break;
        }

        while (solutionDivs.length > 0) {
           var divs = solutionDivs.pop();
           for (var i = 0; i < 5; i++) {
               document.body.removeChild(divs[i]);
           }
        }
        rowIndex = 110;

        guess = "";
        for (var i = 0; i < 5; i++) {
            guess += letters[i].innerHTML;
        }
        guess = guess.toLowerCase();

        console.log("guess '" + guess + "'");

        searchWordles(guess);
     
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
                letter = ".";
            }
            else if (e.code == "Space") {
                letter = " ";
            }
            else {
                letter = e.code[3];
            }
            letters[letterIndex++].innerHTML = letter
        }
        break;
    }
}

function searchWordles(guess)
{
//    var guess = "tau.e";
//    var guess = prompt("Enter guess (with . for unknown letter)");

    if (guess == undefined) {
        alert("guess undefined");
        return;
    }
    if (guess != null && guess.length != 5) {
        alert("guess must be 5 characters");
        return;
    }

    var match;
    var words = [];

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

        match = true;
        for (var l = 0; l < 5; l++) {
            n_letter[word[l]]++;

            if (guess[l] == '.') {
                continue;
            }
            if (guess[l] != word[l]) {
                match = false;
            }
        }

        if (match) {
            words.push(word);
            solutionDivs.push(drawWord(word.toUpperCase()));

            console.log(word);
        }
    }
    if (words.length == 0) {
        console.log("No matching words");
    }

    for (var word of Oa) {
        match = true;
        for (var l = 0; l < 5; l++) {
            if (guess[l] == '.') {
                continue;
            }
            if (guess[l] != word[l]) {
                match = false;
                break;
            }
        }

        if (match) {
            words.push(word + "*");
            console.log(word + '*');
        }
    }

    var out = guess + "\n";

    for (var w of words) {
        out += w + " ";
    }

    out += "\n";
//    out = "";

    for (var l = 0; l < 26; l++) {
        var a = alpha[l];
        out += a + "\t" + n_letter[a] + "\t" + (n_letter[a] < 1000 ? "\t" : "") + n_start[a] + "\t\t"  + n_2nd[a] + "\t\t" + n_3rd[a] + "\t\t"  + n_4th[a] + "\t\t"  + n_end[a] + "\n";
    }

//    alert(out);
}
