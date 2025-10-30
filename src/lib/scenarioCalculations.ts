// Scenario Emission Calculations
// Auto-calculate emissions based on waste composition and treatment allocation

import { FUEL_EF, GWP, GRID_ELECTRICITY_EF } from './calculations';

interface WasteComposition {
  food: number;
  paper: number;
  plastic: number;
  metal: number;
  glass: number;
  textile: number;
  others: number;
}

interface TreatmentAllocation {
  landfill: number;
  composting: number;
  anaerobicDigestion: number;
  mbt: number;
  recycling: number;
  incineration: number;
  openBurning: number;
}

interface FleetConfig {
  dieselTrucks: number;
  electricTrucks: number;
  totalDistance: number;
  fuelEfficiency: number;
}

interface ScenarioEmissions {
  transportation: number;
  landfill: number;
  composting: number;
  anaerobicDigestion: number;
  mbt: number;
  recycling: number;
  incineration: number;
  openBurning: number;
  total: number;
}

// Emission factors (simplified from main calculations)
const EMISSION_FACTORS = {
  // kg CO2-eq per tonne of waste
  landfill: {
    food: 250,
    paper: 180,
    plastic: 10,
    metal: 5,
    glass: 5,
    textile: 120,
    others: 80,
  },
  composting: {
    food: 25,
    paper: 20,
    plastic: 0,
    metal: 0,
    glass: 0,
    textile: 15,
    others: 10,
  },
  anaerobicDigestion: {
    food: 15,
    paper: 12,
    plastic: 0,
    metal: 0,
    glass: 0,
    textile: 10,
    others: 8,
  },
  mbt: {
    food: 80,
    paper: 60,
    plastic: 40,
    metal: 20,
    glass: 15,
    textile: 50,
    others: 35,
  },
  recycling: {
    // Negative = avoided emissions
    food: 0,
    paper: -850,
    plastic: -1800,
    metal: -5000,
    glass: -300,
    textile: -900,
    others: -100,
  },
  incineration: {
    food: 30,
    paper: 40,
    plastic: 2500,
    metal: 10,
    glass: 5,
    textile: 150,
    others: 100,
  },
  openBurning: {
    food: 150,
    paper: 200,
    plastic: 3500,
    metal: 50,
    glass: 20,
    textile: 250,
    others: 180,
  },
};

/**
 * Calculate transportation emissions for a scenario
 */
export function calculateTransportationEmissions(fleet: FleetConfig): number {
  const { dieselTrucks, electricTrucks, totalDistance, fuelEfficiency } = fleet;
  
  // Diesel trucks
  const dieselDistance = (dieselTrucks / (dieselTrucks + electricTrucks || 1)) * totalDistance;
  const fuelConsumption = dieselDistance * fuelEfficiency; // liters
  const energy = fuelConsumption * FUEL_EF.diesel.energyContent; // MJ
  const dieselEmissions = energy * FUEL_EF.diesel.CO2; // kg CO2
  
  // Electric trucks
  const electricDistance = (electricTrucks / (dieselTrucks + electricTrucks || 1)) * totalDistance;
  const electricityConsumption = electricDistance * 1.2; // kWh (assuming 1.2 kWh/km)
  const electricEmissions = electricityConsumption * GRID_ELECTRICITY_EF; // kg CO2-eq
  
  return dieselEmissions + electricEmissions;
}

/**
 * Calculate emissions for a specific treatment method
 */
function calculateTreatmentEmissions(
  wasteComposition: WasteComposition,
  allocationPercentage: number,
  treatmentType: keyof typeof EMISSION_FACTORS
): number {
  let totalEmissions = 0;
  const factors = EMISSION_FACTORS[treatmentType];
  
  Object.entries(wasteComposition).forEach(([wasteType, percentage]) => {
    const wasteAmount = (percentage / 100) * (allocationPercentage / 100); // fraction of total waste
    const ef = factors[wasteType as keyof typeof factors] || 0;
    totalEmissions += wasteAmount * ef;
  });
  
  return totalEmissions;
}

