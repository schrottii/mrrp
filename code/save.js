var save = {
    leaderboard: [],
    update: [],
    templb: [],
    recentTime: ""
}

var emptySave = {};

for (let s in save) {
    emptySave[s] = save[s];
}

// functions used for saving and loading
function saveSave() {
    let ssave = JSON.stringify(save);
    ssave = btoa(ssave);

    return ssave;
}

function saveLoad(ssave) {
    ssave = atob(ssave);
    ssave = JSON.parse(ssave);

    save = Object.assign({}, emptySave, ssave);
    lbUpdated = false;
}

function saveExport() {
    let ssave = saveSave();
    navigator.clipboard.writeText(ssave);
    alert("Copied to clipboard. meow");
}

function saveImport() {
    let ssave = prompt("Insert savedata");
    if (ssave == null || ssave == undefined || ssave == false) return false;

    saveLoad(ssave);
}

function saveBackup() {
    localStorage.setItem("MRRP", saveSave());
}

function saveLoadBackup() {
    let ssave = localStorage.getItem("MRRP");
    if (ssave == null || ssave == undefined || ssave == false) return false;

    saveLoad(ssave);
}

function today() {
    let date = new Date();
    let month = (date.getUTCMonth() + 1);
    if (month < 10) month = "0" + month;
    return date.getUTCFullYear() + "-" + month + "-" +  date.getUTCDate();
}

function saveExportFile() {
    let temporaryFile = document.createElement('a');
    temporaryFile.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveSave()));
    temporaryFile.setAttribute('download', "MRRP_backup_" + save.leaderboard[0][1] + "P_" + today() + ".txt");

    temporaryFile.style.display = 'none';
    document.body.appendChild(temporaryFile);

    temporaryFile.click();

    document.body.removeChild(temporaryFile);
}