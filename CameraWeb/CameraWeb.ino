#include "esp_camera.h"
#include <WiFi.h>
// #include <ArduinoWebsockets.h>
#include <WebSockets2_Generic.h>
#define CAMERA_MODEL_AI_THINKER
#include "camera_pins.h"

const char* ssid = "Trienngat";
const char* password = "trienngat1234";
const char* websocket_server_host = "wss://192.168.1.130:443/";

// using namespace websockets;
using namespace websockets2_generic;
WebsocketsClient client;
bool isWebSocketConnected;

void onEventsCallback(WebsocketsEvent event, String data){
  if(event == WebsocketsEvent::ConnectionOpened){
    Serial.println("Connection Opened");
    isWebSocketConnected = true;
  }else if(event == WebsocketsEvent::ConnectionClosed){
    Serial.println("Connection Closed");
    isWebSocketConnected = false;
    webSocketConnect();
  }
}

// const char ssl_ca_cert[] PROGMEM = \
// "-----BEGIN CERTIFICATE-----\n" \
// "MIIFCTCCAvGgAwIBAgIUen3MMjFyk1Wo525cznTzT2zHFvkwDQYJKoZIhvcNAQEL\n" \
// "BQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTIzMDIwMTA4MTM0N1oXDTI0MDIw\n" \
// "MTA4MTM0N1owFDESMBAGA1UEAwwJbG9jYWxob3N0MIICIjANBgkqhkiG9w0BAQEF\n" \
// "AAOCAg8AMIICCgKCAgEAzGiMT6clHOtzIHckt/Ku/DKA8Cd9tLZPJWNtMPtL8Kzg\n" \
// "F2TncIp/rbc1KJvMJhgsHd5mZV1/g7ozbf9VEPErmejkIku/1Ge2E9l5/IUFr4lQ\n" \
// "Bybh6mglAxnd+eVMiv/PMRPpOHgRDnA6HN1J60RtaUP0V1v8bewYO70NMsDbYbKi\n" \
// "tAWdreMh5ofbZfz5h9yTzj3QlL/yGBgsU/uH45B2D9VdHdkf2JdOUyQtL4DORTKM\n" \
// "+zKmGpdpzMeHMY+iCE72FF0vxjR4ZSBaNFG0aC0A9cxcrFxmXVr6K6wk2+2738iD\n" \
// "cnBqk9vo2okTvbB2h19QpoHwAadTXi8XcBFrQdL2LPSgjz1AJy1ZBIwRz4cTk6CV\n" \
// "IZ6LMi3g/CY+9KCRpEm2HsfIemj01zmyQ5zJ17C7iZCFAxgXxzRwPPNSeeR3J+BQ\n" \
// "N2xWy/uieuJaH1PUwoPYFd6I3rvHH0OdtXgBLrd4WEIp/nRcFYPsFiCh2/McH+Lv\n" \
// "Ys9wbX9KJMK9jelMThtyuqALDy6zAB40UoxrimMoFYmKrd+E2Pz7xulv6PsrAMQ8\n" \
// "FkM0dMbx5lzThy/1LoCtV1uV+cCjUeamr+S/jvRNkaHdUdg47GIRxNdvFfc3eFeh\n" \
// "BU24uaVncbV8aYGiFWbzTDZzL8uN6HOAqsfp/MYG/A54/OmxA8xmI+AJZ/BEBpkC\n" \
// "AwEAAaNTMFEwHQYDVR0OBBYEFE0E5wsNW57aat/+DO+LnjVvVHCVMB8GA1UdIwQY\n" \
// "MBaAFE0E5wsNW57aat/+DO+LnjVvVHCVMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZI\n" \
// "hvcNAQELBQADggIBAFgA0Fjjnpb6RChSiVTZovY0+95YUPgBXcnF+60lH7CRU5pS\n" \
// "xROHRZBD2fzCh1Om1+U74+9WjWLOZm2lySO7tAEgeg+HtbWI/nq9GhtReYPtPNzN\n" \
// "0jSeKtRJL6WNMNSffmYNCixe3xbRC7NU1xUF3tmVamv63TeOFYXe3jzms4HSF2rl\n" \
// "jpYW4KoFzuZGHjWhXyafjK17pqRmQhxJDRRYmToAifRvlHF9LYqch1V3sjWTO5gh\n" \
// "XVvzLkqCdy5UzW0tRXk8kZQZ1PIPWcomXLiZKV0ThAWYgt5YR4H8B58wqVGYTD0h\n" \
// "7qoHO2eeAuoPS6LZy6hNDMs31sCe95BV6IzinQqYQgYt2+XhEXxob6mrHX0zSbct\n" \
// "LkmrJ0a/HT0HX7aKVBz805IYAtK+5zpqw12EHhHMOzaCJhRRZXdwseMEXJ2eqt10\n" \
// "Uk/sN0Qke2Whs3BsodJV+oAwenSN6vBfO+vTeTDClQn1wbeIvuX6c6AYahskvE42\n" \
// "pEgcVvaFhnuZJTdweHk3M8zDne7JeM5T4qAhumZbJBiT9q2fXwDjf5rNTnBb9XfS\n" \
// "f+qTpsfKFIM38AHpr62c3+qyPb+JlD3UNHEx1iceD/43sNCxTnFVFAyufn7ueTgx\n" \
// "+9Ktamu3s2wytSVVUCet5bHo3tQtSm6Q9Z9O0YLxBZjgrQTJ4sjqf/Vgm+jn\n" \
// "-----END CERTIFICATE-----\n";



void setup() {
  isWebSocketConnected = false;
  Serial.begin(115200);
  Serial.println();

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA;
  config.jpeg_quality = 40;
  config.fb_count = 2;

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
 

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  client.onEvent(onEventsCallback);
  client.setInsecure();
  // client.setCACert(ssl_ca_cert);
  webSocketConnect();
}

void webSocketConnect(){
   while(!client.connect(websocket_server_host)){
    delay(500);
    Serial.print("Failed to connect websocket\n");
  }
  Serial.println("Websocket Connected!");
  client.send("Camera_01");
}

void loop() {

  if(client.available()){
    client.poll();
  }
  
  if(!isWebSocketConnected) return;
  
  camera_fb_t *fb = esp_camera_fb_get();
  if(!fb){
    Serial.println("Camera capture failed");
    esp_camera_fb_return(fb);
    return;
  }

  if(fb->format != PIXFORMAT_JPEG){
    Serial.println("Non-JPEG data not implemented");
    return;
  }
  
  fb->buf[12] = 0x01; //FIRST CAM
  // fb->buf[12] = 0x02; //SECOND CAM

  client.sendBinary((const char*) fb->buf, fb->len);
  esp_camera_fb_return(fb);
}