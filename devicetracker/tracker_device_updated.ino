#include <HardwareSerial.h>

// Device configuration
#define DEVICE_ID "2AJYU-SIM7000G" // Unique device identifier
// To configure your device:
// 1. Change DEVICE_ID to a unique identifier for each tracker
// 2. Update APN settings for your cellular carrier
// 3. Ensure SIM card is properly inserted
// 4. Connect to power source (USB or battery)

// SIM7000G pins
#define MODEM_RST            5
#define MODEM_PWRKEY         4
#define MODEM_POWER_ON       23
#define MODEM_TX             27
#define MODEM_RX             26

// Serial communication
HardwareSerial SerialAT(1);

// Convex endpoint - Using Go relay server (same as bus-tracking-iot-main)
// Relay server forwards GPS data to Convex over HTTPS
// See: bus-tracking-iot-main/examples/HttpsBuiltlnPostConvex/HttpsBuiltlnPostConvex.ino
#define RELAY_HOST "24.144.96.134"
#define RELAY_PORT "8345"
#define RELAY_PATH "/gps"
#define DEVICE_ID "2AJYU-SIM7000G"  // Unique device identifier

// Network settings - APN for Free Mobile
const char* APN = "free";  // Free Mobile APN
const char* GPRS_USER = "free";  // Free Mobile username
const char* GPRS_PASS = "free";  // Free Mobile password

// Tracking settings
unsigned long TRACKING_INTERVAL = 30000; // 30 seconds
unsigned long lastTrackTime = 0;

// GPS data
double latitude = 0.0;
double longitude = 0.0;
int satelliteCount = 0;
bool gpsValid = false;
double speed = 0.0;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  SerialAT.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);
  
  // Initialize modem
  pinMode(MODEM_PWRKEY, OUTPUT);
  pinMode(MODEM_RST, OUTPUT);
  pinMode(MODEM_POWER_ON, OUTPUT);
  
  // Power on modem
  digitalWrite(MODEM_PWRKEY, LOW);
  digitalWrite(MODEM_RST, HIGH);
  digitalWrite(MODEM_POWER_ON, HIGH);
  delay(1000);
  
  Serial.println("Device tracker starting...");
  Serial.println("Device ID: " + String(DEVICE_ID));
  Serial.println("APN: " + String(APN));
  
  // Initialize GPS
  setupGPS();
  
  // Connect to network
  connectToNetwork();
  
  lastTrackTime = millis();
}

void loop() {
  // Process any incoming AT responses
  processATResponse();
  
  // Send tracking data at intervals
  if (millis() - lastTrackTime > TRACKING_INTERVAL) {
    sendTrackingData();
    lastTrackTime = millis();
  }
}

void setupGPS() {
  Serial.println("Initializing GPS...");

  // Power on GPS
  sendATCommand("AT+CGNSPWR=1");
  delay(1000);

  // Set GPS update rate to 1Hz (optional)
  sendATCommand("AT+CGNSINF=1");
  delay(1000);

  Serial.println("GPS initialized, waiting for fix...");
}

void connectToNetwork() {
  Serial.println("Connecting to network...");

  // Check if SIM is ready
  int retryCount = 0;
  while (!sendATCommand("AT+CPIN?") && retryCount < 3) {
    delay(1000);
    retryCount++;
  }
  if (retryCount >= 3) {
    Serial.println("SIM not ready or not responding");
    return;
  }

  // Wait for network registration
  Serial.println("Waiting for network registration...");
  retryCount = 0;
  while (retryCount < 30) { // Try for 30 seconds
    String response = "";
    sendATCommand("AT+CREG?");
    unsigned long startTime = millis();
    while (millis() - startTime < 1000) {
      while (SerialAT.available()) {
        char c = SerialAT.read();
        response += c;
      }
      if (response.indexOf("OK") != -1) break;
      delay(10);
    }
    
    // Check if registered (response contains +CREG: 0,1 or +CREG: 0,5)
    if (response.indexOf("+CREG: 0,1") != -1 || response.indexOf("+CREG: 0,5") != -1) {
      Serial.println("Network registered");
      break;
    }
    delay(1000);
    retryCount++;
  }

  // Set APN
  Serial.println("Setting APN...");
  sendATCommand("AT+CGSOCKCONT=1,\"IP\",\"" + String(APN) + "\"");
  delay(1000);

  // Activate PDP context
  Serial.println("Activating PDP context...");
  sendATCommand("AT+CGACT=1,1");
  delay(2000);

  // Check if connected
  if (sendATCommand("AT+CGATT?")) {
    Serial.println("Connected to network");
  } else {
    Serial.println("Failed to connect to network");
  }
}

