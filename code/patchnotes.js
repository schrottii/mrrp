const VERSION = "v1.2";

function generatePatchNotes() {
    let current = patch_notes[VERSION];
    if (current == undefined) current = patch_notes[Object.keys(patch_notes).length - 1];

    ui.patchnotes.innerHTML = current.replaceAll("\n", "<br />");
}

const patch_notes = {
    "v1.0": `
- Release
`,
    "v1.1": `
MRRP v1.1 2026-01-18
-> Scores this update:
- Now shows amount of scores
- Now shows if they have been updated onto the table yet
- Changed "have" to "has" to better suit American English and the team working together

-> Scores formatting:
- Added bolded text every 100 points
- Added secret every ??? points
- Added images for the tada emoji and (secret) emoji, and displaying the bolded text directly
- Added "toggle copyable" button to swap between HTML (see line above) / Discord (copyable)

-> Other:
- Changed table colors (less bright, more green)
- Added lines to separate sections
- Added support for patch notes
- Added Setting to export to a file (ie MRRP_backup_777P_2026-01-18)
`,
    "v1.2": `
MRRP v1.2 2026-03-01
-> Teams:
- Added team logos (optional)
- Logos are shown in the leaderboard and team list (update points)
- Teams have their total tiles (scores) now tracked
- Team logos, total tiles and members are saved separately and differently from points/resources/leaderboard

-> Seasons:
- Added support for multiple Forest Race seasons
- For now, only Season 8 and the new Season 9 are supported
- Added calculations for Season 9

-> Players:
- Players for each team are now saved
- Their total points and tiles (scores) get tracked
- Clicking on a team now gives the players instead, with the option to add a player, click on one to add a score

-> Leaderboard:
- Added gold, silver, bronze colors for the top 3
- Increased size of points, wood, stone and gold images

-> Tools:
- Added tools section
- Add Team and Remove Team are here
- Added Hard Reset button
- Added Change Season button
- Added Add/Change Team Logo button

-> Other:
- Added max. width for the updated scores
`
}