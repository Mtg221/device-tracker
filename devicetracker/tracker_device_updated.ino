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
  sendATCommand("AT+CGNSINF");
  delay(1000);
  
  // If we don't have valid GPS data, send with last known or default values
  if (!gpsValid) {
    Serial.println("No valid GPS data, sending default coordinates");
    latitude = 0.0;
    longitude = 0.0;
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
    // Extract GPS data from the response
    Serial.println("GPS Data: " + response);
    // Parsing would go here to extract latitude, longitude, etc.
  }
}