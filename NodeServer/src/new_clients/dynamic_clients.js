let ws;

window.addEventListener("load", async (e) => {
  let params = new URL(document.location).searchParams;
  let tk = params.get("tk");
  sessionStorage.setItem("tk", tk);
  const domainServer = await getDomain();
  window.domainServer = domainServer;
  const WSS_URL = `wss://${window.domainServer}`;
  ws = new WebSocket(WSS_URL);
  firstInitWebsocket(ws);
  await initNow();
});

async function initNow() {
  const config = await getCameraConfigs();
  window.config = config;
  setFalseCamEnabler(config);
  renderCamViews(config);
  getCamViews(config);
}

async function getDomain() {
  try {
    const tk = sessionStorage.getItem("tk");
    const result = await fetch(`/client/domain?tk=${tk}`);
    const data = await result.json();
    if (data.domain) return data.domain;
    throw new Error("Invalid domain!");
  } catch (error) {
    console.log(error);
  }
}

// const WSS_URL = `wss://${window.domainServer}`;
// ws = new WebSocket(WSS_URL);

function firstInitWebsocket(ws) {
  ws.onopen = () => {
    // console.log(`Connected to ${WSS_URL}`);
    ws.send("WEB_CLIENT");
  };

  ws.onclose = () => {
    onWsClosed();
    console.log("try to connect wss");
  };

  ws.onmessage = onWsMessage;
}

// ws.onopen = () => {
//   console.log(`Connected to ${WSS_URL}`);
//   ws.send("WEB_CLIENT");
// };

function onWsClosed() {
  ws = new WebSocket(WSS_URL);
  ws.onopen = async () => {
    console.log(`Connected to ${WSS_URL}`);
    ws.send("WEB_CLIENT");
    await initNow();
  };
  ws.onmessage = onWsMessage;
  ws.onclose = onWsClosed;
}

// ws.onclose = () => {
//   onWsClosed();
//   console.log("try to connect wss");
// };

async function getCameraConfigs() {
  const tk = sessionStorage.getItem("tk");
  const url = `/client/configs?tk=${tk}`;
  try {
    const response = await fetch(url);
    const config = await response.json();
    // console.log(config);
    return config;
  } catch (error) {
    console.log(error);
  }
}
const enableCams = {};
// setFalseCamEnabler();

function renderCamViews(config) {
  const camViewPlace = document.getElementById("views");
  let html = "";
  for (let id in config) {
    html += generateCamView({ cameraId: id, roomName: config[id] });
  }
  camViewPlace.innerHTML = html;
}

// renderCamViews();

function generateCamView(info) {
  const html = `<div class="card">
 <img id="ESP32-${info.cameraId}" src="" />
 <h2>
   <b
     >${info.roomName}
     <span
       class="dot"
       id="cam_${info.cameraId}_red_dot"
       style="visibility: hidden"
     ></span
   ></b>
 </h2>
 <button
   class="button"
   id="cam_${info.cameraId}_enabler"
   onclick="buttonFunc('cam_${info.cameraId}_enabler')"
 >
   play
 </button>
 <button
   class="button button-save"
   id="cam_${info.cameraId}_save"
   onclick="saveFunc('cam_${info.cameraId}_enabler')"
 >
   save to image
 </button>
</div>`;
  return html;
}

function setFalseCamEnabler(config) {
  for (let id in config) {
    enableCams[`cam_${id}_enabler`] = false;
  }
}

function buttonFunc(source) {
  const x = document.getElementById(source);
  if (x.textContent.trim() === "play") {
    x.textContent = "pause";
    enableCams[source] = true;
  } else {
    x.textContent = "play";
    enableCams[source] = false;
  }
}

const camViews = {};
// getCamViews();

function getCamViews(config) {
  for (let id in config) {
    camViews[`image_${id}`] = document.getElementById(`ESP32-${id}`);
  }
}

let imageFrame, urlObject;

// ws.onmessage = onWsMessage;
async function onWsMessage(message) {
  const arrayBuffer = message.data;

  const blobObj = new Blob([arrayBuffer]);
  const buf = await blobObj.arrayBuffer();
  const uint8 = new Uint8Array(buf.slice(12, 13));
  let currentCam = uint8[0];
  if (currentCam < 10) currentCam = "0" + currentCam;
  // console.log("current Cam: ", currentCam);

  imageFrame = camViews[`image_${currentCam}`];
  document.getElementById(`cam_${currentCam}_red_dot`).style.visibility =
    "visible";
  if (!enableCams[`cam_${currentCam}_enabler`]) return;
  if (urlObject) {
    URL.revokeObjectURL(urlObject);
  }
  urlObject = URL.createObjectURL(blobObj);
  imageFrame.src = urlObject;
}

function saveFunc(source) {
  let blobUrl;
  const camId = source.slice(4, 6);
  // console.log(camViews[`image_${camId}`]);
  // console.log(camId);
  blobUrl = camViews[`image_${camId}`].src;

  if (blobUrl.indexOf("blob") == -1) {
    return;
  }
  let fileName = getFomattedTime(window.config[camId]) + ".jpeg";
  forceDownload(blobUrl, fileName);
}

function getFomattedTime(camInfo) {
  var today = new Date();
  var y = today.getFullYear();
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return camInfo + "-" + y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

function forceDownload(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}
