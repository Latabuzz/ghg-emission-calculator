// Utility to convert module calculation results to Scenario format
// Allows saving individual module calculations as complete scenarios

import { Scenario } from './scenarioStorage';
import { TransportationInput, LandfillInput, EmissionResult } from '@/types/emission';

/**
 * Create a scenario from Transportation module results
 */
export function createScenarioFromTransportation(
  input: TransportationInput,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  // Calculate fleet from input
  const totalFuel = input.totalFuel || 0;
  const fuelEfficiency = input.fuelConsumption || 0.25;
  const distance = input.distance || 0;
  const trips = input.tripsPerMonth || 0;
  
  // Estimate number of trucks based on workload
  const totalDistance = distance * trips;
  const dieselTrucks = input.fuelType !== 'electric' ? Math.max(1, Math.ceil(totalDistance / 500)) : 0;
  const electricTrucks = input.fuelType === 'electric' ? Math.max(1, Math.ceil(totalDistance / 500)) : 0;

  return {
    name: scenarioName || `Transportation Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on ${input.fuelType} transport: ${distance} km × ${trips} trips/month`,
    isBaseline: false,
    wasteComposition: {
      // Use default composition - user can adjust in modal
      food: 35,
      paper: 20,
      plastic: 15,
      metal: 10,
      glass: 5,
      textile: 5,
      others: 10,
    },
    treatmentAllocation: {
      // Default allocation - user can adjust in modal
      landfill: 60,
      composting: 10,
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 15,
      incineration: 10,
      openBurning: 5,
    },
    fleet: {
      dieselTrucks,
      electricTrucks,
      totalDistance,
      fuelEfficiency,
    },
  };
}

/**
 * Create a scenario from Landfill module results
 */
export function createScenarioFromLandfill(
  input: LandfillInput,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  const composition = input.composition;
  
  // Convert composition percentages to waste composition (normalize to 100%)
  const total = Object.values(composition).reduce((sum, val) => sum + val, 0);
  const normalize = (val: number) => total > 0 ? (val / total) * 100 : 0;

  // Map landfill composition to scenario waste types (simplified mapping)
  const wasteComposition = {
    food: normalize(composition.foodWaste || 0),
    paper: normalize(composition.paper || 0),
    plastic: normalize(composition.plastics || 0),
    metal: normalize(composition.metal || 0),
    glass: normalize(composition.glass || 0),
    textile: normalize(composition.textile || 0),
    others: normalize(
      (composition.leather || 0) + 
      (composition.wood || 0) + 
      (composition.nappies || 0) + 
      (composition.hazardous || 0) + 
      (composition.others || 0)
    ),
  };

  return {
    name: scenarioName || `Landfill Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on ${input.wastePerMonth} tonnes/month with ${(input.gasRecovery || 0) * 100}% gas recovery`,
    isBaseline: false,
    wasteComposition,
    treatmentAllocation: {
      landfill: 100, // This scenario focuses on landfill
      composting: 0,
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 0,
      incineration: 0,
      openBurning: 0,
    },
    fleet: {
      // Default fleet - user can adjust
      dieselTrucks: Math.max(1, Math.ceil((input.wastePerMonth || 1000) / 100)),
      electricTrucks: 0,
      totalDistance: 500,
      fuelEfficiency: 0.25,
    },
  };
}

/**
 * Create a scenario from Composting module results
 */
export function createScenarioFromComposting(
  input: any, // CompostingInput
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `Composting Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on ${input.wasteAmount || 0} tonnes composting`,
    isBaseline: false,
    wasteComposition: {
      // Composting typically handles organics
      food: 50,
      paper: 20,
      plastic: 0,
      metal: 0,
      glass: 0,
      textile: 10,
      others: 20,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 100, // This scenario focuses on composting
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 0,
      incineration: 0,
      openBurning: 0,
    },
    fleet: {
      dieselTrucks: 5,
      electricTrucks: 0,
      totalDistance: 300,
      fuelEfficiency: 0.22,
    },
  };
}

/**
 * Create a scenario from Anaerobic Digestion module results
 */
export function createScenarioFromAnaerobicDigestion(
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `Anaerobic Digestion Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on ${input.wasteAmount || 0} tonnes anaerobic digestion`,
    isBaseline: false,
    wasteComposition: {
      food: 60, // AD handles high food waste
      paper: 15,
      plastic: 0,
      metal: 0,
      glass: 0,
      textile: 5,
      others: 20,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 0,
      anaerobicDigestion: 100, // Focus on AD
      mbt: 0,
      recycling: 0,
      incineration: 0,
      openBurning: 0,
    },
    fleet: {
      dieselTrucks: 5,
      electricTrucks: 0,
      totalDistance: 300,
      fuelEfficiency: 0.22,
    },
  };
}

