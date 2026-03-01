var season = 9;

function renderSeason() {
    ui.lbSeason.innerHTML = "(Season " + season + ")";
}

function changeSeason() {
    let newSeason = prompt("Which season? (Supported: 8, 9)");
    newSeason = parseInt(newSeason);
    if (newSeason < 1 || newSeason > 9) return false;

    season = newSeason;
    renderSeason();
}

function calculatePoints(score) {
    console.log(score);
    // score format: team name, time, wood, stone, gold

    switch (season) {
        default:
            return 0;
        case 8:
            return calculateSeason8(score);
        case 9:
            return calculateSeason9(score);
    }
}

function calculateSeason8(score) {
    let team = score[0];
    let points = 1;

    // 1000 wood, no stone, no gold rules
    if (parseInt(score[2]) >= parseInt(getTeam(team)[2]) + 1000) points += 1;
    if (score[3] == getTeam(team)[3]) points += 1;
    if (score[4] == getTeam(team)[4]) points += 1;

    // x2 if <24h
    let hours = calcTileHours(score);
    if (hours < 24) points *= 2;

    return points;
}

function calculateSeason9(score) {
    let team = score[0];
    let points = 1;

    // 1000 wood, max 1 stone, max 1 gold rules
    let prev = getTeam(team);
    if (parseInt(score[2]) >= parseInt(prev[2]) + 500) points += 1;
    if (score[3] == prev[3] || score[3] == parseInt(prev[3]) + 1) points += 1;
    if (score[4] == prev[4] || score[4] == parseInt(prev[4]) + 1) points += 1;

    // x2 if <24h
    let hours = calcTileHours(score);
    if (hours < 24) points *= 2;

    return points;
}