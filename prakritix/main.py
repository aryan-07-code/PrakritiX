import os
import base64
import serial
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="PrakritiX Smart Waste API",
    description="API for classifying waste and controlling Arduino hardware",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000", "http://localhost:5173"],  # Allows all origins for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Initialize Serial Connection
SERIAL_PORT = os.getenv("SERIAL_PORT", "/dev/ttyUSB0") # Use 'COM3' or similar on Windows
BAUD_RATE = 9600
arduino_serial = None

try:
    arduino_serial = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"✅ Successfully connected to Arduino on {SERIAL_PORT}")
except serial.SerialException as e:
    print(f"⚠️ WARNING: Could not connect to Arduino on {SERIAL_PORT}.")
    print("Hardware triggers will be disabled, but the AI API will still function.")
    print(f"Error details: {e}")

# Define request model
class ImagePayload(BaseModel):
    image_base64: str

# Command mapping
COMMAND_MAP = {
    "DEGRADABLE": b'D',
    "NON_DEGRADABLE": b'N',
    "METAL": b'M',
    "HAZARDOUS": b'H',
    "UNKNOWN": b'U'
}

@app.post("/api/classify-waste")
async def classify_waste(payload: ImagePayload):
    try:
        # Decode base64 image
        # Remove data URI scheme prefix if present (e.g., "data:image/jpeg;base64,")
        base64_data = payload.image_base64
        if "," in base64_data:
            base64_data = base64_data.split(",")[1]
            
        image_bytes = base64.b64decode(base64_data)
        
        # Prepare image for Gemini
        image_parts = [
            {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
        ]
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Define the strict prompt
        prompt = (
            "Analyze this image. First, classify it strictly as DEGRADABLE, NON_DEGRADABLE, METAL, or HAZARDOUS. "
            "Second, identify the specific item. Third, if it is DEGRADABLE, estimate the number of days it takes "
            "to decompose into biogas. Return ONLY a JSON object in this exact format: "
            '{"category": "DEGRADABLE", "item_name": "apple core", "days_to_decompose": 18}'
        )
        
        # Generate content
        response = model.generate_content([prompt, image_parts[0]])
        
        # Parse response
        import json
        try:
            # Clean up the response text in case it has markdown code blocks
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()
                
            result_data = json.loads(response_text)
            category = result_data.get("category", "UNKNOWN").upper()
            item_name = result_data.get("item_name", "Unknown Item")
            days_to_decompose = result_data.get("days_to_decompose", 0)
        except Exception as e:
            print(f"JSON parsing error: {e}")
            category = "UNKNOWN"
            item_name = "Unknown Item"
            days_to_decompose = 0
        
        # Validate category (fallback to UNKNOWN if the model hallucinates)
        if category not in COMMAND_MAP:
            category = "UNKNOWN"
            
        # Get corresponding command
        command = COMMAND_MAP[category]
        
        # Send command to Arduino
        command_sent = False
        if arduino_serial and arduino_serial.is_open:
            try:
                arduino_serial.write(command)
                command_sent = True
            except Exception as e:
                print(f"Error writing to serial port: {e}")
                
        return {
            "status": "success",
            "category": category,
            "item_name": item_name,
            "days_to_decompose": days_to_decompose,
            "command_sent": command.decode('utf-8') if command_sent else None,
            "hardware_active": command_sent
        }
        
    except Exception as e:
        print(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "arduino_connected": arduino_serial is not None and arduino_serial.is_open
    }

if __name__ == "__main__":
    import uvicorn
    # Run the server with: python main.py
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
