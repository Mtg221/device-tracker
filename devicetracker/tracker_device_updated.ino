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

// Supabase configuration
#define SUPABASE_URL "https://tlhqgdvnnswmhtljmuut.supabase.co"
#define SUPABASE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaHFnZHZubnN3bWh0bGptdXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU3ODc2NSwiZXhwIjoyMDkzMTU0NzY1fQ.qRAyDyXclLYQibJtjPwkJRv3iUR7bwXBF7fX0Df0qrM"
#define DEVICE_ID "2AJYU-SIM7000G" // Unique device identifier

// Network settings - APN for Orange Senegal
const char* APN = "internet"; // Orange Senegal APN
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

  // Power on GPS
  Serial.println("Powering on GPS...");
  if (sendATCommand("AT+CGNSPWR=1")) {
    Serial.println("GPS powered on successfully");
  } else {
    Serial.println("Failed to power on GPS");
  }
  delay(1000);

  // Set GPS update rate to 1Hz
  Serial.println("Setting GPS update rate...");
  if (sendATCommand("AT+CGNSINF=1")) {
    Serial.println("GPS update rate set to 1Hz");
  } else {
    Serial.println("Failed to set GPS update rate");
  }
  delay(1000);

  // Check initial GPS status
  Serial.println("Checking initial GPS status...");
  sendATCommand("AT+CGNSINF");
  delay(1000);

  Serial.println("GPS initialized, waiting for fix...");
}

void connectToNetwork() {
  Serial.println("Connecting to network...");

  // Check if SIM is ready
  Serial.println("Checking SIM status...");
  int retryCount = 0;
  while (!sendATCommand("AT+CPIN?") && retryCount < 3) {
    Serial.println("SIM not ready, retrying...");
    delay(1000);
    retryCount++;
  }
  if (retryCount >= 3) {
    Serial.println("SIM not ready or not responding after 3 attempts");
    return;
  }

  // Wait for network registration
  Serial.println("Waiting for network registration...");
  retryCount = 0;
  bool registered = false;
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
      Serial.println("Network registered successfully");
      registered = true;
      break;
    }
    delay(1000);
    retryCount++;
  }

  if (!registered) {
    Serial.println("Failed to register to network after 30 seconds");
    return;
  }

  // Set APN
  Serial.println("Setting APN...");
  if (sendATCommand("AT+CGSOCKCONT=1,\"IP\",\"" + String(APN) + "\"")) {
    Serial.println("APN set successfully");
  } else {
    Serial.println("Failed to set APN");
  }
  delay(1000);

  // Activate PDP context
  Serial.println("Activating PDP context...");
  if (sendATCommand("AT+CGACT=1,1")) {
    Serial.println("PDP context activated successfully");
  } else {
    Serial.println("Failed to activate PDP context");
  }
  delay(2000);

  // Check if connected
  if (sendATCommand("AT+CGATT?")) {
    Serial.println("Connected to network successfully");
  } else {
    Serial.println("Failed to connect to network");
  }
}

void sendTrackingData() {
  Serial.println("=== Sending tracking data ===");

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

  Serial.print("Raw GPS Response: ");
  Serial.println(gpsResponse);

  // Parse GPS data if we got a response
  if (gpsResponse.length() > 0 && gpsResponse.indexOf("+CGNSINF:") != -1) {
    Serial.println("Parsing GPS data...");
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

  Serial.print("Final data to send - GPS Valid: ");
  Serial.print(gpsValid ? "YES" : "NO");
  Serial.print(", Lat: ");
  Serial.print(latitude, 6);
  Serial.print(", Lon: ");
  Serial.print(longitude, 6);
  Serial.print(", Battery: ");
  Serial.println(battery);

  // Send data to Supabase
  if (sendDataToSupabase(latitude, longitude, battery)) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Failed to send data");
  }
  
  Serial.println("=== End tracking data ===");
}

