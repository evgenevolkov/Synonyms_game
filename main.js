/**
 * Created by Jenya on 26.06.15.
 */

function output (text) {
    document.getElementById("output").innerHTML = (document.getElementById("output").innerHTML + "<br> " + text)
}

//output("Hello world");
//output("");

//Begin

// "External" source files
var synonymsVocabulary = [
    {word: "существо", synonyms:["создание",  "творение"]},
    {word: "мир", synonyms:["вселенная",  "окружение"]},
    {word: "идти", synonyms:["передвигаться",  "перемещаться"]},
    {word: "большой", synonyms:["великий",  "необъятный"]}
];

var playerSourceFile = [
    {playerName: "John",
        playedWords: ["существо", "большой" ],
        playedGames: 2,
        gamesResults: [2,1],
        possibleResults: [2,2],
        percentageResults: [100,50]
    },
    {playerName: "Bill",
        playedWords: ["мир", "идти", "большой"],
        playedGames: 3,
        gamesResults: [0,0,2],
        possibleResults: [2,2,2],
        percentageResults: [0,0,100]
    }
];

var playersNamesAndPasswords = [
    {name: "John",
        password: "johnpass"},
    {name: "Bill",
        password: "master"}
];

// local cache
var playerData =  (function(){
    var playerName = "",
        playedGames = 0,
        playedWords = [],
        gamesResults = [],
        possibleResults = [],
        percentageResults = [];

    return {
        set: function (sourceData) {
            playerName = sourceData.playerName;
            playedWords = sourceData.playedWords;
            playedGames = sourceData.playedGames;
            gamesResults = sourceData.gamesResults;
            possibleResults = sourceData.possibleResults;
            percentageResults = sourceData.percentageResults;
        },

        logout: function() {
            console.log ("Current PlayerData is: playerName: " + playerName + ", playedWords: " +
            playedWords + ", playedGames: " + playedGames + ", gamesResults: " +
            gamesResults + " possibleResults: " + possibleResults +
            ", percentageResults: " + percentageResults)
        },

        saveToFile: function() {
            // todo add save_to_file function
            console.log ("playerData successfully saved")
        },

        updateWithCurrentRoundResults: function(gameResult, possibleMaxResult, gameSpecificData) {
            ++playedGames;
            playedWords.push(gameSpecificData);
            gamesResults.push(gameResult);
            possibleResults.push(possibleMaxResult);
            percentageResults.push(Math.ceil(gameResult/possibleMaxResult*100))
        },

        read: function (variable) {
            return variable
        },
        readWhole: function () {
            return {
                playerName: playerName,
                playedGames: playedGames,
                playedWords: playedWords,
                gamesResults: gamesResults,
                possibleResults: possibleResults,
                percentageResults: percentageResults
            }

        }
    }
})();

// Viev

