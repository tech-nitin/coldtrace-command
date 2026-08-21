**# ChillChain — Project Planning**

**## 1. Project Overview**

**### Project Name**

ChillChain

**### Tagline**

AI-Powered Cold-Chain Intelligence

**### Problem Statement**

Temperature-sensitive agricultural products can be exposed to unsafe

temperature, humidity, shock, delays, and other conditions during

transportation. These issues may not be detected early enough, resulting

in spoilage, quality loss, and financial losses.

**### Our Solution**

ChillChain is an IoT + AI cold-chain monitoring platform that collects

real-time shipment data and converts it into actionable intelligence.

The system monitors:

\- Temperature

\- Humidity

\- Shock / movement

\- Location

The collected data is processed by the backend and AI risk engine to:

\- Detect anomalies

\- Calculate shipment health

\- Predict spoilage risk

\- Generate alerts

\- Recommend corrective actions

\---

**# 2. Core Product Flow**

Agricultural Shipment

        ↓

IoT Sensors

        ↓

NodeMCU ESP8266

        ↓

Wi-Fi

        ↓

Backend API

        ↓

Database

        ↓

AI Risk Engine

        ↓

ChillChain Dashboard

        ↓

Alerts + Recommendations

\---

**# 3. Hardware**

**## Available / Already Have

- NodeMCU ESP8266 Development Board
- ESP8266 Breakout Module (backup; not required for the main prototype)
- Digital & Analog I/O Board V2
  - LM35 Temperature Sensor
  - Onboard Buzzer
  - LEDs
  - Push Buttons
  - Potentiometers
- 16×2 LCD Display
- Breadboard
- Jumper Wires
- 5V USB Charger
- NEO-6M GPS Module
- Micro-USB Data Cable

## To Buy / Arrange

### Essential for Current Prototype
- I2C Interface / Backpack for 16×2 LCD
- DHT11 (if available) or DHT22 for humidity monitoring

### For Portable Final Hardware
- 2 × 3.7V Lithium-Ion Cells
- 2-Cell Battery Holder
- 5V Buck Converter
- 2S BMS / Protection Board
- Compatible 8.4V 2S Li-ion Charger

### For Final Assembly
- Silicone Wire
- Zero PCB / Perfboard
- On/Off Switch
- Project Enclosure
- Connectors / Header Pins

---

**# 4. Hardware Responsibilities**

**## NodeMCU ESP8266**

Main IoT controller.

Responsibilities:

\- Read sensor data

\- Process sensor readings

\- Connect to Wi-Fi

\- Send data to backend

\- Trigger local alerts

**## SHT40**

Measures:

\- Temperature

\- Humidity

**## LIS3DH**

Detects:

\- Shock

\- Movement

\- Tilt

**## GPS**

Provides:

\- Latitude

\- Longitude

\- Shipment location

**## Buzzer**

Provides immediate local warning during critical conditions.

**## LCD**

Displays:

\- Temperature

\- Humidity

\- System status

\- Alert status

\---

**# 5. Software Architecture**

**## Frontend**

\- React / Next.js

\- TypeScript

\- Tailwind CSS

\- Framer Motion

\- Recharts

\- Leaflet / OpenStreetMap

\- Lucide React

**## Backend**

\- Node.js

\- Express.js

\- REST API

\- MongoDB

**## AI / ML**

AI Risk Engine will use:

\- Temperature

\- Humidity

\- Exposure duration

\- Product type

\- Movement/shock events

\- Location

\- Historical data

Output:

\- Spoilage Risk

\- Shipment Health Score

\- Anomaly Detection

\- Risk Explanation

\- Recommended Action

\---

**# 6. Website Pages**

**## 6.1 Overview**

Main command center.

Features:

\- Live shipment status

\- Temperature

\- Humidity

\- Shipment health

\- Risk score

\- Active alerts

\- Temperature graph

\- Live shipment map

\- Recent events

\---

**## 6.2 Shipments**

Show all shipments.

Data:

\- Shipment ID

\- Product

\- Origin

\- Destination

\- Temperature

\- Humidity

\- Health

\- Risk

\- Status

\- Last updated

Clicking a shipment opens detailed information.

\---

**## 6.3 Live Tracking**

