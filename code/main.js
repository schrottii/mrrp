var ui = {
    header: document.getElementById("header"),
    leaderboardTable: document.getElementById("leaderboardTable"),
    scoreTeams: document.getElementById("scoreTeams"),
    scorePlayers: document.getElementById("scorePlayers"),
    scores: document.getElementById("scores"),
    scoresInfo: document.getElementById("scoresInfo"),
    scoresInfoMostRecent: document.getElementById("scoresInfoMostRecent"),
    patchnotes: document.getElementById("patchnotes"),
    seasonrules: document.getElementById("seasonrules"),
    lbSeason: document.getElementById("lbSeason")
};

function getTeam(name) {
    let lb = currentLB();

    for (let t in lb) {
        if (lb[t][0] == name) return lb[t];
        // [name, points, wood, stone, gold]
    }
}

// LEADERBOARD STUFF

let lbUpdated = false;

function currentLB() {
    // this is a bit nasty but alright...
    // we want to display the normal, complete leaderboard
    // unless we are currently doing an update, then it is saved into the temp lb, and that is displayed
    // this is better than re-calcing every point change onto the normal lb
    if (save.templb.length > 0) return save.templb;
    return save.leaderboard;
}

function addTeam() {
    // add a team to the leaderboard
    let lb = currentLB();
    let input = prompt("name,points,wood,stone,gold");
    input = input.split(",");

    let teamName = input[0];

    for (let t in save.leaderboard) {
        if (t[0] == teamName) return false;
    }
    for (let t in save.teams) {
        if (t[0] == teamName) return false;
    }

    let team = [];
    for (let i in input) {
        if (i >= 5) return false;
        team.push(input[i]);
    }

    lb.push(team);
    save.teams[teamName] = {
        name: teamName,
        logo: "",
        tiles: 0,
        players: {}
    };
    lbUpdated = false;
}

function editTeam(team, i) {
    // edit one square of a team, ie their name or wood
    // used when you typod something
    if (team == "false" || i == 0) return false;
    team = parseInt(team);

    let lb = currentLB();

    i -= 1;
    if (i == 0) i = 1;
    else if (i == 1) i = 0;

    let change = prompt(lb[team][0] + ": edit " + ["Name", "Points", "Wood", "Stone", "Gold"][i] + ": ");
    if (change != 0 && (change == null || change == false)) change = "";

    lbUpdated = false;
    lb[team][i] = change;
}

function teamLogo() {
    let teamName = prompt("Team name?");
    if (save.teams[teamName] == undefined) return false;

    let newLogo = prompt("New logo file name + extension? x or leave empty to remove");
    if (newLogo == "x") newLogo = "";

    save.teams[teamName].logo = newLogo;
    lbUpdated = false;
}

function removeTeam() {
    // remove a team from the leaderboard
    let name = prompt("Team name? (case insensitive)");
    let lb = currentLB();

    for (let t in lb) {
        if (lb[t][0].toLowerCase() == name.toLowerCase()) {
            lb.splice(t, 1);

            lbUpdated = false;
            return true;
        }
    }
    return false;
}

function getLeaderboard() {
    // for lb table rendering
    // teams are saved as [name, points, wood, stone, gold]
    let lb = [];
    let clb = currentLB();

    sortLeaderboard();

    for (let t in clb) {
        // every team
        let team = clb[t];

        while (team.length < 5) {
            team.push("");
        }

        // pos, points, team name, wood, stone, gold
        lb.push([(parseInt(t) + 1), team[1], renderTeamName(team[0]), team[2], team[3], team[4]]);
    }

    return lb;
}

function sortLeaderboard() {
    // this sorts the leaderboard (points, descending)
    // built-in sort function wouldn't do the trick
    let lbUnsorted = [];
    let lbSorted = [];
    let lowest = 99999999;
    let lowestID = -1;
    let clb = currentLB();

    let isTemp = save.templb.length > 0 ? true : false;

    if (save.templb.length > 0) console.log("sorting temp lb");
    else console.log("sorting leaderboard");

    for (let t in clb) {
        lbUnsorted.push(clb[t]);
    }

    // SORT
    let sortLength = lbUnsorted.length;
    while (lbSorted.length < sortLength) {
        // find lowest
        for (let t in lbUnsorted) {
            if (parseInt(lbUnsorted[t][1]) < lowest) {
                lowest = parseInt(lbUnsorted[t][1]);
                lowestID = t;
            }
        }

        // add and reset
        lbSorted.unshift(lbUnsorted[lowestID]);
        lbUnsorted.splice(lowestID, 1);
        lowestID = -1;
        lowest = 99999999;
    }

    console.log("sorted: " + lbSorted);

    if (isTemp) save.templb = lbSorted;
    else save.leaderboard = lbSorted;
    lbUpdated = false;
}