void sendTrackingData() {
  Serial.println("Sending tracking data...");

  // Get GPS data directly from SIM7000G
  Serial.println("Requesting GPS data...");
  sendATCommand("AT+CGNSINF", 2000);

  // Read and parse the GPS response
  String gpsResponse = "";
  unsigned long startTime = millis();
  while (millis() - startTime < 2000) {
    while (SerialAT.available()) {
      char c = SerialAT.read();
      gpsResponse += c;
    }
    if (gpsResponse.indexOf("OK") != -1 || gpsResponse.indexOf("ERROR") != -1) {
      break;
    }
    delay(10);
  }

  // Parse GPS data if we got a response
  if (gpsResponse.length() > 0 && gpsResponse.indexOf("+CGNSINF:") != -1) {
    Serial.print("GPS Response: ");
    Serial.println(gpsResponse);
    parseGPSData(gpsResponse);
  } else {
    Serial.println("No valid GPS response");
    gpsValid = false;
  }

  // If we don't have valid GPS data, still send what we have (last known position)
  if (!gpsValid) {
    Serial.println("No GPS fix, sending last known coordinates");
    Serial.print("Last Lat: ");
    Serial.print(latitude, 6);
    Serial.print(", Lon: ");
    Serial.println(longitude, 6);
  }

  int battery = getBatteryLevel();

  Serial.print("Sending GPS: ");
  Serial.print(latitude, 6);
  Serial.print(", ");
  Serial.println(longitude, 6);

  // Send data to Convex
  if (sendDataToConvex(latitude, longitude, battery)) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Failed to send data");
  }
}

bool sendDataToConvex(double lat, double lon, int battery) {
  Serial.println("Sending GPS data to relay server...");

  // Build URL for relay server (plain HTTP GET, same as bus-tracking-iot-main)
  char url[256];
  snprintf(url, sizeof(url), 
    "http://%s:%s%s?latitude=%.6f&longitude=%.6f&speed=%.2f&altitude=0.0&device_id=%s&battery=%d",
    RELAY_HOST, RELAY_PORT, RELAY_PATH, lat, lon, speed, DEVICE_ID, battery);
  
  Serial.print("Relay URL: ");
  Serial.println(url);

  // End any existing HTTP session
  sendATCommand("AT+HTTPTERM", 2000);
  delay(500);

  // Initialize HTTP session
  sendATCommand("AT+HTTPINIT");
  if (!sendATCommand("AT+HTTPINIT", 3000)) {
    Serial.println("HTTP init failed");
    return false;
  }
  delay(500);

  // Set bearer (CID=1 for SAPBR)
  sendATCommand("AT+HTTPPARA=\"CID\",1");
  delay(500);

  // Set URL
  String urlCmd = String("AT+HTTPPARA=\"URL\",\"") + String(url) + String("\"");
  sendATCommand(urlCmd);
  delay(1000);

  // Execute HTTP GET
  sendATCommand("AT+HTTPACTION=0");
  
  // Wait for +HTTPACTION response
  String response = "";
  unsigned long startTime = millis();
  int statusCode = -1;
  
  while (millis() - startTime < 30000UL && statusCode == -1) {
    while (SerialAT.available()) {
      char c = SerialAT.read();
      response += c;
      if (c == '\n') {
        int idx = response.indexOf("+HTTPACTION:");
        if (idx >= 0) {
          // Parse status code: +HTTPACTION: 0,200,...
          int firstComma = response.indexOf(',', idx);
          if (firstComma != -1) {
            int secondComma = response.indexOf(',', firstComma + 1);
            if (secondComma != -1) {
              String codeStr = response.substring(firstComma + 1, secondComma);
              statusCode = codeStr.toInt();
            }
          }
        }
        response = "";
      }
    }
    if (statusCode != -1) break;
    delay(100);
  }

  // Terminate HTTP session
  sendATCommand("AT+HTTPTERM");
  delay(500);

  if (statusCode == 200 || statusCode == 201) {
    Serial.printf("GPS data sent successfully (HTTP %d)\n", statusCode);
    return true;
  } else {
    Serial.printf("Failed to send GPS data (HTTP %d)\n", statusCode);
    return false;
  }
}

