window.addEventListener("load", (e) => {
  showNow();
});

const nav = document.getElementById("nav");
nav.addEventListener("click", (e) => {
  const tab = e.target.textContent;
  if (tab === "Record") {
    showRecords();
  } else if (tab === "Now") {
    showNow();
  } else if (tab === "Config") {
    showConfigs();
  }
});

function showActiveTab(tabName) {
  const recordTab = document.getElementById("record");
  const nowTab = document.getElementById("now");
  const configTab = document.getElementById("config");

  const listTab = [recordTab, nowTab, configTab];

  for (let tab of listTab) {
    if (tab.textContent === tabName) {
      listTab.map((t) => {
        if (t === tab) return (tab.style.backgroundColor = "rgb(29, 179, 144)");
        t.style.backgroundColor = "rgba(0,0,0,0.2)";
      });
    }
  }
}

function showRecords() {
  const recordTab = document.getElementById("record");
  showActiveTab(recordTab.textContent);
  const views = document.getElementById("views");
  views.style.display = "none";
  const recordContainer = document.getElementById("record-container");
  recordContainer.style.display = "flex";
  const roomLists = document.getElementById("room-lists");
  const config = window.config;
  let html = "";
  for (let camId in config) {
    html += `<div class='record-cam' id='cam_${camId}'}>${config[camId]}</div>`;
  }
  roomLists.innerHTML = html;
  showRecordsByCamId();
  roomLists.firstElementChild.click();
}

function showActiveRecordCamTab(camId) {
  const config = window.config;
  const listOfTabs = [];
  for (let camId in config) {
    let tab = document.getElementById(`cam_${camId}`);
    listOfTabs.push(tab);
  }
  for (let tab of listOfTabs) {
    if (tab.getAttribute("id").slice(4) === camId) {
      listOfTabs.map((t) => {
        if (t === tab) return (tab.style.backgroundColor = "rgb(29, 179, 144)");
        t.style.backgroundColor = "rgba(0,0,0,0.2)";
      });
    }
  }
}

function showRecordsByCamId() {
  const roomLists = document.getElementById("room-lists");
  const recordViews = document.getElementById("record-views");
  roomLists.addEventListener("click", async (e) => {
    const camId = e.target.getAttribute("id").slice(4);
    showActiveRecordCamTab(camId);
    const recordsMeta = await getRecordsMeta(camId);
    let html = "";
    for (let recordMeta of recordsMeta) {
      const [timeStart, timeEnd] = recordMeta.split(".")[0].split("_");
      const start = new Date(parseInt(timeStart));
      const end = new Date(parseInt(timeEnd));
      const startPatern = `${start.getHours()}.${start.getMinutes()}.${start.getSeconds()}`;
      const endPatern = `${end.getHours()}.${end.getMinutes()}.${end.getSeconds()}`;
      html += `<div class='record-meta'>${startPatern}---${endPatern}</div>`;
    }
    recordViews.innerHTML = html;
  });
}

async function getRecordsMeta(camId) {
  try {
    const response = await fetch("/client/records/meta");
    const data = await response.json();
    return data[camId];
  } catch (error) {
    console.log(error);
  }
}

function showNow() {
  const nowTab = document.getElementById("now");
  showActiveTab(nowTab.textContent);
  const views = document.getElementById("views");
  views.style.display = "grid";
  const recordContainer = document.getElementById("record-container");
  recordContainer.style.display = "none";
}
