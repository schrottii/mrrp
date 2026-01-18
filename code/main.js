var ui = {
    header: document.getElementById("header"),
    leaderboardTable: document.getElementById("leaderboardTable"),
    scoreTeams: document.getElementById("scoreTeams"),
    scores: document.getElementById("scores"),
    scoresInfo: document.getElementById("scoresInfo"),
    patchnotes: document.getElementById("patchnotes")
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

    let team = [];
    for (let i in input) {
        if (i >= 5) return false;
        team.push(input[i]);
    }

    lbUpdated = false;
    lb.push(team);
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

        lb.push([(parseInt(t) + 1), team[1], team[0], team[2], team[3], team[4]]);
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

// UPDATE STUFF
function addScore(team) {
    // select team, then provide extra info
    let score = prompt("time (dd:hh:mm),wood,stone,gold (x=same)");
    score = score.split(",");
    if (score.length < 4) return false;

    for (let s = 1; s <= 3; s++) {
        if (score[s] == "x" || score[s] == "") score[s] = getTeam(team)[s + 1];
    }

    score.unshift(team);

    // calculate points
    let points = 1;
    if (parseInt(score[2]) >= parseInt(getTeam(team)[2] + 1000)) points += 1;
    if (score[3] == getTeam(team)[3]) points += 1;
    if (score[4] == getTeam(team)[4]) points += 1;

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

    console.log(timeA, timeB, hours);
    if (hours < 24) points *= 2;

    // score: [points, name, time, wood, stone, gold]
    score.unshift(points);
    console.log(score);

    // add this score to the update we are doing
    save.recentTime = timeB;
    save.update.push(score);
    updateTempLB(score);
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

var copyableScores = false;
function toggleCopyable() {
    copyableScores = !copyableScores;
    updateScores();
}

function updateScores() {
    if (save.update.length == 0) {
        ui.scores.innerHTML = "";
        return false;
    }

    let render = "";
    let score;

    for (let s in save.update) {
        // go thru list of scores, short format
        score = save.update[s];
        render = render + score[1] + " +" + score[0] + (s == save.update.length - 1 ? "" : ", ");
    }

    render = render + "<br />";
    let teamScores = {};
    for (let t in save.leaderboard) {
        teamScores[save.leaderboard[t][0]] = parseInt(save.leaderboard[t][1]);
    }

    let oldScore;
    let newScore;
    let isBig = false;
    for (let s in save.update) {
        score = save.update[s]; // what they gain
        oldScore = teamScores[score[1]];
        newScore = (oldScore + parseInt(score[0]));

        if (Math.floor(newScore / 25) > Math.floor(teamScores[score[1]] / 25)) {
            // every 25
            isBig = (Math.floor(newScore / 25) % 4) == 0;
            render = render + "<br />"
                + (isBig ? "**" : "")
                + score[1] + " has reached " + (Math.floor(newScore / 25) * 25) + " points :tada:"
                + (isBig ? "**" : "");
        }

        if ((newScore % 1000 >= 777 && oldScore % 1000 < 777) || newScore.toString().includes("777")) {
            render = render + "<br />:slot_machine:"
                + score[1] + " has reached "
                + (newScore.toString().includes("777") ? newScore : Math.floor(newScore / 1000) * 1000 + 777)
                + " points :slot_machine:";
        }

        teamScores[score[1]] += parseInt(score[0]);
    }

    // sheets
    render = render + "<br /><br />";
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

    // dc formatting in html
    if (!copyableScores) {
        render = render.replaceAll(":**", ":</b>");
        render = render.replaceAll("**", "<b>");
        render = render.replaceAll(":tada:", "<img src='images/tada.png' height='24px'>");
        render = render.replaceAll(":slot_machine:", "<img src='images/slot_machine.png' height='24px'>");
    }

    ui.scoresInfo.innerHTML = save.update.length + " new scores" + ((save.templb.length == 0) ? " (unsaved)" : " (saved)");
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
generatePatchNotes();
saveLoadBackup();
setInterval("updateUI()", 1000 / 15);
setInterval("saveBackup()", 1000);