var view = (function() {
    var frames = {
        login : {
            id: "#loginDiv",
            state: true
        },

        game : {
            id: "#gameLayoutDiv",
            state: false
        },

        beginButton : {
            id: "#beginButtonDiv",
            state: false
        },

        options : {
            id: "#optionsLayoutDiv",
            state: false
        },

        optionsButton: {
            id: "#optionsButtonDiv",
            state: true
        },

        status: {
            id: "#statusDiv",
            state: true
        }

    };

    var fields = {
        taskWord: {
            id: "#taskWord",
            frame: "gameLayoutDiv"
        }

        , playerInput: {
            id: "#playerInput",
            frame: "game"
        }

        , statusMsg: {
            id: "#statusOutput",
            frame: "status"
        }
    };

    return {
        setState: function (frame, state) {
            frames[frame].state = state;
            return this
        }

        , logState: function () {
            for (var frame in frames) {
                console.log(frame + " state is " + frames[frame].state)
            }
        }

        , redraw: function () {
            for (var i in frames) {
                if (!(view.checkDrawedState(frames[i].id) === frames[i].state) ) {
                    if (frames[i].state === true) {
                        $(frames[i].id).slideDown("slow");
                        console.log (i.toString() + ".id is now shown")
                    } else {
                        $(frames[i].id).slideUp("slow");
                        console.log (i.toString() + ".id is now hidden")
                    }
                }
            }
        }

        , checkDrawedState: function (id) {
            console.log (id + " is visible: " + ($(id).is(":visible")));
            return( $(id).is(":visible") );
        }

        , loginPageSetup : function (gameName, loginFieldsAndNames) {

            view.setState("game", false);
            view.setState("beginButton", false);
            view.setState("options", false);
            view.setState("login", true);
            view.redraw();

            console.log ("LoginPageSetup successful");
        }

        , hideLoginLayout: function() {
            view.setState("login", false);
            view.redraw()
        }

        , drawBeginGameButton: function() {
            view.setState("game", false);
            view.setState("beginButton", true);
            view.redraw()
        }

        , drawGameLayout: function () {
            view.setState("game", true);
            view.setState("beginButton", false);
            view.redraw();
            console.log("DrawGameLayout successful")
        }

        , drawOptionsLayout: function () {
            view.setState("game", false);
            view.setState("beginButton", false);
            view.setState("options", true);
            view.redraw()

        }

        , hideOptionsLayout: function () {
            view.setState("beginButton", true);
            view.setState("options", false);
            view.redraw()
        }

        , renderGameResults: function (playedGames, gamesResults, possibleResults) {
            var playerAverageResult = 0;
            for (i=0, j=gamesResults.length; i<j; i++ ) {
                playerAverageResult += playerAverageResult[i]
            }
            playerAverageResult = playerAverageResult / playedGames;

            output("playedGames: " + playedGames + ", gamesResults: " + gamesResults +
            "% results possibleResults: " + possibleResults + " playerAverageResult: " +
            playerAverageResult + "%")
        }

        , updateSuccessLevelNumericValue: function(){
            document.getElementById("successLevelNumericValue").innerHTML =
                document.getElementById("successLevel").value
        }

        , statusMessage: function(message){
            $(fields.statusMsg.id).prepend("<br>" + message)
        }

        , cleanField: function (fieldId) {
            $(fields[fieldId].id).val("")
        }

        , cleanPlayerInput: function () {
            view.cleanField("playerInput");
            /*
             todo Ask Vova: why this
             todo cleanField("playerInput")
             todo doesn't work? As it seems that currently control is inside "view" module.
             * */
        }
    }
})();

// Mediator - Controller?