function calcTileHours(score) {
    // unholy time calc thing
    let timeA = save.recentTime;
    let timeB = score[1].split(":"); // dd, hh, mm
    if (timeA == "" || timeA == undefined) timeA = prompt("When was the previous score? (dd:hh:mm)").split(":");
    for (let t in timeA) timeA[t] = parseInt(timeA[t]);
    for (let t in timeB) timeB[t] = parseInt(timeB[t]);

    let hours = 0;
    if (timeA[0] == timeB[0]) {
        // same day
        hours = timeB[1] - timeA[1] + ((timeB[2] - timeA[2]) / 60);
    }
    else {
        // different days
        // either next month (cba to account for month lengths) or next day
        if (timeB[0] == 1 && (timeA[0] >= 28)
            || timeB[0] == timeA[0] + 1) hours = (timeB[1] + 24) - timeA[1] + ((timeB[2] - timeA[2]) / 60);
        else hours = 420;
    }

    save.recentTime = timeB; // do we really want this changed here, and every time?
    return hours;
}

// UPDATE STUFF
function showTeamPlayers(team) {
    let render = "";
    let player;

    for (let pl in save.teams[team].players) {
        player = save.teams[team].players[pl];
        console.log(pl, player)
        render = render + "<button onclick='addScore(`" + team + "`, `" + player.name + "`)'>" + player.name + "</button>";
    }

    render = render + "<button onclick='createPlayer(`" + team + "`)'>Create Player</button>";

    ui.scorePlayers.innerHTML = render;
}

function createPlayer(team) {
    let name = prompt("Player name?");
    if (name == "" || name == undefined || name == false) return false;
    if (save.teams[team].players[name] != undefined) {
        alert("This player already exists for this team!");
        return false;
    }

    if (save.teams[team].players == undefined) save.teams[team].players = {};
    save.teams[team].players[name] = {
        name: name,
        tiles: 0,
        points: 0
    }

    showTeamPlayers(team);
}

function addScore(team, player) {
    // select team, then provide extra info
    let teamsLatest = getLeaderboard();
    for (let t in teamsLatest) {
        if ((teamsLatest[t][2].includes("/>") ? teamsLatest[t][2].split("/>")[1] : teamsLatest[t][2]) == team) {
            teamsLatest = teamsLatest[t];
            break;
        }
        if (t == teamsLatest.length - 1) {
            // reached last one and it wasnt correct either
            alert("Add this team before giving it points!");
            return false;
        }
    }

    // ask for new score, showing syntax, then last tile's time, then this team's resources
    let score = prompt("time (dd:hh:mm),wood,stone,gold (x=same)\n"
        + save.recentTime[0] + ":" + save.recentTime[1] + ":" + save.recentTime[2]
        + "," + teamsLatest[3] + "," + teamsLatest[4] + "," + teamsLatest[5]);

    if (score == false || score == "" || score == undefined) return false;
    score = score.split(",");
    if (score.length < 4) return false;

    // replace x's with previous
    for (let s = 1; s <= 3; s++) {
        if (score[s].substr(0, 2) == "x+") score[s] = parseInt(getTeam(team)[s + 1]) + parseInt(score[s].split("x+")[1]);
        else if (score[s] == "x" || score[s] == "") score[s] = getTeam(team)[s + 1];
    }

    // check validity
    for (let s = 1; s <= 3; s++) {
        if (score[s] > teamsLatest[2 + s] * 9 || score[s] < teamsLatest[2 + s] / 9 || score[s] == 0) {
            let isCorrect = confirm("Previous: " + teamsLatest[2 + s] + "\nNew: " + score[s] + "\nIs this correct? Continue? (" + ["", "Wood", "Stone", "Gold"][s] + ")");
            if (isCorrect === false) return false;
        }
    }

    // add team name to first place
    score.unshift(team);

    // calculate points
    let points = calculatePoints(score);

    // score: [points, name, time, wood, stone, gold]
    score.unshift(points);
    console.log(score);

    // add this score to the update we are doing
    save.update.push(score);
    updateTempLB(score);

    save.teams[team].tiles++;
    save.teams[team].players[player].tiles++;
    save.teams[team].players[player].points += points;

    // hide players of team, so next team can be clicked without confusion
    ui.scorePlayers.innerHTML = "";
}

function updateTempLB(score) {
    // create
    if (save.templb.length == 0) {
        for (let l in save.leaderboard) {
            save.templb[l] = [];
            for (let ll in save.leaderboard[l]) {
                save.templb[l][ll] = save.leaderboard[l][ll];
            }
        }
    }

    // add
    // score: [points, name, time, wood, stone, gold]
    let teamName = score[1];
    let teamID = -1;

    for (let t in save.templb) {
        if (save.templb[t][0] == teamName) teamID = t;
    }

    if (teamID == -1) return false;
    save.templb[teamID][1] = (parseInt(save.templb[teamID][1]) + parseInt(score[0])) + ""; // add points
    // update wood, stone, gold
    save.templb[teamID][2] = score[3];
    save.templb[teamID][3] = score[4];
    save.templb[teamID][4] = score[5];

    // update scores list
    updateScores();

    console.log(teamName, save.templb[teamID], score);
    lbUpdated = false;
}

