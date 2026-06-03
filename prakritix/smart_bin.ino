#include <Servo.h>

// ==========================================
// PIN CONFIGURATION
// ==========================================
// Define the PWM pins connected to the signal wires of the servos
const int PIN_DEGRADABLE = 3;
const int PIN_NON_DEGRADABLE = 5;
const int PIN_METAL = 6;
const int PIN_HAZARDOUS = 9;

// ==========================================
// SERVO CONFIGURATION
// ==========================================
// Define the angles for the closed and open positions
// Adjust these values based on your physical bin lid mechanics
const int ANGLE_CLOSED = 0;   // Angle when the bin lid is fully closed
const int ANGLE_OPEN = 90;    // Angle when the bin lid is fully open

// Define how long the bin should stay open (in milliseconds)
const unsigned long OPEN_DURATION = 3000; // 3 seconds

// Create Servo objects to control each motor
Servo degradableServo;
Servo nonDegradableServo;
Servo metalServo;
Servo hazardousServo;

void setup() {
  // Initialize serial communication at 9600 baud rate
  // This must match the baud rate in the Python FastAPI server
  Serial.begin(9600);
  
  // Attach the servo objects to their respective pins
  degradableServo.attach(PIN_DEGRADABLE);
  nonDegradableServo.attach(PIN_NON_DEGRADABLE);
  metalServo.attach(PIN_METAL);
  hazardousServo.attach(PIN_HAZARDOUS);
  
  // Set all servos to their initial "closed" position
  degradableServo.write(ANGLE_CLOSED);
  nonDegradableServo.write(ANGLE_CLOSED);
  metalServo.write(ANGLE_CLOSED);
  hazardousServo.write(ANGLE_CLOSED);
  
  // Print a ready message to the Serial Monitor (optional, for debugging)
  Serial.println("PrakritiX Smart Bin Controller Initialized.");
  Serial.println("Waiting for commands (D, N, M, H)...");
}

void loop() {
  // Check if there is any data available to read from the USB serial connection
  if (Serial.available() > 0) {
    
    // Read the incoming byte (character)
    char command = Serial.read();
    
    // Execute the corresponding action based on the received command
    switch (command) {
      
      case 'D': // Degradable Waste
        Serial.println("Command Received: DEGRADABLE. Opening Degradable Bin.");
        openBin(degradableServo);
        break;
        
      case 'N': // Non-Degradable Waste
        Serial.println("Command Received: NON_DEGRADABLE. Opening Non-Degradable Bin.");
        openBin(nonDegradableServo);
        break;
        
      case 'M': // Metal Waste
        Serial.println("Command Received: METAL. Opening Metal Bin.");
        openBin(metalServo);
        break;
        
      case 'H': // Hazardous Waste
        Serial.println("Command Received: HAZARDOUS. Opening Hazardous Bin.");
        openBin(hazardousServo);
        break;
        
      case 'U': // Unknown Waste
        Serial.println("Command Received: UNKNOWN. No bin opened.");
        // You could optionally trigger an LED or buzzer here to indicate an unknown item
        break;
        
      case '\n':
      case '\r':
        // Ignore newline and carriage return characters
        break;
        
      default:
        Serial.print("Invalid command received: ");
        Serial.println(command);
        break;
    }
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Opens a specific bin, waits for the configured duration, and then closes it.
 * 
 * @param targetServo The Servo object corresponding to the bin to be opened.
 */
void openBin(Servo &targetServo) {
  // Move the servo to the open position
  targetServo.write(ANGLE_OPEN);
  
  // Wait for the specified duration to allow the user to drop the waste
  delay(OPEN_DURATION);
  
  // Move the servo back to the closed position
  targetServo.write(ANGLE_CLOSED);
  
  Serial.println("Bin closed. Ready for next item.");
}
