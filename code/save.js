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