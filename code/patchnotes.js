const VERSION = "v1.1";

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
MRRP v1.1 2025-01-18
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
- Added Setting to export to a file (ie MRRP_backup_777P_2025-01-18)
`
}