var gameInterface = (function() {

    var vocabulary = [],
        gameType ="notPlayed",
        rejectPlayedWords = true,
        gameInterfaceCache = {
            taskWord: "",
            enteredCorectWords: [],
            possibleSynonymsArray: []
        }
        ;

    return {

        gameInitialization: function() {
            vocabulary = getVocabulary(gameType, 30);
            view.updateSuccessLevelNumericValue();
            gameInterface.loginPageSetup()
        }

        , loginPageSetup: function () {
            view.loginPageSetup( "synonyms",
                {
                    playerName: "playerName",
                    playerPassword: "playerPassword"
                }
            );


// For tasting purpose. Todo delete next lines

            var playersNamesAndPasswordsOutput = "";
            for (i=0, j = playersNamesAndPasswords.length; i<j; i++) {
                playersNamesAndPasswordsOutput += "<br>" + playersNamesAndPasswords[i]["name"]
                + "/" + playersNamesAndPasswords[i]["password"] ;
            }
            view.statusMessage("Possible name/pass pairs are:" + playersNamesAndPasswordsOutput);
            // todo end deleting lines

            view.statusMessage("Please, enter player name and login");
        }

        , checkLogin: function() {
            var playerName = document.getElementById("playerName").value,
                playerPassword = document.getElementById("playerPassword").value;

            if (checkLogin(playerName, playerPassword, playersNamesAndPasswords) &&
                loadPlayerData(playerSourceFile, playerName)) {
                console.log ("Player login successful. Initializing game");
                view.hideLoginLayout();
                view.drawBeginGameButton()
            }
        }

        , createNewPlayer: function() {
            //todo add createNewPlayer function
        }

        , newGameRound: function () {
            if (!playerData) {
                playerData = {}
            }
            var taskWordNo;
            taskWordNo = taskWordNoSelector(vocabulary, playerData.readWhole().playedWords, rejectPlayedWords);
            if (taskWordNo < 0) {
                gameInterface.endOfRound.general()
            } else {

                gameInterfaceCache.taskWord = vocabulary[taskWordNo];
                gameInterfaceCache.possibleSynonymsArray = synonymsVocabulary[taskWordNo].synonyms;
                gameInterface.enteredCorectWords = [];

                document.getElementById("taskWord").innerHTML = gameInterfaceCache.taskWord;
                //todo refactor: move bottom line to the "view"
                view.cleanPlayerInput();
                view.drawGameLayout();

                //temprorary - begin
                console.log("synonyms q possible:" + synonymsVocabulary[taskWordNo].synonyms.length);

                var synonymsCue = "";
                for (i = 0; i < synonymsVocabulary[taskWordNo].synonyms.length; i++) {
                    synonymsCue += i + ". " + synonymsVocabulary[taskWordNo].synonyms[i] + "<br>";
                }
                $("#output").html("Synonyms cue: <br>" + synonymsCue);
                //temprorary - end

                timer.start();
                gameController.listenPlayerInputs();
            }
        }

        , playerMadeInput: function (enteredWord) {
            // todo ask Vova should I make short names inside this function to increase readability
            // todo of the code?
            // todo e.g. possSyns = gameInterfaceCache.possibleSynonymsArray

            if (checkNotADupee(enteredWord, gameInterfaceCache.enteredCorectWords)) {
                console.log("Not a dupee. Checking if correct...");
                var checkResult;
                checkResult = (checkMatches (enteredWord, gameInterfaceCache.possibleSynonymsArray));
                console.log ("Check result is: " + checkResult);
                if (checkResult >= 0) {
                    view.cleanPlayerInput();
                    view.statusMessage("Good Try. Try enter some more");
                    console.log ("Successful");
                    gameInterfaceCache.enteredCorectWords.push(enteredWord);
                } else {
                    view.statusMessage("Такого синонима нет");
                    console.log ("fail")
                }

                if (gameInterfaceCache.possibleSynonymsArray.length
                    === gameInterfaceCache.enteredCorectWords.length) {
                    console.log ("All correct answers entered");
                    gameInterface.endOfRound.allPossibleEntered();
                    // todo add "end of round" here.
                    view.statusMessage("Congrats! You've entered all possible synonyms")
                }
                /*  todo Ask Vova: how should it be written if several conditions should be check followed one by one and
                 todo different actions are to be made in different conditions and some data should be passed to each
                 todo check
                 */
            } else {
                view.statusMessage ("sorry, you've already entered this word. Please try another one.");
                view.cleanPlayerInput();
            }
        }

        , endOfRound: (function () {
            return {

// todo Ask Vova: is it OK to use nested modules?

                general:function() {
                    timer.stop();
                    view.setState("game", false);
                    view.setState("beginButton", true);
                    gameInterfaceCache.taskWord = "";
                    gameInterfaceCache.enteredCorectWords= [];
                    gameInterfaceCache.possibleSynonymsArray = [];
                    view.redraw();
                }

                , outOfTime: function () {

                    view.statusMessage("You are out of time. End of Round");
                    gameInterface.updateResults();
                    gameInterface.endOfRound.general();
                }

                , allPossibleEntered: function(){
                    view.statusMessage("Great! You've entered all possible results!");
                    gameInterface.updateResults();
                    gameInterface.endOfRound.general();
                }

                , breakOfRound: function(){
                    view.statusMessage("Round is stopped without saving results.");
                    gameInterface.endOfRound.general();
                }

            }
        })()

        , updateResults: function () {
            console.log ("State before updateResults made:");
            playerData.logout();
            playerData.updateWithCurrentRoundResults(gameInterfaceCache.enteredCorectWords.length
                , gameInterfaceCache.possibleSynonymsArray.length
                , gameInterfaceCache.taskWord);
            view.statusMessage("Round ended. Results are saved");
            console.log ("State after updateResults made:");
            playerData.logout()
        }

        , optionsButton: function () {
            // todo add if timer > 0 then reset round
            view.drawOptionsLayout();

        }

        , closeOptions: function () {

            timer.stop();
            view.setState("options", false);
            view.setState("game", false);
            view.setState("beginButton", true);
            view.redraw()

        }

        , closeExtrasDiv: function () {
            // todo add closeExtrasDiv function
        }

        , viewStatistics: function() {
            // todo add vievStatistics
        }

        , optionSetGameTypeConfirmButton: function () {
            var newGameType,
                successLevel;

            newGameType = document.querySelector('input[name="gameType"]:checked').value;
            console.log ("new game type is to be set to " + newGameType);
            successLevel = document.getElementById("successLevel").value;
            console.log ("SuccessLevel will be set to: " + successLevel);

            switch (newGameType) {
                case "onlyPlayed":
                    vocabulary = playerData.readWhole().playedWords;
                    rejectPlayedWords = false;
                    break;

                case "onlyFailed":
                    vocabulary = [];
                    for (i = 0, j = playerData.readWhole().playedWords.length; i < j; i++) {
                        if (playerData.readWhole().percentageResults[i] <= successLevel) {
                            vocabulary.push(playerData.readWhole().playedWords[i]);
                            console.log ('word "' + playerData.readWhole().playedWords[i]
                            + '" was played with success rate ' + playerData.readWhole().percentageResults[i]
                            + '%. Success level set at ' + successLevel
                            + ' and thus the word is added to current vocabulary');
                        }
                    }
                    rejectPlayedWords = false;
                    break;

                case "notPlayed":
                    for (i=0, j=synonymsVocabulary.length; i<j; i++)
                        vocabulary = synonymsVocabulary;
                    rejectPlayedWords = true;
                    break;

                case "all":
                    vocabulary = synonymsVocabulary;
                    rejectPlayedWords = false;
                    break;

                default:
                    vocabulary = synonymsVocabulary;
                    rejectPlayedWords = true;
            }

            gameInterface.setGameType(newGameType, rejectPlayedWords)

        }

        , setGameType: function (newGameType, newRejectPlayedWordsPolicy) {
            // todo rejectPlayedWords seems to be abundant. Check if it can be deleted

            rejectPlayedWords = newRejectPlayedWordsPolicy;
            vocabulary = getVocabulary(newGameType
                , document.getElementById("successLevel").value);
            console.log ("New game type set: " + newGameType + " successLevel"
            + document.getElementById("successLevel").value)
        }

    }
})();