/**
 * Create a scenario from Recycling module results
 */
export function createScenarioFromRecycling(
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `Recycling Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on recycling operations`,
    isBaseline: false,
    wasteComposition: {
      food: 0, // Recycling doesn't handle organics
      paper: 30,
      plastic: 25,
      metal: 20,
      glass: 15,
      textile: 5,
      others: 5,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 0,
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 100, // Focus on recycling
      incineration: 0,
      openBurning: 0,
    },
    fleet: {
      dieselTrucks: 8,
      electricTrucks: 2,
      totalDistance: 400,
      fuelEfficiency: 0.23,
    },
  };
}

/**
 * Create a scenario from Incineration module results
 */
export function createScenarioFromIncineration(
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `Incineration Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on incineration with energy recovery`,
    isBaseline: false,
    wasteComposition: {
      food: 20,
      paper: 25,
      plastic: 30, // High plastic suitable for incineration
      metal: 5,
      glass: 5,
      textile: 10,
      others: 5,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 0,
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 0,
      incineration: 100, // Focus on incineration
      openBurning: 0,
    },
    fleet: {
      dieselTrucks: 6,
      electricTrucks: 0,
      totalDistance: 350,
      fuelEfficiency: 0.24,
    },
  };
}

/**
 * Create a scenario from MBT module results
 */
export function createScenarioFromMBT(
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `MBT Scenario - ${new Date().toLocaleDateString()}`,
    description: `Based on Mechanical Biological Treatment`,
    isBaseline: false,
    wasteComposition: {
      food: 30,
      paper: 20,
      plastic: 20,
      metal: 10,
      glass: 5,
      textile: 10,
      others: 5,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 0,
      anaerobicDigestion: 0,
      mbt: 100, // Focus on MBT
      recycling: 0,
      incineration: 0,
      openBurning: 0,
    },
    fleet: {
      dieselTrucks: 7,
      electricTrucks: 0,
      totalDistance: 400,
      fuelEfficiency: 0.25,
    },
  };
}

/**
 * Create a scenario from Open Burning module results
 */
export function createScenarioFromOpenBurning(
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  return {
    name: scenarioName || `Open Burning Scenario - ${new Date().toLocaleDateString()}`,
    description: `⚠️ Current open burning practice (high emissions)`,
    isBaseline: false,
    wasteComposition: {
      food: 25,
      paper: 25,
      plastic: 25, // High emissions from plastic burning
      metal: 5,
      glass: 5,
      textile: 10,
      others: 5,
    },
    treatmentAllocation: {
      landfill: 0,
      composting: 0,
      anaerobicDigestion: 0,
      mbt: 0,
      recycling: 0,
      incineration: 0,
      openBurning: 100, // All open burning (worst case)
    },
    fleet: {
      dieselTrucks: 3,
      electricTrucks: 0,
      totalDistance: 200,
      fuelEfficiency: 0.25,
    },
  };
}

/**
 * Generic function to route to appropriate converter based on module type
 */
export function createScenarioFromModule(
  moduleType: 'transportation' | 'landfill' | 'composting' | 'anaerobic-digestion' | 'recycling' | 'incineration' | 'mbt' | 'open-burning',
  input: any,
  result: EmissionResult,
  scenarioName?: string
): Partial<Scenario> {
  switch (moduleType) {
    case 'transportation':
      return createScenarioFromTransportation(input, result, scenarioName);
    case 'landfill':
      return createScenarioFromLandfill(input, result, scenarioName);
    case 'composting':
      return createScenarioFromComposting(input, result, scenarioName);
    case 'anaerobic-digestion':
      return createScenarioFromAnaerobicDigestion(input, result, scenarioName);
    case 'recycling':
      return createScenarioFromRecycling(input, result, scenarioName);
    case 'incineration':
      return createScenarioFromIncineration(input, result, scenarioName);
    case 'mbt':
      return createScenarioFromMBT(input, result, scenarioName);
    case 'open-burning':
      return createScenarioFromOpenBurning(input, result, scenarioName);
    default:
      throw new Error(`Unknown module type: ${moduleType}`);
  }
}
