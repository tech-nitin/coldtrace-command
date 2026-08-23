import os
import json
import ssl
from datetime import datetime, timezone
import paho.mqtt.client as mqtt
from pymongo import MongoClient
from dotenv import load_dotenv

# 1. Load Environment Variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("Error: MONGODB_URI not found in .env file!")

# 2. MQTT Broker Configuration
MQTT_BROKER = "e2714ea32aa946d6a9b4850b5550d8f3.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USER = "coldchain_evos"
MQTT_PASS = "Ajeetjain007@"
MQTT_TOPIC = "coldchain/telemetry/#"
DB_NAME = "ChillChainData"

# 3. Database Connection
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
telemetry_collection = db["telemetries"]

# 4. Store Ingested Telemetry to MongoDB
def save_telemetry(data):
    device_id = data.get("device_id") or data.get("deviceId", "COLD_TRUCK_01")
    shipment_id = data.get("shipment_id") or data.get("shipmentId", "CG-10500")
    temp = data.get("temp")
    humidity = data.get("humidity")
    
    doc = {
        "deviceId": device_id,
        "sensorDeviceId": device_id,
        "shipmentId": shipment_id,
        "temperature": temp,
        "humidity": humidity,
        "ethylene": data.get("ethylene", 11.2),
        "location": {
            "lat": data.get("lat", 0.0),
            "lng": data.get("lng", 0.0)
        },
        "healthIndex": 100 if (temp is not None and temp <= 8.0) else 60,
        "timestamp": datetime.now(timezone.utc),
        "createdAt": datetime.now(timezone.utc)
    }
    
    result = telemetry_collection.insert_one(doc)
    print(f" [DB] Saved to MongoDB (ID: {result.inserted_id}) | Device: {device_id} | Temp: {temp}°C | Humidity: {humidity}%")

# 5. MQTT Event Handlers
def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(" Connected successfully to HiveMQ Broker!")
        client.subscribe(MQTT_TOPIC)
        print(f" Subscribed to topic: {MQTT_TOPIC}")
    else:
        print(f" Connection failed with status code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode("utf-8"))
        print(f"\n Message received on {msg.topic}")
        
        device_id = payload.get("device_id") or payload.get("deviceId", "COLD_TRUCK_01")
        temp = payload.get("temp")
        humidity = payload.get("humidity")
        print(f" [DATA] Received Sensor Data -> Temp: {temp}°C | Humidity: {humidity}%")
        
        # Define the command topic for the specific hardware device
        command_topic = f"coldchain/commands/{device_id}"

        # ALARM LOGIC: Temperature threshold check
        if temp is not None and temp > 8.0:
            print(f" [ALERT] Temperature exceeded safety limit! ({temp}°C)")
            alarm_payload = json.dumps({"alarm": True, "buzzer": "ON", "temp": temp})
            client.publish(command_topic, alarm_payload)
            print(f" [COMMAND] Sent ALARM ON signal to MQTT topic: {command_topic}")
        elif temp is not None:
            # Turn alarm off when temperature normalizes
            alarm_payload = json.dumps({"alarm": False, "buzzer": "OFF", "temp": temp})
            client.publish(command_topic, alarm_payload)
            print(f" [COMMAND] Sent ALARM OFF signal to MQTT topic: {command_topic}")
            
        save_telemetry(payload)
    except Exception as e:
        print(f" [ERROR] Could not parse message: {e}")

# 6. Start Listener
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(MQTT_USER, MQTT_PASS)
client.tls_set(cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2)

client.on_connect = on_connect
client.on_message = on_message

print("Connecting to HiveMQ...")
client.connect(MQTT_BROKER, MQTT_PORT)
client.loop_forever()