function renderTeamName(teamname) {
    // team syntax: name, logo, players
    if (save.teams == undefined && save.leaderboard.length > 0) {
        save.teams = {};
        for (let team of save.leaderboard) {
            // it was originally gonna be an array, but the past few months i went from
            // making everything hyper space optimized (caring about every byte, as much as you can in JS)
            // to "some more space but better readability is better" and while
            // as an array it fitted the rest of mrrp, really, this is better than ["name", ""?, [[],...]]
            save.teams[team[0]] = {
                name: team[0],
                logo: "",
                tiles: 0,
                players: {}
            };
        }
    }

    let team = save.teams[teamname];
    if (team == undefined) return "";

    return (team.logo != "" ? ("<img src='images/teams/" + team.logo + "' class='teamImage' />") : "") + team.name;
}

var copyableScores = false;
function toggleCopyable() {
    copyableScores = !copyableScores;
    updateScores();
}

var scoresDisplayFormat = "all";
function changeScoresDisplay(newFormat) {
    scoresDisplayFormat = newFormat;
    updateScores();
}

function updateScores() {
    if (save.update.length == 0) {
        ui.scores.innerHTML = "";
        return false;
    }

    let render = "";
    let score;

    // POINTS
    if (scoresDisplayFormat == "points" || scoresDisplayFormat == "all") {
        for (let s in save.update) {
            // go thru list of scores, short format
            score = save.update[s];
            render = render + score[1] + " +" + score[0] + (s == save.update.length - 1 ? "" : ", ");
        }
    }

    if (scoresDisplayFormat == "all") render = render + "<br /><br />";

    // POINTS
    if (scoresDisplayFormat == "milestones" || scoresDisplayFormat == "all") {
        let teamScores = {};
        for (let t in save.leaderboard) {
            teamScores[save.leaderboard[t][0]] = parseInt(save.leaderboard[t][1]);
        }

        let oldScore;
        let newScore;
        let isBig = false;
        let isFirst = true;

        for (let s in save.update) {
            score = save.update[s]; // what they gain
            oldScore = teamScores[score[1]];
            newScore = (oldScore + parseInt(score[0]));

            if (Math.floor(newScore / 25) > Math.floor(teamScores[score[1]] / 25)) {
                // every 25
                isBig = (Math.floor(newScore / 25) % 4) == 0;
                render = render + (!isFirst ? "<br />" : "")
                    + (isBig ? "**" : "")
                    + score[1] + " has reached " + (Math.floor(newScore / 25) * 25) + " points :tada:"
                    + (isBig ? "**" : "");
                isFirst = false;
            }

            if ((newScore % 1000 >= 777 && oldScore % 1000 < 777) || newScore.toString().includes("777")) {
                render = render + (!isFirst ? "<br />" : "") + ":slot_machine:"
                    + score[1] + " has reached "
                    + (newScore.toString().includes("777") ? newScore : Math.floor(newScore / 1000) * 1000 + 777)
                    + " points :slot_machine:";
                isFirst = false;
            }

            teamScores[score[1]] += parseInt(score[0]);
        }

        // dc formatting in html
        if (!copyableScores) {
            render = render.replaceAll(":**", ":</b>");
            render = render.replaceAll("**", "<b>");
            render = render.replaceAll(":tada:", "<img src='images/tada.png' height='24px'>");
            render = render.replaceAll(":slot_machine:", "<img src='images/slot_machine.png' height='24px'>");
        }
    }

    if (scoresDisplayFormat == "all") render = render + "<br /><br />";

    if (scoresDisplayFormat == "sheetformat" || scoresDisplayFormat == "all") {
        let sep = ";";

        for (let s in save.update) {
            score = save.update[s];
            // date    time    team    tile    wood +1000        stone
            // score: [points, name, time, wood, stone, gold]
            // time    team    points    wood    stone    gold
            render = render + score[2].split(":")[0] + "-" + score[2].split(":")[1] + ":" + score[2].split(":")[2]
                + sep + score[1] + sep + score[0]
                + sep + score[3] + sep + score[4] + sep + score[5] + "<br />";
        }
    }

    ui.scoresInfo.innerHTML = save.update.length + " new scores" + ((save.templb.length == 0) ? " (unsaved)" : " (saved)");
    ui.scoresInfoMostRecent.innerHTML = save.update[save.update.length - 1];
    ui.scores.innerHTML = render;
}

function saveUpdate() {
    console.log("saving update onto lb");
    if (save.templb.length == 0) return false;

    save.leaderboard = [];
    for (let l in save.templb) {
        save.leaderboard[l] = save.templb[l];
    }
}

function clearUpdate() {
    save.templb = [];
    save.update = [];
    lbUpdated = false;
}

// CORE STUFF

function numberWithCommas(x) {
    // blatantly stole this, thx ovie flowie
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateUI() {
    // UI updating at 15 FPS

    renderLeaderboard();
}

// setup
ui.header.innerHTML = "MRRP " + VERSION;
renderSeason();
generatePatchNotes();

saveLoadBackup();

setInterval("updateUI()", 1000 / 15);
setInterval("saveBackup()", 1000);