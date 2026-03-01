function generateTableRow(contents, team = false, head = false, bgColor = "") {
    // ONE row of a table
    let render = "<tr>";
    if (head == false) head = "td";
    else head = "th";

    for (let c in contents) {
        render = render + "<" + head + " onclick='editTeam(`" + team + "`, `" + c + "`)' style='background-color: " + bgColor + ";text-align: " + (c == 2 ? "left" : "center") + "'>" + (c < 3 ? contents[c] : numberWithCommas(contents[c])) + "</" + head + ">";
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