Interactive map showing:

\- Current shipment location

\- Routes

\- Destination

\- Shipment status

\- Temperature

\- Health score

Status:

🟢 Safe

🟡 Warning

🔴 Critical

\---

**## 6.4 Analytics**

Visualize:

\- Temperature trends

\- Humidity trends

\- Risk distribution

\- Temperature excursions

\- Unsafe exposure time

\- Shipment health

\- Shipment performance

\---

**## 6.5 AI Insights**

Main AI functionality.

Show:

\- Spoilage Risk %

\- Shipment Health Score

\- Anomaly Score

\- Estimated Safe Time

AI explanation:

Why did the risk increase?

AI recommendation:

What should the operator do?

\---

**## 6.6 Alerts**

Show:

\- Temperature breach

\- Humidity warning

\- Shock detected

\- Route deviation

\- Sensor offline

\- Critical shipment

Each alert contains:

\- Severity

\- Shipment

\- Time

\- Cause

\- Recommended action

\---

**## 6.7 Devices**

Monitor IoT hardware.

Example:

NodeMCU ESP8266       ● ONLINE

SHT40       ● ONLINE

LIS3DH      ● ONLINE

GPS         ● ONLINE

LCD         ● ONLINE

BUZZER      ● ONLINE

Show:

\- Device status

\- Last communication

\- Sensor status

\- Battery status

\- Connection status

\---

**## 6.8 Profile**

**### Personal Details**

\- Name

\- Email

\- Role

\- College

\- Course

\- Year

**### Organization Details**

\- Organization name

\- Organization type

\- Location

\- Team

\- Project

\---

**# 7. Shipment Health Passport**

Signature feature of ChillChain.

Every shipment receives a digital health record.

Example:

Shipment ID: CH-1048

Product: Fresh Produce

Route: Indore → Delhi

Health Score: 92/100

Spoilage Risk: Low

Maximum Temperature: 6.2°C

Unsafe Exposure: 12 min

Temperature Excursions: 1

Shock Events: 0

Journey:

Pickup

  ↓

Cold Storage

  ↓

Transit

  ↓

Temperature Event

  ↓

AI Assessment

  ↓

Delivery

\---

**# 8. AI Risk Engine**

**## Input**

Temperature

Humidity

Duration

Product Type

Shock

Location

Historical Data

        ↓

**## Processing**

Anomaly Detection

\+

Risk Analysis

\+

Historical Pattern Analysis

        ↓

**## Output**

Risk Score

Shipment Health

Risk Explanation

Recommended Action

\---

**# 9. Dashboard Design**

Visual direction:

\- Premium green + white

\- Forest green

\- Emerald accents

\- Warm cream background

\- Editorial typography

\- Large whitespace

\- Professional logistics aesthetic

\- Subtle gradients

\- Smooth animations

\- Selective tilted cards

Avoid:

\- Generic admin dashboard

\- Excessive cards

\- Cyberpunk

\- Purple/neon AI styling

\- Excessive glassmorphism

Dashboard hierarchy:

Hero

↓

Live Metrics

↓

Temperature Intelligence

↓

AI Risk

↓

Live Map

↓

Analytics

↓

Shipments

↓

Health Passport

↓

IoT Status

\---

**# 10. Database**

**## Users**

\- name

\- email

\- role

\- organization

**## Shipments**

\- shipmentId

\- product

\- origin

\- destination

\- status

\- healthScore

\- riskScore

**## Sensor Readings**

\- shipmentId

\- temperature

\- humidity

\- timestamp

**## Movement Events**

\- shipmentId

\- acceleration

\- shock

\- timestamp

**## Location**

\- shipmentId

\- latitude

\- longitude

\- timestamp

**## Alerts**

\- shipmentId

\- type

\- severity

\- message

\- timestamp

\- resolved

\---

**# 11. API Planning**

**## Device**

POST /api/device/data

Receive:

\- temperature

\- humidity

\- acceleration

\- GPS

\- timestamp

**## Shipments**

GET /api/shipments

GET /api/shipments/\:id

**## Analytics**

GET /api/analytics/temperature

GET /api/analytics/risk

GET /api/analytics/health

**## AI**

POST /api/ai/risk

