#include <HardwareSerial.h>

// Device configuration
#define DEVICE_ID "TRACK001"  // Change this for each device
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

// Convex endpoint
const char* CONVEX_URL = "https://fantastic-chipmunk-934.eu-west-1.convex.cloud";
const char* CONVEX_ENDPOINT = "/tracker/update";

// Network settings
const char* APN = "internet";  // Replace with your carrier's APN
const char* GPRS_USER = "";
const char* GPRS_PASS = "";

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
  
  // Send AT command to enable GPS
  sendATCommand("AT+CGNSPWR=1");
  delay(1000);
  
  // Set GPS mode
  sendATCommand("AT+CGNSSEQ=\"RMC\"");
  delay(1000);
  
  Serial.println("GPS initialized, waiting for fix...");
}

void connectToNetwork() {
  Serial.println("Connecting to network...");
  
  // Check if SIM is ready
  if (!sendATCommand("AT+CPIN?")) {
    Serial.println("SIM not ready");
    return;
  }
  
  // Wait for network registration
  Serial.println("Waiting for network registration...");
  while (!sendATCommand("AT+CREG?")) {
    delay(1000);
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
  SerialAT.println("AT+CGNSINF");
  delay(1000);
  
  // Read and parse the GPS response
  String gpsResponse = "";
  unsigned long startTime = millis();
  while (millis() - startTime < 2000) { // Wait up to 2 seconds
    while (SerialAT.available()) {
      char c = SerialAT.read();
      gpsResponse += c;
    }
    if (gpsResponse.length() > 0 && gpsResponse.indexOf("OK") != -1) {
      break; // Got response
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
  Serial.println("Sending HTTP request to Convex...");
  
  // Create JSON data
  String jsonData = "{\"deviceId\":\"" + String(DEVICE_ID) + "\",\"latitude\":" + String(lat, 6) + 
                    ",\"longitude\":" + String(lon, 6) + ",\"battery\":" + String(battery) + "}";
  
  // Send HTTP request via SIM7000G
  sendATCommand("AT+CHTTPSSTART");
  delay(1000);
  
  // Prepare HTTP request
  String httpRequest = "POST " + String(CONVEX_ENDPOINT) + " HTTP/1.1\r\n";
  httpRequest += "Host: fantastic-chipmunk-934.eu-west-1.convex.cloud\r\n";
  httpRequest += "Content-Type: application/json\r\n";
  httpRequest += "Content-Length: " + String(jsonData.length()) + "\r\n\r\n";
  httpRequest += jsonData;
  
  // Send the HTTP request
  bool result = sendATCommand("AT+CHTTPSSEND=" + String(httpRequest.length()));
  
  if (result) {
    Serial.println("HTTP request sent successfully");
    return true;
  } else {
    Serial.println("Failed to send HTTP request");
    return false;
  }
}

bool sendATCommand(String command) {
  SerialAT.println(command);
  delay(1000);
  
  // Read response
  String response = "";
  while (SerialAT.available()) {
    response += (char)SerialAT.read();
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
  while (SerialAT.available()) {
    response += (char)SerialAT.read();
  }
  
  Serial.println("Battery Response: " + response);
  
  // Parse battery level from response
  // Response format: +CBC: <bcs>,<bcl>,<voltage>
  // <bcl> is battery level percentage (0-100)
  int bclStart = response.indexOf(",");
  if (bclStart != -1) {
    bclStart = response.indexOf(",", bclStart + 1);
    if (bclStart != -1) {
      int bclEnd = response.indexOf(",", bclStart + 1);
      if (bclEnd == -1) {
        bclEnd = response.indexOf("\n");
      }
      String bclStr = response.substring(bclStart + 1, bclEnd);
      return bclStr.toInt();
    }
  }
  
  return 0; // Unknown battery level
}

void processATResponse() {
  // Process any unsolicited responses from the modem
  while (SerialAT.available()) {
    String response = SerialAT.readString();
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
    int pos = start + 9; // Length of "+CGNSINF:"
    
    // Split by commas to get fields
    int fieldCount = 0;
    int fieldStarts[20];
    int fieldEnds[20];
    
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
    
    // Field 3 is latitude (index 3), field 4 is longitude (index 4)
    // +CGNSINF: runStatus,fixStatus,dateTime,latitude,longitude,...
    if (fieldCount > 4) {
      // Extract latitude (field 3)
      String latStr = response.substring(fieldStarts[3], fieldEnds[3]);
      latStr.trim();
      
      // Extract longitude (field 4)
      String lonStr = response.substring(fieldStarts[4], fieldEnds[4]);
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