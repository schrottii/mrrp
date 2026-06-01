function generateTableRow(contents, team = false, head = false, bgColor = "") {
    // ONE row of a table
    let render = "<tr>";
    if (head == false) head = "td";
    else head = "th";

    for (let c in contents) {
        render = render + "<" + head + " onclick='editTeam(`" + team + "`, `" + c + "`)' style='background-color: " + bgColor + "; text-align: " + (c == 2 ? "left" : "center") + "'>" + (c < 3 ? contents[c] : numberWithCommas(contents[c])) + "</" + head + ">";
    }

    render = render + "</tr>";
    return render;
}

function generateTable(header, contentRows, bgColors = []) {
    // generates the header, then the rows, format is: ([], [[], [], ...])
    let table = "<table>";
    let bgColor;

    if (header != false) table = table + generateTableRow(header, false, true);

    for (let cR in contentRows) {
        bgColor = bgColors[cR] != undefined ? bgColors[cR] : "";
        table = table + generateTableRow(contentRows[cR], cR, false, bgColor);
    }

    table = table + "</table>";
    return table;
}

function renderLeaderboard() {
    // renders the leaderboard with header and its rows (no pages yet)
    if (lbUpdated) return false;
    let LB = currentLB();
    if (LB.length == 0) {
        ui.leaderboardTable.innerHTML = "";
        return false;
    }

    // render table
    ui.leaderboardTable.innerHTML = generateTable(
        /* headers */
        ["#", "<img src='images/tcp.png' width=24>", "Team", "<img src='images/wood.png' width=24>", "<img src='images/stone.png' width=24>", "<img src='images/gold.png' width=24>"],
        /* actual content */
        getLeaderboard(),
        ["rgb(255, 255, 180)", "rgb(220, 255, 255)", "rgb(255, 200, 200)"]);



    // render the teams that can score
    let teamNames = [];
    let render = "";

    // grab team names
    for (let t in LB) {
        teamNames.push(LB[t][0]);
    }
    // render team buttons
    for (let t in teamNames) {
        render = render + "<button onclick='showTeamPlayers(`" + teamNames[t] + "`)'>" + renderTeamName(teamNames[t]) + "</button>";
    }
    ui.scoreTeams.innerHTML = render;

    updateScores();
    lbUpdated = true;
}

let playerLBType = 2;

function renderPlayerLeaderboard() {
    if (save.teams.length == 0) {
        ui.leaderboardTable.innerHTML = "";
        return false;
    }
    
    // 0 = normal, 1 = players combined, 2 = back to normal
    playerLBType = (playerLBType + 1) % 3;
    if (playerLBType == 2) {
        lbUpdated = false;
        renderLeaderboard();
        return false;
    }

    let allPlayers = [];
    let player;
    let skip;

    for (let t in save.teams) {
        for (let p in save.teams[t].players) {
            player = save.teams[t].players[p];

            if (playerLBType == 1) {
                skip = false;

                // combine?
                for (let p2 in allPlayers) {
                    if (allPlayers[p2][2].includes(player.name)) {
                        allPlayers[p2][1] += player.points;
                        allPlayers[p2][3] += player.tiles;
                        allPlayers[p2][4] += player.demontiles != undefined ? player.demontiles : 0;

                        skip = true;
                        break;
                    }
                }

                if (skip) continue;
            }

            allPlayers.push([1, player.points, 
                playerLBType == 0 ? t + ": " + player.name : player.name,
                player.tiles, (player.points / player.tiles).toFixed(1), player.demontiles != undefined ? player.demontiles : 0]);
        }
    }

    for (let i = 0; i < allPlayers.length; i++) {
        for (let j = i; j < allPlayers.length; j++) {
            if (allPlayers[j][1] > allPlayers[i][1]) {
                let temp = allPlayers[i];
                console.log(allPlayers[i], allPlayers[j]);
                allPlayers[i] = allPlayers[j];
                allPlayers[j] = temp;
                console.log(allPlayers[i], allPlayers[j]);
            }
        }
    }
    for (let i = 0; i < allPlayers.length; i++) {
        allPlayers[i][0] = (i + 1);
    }

    ui.leaderboardTable.innerHTML = generateTable(
        /* headers */
        ["#", "<img src='images/tcp.png' width=24>", "Player", "Tiles", "p/t", "Demon Tiles"],
        /* actual content */
        allPlayers,
        ["rgb(255, 255, 180)", "rgb(220, 255, 255)", "rgb(255, 200, 200)"]);
}