// todo ask Vova: should I put all "accessory" functions put inside gameInterface or separate object??

var gameController = (function() {
    var gameControllerCache = {};

    return {

        listenPlayerInputs: function() {
            document.getElementById("playerInput").onkeydown = function(e) {
                if (e.keyCode == 13) {
                    console.log("Enter pressed. Value: " + document.getElementById("playerInput").value);
                    gameInterface.playerMadeInput(document.getElementById("playerInput").value)
                }
            };
            document.getElementById("submit").onclick=function(){
                console.log("Enter pressed. Value: " + document.getElementById("playerInput").value);
                gameInterface.playerMadeInput(document.getElementById("playerInput").value)
            };
        }

        , exitOptionsButton: function() {
            gameInterface.closeOptions();
            return this
        }

        , endRoundButton: function() {
            gameInterface.endOfRound.breakOfRound();
            return this
        }

    }



})();
// Accessory functions
function loadPlayerData (playerSourceFile, playerName) {
    // load sourceFile to array of objects with playerData
    if (!playerSourceFile) {
        console.log("error loading playerSourceFile");
        return false
    } else {
        for (i = 0, j = playerSourceFile.length; i < j; i++) {
            if (playerSourceFile[i].playerName === playerName) {
                playerDataToLoad = playerSourceFile[i];
                playerData.set(playerDataToLoad);
                console.log("playerSourceFile loaded successful. PlayerData= " + playerData.logout());
                return true
            }
        }

        console.log("No Player data with name " + playerName + " found in " +
        "playerSourceFile: " + playerSourceFile);
        return false

    }
}