/**
 * Calculate all emissions for a scenario
 * Assumes 1000 tonnes of waste per month as baseline
 */
export function calculateScenarioEmissions(
  wasteComposition: WasteComposition,
  treatmentAllocation: TreatmentAllocation,
  fleet: FleetConfig,
  totalWaste: number = 1000 // tonnes/month
): ScenarioEmissions {
  // Transportation
  const transportation = calculateTransportationEmissions(fleet);
  
  // Treatment emissions per tonne
  const landfill = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.landfill,
    'landfill'
  );
  
  const composting = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.composting,
    'composting'
  );
  
  const anaerobicDigestion = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.anaerobicDigestion,
    'anaerobicDigestion'
  );
  
  const mbt = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.mbt,
    'mbt'
  );
  
  const recycling = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.recycling,
    'recycling'
  );
  
  const incineration = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.incineration,
    'incineration'
  );
  
  const openBurning = calculateTreatmentEmissions(
    wasteComposition,
    treatmentAllocation.openBurning,
    'openBurning'
  );
  
  // Scale to total waste amount
  const scaleFactor = totalWaste;
  
  const emissions = {
    transportation: transportation,
    landfill: landfill * scaleFactor,
    composting: composting * scaleFactor,
    anaerobicDigestion: anaerobicDigestion * scaleFactor,
    mbt: mbt * scaleFactor,
    recycling: recycling * scaleFactor,
    incineration: incineration * scaleFactor,
    openBurning: openBurning * scaleFactor,
    total: 0,
  };
  
  emissions.total = Object.values(emissions).reduce((sum, val) => sum + val, 0) - emissions.total;
  
  return emissions;
}

/**
 * Compare two scenarios and calculate differences
 */
export function compareScenarios(baseline: ScenarioEmissions, intervention: ScenarioEmissions) {
  const reduction = baseline.total - intervention.total;
  const percentageReduction = baseline.total !== 0 ? (reduction / baseline.total * 100) : 0;
  
  return {
    absoluteReduction: reduction,
    percentageReduction,
    byCategory: {
      transportation: baseline.transportation - intervention.transportation,
      landfill: baseline.landfill - intervention.landfill,
      composting: baseline.composting - intervention.composting,
      anaerobicDigestion: baseline.anaerobicDigestion - intervention.anaerobicDigestion,
      mbt: baseline.mbt - intervention.mbt,
      recycling: baseline.recycling - intervention.recycling,
      incineration: baseline.incineration - intervention.incineration,
      openBurning: baseline.openBurning - intervention.openBurning,
    },
  };
}

/**
 * Generate AI insights based on scenario comparison
 */
export function generateAIInsights(baseline: ScenarioEmissions, intervention: ScenarioEmissions) {
  const comparison = compareScenarios(baseline, intervention);
  
  // Find biggest reduction areas
  const reductions = Object.entries(comparison.byCategory)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const insights = {
    summary: `Scenario achieves ${comparison.absoluteReduction.toFixed(1)} tonnes CO₂-eq reduction (${comparison.percentageReduction.toFixed(1)}% decrease)`,
    keyReductions: reductions.map(([category, reduction]) => ({
      category: category.replace(/([A-Z])/g, ' $1').trim(),
      reduction: reduction.toFixed(1),
    })),
    recommendations: [] as string[],
  };
  
  // Generate recommendations based on analysis
  if (baseline.landfill > intervention.landfill) {
    insights.recommendations.push('Landfill diversion is effective. Consider increasing organic waste composting.');
  }
  
  if (baseline.recycling > intervention.recycling) {
    insights.recommendations.push('Enhanced recycling shows strong emission reduction. Expand material recovery program.');
  }
  
  if (baseline.transportation > intervention.transportation) {
    insights.recommendations.push('Fleet optimization is working. Consider further electrification of vehicles.');
  }
  
  if (intervention.openBurning > 0) {
    insights.recommendations.push('⚠️ Open burning still present. Eliminating this practice would significantly reduce emissions and air pollution.');
  }
  
  return insights;
}