bool sendDataToSupabase(double lat, double lon, int battery) {
  Serial.println("Sending GPS data to Supabase...");

  // Build JSON payload for upsert
  String jsonData = String("{\"device_id\":\"") + DEVICE_ID + 
                  String("\",\"latitude\":") + String(lat, 6) +
                  String(",\"longitude\":") + String(lon, 6) +
                  String(",\"speed\":") + String(speed, 1) +
                  String(",\"battery\":") + String(battery) +
                  String(",\"status\":\"running\"}");
  
  // For upsert operation
  String upsertData = String("{\"on_conflict\":\"device_id\"}";

  Serial.print("Sending to Supabase: ");
  Serial.println(jsonData);

  // End any existing HTTP session
  sendATCommand("AT+HTTPTERM", 2000);
  delay(500);

  // Initialize HTTP session
  if (!sendATCommand("AT+HTTPINIT", 3000)) {
    Serial.println("HTTP init failed");
    sendATCommand("AT+HTTPTERM");
    return false;
  }
  delay(1000);

  // Set bearer
  sendATCommand("AT+HTTPPARA=\"CID\",1");
  delay(500);

  // Set URL for Supabase REST API with upsert
  String supabaseUrl = String(SUPABASE_URL) + "/rest/v1/devices?on_conflict=device_id";
  String urlCmd = "AT+HTTPPARA=\"URL\",\"" + supabaseUrl + "\"";
  sendATCommand(urlCmd);
  delay(1000);

  // Set headers for Supabase
  sendATCommand("AT+HTTPPARA=\"HEADER\",\"apikey: " + String(SUPABASE_KEY) + "\"");
  delay(500);
  
  sendATCommand("AT+HTTPPARA=\"HEADER\",\"Authorization: Bearer " + String(SUPABASE_KEY) + "\"");
  delay(500);
  
  sendATCommand("AT+HTTPPARA=\"HEADER\",\"Content-Type: application/json\"");
  delay(500);
  
  sendATCommand("AT+HTTPPARA=\"HEADER\",\"Prefer: resolution=merge-duplicates\"");
  delay(500);

  // Set HTTP method to POST
  sendATCommand("AT+HTTPMETHOD=\"POST\"");
  delay(500);

  // Send data length
  String dataLenCmd = "AT+HTTPDATA=" + String(jsonData.length());
  sendATCommand(dataLenCmd);
  delay(500);
  
  // Send actual data
  SerialAT.print(jsonData);
  delay(2000);

  // Execute HTTP POST
  sendATCommand("AT+HTTPACTION=1");
  
  // Wait for response
  String response = "";
  unsigned long startTime = millis();
  int statusCode = -1;
  
  while (millis() - startTime < 30000UL) {
    while (SerialAT.available()) {
      char c = SerialAT.read();
      response += c;
      if (c == '\n') {
        int idx = response.indexOf("+HTTPACTION:");
        if (idx >= 0) {
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

  if (statusCode == 200 || statusCode == 201 || statusCode == 204) {
    Serial.printf("Data sent to Supabase successfully (HTTP %d)\n", statusCode);
    return true;
  } else {
    Serial.printf("Failed to send to Supabase (HTTP %d)\n", statusCode);
    Serial.println("Response: " + response);
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
  // Format: +CGNSINF: <GNSS run status>,<Fix status>,<UTC date & Time>,<Latitude>,<Longitude>,<Msl altitude>,<Speed Over Ground>,<Course Over Ground>,<Fix Mode>,<Reserved1>,<HDOP>,<PDOP>,<VDOP>,<Reserved2>,<GNSS Satellites in fix>,<Reserved3>,<GNSS Satellites viewed>,<Reserved4>,<HPA>,<VPA>
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

    // Field 3 is latitude (index 3), field 4 is longitude (index 4)
    // +CGNSINF: runStatus,fixStatus,dateTime,latitude,longitude,satellites,hdop,altitude,speed,...
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

        // Only update if coordinates are valid (not 0,0 and within reasonable bounds)
        if ((newLat != 0.0 || newLon != 0.0) && 
            (newLat >= -90.0 && newLat <= 90.0) && 
            (newLon >= -180.0 && newLon <= 180.0)) {
          latitude = newLat;
          longitude = newLon;
          gpsValid = true;
          Serial.print("Updated GPS - Lat: ");
          Serial.print(latitude, 6);
          Serial.print(", Lon: ");
          Serial.println(longitude, 6);
        } else {
          Serial.println("GPS data out of range or invalid, keeping previous values");
        }
      }
    }
  }
}