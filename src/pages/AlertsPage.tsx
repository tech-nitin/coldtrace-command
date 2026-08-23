// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// interface CargoConfig {
//   name: string;
//   minTemp: number;
//   maxTemp: number;
//   unitCost: number; // e.g. Rs 500 per packet/box
//   minTimeLimitMins: number; // Max tolerable excursion time before damage occurs
// }

// const CARGO_TYPES: Record<string, CargoConfig> = {
//   IceCream: { name: 'Ice Cream', minTemp: -18, maxTemp: -10, unitCost: 500, minTimeLimitMins: 15 },
//   Milk: { name: 'Milk', minTemp: 2, maxTemp: 8, unitCost: 60, minTimeLimitMins: 30 },
//   Vegetables: { name: 'Vegetables', minTemp: 4, maxTemp: 12, unitCost: 120, minTimeLimitMins: 60 },
// };

// export function AlertsPage() {
//   const [selectedCargo, setSelectedCargo] = useState<string>('IceCream');
//   const [currentTemp, setCurrentTemp] = useState<number>(-8); // Example initial temp above max
//   const [packageCount, setPackageCount] = useState<number>(100);
  
//   // Logic tracking states
//   const [excursionMins, setExcursionMins] = useState<number>(0);
//   const [flag, setFlag] = useState<boolean>(false);
//   const [damagedUnits, setDamagedUnits] = useState<number>(0);

//   const cargo = CARGO_TYPES[selectedCargo];

//   // Logic calculation loop
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (currentTemp > cargo.maxTemp) {
//       interval = setInterval(() => {
//         setExcursionMins((prevMins) => {
//           const updatedMins = prevMins + 1;

//           // Check if excursion time exceeds threshold limits
//           if (updatedMins > cargo.minTimeLimitMins) {
//             setFlag(true);
//             setDamagedUnits(packageCount); // Total package damage
//           }
//           return updatedMins;
//         });
//       }, 1000); // 1 sec represents 1 minute in real-time simulation
//     } else {
//       // Temp back to safe zone
//       if (flag) {
//         // Flag remains true to log total excursion time during breach
//       }
//     }

//     return () => clearInterval(interval);
//   }, [currentTemp, selectedCargo, cargo, packageCount, flag]);

//   // Financial calculations
//   const totalFinancialRisk = packageCount * cargo.unitCost;
//   const actualIncurredLoss = damagedUnits * cargo.unitCost;

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold tracking-tight">🚨 Risk & Spoilage Alert Center</h1>

//       {/* Cargo & Simulation Selection */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader><CardTitle>1. Select Commodity</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <select 
//               value={selectedCargo} 
//               onChange={(e) => {
//                 setSelectedCargo(e.target.value);
//                 setExcursionMins(0);
//                 setFlag(false);
//                 setDamagedUnits(0);
//               }}
//               className="w-full p-2 border rounded bg-background"
//             >
//               <option value="IceCream">Ice Cream (Cost: ₹500 / unit)</option>
//               <option value="Milk">Milk (Cost: ₹60 / unit)</option>
//               <option value="Vegetables">Vegetables (Cost: ₹120 / unit)</option>
//             </select>
//             <p className="text-sm text-muted-foreground">
//               Safe Zone: {cargo.minTemp}°C to {cargo.maxTemp}°C
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><CardTitle>2. Adjust Sensor Temperature</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <input 
//               type="number" 
//               value={currentTemp} 
//               onChange={(e) => setCurrentTemp(parseFloat(e.target.value))}
//               className="w-full p-2 border rounded bg-background"
//             />
//             <p className="text-sm text-muted-foreground">
//               Current Reading: <span className={currentTemp > cargo.maxTemp ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{currentTemp}°C</span>
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader><CardTitle>3. Cargo Volume</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <input 
//               type="number" 
//               value={packageCount} 
//               onChange={(e) => setPackageCount(parseInt(e.target.value) || 0)}
//               className="w-full p-2 border rounded bg-background"
//             />
//             <p className="text-sm text-muted-foreground">Total Units in Transit</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Alert Banner / Warning Output */}
//       {currentTemp > cargo.maxTemp && (
//         <div className={`p-4 rounded-lg border ${flag ? "bg-red-500/10 border-red-500" : "bg-amber-500/10 border-amber-500"}`}>
//           <h2 className="text-xl font-bold flex items-center gap-2">
//             {flag ? "❌ CARGO HARMFUL & SPOILED" : "⚠️ WARNING: Temperature Threshold Breached!"}
//           </h2>
//           <p className="mt-1">
//             Product temperature ({currentTemp}°C) is exceeding maximum limit ({cargo.maxTemp}°C).
//           </p>
//           <p className="font-mono mt-2 text-sm">
//             Continuous Excursion Duration: <span className="font-bold">{excursionMins} minutes</span> (Max threshold: {cargo.minTimeLimitMins} mins)
//           </p>
//         </div>
//       )}

//       {/* Financial Loss Breakdown */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="border-amber-500/50">
//           <CardHeader>
//             <CardTitle className="text-amber-500"> Projected Loss (If Not Fixed)</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-extrabold">₹{totalFinancialRisk.toLocaleString()}</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               If temperature isn't lowered immediately, you will lose all {packageCount} packages @ ₹{cargo.unitCost}/unit.
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="border-red-500/50">
//           <CardHeader>
//             <CardTitle className="text-red-500"> Actual Incurred Loss</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-3xl font-extrabold text-red-500">₹{actualIncurredLoss.toLocaleString()}</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               {flag 
//                 ? `Damage recorded! Total excursion time crossed ${cargo.minTimeLimitMins} mins limit. Time counter stopped.` 
//                 : "No permanent damage incurred yet. Adjust cooling to avoid loss."}
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }