// GHG Emission Calculations Library - FIXED VERSION
// Based on IPCC 2006 Guidelines and IGES Calculator vIII
// All formulas verified against calculation_guide.md

import type { TransportationInput, EmissionResult } from '@/types/emission';

// ==================== GLOBAL CONSTANTS ====================

// Global Warming Potential (IPCC AR4)
export const GWP = {
  CO2: 1,
  CH4: 25,
  N2O: 298
};

// Grid electricity emission factor for China
export const GRID_ELECTRICITY_EF = 0.855; // kg CO2-eq/kWh

// Fuel emission factors (IPCC defaults from calculation_guide.md)
export const FUEL_EF = {
  diesel: {
    energyContent: 36.3972, // MJ/L
    density: 0.84, // kg/L
    CO2: 0.0741, // kg/MJ
    CH4: 0.000003, // kg/MJ
    N2O: 0.0000006 // kg/MJ
  },
  gasoline: {
    energyContent: 35.84,
    density: 0.8,
    CO2: 0.0693,
    CH4: 0.000003,
    N2O: 0.0000006
  },
  lpg: {
    energyContent: 25.0743,
    density: 0.53,
    CO2: 0.0631,
    CH4: 0.000003,
    N2O: 0.0000006
  },
  kerosene: {
    energyContent: 35.8,
    density: 0.8,
    CO2: 0.0716,
    CH4: 0.000003,
    N2O: 0.0000006
  },
  naturalGas: {
    energyContent: 0.038931, // MJ/kg (NOT per liter!)
    density: 0.00074, // kg/m³
    CO2: 0.056, // kg/MJ
    CH4: 0.0000003, // kg/MJ
    N2O: 0.0000000001 // kg/MJ
  }
};

// ==================== TRANSPORTATION ====================

