# ❄️ ChillChain AI

> **AI-Powered Cold-Chain Intelligence for Temperature-Sensitive
> Shipments**

ChillChain AI is an IoT + AI-powered cold-chain monitoring platform
designed to help protect temperature-sensitive agricultural and
perishable shipments. It combines real-time sensor telemetry, GPS
tracking, risk analysis, alerts, shipment intelligence, and a live
command-center dashboard.

![ChillChain
AI](https://img.shields.io/badge/ChillChain-AI-14532D?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon%20Build-16A34A?style=for-the-badge)
![IoT](https://img.shields.io/badge/IoT-Live%20Telemetry-0F766E?style=for-the-badge)

------------------------------------------------------------------------

## 🚚 The Problem

Cold-chain failures can cause:

-   ❌ Product spoilage
-   ❌ Financial losses
-   ❌ Temperature excursions
-   ❌ Poor visibility during transportation
-   ❌ Delayed detection of refrigeration problems

Traditional monitoring systems often detect a problem **after the
shipment has already been compromised**.

### ChillChain AI changes that.

> **Protect every shipment before spoilage happens.**

------------------------------------------------------------------------

## ✨ What ChillChain AI Does

``` text
Sensors
   ↓
NodeMCU ESP8266
   ↓
Wi-Fi
   ↓
Backend API
   ↓
MongoDB
   ↓
AI Risk Engine
   ↓
ChillChain Command Dashboard
```

ChillChain continuously processes telemetry data to:

-   🌡️ Monitor temperature
-   💧 Monitor humidity
-   📍 Track shipment location
-   🚨 Detect unsafe conditions
-   📊 Calculate shipment health
-   🤖 Estimate spoilage risk
-   ⚠️ Generate alerts
-   🧠 Recommend corrective actions

------------------------------------------------------------------------

# 🖥️ ChillChain Command

The project is centered around a premium live cold-chain command center
built for real-time decision-making.

## First View

### **Protect Every Shipment. Before Spoilage Happens.**

The dashboard provides a live operational overview with:

-   Live cold-chain status
-   Animated shipment metrics
-   Refrigerated shipment visualization
-   Real-time sensor data
-   Shipment health indicators
-   AI-powered risk analysis

------------------------------------------------------------------------

## 📊 Dashboard Features

### 🌡️ Temperature Intelligence

A live telemetry visualization for:

-   Current temperature
-   Safe operating range
-   Critical thresholds
-   Temperature excursions
-   24H / 7D / 30D history
-   Shipment selection

Example:

``` text
11.8°C
CRITICAL
Threshold Breached
```

------------------------------------------------------------------------

### 🤖 AI Risk Assessment

ChillChain converts sensor telemetry into actionable risk intelligence.

The AI/risk engine evaluates:

-   Temperature excursions
-   Humidity conditions
-   Unsafe exposure duration
-   Anomaly patterns
-   Shipment health

Example output:

``` text
Spoilage Risk: 72%
Shipment Health: 28/100
Anomaly Score: 0.87
Estimated Safe Time: 18 min
```

Example explanation:

> Temperature has remained above the safe range for an extended period,
> indicating possible refrigeration degradation.

Recommended action:

> Inspect refrigeration and prioritize delivery.

------------------------------------------------------------------------

### 📍 Live Shipment Tracking

The platform supports shipment tracking using GPS telemetry.

Example routes:

-   Delhi → Indore
-   Mumbai → Bhopal
-   Pune → Nagpur
-   Delhi → Kolkata

Shipment status indicators:

  Status        Meaning
  ------------- ---------------------------
  🟢 Healthy    Safe operating conditions
  🟡 Warning    Risk increasing
  🔴 Critical   Immediate action required

------------------------------------------------------------------------

### 🚛 Active Shipments

The shipment management view is designed to display:

  ---------------------------------------------------------------------------------------
  Shipment   Product   Route      Temperature   Humidity     Health       Risk Status
  ID                                                                           
  ---------- --------- -------- ------------- ---------- ---------- ---------- ----------
  CHL-001    Fruits    Delhi →          4.8°C        68%     92/100        Low 🟢 Healthy
                       Indore                                                  

  CHL-002    Dairy     Mumbai →         9.6°C        72%     48/100     Medium 🟡 Warning
                       Bhopal                                                  

  CHL-003    Seafood   Pune →          11.8°C        81%     28/100       High 🔴
                       Nagpur                                                  Critical
  ---------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 🛂 Shipment Health Passport

### **Every Shipment Has a Health Story.**

A signature ChillChain feature that summarizes the health of an
individual shipment.

Example:

``` text
Shipment: CHL-10458
Product: Fresh Produce Batch 12C
Route: Indore → Delhi

Health Score: 28/100
Spoilage Risk: 72%
Maximum Temperature: 11.8°C
Unsafe Exposure: 47 min
Temperature Excursions: 3
```

The Health Passport is designed to show the complete journey and
condition history of a shipment.

------------------------------------------------------------------------

## 🚨 Alert Center

ChillChain can surface operational events such as:

-   🔴 Temperature Breach
-   🟡 Humidity Warning
-   🟡 Route Deviation
-   🔴 Sensor Offline
-   🟢 Temperature Normalized

Alerts are designed for fast operator response.

------------------------------------------------------------------------

# 🔌 IoT Hardware

## Currently Available

-   NodeMCU ESP8266 Development Board
-   ESP8266 breakout module (backup)
-   Digital & Analog I/O Board V2
-   LM35 temperature sensor
-   Onboard buzzer
-   LEDs and push buttons
-   16×2 LCD
-   Breadboard
-   Jumper wires
-   5V USB charger
-   NEO-6M GPS module
-   Micro-USB data cable

## Planned / To Arrange

### Current Prototype

-   DHT11 humidity sensor, if available
-   DHT22 as the alternative humidity sensor
-   I2C interface/backpack for the 16×2 LCD

### Portable Final Prototype

-   2 × 3.7V lithium-ion cells
-   2-cell battery holder
-   5V buck converter
-   2S BMS/protection board
-   Compatible 8.4V 2S charger

### Final Assembly

-   Silicone wire
-   Zero PCB / perfboard
-   On/off switch
-   Connectors/header pins
-   Project enclosure

------------------------------------------------------------------------

## 🧩 Hardware Architecture

``` text
LM35 ───────────────┐
                    │
DHT11 / DHT22 ──────┼──→ NodeMCU ESP8266 ──→ Wi-Fi ──→ Backend
                    │
NEO-6M GPS ─────────┤
                    │
I/O Board Buzzer ───┘
                    │
                    └──→ 16×2 LCD
```

### Hardware Responsibilities

  Component          Purpose
  ------------------ --------------------------------
  NodeMCU ESP8266    Main IoT controller + Wi-Fi
  LM35               Temperature monitoring
  DHT11/DHT22        Humidity monitoring
  NEO-6M             GPS location tracking
  16×2 LCD + I2C     Local status display
  I/O board buzzer   Local critical alert
  Battery system     Portable final prototype power

> The separate ESP8266 module is available as backup; the NodeMCU is the
> main controller.

------------------------------------------------------------------------

# 🧠 AI & Risk Intelligence

ChillChain is structured around a risk-analysis pipeline.

``` text
Telemetry
   ↓
Validation
   ↓
Threshold Analysis
   ↓
Anomaly Detection
   ↓
Risk Calculation
   ↓
Shipment Health Update
   ↓
Alerts + Recommendations
```

Planned shipment states:

``` text
HEALTHY
AT_RISK
CRITICAL
```

Example risk inputs:

-   Temperature above safe range
-   Temperature excursion frequency
-   Unsafe exposure duration
-   Humidity abnormalities
-   Sensor anomalies
-   GPS/route deviations

------------------------------------------------------------------------

# 🏗️ System Architecture

``` text
┌──────────────────────┐
│   IoT Sensors        │
│ LM35 • DHT • GPS     │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  NodeMCU ESP8266     │
│  Sensor Collection   │
└──────────┬───────────┘
           ↓ Wi-Fi
┌──────────────────────┐
│   Express Backend    │
│   Validation + APIs  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│      MongoDB         │
│ Shipments/Telemetry  │
│       Alerts         │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│   AI Risk Engine     │
│ Risk + Health Score  │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ ChillChain Dashboard │
│  React + Live Data   │
└──────────────────────┘
```

------------------------------------------------------------------------

# 🛠️ Tech Stack

## Frontend

-   React
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Recharts
-   Lucide React
-   Leaflet / OpenStreetMap
-   TanStack Router

## Backend

-   Node.js
-   Express
-   TypeScript
-   MongoDB
-   Mongoose
-   REST APIs

## IoT

-   NodeMCU ESP8266
-   LM35
-   DHT11 / DHT22
-   NEO-6M GPS
-   Wi-Fi

------------------------------------------------------------------------

# 📁 Project Structure

``` text
chillchain/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── lib/
│       ├── types/
│       └── routes/
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── config/
│
├── firmware/
│   └── NodeMCU sensor code
│
└── README.md
```

------------------------------------------------------------------------

# 🚀 Backend Development Priority

## Priority 1 --- Foundation

-   [ ] Express + TypeScript setup
-   [ ] Environment variables
-   [ ] MongoDB connection
-   [ ] Error-handling middleware
-   [ ] Health check API

## Priority 2 --- Data Models

-   [ ] Shipment model
-   [ ] Telemetry model
-   [ ] Alert model

## Priority 3 --- Core APIs

-   [ ] Dashboard metrics
-   [ ] Get all shipments
-   [ ] Get shipment by ID
-   [ ] Receive telemetry from NodeMCU
-   [ ] Get latest telemetry
-   [ ] Get telemetry history

## Priority 4 --- IoT Integration

``` text
Sensor → NodeMCU → Backend API → MongoDB → Frontend
```

-   [ ] Test telemetry API
-   [ ] Validate sensor data
-   [ ] Store telemetry
-   [ ] Connect NodeMCU
-   [ ] Send periodic readings

## Priority 5 --- Intelligence

-   [ ] Temperature/humidity threshold detection
-   [ ] Risk calculation
-   [ ] Update HEALTHY / AT_RISK / CRITICAL
-   [ ] Generate alerts
-   [ ] Track unsafe exposure duration

## Priority 6 --- GPS

-   [ ] Store GPS coordinates
-   [ ] Latest location API
-   [ ] Location history API
-   [ ] Connect map to live data

## Priority 7 --- Authentication

-   [ ] Registration/login
-   [ ] JWT authentication
-   [ ] Protected routes
-   [ ] User-shipment association

## Priority 8 --- Real-Time

-   [ ] Socket.IO
-   [ ] Live telemetry updates
-   [ ] Live alerts
-   [ ] Live shipment positions

------------------------------------------------------------------------

# 🔄 Current Development Status

## Frontend

-   [x] Dashboard UI created
-   [x] Core pages created
-   [x] Telemetry simulation implemented
-   [x] Temperature Intelligence connected to simulated live telemetry
-   [ ] Final UI refinement
-   [ ] Whitespace and responsive improvements
-   [ ] Replace mock data with backend APIs

## Backend

-   [x] Shipment controller started
-   [x] Metrics endpoint logic started
-   [x] Shipment list endpoint logic started
-   [x] Shipment-by-ID endpoint logic started
-   [ ] Telemetry model
-   [ ] Telemetry ingestion API
-   [ ] Latest telemetry API
-   [ ] Telemetry history API
-   [ ] Alert model and risk engine

## Hardware

-   [x] NodeMCU ESP8266 available
-   [x] LM35 available
-   [x] GPS available
-   [x] LCD available
-   [x] I/O board buzzer available
-   [ ] Confirm DHT11 availability
-   [ ] Use DHT22 if DHT11 is unavailable
-   [ ] Portable power system
-   [ ] Final perfboard assembly

------------------------------------------------------------------------

# ⚡ Getting Started

## Prerequisites

-   Node.js
-   npm
-   MongoDB
-   Git

## Clone the Repository

``` bash
git clone <repository-url>
cd <repository-name>
```

## Install Dependencies

``` bash
npm install
```

## Run Development Server

``` bash
npm run dev
```

The development server will start on the configured local URL.

------------------------------------------------------------------------

# 🌍 Future Vision

-   Multi-shipment monitoring
-   Live WebSocket updates
-   AI spoilage prediction
-   Advanced anomaly detection
-   GPS geofencing
-   Predictive refrigeration failure detection
-   Automated escalation
-   Mobile monitoring
-   Exportable shipment health reports

------------------------------------------------------------------------

# 🏆 Built For

**Hackathon Prototype / Cold-Chain Intelligence**

ChillChain AI is designed to demonstrate how:

> **IoT + Real-Time Data + AI + Intelligent Visualization**

can help make cold-chain logistics more proactive, visible, and
resilient.

------------------------------------------------------------------------

## ❄️ ChillChain AI

### **Premium. Live. Intelligent.**

**Protect Every Shipment. Before Spoilage Happens.**
