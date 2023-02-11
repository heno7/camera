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
    sessionStorage.setItem("currentCamId", camId);
    const recordsMeta = await getRecordsMeta(camId);
    let html = "";
    for (let recordMeta of recordsMeta) {
      const [timeStart, timeEnd] = recordMeta.split(".")[0].split("_");
      // const [timeStart, timeEnd] = [1675932667084, 1675933027700];

      const start = new Date(parseInt(timeStart));
      const end = new Date(parseInt(timeEnd));
      const chooseAmOrPm = (hour) => (hour <= 12 ? "am" : "pm");
      const startPatern = `${start.getHours()}.${start.getMinutes()}.${start.getSeconds()} ${chooseAmOrPm(
        start.getHours()
      )}`;
      const endPatern = `${end.getHours()}.${end.getMinutes()}.${end.getSeconds()} ${chooseAmOrPm(
        end.getHours()
      )}`;
      html += `<div class='record-meta' id='${recordMeta}'>${startPatern}  ----  ${endPatern}</div>`;
    }
    recordViews.innerHTML = html;
    handlePlayRecords();
  });
}

function handlePlayRecords() {
  const recordViews = document.getElementById("record-views");
  recordViews.addEventListener("click", (e) => {
    const storeId = sessionStorage.getItem("currentCamId");
    const tk = sessionStorage.getItem("tk");
    const videoMeta = e.target.getAttribute("id");
    // location.href = `/client/records/pro_store_${storeId}/${videoMeta}`;
    let html = `
    <video width="640" height="480" controls>
      <source src="/client/records/pro_store_${storeId}/${videoMeta}?tk=${tk}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <button id='exit'>Exit</button>
    `;
    recordViews.innerHTML = html;
    handleExit();
  });
}

function handleExit() {
  const exitBtn = document.getElementById("exit");
  exitBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const camId = sessionStorage.getItem("currentCamId");
    const roomLists = document.getElementById("room-lists");
    roomLists.querySelector(`#cam_${camId}`).click();
  });
}

async function getRecordsMeta(camId) {
  try {
    const tk = sessionStorage.getItem("tk");
    const response = await fetch(`/client/records/meta?tk=${tk}`);
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