export function calculateTransportation(input: TransportationInput): EmissionResult {
  const fuelType = input.fuelType || 'diesel';
  const wasteAmount = input.wasteTransported || 0;
  let fuelConsumption = input.totalFuel || 0;
  const electricityConsumption = input.electricity || 0;
  
  // Calculate total fuel if consumption rate is provided
  if (input.distance && input.tripsPerMonth && input.fuelConsumption) {
    fuelConsumption = input.distance * input.tripsPerMonth * input.fuelConsumption;
  }
  
  if (wasteAmount === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  let co2 = 0, ch4 = 0, n2o = 0;

  if (fuelType === 'electric') {
    // Electric vehicle - only indirect emissions from electricity generation
    const totalEmissions = electricityConsumption * GRID_ELECTRICITY_EF;
    const emissionPerTonne = totalEmissions / wasteAmount;
    
    return {
      totalEmission: emissionPerTonne,
      totalCO2e: emissionPerTonne / 1000,
      co2: emissionPerTonne, // Treated as CO2-eq
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  } else if (fuelType === 'naturalGas') {
    // Natural gas is measured in kg/month, not L/month
    const energy = fuelConsumption * FUEL_EF.naturalGas.energyContent; // MJ
    co2 = energy * FUEL_EF.naturalGas.CO2;
    ch4 = energy * FUEL_EF.naturalGas.CH4;
    n2o = energy * FUEL_EF.naturalGas.N2O;
  } else {
    // Fossil fuel calculation (diesel, gasoline, LPG, kerosene)
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelConsumption * ef.energyContent; // MJ
    
    co2 = energy * ef.CO2; // kg
    ch4 = energy * ef.CH4; // kg
    n2o = energy * ef.N2O; // kg
  }
  
  const totalCO2eq = co2 + (ch4 * GWP.CH4) + (n2o * GWP.N2O);
  const emissionPerTonne = totalCO2eq / wasteAmount;

  return {
    totalEmission: emissionPerTonne,
    totalCO2e: emissionPerTonne / 1000,
    co2: co2 / wasteAmount,
    ch4: ch4 / wasteAmount,
    n2o: n2o / wasteAmount,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== LANDFILL (IPCC FOD METHOD) ====================

// Degradable Organic Carbon (DOC) values from IPCC 2006
const DOC_VALUES: Record<string, number> = {
  foodWaste: 0.15,
  food: 0.15,
  gardenWaste: 0.2,
  garden: 0.2,
  paper: 0.41,
  wood: 0.43,
  textile: 0.24,
  nappies: 0.24,
  disposableNappies: 0.24,
  rubber: 0.45,
  leather: 0.45
};

// Methane generation rate constant (k) for tropical climate
const K_VALUES: Record<string, number> = {
  foodWaste: 0.4,
  food: 0.4,
  gardenWaste: 0.17,
  garden: 0.17,
  paper: 0.07,
  wood: 0.035,
  textile: 0.07,
  nappies: 0.17,
  disposableNappies: 0.17
};

export function calculateLandfill(input: any): EmissionResult {
  const wastePerMonth = input.wastePerMonth || input.wasteAmount || 0;
  const composition = input.composition || {};
  const mcf = input.mcf || 0.8; // Methane Correction Factor
  const gasRecoveryEfficiency = input.gasRecovery || 0; // %
  const oxidationFactor = input.oxidation || 0; // Default 0 for unmanaged
  const fuelUse = input.fuelUse || {};
  
  if (wastePerMonth === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // Calculate weighted DOC based on composition
  let weightedDOC = 0;
  let weightedK = 0;
  let totalCompositionWeight = 0;

  Object.keys(composition).forEach(key => {
    const percentage = composition[key] || 0;
    const docValue = DOC_VALUES[key] || 0;
    const kValue = K_VALUES[key] || 0.05;
    
    weightedDOC += (percentage / 100) * docValue;
    weightedK += (percentage / 100) * kValue;
    totalCompositionWeight += percentage;
  });

  // IPCC FOD Method parameters
  const DOCf = 0.5; // Fraction of DOC that decomposes (IPCC default)
  const F = 0.5; // Fraction of CH4 in landfill gas (IPCC default)
  const R = gasRecoveryEfficiency / 100; // Recovery efficiency
  const OX = oxidationFactor; // Oxidation factor

  // Convert monthly to annual for FOD calculation
  const wastePerYear = wastePerMonth * 12; // tonnes/year
  const wasteInGg = wastePerYear / 1000; // Gigagrams (Gg)

  // Calculate DDOCm deposited (Degradable DOC deposited)
  const DDOCm = wasteInGg * weightedDOC * DOCf * mcf; // Gg

  // Simplified FOD - assuming steady state after several years
  // For full FOD, we would need multi-year tracking
  // Using simplified formula: CH4 = DDOCm * (16/12) * F
  const ch4GeneratedGg = DDOCm * (16/12) * F; // Gg CH4
  const ch4GeneratedKg = ch4GeneratedGg * 1000000; // kg CH4 per year
  const ch4GeneratedPerMonth = ch4GeneratedKg / 12; // kg CH4 per month

  // Apply recovery and oxidation
  const ch4EmittedPerMonth = ch4GeneratedPerMonth * (1 - R) * (1 - OX);
  
  // Per tonne of waste
  const ch4PerTonne = ch4EmittedPerMonth / wastePerMonth;
  
  // Calculate operational emissions from fuel use
  let operationalEmissions = 0;
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    operationalEmissions = (energy * ef.CO2 + 
                           energy * ef.CH4 * GWP.CH4 + 
                           energy * ef.N2O * GWP.N2O) / wastePerMonth;
  }

  // Total emissions in kg CO2-eq per tonne
  const totalEmission = (ch4PerTonne * GWP.CH4) + operationalEmissions;

  return {
    totalEmission: totalEmission,
    totalCO2e: totalEmission / 1000,
    co2: operationalEmissions,
    ch4: ch4PerTonne,
    n2o: 0,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== COMPOSTING ====================

export function calculateComposting(input: any): EmissionResult {
  const foodWaste = input.foodWaste || 0;
  const gardenWaste = input.gardenWaste || 0;
  const totalWaste = foodWaste + gardenWaste;
  const compostProduction = input.compostProduction || 0;
  const compostUsePercentage = input.compostUsePercentage || 100;
  const fuelUse = input.fuelUse || {};
  
  if (totalWaste === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // IPCC default emission factors for composting
  const CH4_EF = 4; // g CH4/kg organic waste (wet basis)
  const N2O_EF = 0.3; // g N2O/kg organic waste (wet basis)
  
  const ch4Emission = (totalWaste * 1000 * CH4_EF) / 1000; // kg CH4
  const n2oEmission = (totalWaste * 1000 * N2O_EF) / 1000; // kg N2O
  
  // Process emissions
  const processEmissions = (ch4Emission * GWP.CH4 + n2oEmission * GWP.N2O) / totalWaste;
  
  // Operational emissions from fuel use
  let operationalEmissions = 0;
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    operationalEmissions = (energy * ef.CO2 + 
                           energy * ef.CH4 * GWP.CH4 + 
                           energy * ef.N2O * GWP.N2O) / totalWaste;
  }
  
  const directEmissions = processEmissions + operationalEmissions;
  
  // Avoided emissions from chemical fertilizer replacement
  const FERTILIZER_REPLACEMENT = {
    N: 7.1,      // kg N/tonne compost
    P2O5: 4.1,   // kg P2O5/tonne compost
    K2O: 5.4     // kg K2O/tonne compost
  };
  
  const FERTILIZER_EF = {
    N: 2.404,    // kg CO2-eq/kg N fertilizer
    P2O5: 0.448, // kg CO2-eq/kg P2O5
    K2O: 0.443   // kg CO2-eq/kg K2O
  };
  
  const compostUsed = compostProduction * (compostUsePercentage / 100);
  const avoidedEmissions = compostUsed > 0 
    ? ((FERTILIZER_REPLACEMENT.N * FERTILIZER_EF.N + 
        FERTILIZER_REPLACEMENT.P2O5 * FERTILIZER_EF.P2O5 + 
        FERTILIZER_REPLACEMENT.K2O * FERTILIZER_EF.K2O) * compostUsed) / totalWaste
    : 0;
  
  const netEmissions = directEmissions - avoidedEmissions;

  return {
    totalEmission: netEmissions,
    totalCO2e: netEmissions / 1000,
    co2: operationalEmissions / totalWaste,
    ch4: ch4Emission / totalWaste,
    n2o: n2oEmission / totalWaste,
    directEmissions: directEmissions,
    avoidedEmissions: avoidedEmissions,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== ANAEROBIC DIGESTION ====================

export function calculateAnaerobicDigestion(input: any): EmissionResult {
  const foodWaste = input.foodWaste || 0;
  const gardenWaste = input.gardenWaste || 0;
  const totalWaste = foodWaste + gardenWaste;
  const fuelUse = input.fuelUse || {};
  const electricityUse = input.electricityUse || 0;
  const biogasUtilization = input.biogasUtilization || 'thermal';
  
  if (totalWaste === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // IPCC default for AD
  const CH4_LEAKAGE_EF = 0.8; // g CH4/kg wet weight (unavoidable leakage)
  const ch4Leakage = (totalWaste * 1000 * CH4_LEAKAGE_EF) / 1000; // kg CH4
  
  // Operational emissions
  let operationalEmissions = 0;
  
  // From fuel
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    operationalEmissions += energy * ef.CO2 + 
                           energy * ef.CH4 * GWP.CH4 + 
                           energy * ef.N2O * GWP.N2O;
  }
  
  // From electricity
  operationalEmissions += electricityUse * GRID_ELECTRICITY_EF;
  
  const directEmissions = (ch4Leakage * GWP.CH4 + operationalEmissions) / totalWaste;
  
  // Theoretical biogas production (from literature)
  const BIOGAS_PRODUCTION = 150; // m³ biogas/tonne organic waste
  const CH4_CONTENT = 0.6; // 60% methane in biogas
  const CH4_HEATING_VALUE = 37; // MJ/m³ CH4
  const CH4_DENSITY = 0.7168; // kg/m³
  
  const biogasProduced = totalWaste * BIOGAS_PRODUCTION; // m³
  const ch4Volume = biogasProduced * CH4_CONTENT; // m³ CH4
  const energyContent = ch4Volume * CH4_HEATING_VALUE; // MJ
  
  // Avoided emissions based on utilization
  let avoidedEmissions = 0;
  
  if (biogasUtilization === 'thermal') {
    // Replacing LPG for thermal energy
    const lpgReplaced = energyContent / FUEL_EF.lpg.energyContent; // L of LPG
    avoidedEmissions = (lpgReplaced * FUEL_EF.lpg.energyContent * FUEL_EF.lpg.CO2) / totalWaste;
  } else if (biogasUtilization === 'electricity') {
    // Electricity generation (35% efficiency typical)
    const electricityProduced = energyContent / 3.6 * 0.35; // kWh
    avoidedEmissions = (electricityProduced * GRID_ELECTRICITY_EF) / totalWaste;
  } else if (biogasUtilization === 'both') {
    // 50% electricity, 50% heat
    const electricityProduced = energyContent / 3.6 * 0.35 * 0.5; // kWh
    const thermalEnergy = energyContent * 0.5; // MJ
    const lpgReplaced = thermalEnergy / FUEL_EF.lpg.energyContent;
    
    avoidedEmissions = ((electricityProduced * GRID_ELECTRICITY_EF) +
                       (lpgReplaced * FUEL_EF.lpg.energyContent * FUEL_EF.lpg.CO2)) / totalWaste;
  }
  
  const netEmissions = directEmissions - avoidedEmissions;

  return {
    totalEmission: netEmissions,
    totalCO2e: netEmissions / 1000,
    co2: operationalEmissions / totalWaste,
    ch4: ch4Leakage / totalWaste,
    n2o: 0,
    directEmissions: directEmissions,
    avoidedEmissions: avoidedEmissions,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== INCINERATION (IPCC METHOD) ====================

// Dry Matter, Total Carbon, and Fossil Carbon Fraction (IPCC 2006 defaults)
const INCINERATION_PARAMS: Record<string, { dm: number, tc: number, fcf: number, of: number }> = {
  foodWaste: { dm: 40, tc: 38, fcf: 0, of: 100 },
  food: { dm: 40, tc: 38, fcf: 0, of: 100 },
  gardenWaste: { dm: 40, tc: 49, fcf: 0, of: 100 },
  garden: { dm: 40, tc: 49, fcf: 0, of: 100 },
  paper: { dm: 90, tc: 46, fcf: 1, of: 100 },
  cardboard: { dm: 90, tc: 46, fcf: 1, of: 100 },
  textile: { dm: 80, tc: 50, fcf: 20, of: 100 },
  wood: { dm: 85, tc: 50, fcf: 0, of: 100 },
  nappies: { dm: 40, tc: 70, fcf: 10, of: 100 },
  disposableNappies: { dm: 40, tc: 70, fcf: 10, of: 100 },
  rubber: { dm: 84, tc: 67, fcf: 20, of: 100 },
  leather: { dm: 84, tc: 67, fcf: 20, of: 100 },
  plastics: { dm: 100, tc: 75, fcf: 100, of: 100 },
  glass: { dm: 100, tc: 0, fcf: 0, of: 100 },
  metal: { dm: 100, tc: 0, fcf: 0, of: 100 },
  hazardous: { dm: 90, tc: 50, fcf: 50, of: 100 },
  others: { dm: 90, tc: 3, fcf: 100, of: 100 }
};

export function calculateIncineration(input: any): EmissionResult {
  const wasteAmount = input.wasteAmount || 0;
  const composition = input.composition || {};
  const fuelUse = input.fuelUse || {};
  const electricityUse = input.electricityUse || 0;
  const energyRecovery = input.energyRecovery || {};
  const incinerationType = input.incinerationType || 'no-energy';
  
  if (wasteAmount === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // Calculate fossil CO2 emissions using IPCC formula
  // CO2 = Σ[Waste × DM × TC × FCF × OF × (44/12)]
  let totalFossilCO2 = 0;
  
  Object.keys(composition).forEach(component => {
    const percentage = composition[component] || 0;
    const amount = (percentage / 100) * wasteAmount; // tonnes
    const params = INCINERATION_PARAMS[component] || INCINERATION_PARAMS.others;
    
    // Convert percentages to fractions
    const dm = params.dm / 100;
    const tc = params.tc / 100;
    const fcf = params.fcf / 100;
    const of = params.of / 100;
    
    // CO2 emissions in kg (44/12 is molecular weight ratio CO2/C)
    const co2 = amount * 1000 * dm * tc * fcf * of * (44/12);
    totalFossilCO2 += co2;
  });
  
  // N2O emissions (IPCC default for incineration)
  const N2O_EF = 0.05; // kg N2O/tonne waste
  const n2oEmission = wasteAmount * N2O_EF;
  
  // Operational emissions
  let operationalEmissions = 0;
  
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    operationalEmissions += energy * ef.CO2 + 
                           energy * ef.CH4 * GWP.CH4 + 
                           energy * ef.N2O * GWP.N2O;
  }
  
  operationalEmissions += electricityUse * GRID_ELECTRICITY_EF;
  
  const directEmissions = (totalFossilCO2 + n2oEmission * GWP.N2O + operationalEmissions) / wasteAmount;
  
  // Calculate avoided emissions from energy recovery
  let avoidedEmissions = 0;
  
  if (incinerationType !== 'no-energy') {
    // Theoretical energy content of waste (assume 10 GJ/tonne average)
    const ENERGY_CONTENT = 10000; // MJ/tonne
    
    if (incinerationType === 'electricity' || incinerationType === 'both') {
      const electricityEfficiency = (energyRecovery.electricityEfficiency || 25) / 100;
      const onsitePercentage = (energyRecovery.electricityOnsitePercentage || 10) / 100;
      
      const electricityProduced = (ENERGY_CONTENT * electricityEfficiency) / 3.6; // kWh/tonne
      const electricityExported = electricityProduced * (1 - onsitePercentage);
      
      avoidedEmissions += electricityExported * GRID_ELECTRICITY_EF;
    }
    
    if (incinerationType === 'heat' || incinerationType === 'both') {
      const heatEfficiency = (energyRecovery.heatEfficiency || 60) / 100;
      const onsitePercentage = (energyRecovery.heatOnsitePercentage || 20) / 100;
      const replacedFuelType = (energyRecovery.replacedFuelType || 'diesel').toLowerCase();
      
      const heatProduced = ENERGY_CONTENT * heatEfficiency; // MJ/tonne
      const heatExported = heatProduced * (1 - onsitePercentage);
      
      const ef = FUEL_EF[replacedFuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
      const fuelReplaced = heatExported / ef.energyContent; // L
      
      avoidedEmissions += fuelReplaced * ef.energyContent * ef.CO2;
    }
  }
  
  const netEmissions = directEmissions - avoidedEmissions;

  return {
    totalEmission: netEmissions,
    totalCO2e: netEmissions / 1000,
    co2: totalFossilCO2 / wasteAmount,
    ch4: 0,
    n2o: n2oEmission / wasteAmount,
    directEmissions: directEmissions,
    avoidedEmissions: avoidedEmissions,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== OPEN BURNING ====================

// Same parameters as incineration but with Oxidation Factor = 58%
const OPEN_BURNING_PARAMS: Record<string, { dm: number, tc: number, fcf: number, of: number }> = {
  foodWaste: { dm: 40, tc: 38, fcf: 0, of: 58 },
  food: { dm: 40, tc: 38, fcf: 0, of: 58 },
  gardenWaste: { dm: 40, tc: 49, fcf: 0, of: 58 },
  garden: { dm: 40, tc: 49, fcf: 0, of: 58 },
  paper: { dm: 90, tc: 46, fcf: 1, of: 58 },
  cardboard: { dm: 90, tc: 46, fcf: 1, of: 58 },
  textile: { dm: 80, tc: 50, fcf: 20, of: 58 },
  wood: { dm: 85, tc: 50, fcf: 0, of: 58 },
  nappies: { dm: 40, tc: 70, fcf: 10, of: 58 },
  disposableNappies: { dm: 40, tc: 70, fcf: 10, of: 58 },
  rubber: { dm: 84, tc: 67, fcf: 20, of: 58 },
  leather: { dm: 84, tc: 67, fcf: 20, of: 58 },
  plastics: { dm: 100, tc: 75, fcf: 100, of: 58 },
  glass: { dm: 100, tc: 0, fcf: 0, of: 58 },
  metal: { dm: 100, tc: 0, fcf: 0, of: 58 },
  hazardous: { dm: 90, tc: 50, fcf: 50, of: 58 },
  others: { dm: 90, tc: 3, fcf: 100, of: 58 }
};

export function calculateOpenBurning(input: any): EmissionResult {
  const wasteAmount = input.wasteAmount || 0;
  const composition = input.composition || {};
  
  if (wasteAmount === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // Calculate fossil CO2 emissions (same formula as incineration but OF=58%)
  let totalFossilCO2 = 0;
  
  Object.keys(composition).forEach(component => {
    const percentage = composition[component] || 0;
    const amount = (percentage / 100) * wasteAmount; // tonnes
    const params = OPEN_BURNING_PARAMS[component] || OPEN_BURNING_PARAMS.others;
    
    const dm = params.dm / 100;
    const tc = params.tc / 100;
    const fcf = params.fcf / 100;
    const of = params.of / 100; // 0.58 for open burning
    
    const co2 = amount * 1000 * dm * tc * fcf * of * (44/12);
    totalFossilCO2 += co2;
  });
  
  // N2O emissions for open burning (typically higher than controlled incineration)
  const N2O_EF = 0.1; // kg N2O/tonne (higher than incineration)
  const n2oEmission = wasteAmount * N2O_EF;
  
  // CH4 emissions for incomplete combustion
  const CH4_EF = 6.5; // kg CH4/tonne (average for open burning)
  const ch4Emission = wasteAmount * CH4_EF;
  
  const totalEmission = (totalFossilCO2 + ch4Emission * GWP.CH4 + n2oEmission * GWP.N2O) / wasteAmount;

  return {
    totalEmission: totalEmission,
    totalCO2e: totalEmission / 1000,
    co2: totalFossilCO2 / wasteAmount,
    ch4: ch4Emission / wasteAmount,
    n2o: n2oEmission / wasteAmount,
    unit: 'kg CO2-eq/tonne',
    warning: '⚠️ Open burning produces extremely high emissions and toxic air pollutants! Strongly discouraged!'
  };
}

// ==================== MBT (MECHANICAL BIOLOGICAL TREATMENT) ====================

export function calculateMBT(input: any): EmissionResult {
  const mixedWaste = input.mixedWaste || 0;
  const biodegradablePercentage = input.biodegradablePercentage || 50;
  const fuelUse = input.fuelUse || {};
  const electricityUse = input.electricityUse || 0;
  const compostProduction = input.compostProduction || 0;
  const compostUsePercentage = input.compostUsePercentage || 50;
  const plasticUtilization = input.plasticUtilization || 'none';
  const plasticAmount = input.plasticAmount || 0;
  const crudeOilProduction = input.crudeOilProduction || 0;
  const crudeOilUsePercentage = input.crudeOilUsePercentage || 0;
  
  if (mixedWaste === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // 1. Mechanical separation operational emissions
  let mechanicalEmissions = 0;
  
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    mechanicalEmissions += energy * ef.CO2 + 
                          energy * ef.CH4 * GWP.CH4 + 
                          energy * ef.N2O * GWP.N2O;
  }
  
  mechanicalEmissions += electricityUse * GRID_ELECTRICITY_EF;
  
  // 2. Biological treatment emissions (composting of bio-fraction)
  const biodegradableWaste = mixedWaste * (biodegradablePercentage / 100);
  const CH4_EF = 4; // g CH4/kg
  const N2O_EF = 0.3; // g N2O/kg
  
  const ch4FromBioTreatment = (biodegradableWaste * 1000 * CH4_EF) / 1000;
  const n2oFromBioTreatment = (biodegradableWaste * 1000 * N2O_EF) / 1000;
  
  const bioTreatmentEmissions = ch4FromBioTreatment * GWP.CH4 + n2oFromBioTreatment * GWP.N2O;
  
  const directEmissions = (mechanicalEmissions + bioTreatmentEmissions) / mixedWaste;
  
  // 3. Avoided emissions
  let avoidedEmissions = 0;
  
  // From compost use
  if (compostProduction > 0) {
    const FERTILIZER_REPLACEMENT = {
      N: 7.1, P2O5: 4.1, K2O: 5.4
    };
    const FERTILIZER_EF = {
      N: 2.404, P2O5: 0.448, K2O: 0.443
    };
    
    const compostUsed = compostProduction * (compostUsePercentage / 100);
    avoidedEmissions += ((FERTILIZER_REPLACEMENT.N * FERTILIZER_EF.N + 
                         FERTILIZER_REPLACEMENT.P2O5 * FERTILIZER_EF.P2O5 + 
                         FERTILIZER_REPLACEMENT.K2O * FERTILIZER_EF.K2O) * compostUsed) / mixedWaste;
  }
  
  // From plastic utilization (RDF or crude oil)
  if (plasticUtilization === 'rdf' && plasticAmount > 0) {
    const RDF_ENERGY = 15; // MJ/kg
    const rdfEnergy = plasticAmount * 1000 * RDF_ENERGY; // MJ
    const electricityFromRDF = rdfEnergy / 3.6 * 0.3; // kWh (30% efficiency)
    avoidedEmissions += (electricityFromRDF * GRID_ELECTRICITY_EF) / mixedWaste;
  } else if (plasticUtilization === 'crudeOil' && crudeOilProduction > 0) {
    const crudeOilUsed = crudeOilProduction * (crudeOilUsePercentage / 100);
    // Assuming crude oil replaces diesel
    const crudeOilEnergy = crudeOilUsed * FUEL_EF.diesel.energyContent;
    avoidedEmissions += (crudeOilEnergy * FUEL_EF.diesel.CO2) / mixedWaste;
  }
  
  const netEmissions = directEmissions - avoidedEmissions;

  return {
    totalEmission: netEmissions,
    totalCO2e: netEmissions / 1000,
    co2: mechanicalEmissions / mixedWaste,
    ch4: ch4FromBioTreatment / mixedWaste,
    n2o: n2oFromBioTreatment / mixedWaste,
    directEmissions: directEmissions,
    avoidedEmissions: avoidedEmissions,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== RECYCLING ====================

export function calculateRecycling(input: any): EmissionResult {
  const totalRecyclables = input.totalRecyclables || 0;
  const composition = input.composition || {};
  const fuelUse = input.fuelUse || {};
  const electricityUse = input.electricityUse || 0;
  const recyclability = input.recyclability || 100;
  
  if (totalRecyclables === 0) {
    return {
      totalEmission: 0,
      totalCO2e: 0,
      co2: 0,
      ch4: 0,
      n2o: 0,
      unit: 'kg CO2-eq/tonne'
    };
  }

  // Operational emissions
  let operationalEmissions = 0;
  
  if (fuelUse.amount && fuelUse.type) {
    const fuelType = fuelUse.type.toLowerCase();
    const ef = FUEL_EF[fuelType as keyof typeof FUEL_EF] || FUEL_EF.diesel;
    const energy = fuelUse.amount * ef.energyContent;
    operationalEmissions += energy * ef.CO2 + 
                           energy * ef.CH4 * GWP.CH4 + 
                           energy * ef.N2O * GWP.N2O;
  }
  
  operationalEmissions += electricityUse * GRID_ELECTRICITY_EF;
  
  // Avoided emissions from recycling (from literature - calculation_guide.md)
  const RECYCLING_EF = {
    paper: 1.74,      // kg CO2-eq/kg virgin paper avoided
    plastic: 1.745,   // kg CO2-eq/kg virgin plastic avoided
    aluminium: 0.59,  // kg CO2-eq/kg recycled (vs virgin production much higher)
    aluminum: 0.59,
    steel: 1.53,      // kg CO2-eq/kg virgin steel avoided
    glass: 0.353      // kg CO2-eq/kg virgin glass avoided
  };
  
  const RECYCLING_EMISSION = {
    paper: 1.4,
    plastic: 0.66,
    aluminium: 0.59,
    aluminum: 0.59,
    steel: 1.53,
    glass: 0.353
  };
  
  let totalAvoidedEmissions = 0;
  
  Object.keys(composition).forEach(material => {
    const percentage = composition[material] || 0;
    const amount = (percentage / 100) * totalRecyclables * (recyclability / 100);
    const avoidedEF = RECYCLING_EF[material as keyof typeof RECYCLING_EF] || 0;
    
    totalAvoidedEmissions += amount * 1000 * avoidedEF; // kg CO2-eq
  });
  
  const avoidedEmissionsPerTonne = totalAvoidedEmissions / totalRecyclables;
  const operationalEmissionsPerTonne = operationalEmissions / totalRecyclables;
  const netEmissions = operationalEmissionsPerTonne - avoidedEmissionsPerTonne;

  return {
    totalEmission: netEmissions,
    totalCO2e: netEmissions / 1000,
    co2: operationalEmissionsPerTonne,
    ch4: 0,
    n2o: 0,
    directEmissions: operationalEmissionsPerTonne,
    avoidedEmissions: avoidedEmissionsPerTonne,
    unit: 'kg CO2-eq/tonne'
  };
}

// ==================== UTILITY FUNCTIONS ====================

export function formatEmissionResult(result: EmissionResult): string {
  return `${result.totalEmission.toFixed(2)} ${result.unit || 'kg CO2-eq'}`;
}

export function convertUnits(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, number>> = {
    'kg': { 'tonne': 0.001, 'g': 1000, 'kg': 1 },
    'tonne': { 'kg': 1000, 'g': 1000000, 'tonne': 1 },
    'g': { 'kg': 0.001, 'tonne': 0.000001, 'g': 1 }
  };
  
  if (fromUnit === toUnit) return value;
  return value * (conversions[fromUnit]?.[toUnit] || 1);
}
