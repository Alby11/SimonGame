//Global Variables
const WHEN_GAME_ENDS = 20;
let switchedOn = false,
    pads = document.getElementsByClassName('pad'),
    randomPad = function () {
        return Math.floor((Math.random() * 4) + 1);
    },
    padsSequence = [],
    playerTurns = 0,
    playerChoice,
    strictMode,
    theCount = '',
    thePads = {
        1: 'topLeftGreen',
        2: 'topRightRed',
        3: 'bottomLeftYellow',
        4: 'bottomRightBlue'
    },
    greenSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    redSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellowSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blueSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');


function onOffSwitch(element) {

    let switchState = element.target.id;

    if (switchState === 'off') {
        document.getElementById(switchState).id = 'on';
        document.getElementById('count').innerHTML = '--';
        switchedOn = true;
    } else {
        document.getElementById(switchState).id = 'off';
        document.getElementById('count').innerHTML = '';
        endGame();
        strictMode = false;
        document.getElementById('strictLed').style.background = 'linear-gradient(black, grey)';
        switchedOn = false;
    }

}

function startButton(element) {

    element.target.style.background = 'linear-gradient(#A50000, red)';

    setTimeout(() => {
        element.target.style.background = 'linear-gradient(red, #A50000)';
    }, 300);

    restartGame();

}

function strictButton(element) {

    element.target.style.background = 'linear-gradient(#909000, yellow)';

    setTimeout(() => {
        element.target.style.background = 'linear-gradient(yellow, #909000)';
    }, 300);

    if (switchedOn) {
        if (strictMode) {
            document.getElementById('strictLed').style.background = 'linear-gradient(black, grey)';
            strictMode = false;
        } else {
            document.getElementById('strictLed').style.background = 'linear-gradient(red, grey)';
            strictMode = true;
        }
    }

}

function blinkTheCount(symbol = '') {

    let count = 0;
    let countDiv = document.getElementById('count');
    let blinkIt = setInterval(() => {
        if (count++ === 5) clearInterval(blinkIt);
        countDiv.innerHTML = countDiv.innerHTML != symbol ? symbol : '';
    }, 200);

}

function lightThePad(element) {

    let lightingTime = 700;

    if (element.target) {
        element = element.target;
        var player = true;
        lightingTime = 300;
    }

    elementId = element.id;

    switch (elementId) {
        case 'topLeftGreen':
            element.style.backgroundColor = 'lightgreen';
            greenSound.play();
            break;
        case 'topRightRed':
            element.style.backgroundColor = 'red';
            redSound.play();
            break;
        case 'bottomLeftYellow':
            element.style.backgroundColor = 'yellow';
            yellowSound.play();
            break;
        case 'bottomRightBlue':
            element.style.backgroundColor = 'lightblue';
            blueSound.play();
            break;
    }

    let lightPadTimeout = setTimeout(() => {
        document.getElementById('topLeftGreen').style.backgroundColor = 'green';
        document.getElementById('topRightRed').style.backgroundColor = 'darkred';
        document.getElementById('bottomLeftYellow').style.backgroundColor = 'darkorange';
        document.getElementById('bottomRightBlue').style.backgroundColor = 'blue';
        clearTimeout(lightPadTimeout);
    }, lightingTime);

    if (player) {
        playerTurns++;
        theGame(elementId, null);
    }

}

function addListenerOnPads() {

    // Setting event listener on pads
    for (let sp = 0; sp < pads.length; sp++) {
        pads[sp].addEventListener('click', lightThePad);
    }

}

function removeListenerOnPads() {

    // Removing event listener on pads
    for (let up = 0; up < pads.length; up++) {
        pads[up].removeEventListener('click', lightThePad);
    }

}

function theGame(playerChoice = null, playerError = null) {

    function lightTheSequence() {

        removeListenerOnPads();
        // to light the pads in sequence with pause between
        var i = 0;
        theCount = (padsSequence.length < 10) ? count = '0' + padsSequence.length : count = padsSequence.length;
        var lightPadInterval = setInterval( () => {
            if (i === padsSequence.length - 1) {
                addListenerOnPads();
                clearInterval(lightPadInterval);
            }
            document.getElementById('count').innerHTML = theCount;
            lightThePad(document.getElementById(thePads[padsSequence[i++]]));
        }, 2000);
        // end of pad lighting

    }

    if (playerError) {
        playerTurns = 0;
        lightTheSequence();
    } else if (playerChoice && playerChoice !== thePads[padsSequence[playerTurns - 1]]) {
        if (strictMode) {
            endGame();
            blinkTheCount('??');
            alert("YOU LOSE");
        } else {
            blinkTheCount('!!');
            theGame(null, true);
        }
    } else {
        if (playerTurns === padsSequence.length) {
            if (padsSequence.length === WHEN_GAME_ENDS) {
                endGame();
                blinkTheCount(WHEN_GAME_ENDS.toString());
                alert("YOU WIN!!!");
                let gameWon = setTimeout(() => {
                    restartGame();
                    clearTimeout(gameWon);
                }, 5000);
            } else {
                playerTurns = 0;
                padsSequence.push(randomPad());
                lightTheSequence();
            }
        }
    }

}

function startGame() {

    if (switchedOn) {
        endGame();
        blinkTheCount('--');
        theGame();
    }

}

function endGame() {

    padsSequence = [];
    playerTurns = 0;
    // playerChoice = null;
    theCount = '';

}

function restartGame() {

    endGame();
    startGame();

}

function main() {

    // The Graphics
    setTimeout(() => {
        document.getElementsByClassName('header')[0].style.opacity = '1';
        setTimeout(() => {
            document.getElementById('headerBefore').id = 'headerTransition';
            document.getElementById('box').style.opacity = '1';
            document.getElementById('box').style.animation = 'rotateIt 3s';
        }, 2000);
    }, 2000);
    document.getElementsByClassName('onOff')[0].addEventListener('click', onOffSwitch);
    document.getElementById('start').addEventListener('click', startButton);
    document.getElementById('strict').addEventListener('click', strictButton);

}

document.addEventListener("DOMContentLoaded", main(), false);