var fileManager = (function() {
    var cache;
    return {
        save: function () {
            localStorage1 = JSON.stringify(cache, " ");
            console.log ("JSON.stringify successful. localStorage is:" + JSON.stringify(localStorage1))
        },
        load: function () {
            cache = JSON.parse(localStorage1);
            console.log ("JSON.parse successful. cache is:" + JSON.stringify(localStorage1))
        },
        updateCache: function (newData) {
            cache = newData
        },
        logCache: function () {
            console.log(JSON.stringify(cache))
        },
        returnCache: function () {
            return cache
        }
    }
})();

function Countdown(options) {
    var timer,
        instance = this,
        seconds = options.seconds || 10,
        updateStatus = options.onUpdateStatus || function () {},
        counterEnd = options.onCounterEnd || function () {};

    function decrementCounter() {
        updateStatus(seconds);
        if (seconds === 0) {
            instance.stop();
            counterEnd();
        }
        seconds--;
    }

    this.start = function () {
        clearInterval(timer);
        timer = 0;
        seconds = options.seconds;
        timer = setInterval(decrementCounter, 1000);
    };

    this.stop = function () {
        clearInterval(timer);
    };
}

var timer = new Countdown({
    seconds:30,  // number of seconds to count down
    onUpdateStatus: function(seconds){document.getElementById("timer").innerHTML=seconds}, // callback for each second
    onCounterEnd: function(){ gameInterface.endOfRound.outOfTime()} // final action
});

// General functions
function checkLogin (playerName, playerPassword, namesAndPasswordsArray) {
    for (var i=0, j=namesAndPasswordsArray.length; i<j; i++ ) {
        if (namesAndPasswordsArray[i].name === playerName) {
            if (namesAndPasswordsArray[i].password === playerPassword) {
                playerData.name = document.getElementById("playerName").value;
                document.getElementById("loginMessage").innerHTML = "Player data loaded";
                // todo load playerData
                return true
            } else {
                document.getElementById("loginMessage").innerHTML = "Incorrect password";
                return false
            }
        }
    }

    document.getElementById("loginMessage").innerHTML = "No such saved Player name";
    return false
}

var localStorage1={};

function getVocabulary (gameType, successLevel) {

    var vocabulary = [];

    switch (gameType) {
        case "onlyPlayed":
            vocabulary = playerData.readWhole().playedWords;
            break;

        case "onlyFailed":
            for (i = 0, j = playerData.readWhole().playedWords.length; i < j; i++) {
                if (playerData.readWhole().percentageResults[i] <= successLevel) {
                    vocabulary.push(playerData.readWhole().playedWords[i]);
                    console.log ('word "' + playerData.readWhole().playedWords[i]
                    + '" was played with success rate ' + playerData.readWhole().percentageResults[i]
                    + '%. Success level set at ' + successLevel
                    + ' and thus the word is added to current vocabulary');
                }
            }
            break;

        case "notPlayed" || "all":
            for (i = 0, j = synonymsVocabulary.length; i<j; i++) {
                vocabulary.push(synonymsVocabulary[i].word)
            }
            break;

        default:
            for (i = 0, j = synonymsVocabulary.length; i<j; i++) {
                vocabulary.push(synonymsVocabulary[i].word)
            }

    }
    return vocabulary;
}

function checkNotADupee(enteredWord, successfulArray) {
    for (i=0, j=successfulArray.length; i<j; i++) {
        if (enteredWord === successfulArray[i]) {
            console.log("CheckForDupees: enteredWord match a dupee at: "
            + i + " in successfulArray");
            return false
        }
    }
    console.log ("CheckForDupees: Not a dupee.");
    return true
}

