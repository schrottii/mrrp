var season = 11;

var rulesBySeason = [
/* season 1 */ `
Welcome to the new map game "Forest races"!
The goal is to be the first team who will take their car to the announced coordinates on the map

The winner team is choosing the next coordinates and is not taking part in the next race (you can choose only empty tiles with no cars on them)

To prove your team was the first, just post a screenshot where your team's car will be in the blue square and the right coordinates will be shown (like on the example)

This game is for fun but not for prize,  just show other teams who is the fastest!
`,
/* season 2 */ `
Racing rules:
- To win a point, drive your car on the current goal tile, post a screenshot and write the next goal tile (or send it as a screenshot)
- Goal tiles must be empty
- Do not select very easy or very hard tiles to keep it fair
- The winner team can't take part for the next round
- No cheating, obviously
`,
/* season 3 */ `
Racing rules: [UPDATED - Season 3]
- To win a point, drive your car on the current goal tile, post a screenshot,  generate and write the next goal tile
- You must generate the next goal tile with the generator linked in the pins (send evidence)
- The winner team can't take part for the next round
- No cheating, obviously
`,
/* season 4 */ `
Racing rules: [UPDATED - Season 4]
- To win a point, drive your car on one of the **three** current goal tiles, post a screenshot with the tile and team name visible, generate and write the next goal tiles
- Generate **three** goal tiles with the generator linked in the pins (send evidence)
- The winner team can't take part for the next round
- No cheating
`,
/* season 5 */ `
Racing rules: [UPDATED - Season 5]
- To win a point, drive your car ON the current goal tile, post a screenshot with the tile and team name visible, and another team has to be right next to your car, BOTH get points generate and write the next goal tile
- Generate one goal tiles with the generator linked in the pins (send evidence)
- The winner teams can't take part for the next round
- No cheating
`,
/* season 6 */ `
Racing rules: [UPDATED - Season 6]
- To win a point, drive your car ON one of the current goal tiles, post a screenshot with the tile and team name visible, get a point and generate a new one with https://cubruce1103.github.io/tile-select/  .   The winner team can't get their own goal tile.
- If, after 24 hours, nobody has gathered the new tile, another team (that is not the latest winner that submitted the current goal) can generate *another* goal tile with the link above. This team is not allowed to get the goal tile they generated, but other teams, including the previous winner, are.
- No collecting points from goal coords your team has generated
- No cheating
`,
/* season 7 */ `
Racing rules: [UPDATED - Season 7]
- To win a point, drive your car ON the current goal tile, post a screenshot with the tile and team name visible, get a point and generate a new one with https://cubruce1103.github.io/tile-select/  .   The winner team can't get their own goal tile.
- If you collect the tile less than 12 hours after it was generated, you get 2x points!
- No cheating
`,
/* season 8 */ `
Racing rules: [UPDATED - Season 8]
- When you enter Season 8, you have to post your team's resources
- To win a point, drive your car ON the current goal tile (by a different team), post a screenshot with the tile and team name visible, and generate a new one with https://cubruce1103.github.io/tile-select/  .  Also provide a screenshot of your resources, to get the extra point(s) 
- You get 1 point per tile. An extra point if you didn't collect Gold. An extra point if you didn't collect Stone. An extra point if you gained 1000 Wood. (These are based on your resources ss)
- If you collect the tile less than 24 hours after it was generated, you get 2x points!
- No cheating
`,
/* season 9 */ `
Racing rules: [UPDATED - Season 9]
- When you enter Season 9, you have to post your team's resources
- To win a point, drive your car ON the current goal tile (by a different team), post a screenshot with the tile and team name visible, and generate a new one with https://cubruce1103.github.io/tile-select/  .  Also provide a screenshot of your resources, to get the extra point(s) 
- You get 1 point per tile. An extra point if you collected 1 :stone: or less, another if 1 :gold: or less, another if you gained 500 :wood~1:. (These are based on your resources ss)
- If you collect the tile less than 24 hours after it was generated, you get 2x points!
- No cheating, no alts used for the race in other teams
`,
/* season 10 */ `
**[Season 10]** Racing rules:
- When you enter Season 10, you have to post your team's resources
- To win a point, drive your car ON the current goal tile (by a different team), post a screenshot with the tile and team name visible, and generate a new one with https://cubruce1103.github.io/tile-select/  .  Also provide a screenshot of your resources, to get the extra point(s) 
- You get 1 point per tile. An extra point if you collected 0 :stone:, another if you collected 0 :gold:, but if one of them went up by only 1, you get 1 of those 2 extra points. Another extra point if you gained 500 :wood~1: since your last tile. (These are based on your resources ss) (= 8 points max.)
- If you collect the tile less than 24 hours after it was generated, you get 2x points!
- No cheating, no alts used for the race in other teams
- **New:** sometimes, Demon Tiles spawn. They are much harder, but optional (normal tiles continue as usual). You get 20 points for getting a demon tile (and do not generate a new one). Extra +5 points if it spawned less than 2 hours ago, and extra +5 points if the last tile your team got was less than 4 hours ago. (= 30 points max.)
`,
/* season 11 */ `
**[Season 11]** __Racing rules:__
- **Enter:** When you enter Season 11, you have to post your team's resources before going for the first tile. The team leader does not need to be involved.
- **Score:** To win a point, drive your car ON the current goal tile (by a different team), post a screenshot with the tile and team name visible, and generate a new one with https://cubruce1103.github.io/tile-select/  .  Also provide a screenshot of your resources, to get the extra point(s). If the goal tile is blocked by a non-participating car, any adjacent tiles are valid.
- **Points:** You get 1 base point per tile. An extra point if you collected 0 :stone:, another if you collected 0 :gold:, but if only one of them went up by only 1, you get at least 1 of those 2 extra points. Another extra point if you gained 500 :wood~1: since your last tile. If you collect the tile in less than 12 hours, you get 2x points! (These are based on your resources ss, = 8 points max.)
- **Fairness:** No cheating, no alts used for the race in other teams.
- **Demons:** Sometimes, Demon Tiles spawn. They are much harder, but optional (normal tiles continue as usual). You get 20 points for getting a demon tile (and do not generate a new tile). Extra +5 points if it spawned less than 4 hours ago, and extra +5 points if the last tile your team got was less than 4 hours ago. (= 30 points max.)
`
];

function renderSeason() {
    ui.lbSeason.innerHTML = "(Season " + season + ")";
    ui.seasonrules.innerHTML = rulesBySeason[season - 1].replaceAll("\n", "<br />");
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
        case 10:
            return calculateSeason10(score);
        case 11:
            return calculateSeason10(score);
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

function calculateSeason10(score) {
    let team = score[0];
    let points = 1;

    // 1000 wood, max 1 stone, max 1 gold (only one of them 1) rules
    let prev = getTeam(team);
    if (parseInt(score[2]) >= parseInt(prev[2]) + 500) points += 1;

    let max1 = false;
    if (score[3] == prev[3]) points += 1;
    if (score[3] == parseInt(prev[3]) + 1) {
        points += 1;
        max1 = true;
    }
    if (score[4] == prev[4] || (score[4] == parseInt(prev[4]) + 1) && max1 === false) points += 1;

    // x2 if <24h (season 11: 12h)
    let hours = calcTileHours(score);
    if (season == 11 && hours < 24) points *= 2;
    else if (season == 10 && hours < 12) points *= 2;

    return points;
}