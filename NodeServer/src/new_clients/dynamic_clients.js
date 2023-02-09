window.addEventListener("load", async (e) => {
  let params = new URL(document.location).searchParams;
  let tk = params.get("tk");
  sessionStorage.setItem("tk", tk);
  const config = await getConfigs();
  window.config = config;
  setFalseCamEnabler(config);
  renderCamViews(config);
  getCamViews(config);
});

const WSS_URL = "wss://testfirst.ddns.net";
const ws = new WebSocket(WSS_URL);

ws.onopen = () => {
  console.log(`Connected to ${WSS_URL}`);
  ws.send("WEB_CLIENT");
};

// const config = {
//   1: "living room",
//   2: "dining room",
//   3: "yard",
// };

async function getConfigs() {
  const url = `/client/configs`;
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
  var x = document.getElementById(source);
  if (x.innerHTML === "Play") {
    x.innerHTML = "Pause";
    enableCams[source] = true;
  } else {
    x.innerHTML = "Play";
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

ws.onmessage = async (message) => {
  const arrayBuffer = message.data;

  const blobObj = new Blob([arrayBuffer]);
  const buf = await blobObj.arrayBuffer();
  const uint8 = new Uint8Array(buf.slice(12, 13));
  let currentCam = uint8[0];
  if (currentCam < 10) currentCam = "0" + currentCam;
  console.log("current Cam: ", currentCam);

  imageFrame = camViews[`image_${currentCam}`];
  document.getElementById(`cam_${currentCam}_red_dot`).style.visibility =
    "visible";
  if (!enableCams[`cam_${currentCam}_enabler`]) return;
  if (urlObject) {
    URL.revokeObjectURL(urlObject);
  }
  urlObject = URL.createObjectURL(blobObj);
  imageFrame.src = urlObject;
};