bool sendATCommand(String command, unsigned long timeout = 1000) {
  SerialAT.println(command);
  
  // Read response with timeout
  String response = "";
  unsigned long startTime = millis();
  while (millis() - startTime < timeout) {
    while (SerialAT.available()) {
      char c = SerialAT.read();
      response += c;
      delay(10);
    }
    // Check if we got OK or ERROR
    if (response.indexOf("OK") != -1 || response.indexOf("ERROR") != -1) {
      break;
    }
  }

  Serial.println("AT Response: " + response);

  // Check if command was successful
  return response.indexOf("OK") != -1;
}

int getBatteryLevel() {
  // Query battery level from SIM7000G module
  SerialAT.println("AT+CBC");
  delay(1000);

  // Read response
  String response = "";
  unsigned long startTime = millis();
  while (millis() - startTime < 1000) {
    while (SerialAT.available()) {
      char c = SerialAT.read();
      response += c;
      delay(10);
    }
    if (response.indexOf("OK") != -1 || response.indexOf("ERROR") != -1) {
      break;
    }
  }

  Serial.println("Battery Response: " + response);

  // Parse battery level from response
  // Response format: +CBC: <bcs>,<bcl>,<voltage>
  // <bcl> is battery charge level (0-100)
  int bclIndex = response.indexOf("+CBC:");
  if (bclIndex != -1) {
    // Find first comma (after bcs)
    int firstComma = response.indexOf(",", bclIndex + 5);
    if (firstComma != -1) {
      // Find second comma (after bcl)
      int secondComma = response.indexOf(",", firstComma + 1);
      if (secondComma != -1) {
        String bclStr = response.substring(firstComma + 1, secondComma);
        bclStr.trim();
        int bcl = bclStr.toInt();
        return bcl;
      }
    }
  }

  return 0; // Unknown battery level
}

void processATResponse() {
  // Process any unsolicited responses from the modem
  if (SerialAT.available()) {
    String response = "";
    unsigned long startTime = millis();
    while (millis() - startTime < 100) {
      while (SerialAT.available()) {
        char c = SerialAT.read();
        response += c;
      }
      if (SerialAT.available() == 0) {
        delay(10);
      }
    }
    
    if (response.length() > 0) {
      Serial.println("Modem response: " + response);

      // Check for GPS data in response
      if (response.indexOf("+CGNSINF:") != -1) {
        parseGPSData(response);
      }
    }
  }
}

void parseGPSData(String response) {
  // Parse GPS data from +CGNSINF response
  // Format: +CGNSINF: <GNSS run status>,<Fix status>,<UTC date & time>,<Latitude>,<Longitude>,...
  int start = response.indexOf("+CGNSINF:");
  if (start != -1) {
    // Find the position after "+CGNSINF:"
    int pos = response.indexOf(':', start) + 1;
    
    // Skip any whitespace after colon
    while (pos < response.length() && (response.charAt(pos) == ' ' || response.charAt(pos) == '\t')) {
      pos++;
    }

    // Split by commas to get fields
    int fieldCount = 0;
    int fieldStarts[20];
    int fieldEnds[20];
    
    // Initialize arrays
    for (int i = 0; i < 20; i++) {
      fieldStarts[i] = 0;
      fieldEnds[i] = 0;
    }

    // Mark field positions
    fieldStarts[0] = pos;
    for (int i = pos; i < response.length() && fieldCount < 19; i++) {
      if (response.charAt(i) == ',') {
        fieldEnds[fieldCount] = i;
        fieldCount++;
        fieldStarts[fieldCount] = i + 1;
      }
    }
    fieldEnds[fieldCount] = response.length();
    fieldCount++;

    // Field 4 is latitude (index 4), field 5 is longitude (index 5)
    // +CGNSINF: runStatus,fixStatus,dateTime,latitude,longitude,satellites,hdop,altitude,speed,...
    if (fieldCount > 5) {
      // Extract latitude (field 4)
      String latStr = response.substring(fieldStarts[4], fieldEnds[4]);
      latStr.trim();

      // Extract longitude (field 5)
      String lonStr = response.substring(fieldStarts[5], fieldEnds[5]);
      lonStr.trim();

      // Check if we have valid data (not empty)
      if (latStr.length() > 0 && lonStr.length() > 0) {
        double newLat = latStr.toDouble();
        double newLon = lonStr.toDouble();

        // Only update if coordinates are valid (not 0,0)
        if (newLat != 0.0 || newLon != 0.0) {
          latitude = newLat;
          longitude = newLon;
          gpsValid = true;
          Serial.print("Updated GPS - Lat: ");
          Serial.print(latitude, 6);
          Serial.print(", Lon: ");
          Serial.println(longitude, 6);
        }
      }
    }
  }
}