**## Alerts**

GET /api/alerts

PATCH /api/alerts/\:id

\---

**# 11.5 Current Implementation Status

## Frontend
- Dashboard UI and core pages created
- Telemetry simulation implemented
- Temperature Intelligence connected to live simulated telemetry
- Remaining frontend task: page-by-page UI refinement and whitespace improvement

## Backend
- Shipment controller started
- Metrics API planned
- Shipment list API planned
- Shipment-by-ID API planned
- Next priority: complete core models and telemetry APIs

## Hardware
- College components collected
- NEO-6M GPS and Micro-USB cable included
- DHT11 availability to be checked; use DHT22 if DHT11 is unavailable
- Portable battery hardware planned for the final prototype

---

# 12. Development Phases**

**## Phase 1 — UI**

Build:

\- Dashboard

\- Shipments

\- Live Tracking

\- Analytics

\- AI Insights

\- Alerts

\- Devices

\- Profile

Use mock data initially.

**## Phase 2 — Backend**

Build:

\- Express server

\- MongoDB

\- APIs

\- Authentication

\- Shipment management

**## Phase 3 — IoT**

Connect:

SHT40

LIS3DH

GPS

LCD

Buzzer

        ↓

      NodeMCU ESP8266

**## Phase 4 — Integration**

NodeMCU ESP8266

↓

Wi-Fi

↓

Backend

↓

Database

↓

Dashboard

**## Phase 5 — AI**

Implement:

\- Anomaly detection

\- Spoilage-risk prediction

\- Shipment health score

\- Recommendations

**## Phase 6 — Testing**

Test:

\- Normal temperature

\- Temperature rise

\- High humidity

\- Shock event

\- GPS movement

\- Sensor disconnection

\- Critical alert

**## Phase 7 — Hackathon Demo**

Demonstrate:

Normal Shipment

→ Safe

Temperature increases

→ Warning

Unsafe condition continues

→ AI Risk increases

Critical threshold

→ Buzzer + LED + Dashboard Alert

GPS

→ Shipment moves on map

AI

→ Recommendation generated

\---

**# 13. Hackathon Demo Story**

Start with a shipment carrying agricultural produce.

Show:

1\. Shipment starts in SAFE state.

2\. LM35 sends normal temperature and DHT11/DHT22 provides humidity data.

3\. Dashboard displays live data.

4\. Simulate temperature increase.

5\. Dashboard detects the excursion.

6\. AI risk score increases.

7\. Buzzer triggers.

8\. Alert appears.

9\. GPS location updates.

10\. AI explains the risk.

11\. System recommends corrective action.

12\. Shipment Health Passport records the event.

\---

**# 14. USP**

**## Digital Shipment Health Passport**

ChillChain doesn't simply monitor sensor readings.

It creates a complete digital health history of every shipment.

The system answers:

\- What happened?

\- When did it happen?

\- How long did it happen?

\- Where did it happen?

\- How much did it affect the shipment?

\- What should be done now?

\---

**# 15. Future Scope**

Potential expansion:

\- Fruits & vegetables

\- Dairy

\- Meat & seafood

\- Pharmaceuticals

\- Vaccines

\- Large logistics companies

\- Warehouse monitoring

\- Predictive maintenance

\- Multi-shipment fleet management

\- Advanced ML models

\- Automated refrigeration control

\---

**# 16. Final Architecture**

                    CHILLCHAIN

                         │

        ┌────────────────┼────────────────┐

        │                │                │

       IoT             Backend            AI

        │                │                │

   ┌────┴────┐           │          Risk Engine

   │         │           │                │

 SHT40    LIS3DH         │                │

   │         │           │                │

   └────┬────┘           │                │

        │                │                │

       NodeMCU ESP8266 ──────── Wi-Fi ──────────────┘

        │                │

       GPS              DB

        │                │

       LCD              API

        │                │

     Buzzer              │

        │                │

        └────────────────┘

                 │

                 ▼

        CHILLCHAIN DASHBOARD

                 │

      ┌──────────┼──────────┐

      │          │          │

   Tracking   Analytics    Alerts

      │          │          │

      └──────────┼──────────┘

                 │

                 ▼

          AI Recommendations