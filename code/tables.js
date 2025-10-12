function generateTableRow(contents, team = false, head = false) {
    // ONE row of a table
    let render = "<tr>";
    if (head == false) head = "td";
    else head = "th";

    for (let c in contents) {
        render = render + "<" + head + " onclick='editTeam(`" + team + "`, `" + c + "`)' style='text-align: " + (c == 2 ? "left" : "center") + "'>" + (c < 3 ? contents[c] : numberWithCommas(contents[c])) + "</" + head + ">";
    }

    render = render + "</tr>";
    return render;
}

function generateTable(header, contentRows) {
    // generates the header, then the rows, format is: ([], [[], [], ...])
    let table = "<table>";

    if (header != false) table = table + generateTableRow(header, false, true);

    for (let cR in contentRows) {
        table = table + generateTableRow(contentRows[cR], cR);
    }

    table = table + "</table>";
    return table;
}

function renderLeaderboard() {
    // renders the leaderboard with header and its rows (no pages yet)
    if (lbUpdated) return false;
    if (currentLB().length == 0) return false;

    ui.leaderboardTable.innerHTML = generateTable(
        ["#", "<img src='images/tcp.png' width=16>", "Team", "<img src='images/wood.png' width=16>", "<img src='images/stone.png' width=16>", "<img src='images/gold.png' width=16>"],
        getLeaderboard());

    // render the teams that can score
    let teamNames = [];
    let render = "";
    for (let t in currentLB()) {
        teamNames.push(currentLB()[t][0]);
    }
    for (let t in teamNames) {
        render = render + "<button onclick='addScore(`" + teamNames[t] + "`)'>" + teamNames[t] + "</button>";
    }
    ui.scoreTeams.innerHTML = render;

    updateScores();

    lbUpdated = true;
}