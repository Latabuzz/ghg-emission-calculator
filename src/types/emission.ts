export interface EmissionResult {
  co2: number; // kg
  ch4: number; // kg
  n2o: number; // kg
  totalCO2e?: number; // ton (optional for backward compatibility)
  totalEmission: number; // kg CO2-eq (primary field)
  unit?: string; // unit description
  directEmissions?: number; // kg CO2-eq
  avoidedEmissions?: number; // kg CO2-eq
  warning?: string; // optional warning message
}

export interface TransportationInput {
  distance: number; // km per trip
  tripsPerMonth: number;
  fuelConsumption?: number; // L/km
  fuelType: 'diesel' | 'gasoline' | 'lpg' | 'naturalGas' | 'electric';
  totalFuel?: number; // L/month
  wasteTransported: number; // tonnes/month
  electricity?: number; // kWh/month for electric trucks
}

export interface LandfillInput {
  wastePerMonth: number; // tonnes
  doc: number; // degradable organic carbon
  docf: number; // fraction decomposing
  mcf: number; // methane correction factor
  oxidation: number; // oxidation factor
  gasRecovery?: number; // efficiency %
  composition: {
    foodWaste: number;
    gardenWaste: number;
    plastics: number;
    paper: number;
    textile: number;
    leather: number;
    glass: number;
    metal: number;
    wood: number;
    nappies: number;
    hazardous: number;
    others: number;
  };
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
}

export interface CompostingInput {
  foodWaste: number; // tonnes/month
  gardenWaste: number; // tonnes/month
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
  compostProduction: number; // tonnes/month
  compostUsePercentage: number; // % for agricultural purposes
}

export interface AnaerobicDigestionInput {
  foodWaste: number; // tonnes/month
  gardenWaste: number; // tonnes/month
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
  electricityUse: number; // kWh/month
  moistureContent: number; // %
  biogasUtilization: 'thermal' | 'electricity' | 'both';
  gasRecoveryEfficiency?: number; // %
  leakageRate?: number; // %
}

export interface MBTInput {
  mixedWaste: number; // tonnes/month
  biodegradablePercentage: number; // %
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
  electricityUse: number; // kWh/month
  compostProduction: number; // tonnes/month
  compostUsePercentage: number; // %
  plasticUtilization: 'none' | 'rdf' | 'crudeOil';
  plasticAmount?: number; // tonnes/month
  crudeOilProduction?: number; // L/month
  crudeOilUsePercentage?: number; // % for energy
}

export interface RecyclingInput {
  totalRecyclables: number; // tonnes/month
  composition: {
    paper: number; // %
    plastic: number; // %
    aluminium: number; // %
    steel: number; // %
    glass: number; // %
  };
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
  electricityUse: number; // kWh/month
  recyclability: number; // %
}

export interface IncinerationInput {
  incinerationType: 'no-energy' | 'electricity' | 'heat' | 'both';
  wasteAmount: number; // tonnes/month
  fuelUse?: {
    type: string;
    amount: number; // L/month
  };
  electricityUse: number; // kWh/month
  composition: {
    foodWaste: number;
    gardenWaste: number;
    plastics: number;
    paper: number;
    textile: number;
    leather: number;
    glass: number;
    metal: number;
    wood: number;
    nappies: number;
    hazardous: number;
    others: number;
  };
  energyRecovery: {
    electricityEfficiency: number;
    electricityOnsitePercentage: number;
    heatEfficiency: number;
    heatOnsitePercentage: number;
    replacedFuelType: string;
  };
}

export interface OpenBurningInput {
  wasteAmount: number; // tonnes/month
  composition: {
    foodWaste: number;
    gardenWaste: number;
    plastics: number;
    paper: number;
    textile: number;
    leather: number;
    glass: number;
    metal: number;
    nappies: number;
    hazardous: number;
    others: number;
  };
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  isBaseline: boolean;
  emissions: {
    transportation: EmissionResult;
    landfill: EmissionResult;
    composting: EmissionResult;
    anaerobicDigestion: EmissionResult;
    mbt: EmissionResult;
    recycling: EmissionResult;
    incineration: EmissionResult;
    openBurning: EmissionResult;
  };
  totalEmission: number; // ton CO2e
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  emissions: number;
}
