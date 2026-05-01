#include <HardwareSerial.h>

// Function prototypes
void setupGPS();
void connectToNetwork();
bool sendATCommand(String command);
int getBatteryLevel();
double parseLatitude(String gpsResponse);
double parseLongitude(String gpsResponse);
bool sendDataToBackend(double lat, double lon, int battery);

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

// Backend endpoint
const char* BACKEND_URL = "https://tlhqgdvnnswmhtljmuut.supabase.co";
const char* BACKEND_ENDPOINT = "/rest/v1/devices";

// Network settings
const char* APN = "internet";  // Replace with your carrier's APN
const char* GPRS_USER = "";
const char* GPRS_PASS = "";

// Tracking settings
unsigned long TRACKING_INTERVAL = 30000; // 30 seconds
unsigned long lastTrackTime = 0;

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
  // Read any unsolicited AT responses
  while (SerialAT.available()) {
    String response = SerialAT.readString();
    if (response.length() > 0) {
      Serial.println("Unsolicited response: " + response);
    }
  }
  
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
  
  // Check GPS status
  Serial.println("Checking GPS status...");
  sendATCommand("AT+CGNSINF");
  
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
  
  // Check network connection status
  sendATCommand("AT+CSQ");
  delay(500);
}

void sendTrackingData() {
  Serial.println("=== Sending tracking data ===");
  
  // Get current GPS data
  double latitude = 0.0;
  double longitude = 0.0;
  int battery = getBatteryLevel();
  
  // Try to get GPS fix
  Serial.println("Requesting GPS data from SIM7000G...");
  SerialAT.println("AT+CGNSINF");
  delay(2000);
  
  // Read response
  String gpsResponse = "";
  while (SerialAT.available()) {
    gpsResponse += (char)SerialAT.read();
  }
  
  if (gpsResponse.length() > 0) {
    Serial.print("GPS Response: ");
    Serial.println(gpsResponse);
    
    // Parse GPS data to get actual coordinates
    latitude = parseLatitude(gpsResponse);
    longitude = parseLongitude(gpsResponse);
    
    Serial.print("Parsed coordinates: ");
    Serial.print(latitude, 6);
    Serial.print(", ");
    Serial.println(longitude, 6);
  } else {
    Serial.println("No GPS response received");
  }
  
  // Send data to backend
  Serial.println("Attempting to send data to backend...");
  if (sendDataToBackend(latitude, longitude, battery)) {
    Serial.println("Data sent successfully to backend!");
  } else {
    Serial.println("Failed to send data to backend");
  }
}

bool sendDataToBackend(double lat, double lon, int battery) {
  Serial.println("=== Preparing to send data to backend ===");
  Serial.print("Coordinates: ");
  Serial.print(lat, 6);
  Serial.print(", ");
  Serial.println(lon, 6);
  Serial.print("Battery: ");
  Serial.println(battery);
  
// Create simple JSON data
  String jsonData = "{\"deviceId\":\"" + String(DEVICE_ID) + "\",\"latitude\":" + String(lat, 6) + 
                ",\"longitude\":" + String(lon, 6) + ",\"battery\":" + String(battery) + "}";
  
  Serial.println("Full JSON data to send: " + jsonData);
  
  Serial.println("Data to send: " + jsonData);
  
  // Try to send HTTP request using the working approach
  Serial.println("Initializing HTTP connection...");
  SerialAT.println("AT+HTTPINIT");
  delay(1000);
  
  // Set up HTTP parameters
  Serial.println("Setting HTTP parameters...");
  sendATCommand("AT+HTTPPARA=\"CID\",1");
  delay(500);
  sendATCommand("AT+HTTPPARA=\"URL\",\"" + String(BACKEND_URL) + String(BACKEND_ENDPOINT) + "\"");
  delay(500);
  sendATCommand("AT+HTTPPARA=\"CONTENT\",\"application/json\"");
  delay(500);
  
  // Send data
  Serial.println("Sending data...");
  sendATCommand("AT+HTTPDATA=" + String(jsonData.length()) + ",5000");
  delay(1000);
  SerialAT.println(jsonData);
  delay(1000);
  
  // Send HTTP request
  Serial.println("Sending HTTP request...");
  if (sendATCommand("AT+HTTPACTION=1")) {
    Serial.println("HTTP request sent successfully to backend!");
    sendATCommand("AT+HTTPTERM");
    delay(500);
    return true;
  } else {
    Serial.println("Failed to send HTTP request to backend");
    sendATCommand("AT+HTTPTERM");
    delay(500);
    return false;
  }
}

bool sendATCommand(String command) {
  SerialAT.println(command);
  delay(1000);
  
  // Read response
  String response = "";
  unsigned long timeout = millis() + 5000; // 5 second timeout
  while (millis() < timeout) {
    while (SerialAT.available()) {
      response += (char)SerialAT.read();
    }
    if (response.indexOf("OK") != -1 || response.indexOf("ERROR") != -1) {
      break;
    }
    delay(10);
  }
  
  Serial.println("AT Response (" + command + "): " + response);
  
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

double parseLatitude(String gpsResponse) {
  // Simple parsing for latitude from +CGNSINF response
  int gpsStart = gpsResponse.indexOf("+CGNSINF:");
  if (gpsStart != -1) {
    // Find commas to parse the fields
    int pos = gpsStart;
    int commaPositions[20];
    int commaCount = 0;
    
    // Find all comma positions after +CGNSINF:
    for (int i = 0; i < 20; i++) {
      int nextComma = gpsResponse.indexOf(',', pos);
      if (nextComma == -1) break;
      commaPositions[commaCount++] = nextComma;
      pos = nextComma + 1;
    }
    
    // +CGNSINF format: <GNSS run status>,<Fix status>,<UTC date & time>,<Latitude>,<Longitude>,...
    // Latitude is field 3 (index 2 in zero-based array, but we need to account for the first field)
    // Actually, latitude is at index 3 in the comma-separated values (0-indexed)
    if (commaCount > 3) {
      int latStart = commaPositions[2] + 1;  // After 3rd comma
      int latEnd = commaPositions[3];        // Before 4th comma
      String latStr = gpsResponse.substring(latStart, latEnd);
      latStr.trim(); // Remove any whitespace
      
      if (latStr.length() > 0 && latStr != ",") {
        return latStr.toDouble();
      }
    }
  }
  return 0.0;
}

double parseLongitude(String gpsResponse) {
  // Simple parsing for longitude from +CGNSINF response
  int gpsStart = gpsResponse.indexOf("+CGNSINF:");
  if (gpsStart != -1) {
    // Find commas to parse the fields
    int pos = gpsStart;
    int commaPositions[20];
    int commaCount = 0;
    
    // Find all comma positions after +CGNSINF:
    for (int i = 0; i < 20; i++) {
      int nextComma = gpsResponse.indexOf(',', pos);
      if (nextComma == -1) break;
      commaPositions[commaCount++] = nextComma;
      pos = nextComma + 1;
    }
    
    // Longitude is field 4 (index 3 in zero-based array)
    if (commaCount > 4) {
      int lonStart = commaPositions[3] + 1;  // After 4th comma
      int lonEnd = commaPositions[4];        // Before 5th comma
      String lonStr = gpsResponse.substring(lonStart, lonEnd);
      lonStr.trim(); // Remove any whitespace
      
      if (lonStr.length() > 0 && lonStr != ",") {
        return lonStr.toDouble();
      }
    }
  }
  return 0.0;
}