function taskWordNoSelector (vocabulary, playedWords, rejectPlayedWords) {
    var rnd = Math.floor(Math.random() * vocabulary.length);

    if (rejectPlayedWords) {
        for (var i=0; i < 50; i++) { // quantity of word select tries is limited to 1 000
            console.log('RejectPlayedWords policy is "true"');
            var wordWasPlayed = false,
                wordToCheck = vocabulary[rnd];

            for (j = 0, y = playedWords.length; j < y; j++) {
                if (playedWords[j] === wordToCheck) {
                    console.log("Word " + wordToCheck + " is rejected");
                    wordWasPlayed = true;
                    break;
                }
            }

            if (!wordWasPlayed) {
                return rnd
            } else {
                rnd = Math.floor(Math.random() * vocabulary.length);
                console.log("taskWordNoSelector #" + i)
            }
        }
    } else {
        console.log('RejectPlayedWords policy is "false"');
        console.log("random: " + rnd + " taskWord: " + vocabulary[rnd]);
        return rnd
    }
    console.log("New word not found");
    view.statusMessage("Sorry, it seems like you've played almost all words <br>"
    + "Please select another game type, reset played words or you can try again");
    return -1
}

function checkMatches (enteredValue, possibleSynonymsArray) {

    for (i=0; i < possibleSynonymsArray.length; i++) {
        if (possibleSynonymsArray[i] === enteredValue) {
            return i
        }
    }
    return -1;
    // todo add possibility to extend user vocabluary
    // todo add possibility to stop game and see possible answers
}

function spellcheck (taskWordNo, enteredValue) {
    // TODO Spellcheck:
    // todo 1. send entered Value to YandexSpellchecker
    // todo 2. recieve possible alternatives
    // todo 3. compare synonyms of taskWordNo with recievedAlternatives
}

var currentRoundCache = (function () {
    var successfulWordsEntered = [],
        roundResult = 0;

    return {
        successfulWordEntered: function (word) {
            successfulWordsEntered.push(word);
            ++roundResult;
        },

        reset: function(){
            successfulWordsEntered = [];
            roundResult = 0;
        },

        getSuccessfulWordsEntered: function() {
            return successfulWordsEntered
        },

        getRoundResult: function() {
            return roundResult
        }

    };
}());

function saveTextAsFile(textToWrite, targetFile, callback) {

    // todo load existing data file update it and then save whole thing

    //   var blob = new Blob(textToWrite, {type: "text/plain;charset=utf-8"});
    //   saveAs(blob, targetFile);


    /*
     var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
     var downloadLink = document.createElement("a");
     downloadLink.download = targetFile;
     downloadLink.innerHTML = "Download File";
     if (window.webkitURL != null)
     {
     // Chrome allows the link to be clicked
     // without actually adding it to the DOM.
     downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
     }
     else
     {
     // Firefox requires the link to be added to the DOM
     // before it can be clicked.
     downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
     downloadLink.onclick = destroyClickedElement;
     downloadLink.style.display = "none";
     document.body.appendChild(downloadLink);
     }

     downloadLink.click();
     }

     function destroyClickedElement(event)
     {
     document.body.removeChild(event.target);
     }

     */
}

function loadFileAsText(fileToLoad, targetVar, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent)
    {
        targetVar = fileLoadedEvent.target.result;
        callback()
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}



// INITIALIZATION - BEGIN



// INITIALIZATION - END



// DONE 1. login
// 2. draw game start, allow begin round, start counting rounds

// 2.2 todo ask Vova: shoud I change button onClick to mediator listeners to implement mediator pattern properly
// 3. todo after end of round output and save result, show it,
// 4. todo allow logout after each round
// 5. todo allow see additional functions:
//  todo 1) play only incorrect words
//  todo 2) see correct answers for incorrect or all played words
//  todo 3) see statistics
//  todo 4) re-login
// todo Global todos:
// todo G1 : login through nodeJS


// todo Discuss with Vova:
// todo V1: should I use facade to listen to buttons and facade module to pass info about buttons pressed
// todo to gameInterfaceModule



gameInterface.gameInitialization();

// todo del evrth under this. This all is for development purpose


fileManager.updateCache(playerSourceFile[1]);
fileManager.save();
fileManager.load();
//renderGameResults(playerData.read(playedGames), playerData.read(gamesResults), playerData.read(possibleResults));
playerData.set(fileManager.returnCache());
output(playerData.readWhole().playedGames);


//document.getElementById("playerName").value="Bill";
//layerPassword = document.getElementById("playerPassword").value="master";
//gameInterface.checkLogin();

console.log ("Ok");