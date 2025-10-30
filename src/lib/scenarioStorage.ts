// LocalStorage Management for Scenarios

const STORAGE_KEY = 'ghg_scenarios';

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  isBaseline: boolean;
  createdAt: Date;
  updatedAt: Date;
  wasteComposition: {
    food: number;
    paper: number;
    plastic: number;
    metal: number;
    glass: number;
    textile: number;
    others: number;
  };
  treatmentAllocation: {
    landfill: number;
    composting: number;
    anaerobicDigestion: number;
    mbt: number;
    recycling: number;
    incineration: number;
    openBurning: number;
  };
  fleet: {
    dieselTrucks: number;
    electricTrucks: number;
    totalDistance: number;
    fuelEfficiency: number;
  };
  emissions?: {
    transportation: number;
    landfill: number;
    composting: number;
    anaerobicDigestion: number;
    mbt: number;
    recycling: number;
    incineration: number;
    openBurning: number;
    total: number;
  };
  tags?: string[];
  notes?: string;
}

/**
 * Get all scenarios from localStorage
 */
export function getScenarios(): Scenario[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultScenarios();
    
    const scenarios = JSON.parse(data);
    // Convert date strings back to Date objects
    return scenarios.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  } catch (error) {
    console.error('Error loading scenarios:', error);
    return getDefaultScenarios();
  }
}

/**
 * Save scenarios to localStorage
 */
export function saveScenarios(scenarios: Scenario[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (error) {
    console.error('Error saving scenarios:', error);
  }
}

/**
 * Add a new scenario
 */
export function addScenario(scenario: Scenario): Scenario[] {
  const scenarios = getScenarios();
  scenarios.push(scenario);
  saveScenarios(scenarios);
  return scenarios;
}

/**
 * Update an existing scenario
 */
export function updateScenario(id: string, updates: Partial<Scenario>): Scenario[] {
  const scenarios = getScenarios();
  const index = scenarios.findIndex(s => s.id === id);
  
  if (index !== -1) {
    scenarios[index] = {
      ...scenarios[index],
      ...updates,
      updatedAt: new Date(),
    };
    saveScenarios(scenarios);
  }
  
  return scenarios;
}

/**
 * Delete a scenario
 */
export function deleteScenario(id: string): Scenario[] {
  const scenarios = getScenarios();
  const filtered = scenarios.filter(s => s.id !== id);
  saveScenarios(filtered);
  return filtered;
}

/**
 * Get a single scenario by ID
 */
export function getScenarioById(id: string): Scenario | undefined {
  const scenarios = getScenarios();
  return scenarios.find(s => s.id === id);
}

/**
 * Duplicate a scenario
 */
export function duplicateScenario(id: string, newName: string): Scenario[] {
  const scenario = getScenarioById(id);
  if (!scenario) return getScenarios();
  
  const newScenario: Scenario = {
    ...scenario,
    id: `scenario-${Date.now()}`,
    name: newName,
    isBaseline: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  return addScenario(newScenario);
}

/**
 * Export scenarios to JSON
 */
export function exportScenarios(): string {
  const scenarios = getScenarios();
  return JSON.stringify(scenarios, null, 2);
}

/**
 * Import scenarios from JSON
 */
export function importScenarios(jsonString: string): Scenario[] {
  try {
    const imported = JSON.parse(jsonString);
    if (!Array.isArray(imported)) {
      throw new Error('Invalid format');
    }
    
    // Validate and add imported scenarios
    const scenarios = getScenarios();
    imported.forEach(s => {
      if (s.id && s.name) {
        scenarios.push({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(),
        });
      }
    });
    
    saveScenarios(scenarios);
    return scenarios;
  } catch (error) {
    console.error('Error importing scenarios:', error);
    throw error;
  }
}

/**
 * Get default scenarios (baseline + examples)
 */
function getDefaultScenarios(): Scenario[] {
  return [
    {
      id: 'baseline',
      name: 'Baseline Scenario',
      description: 'Current waste management practices',
      isBaseline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      wasteComposition: {
        food: 35,
        paper: 20,
        plastic: 15,
        metal: 10,
        glass: 5,
        textile: 5,
        others: 10,
      },
      treatmentAllocation: {
        landfill: 60,
        composting: 10,
        anaerobicDigestion: 0,
        mbt: 0,
        recycling: 15,
        incineration: 10,
        openBurning: 5,
      },
      fleet: {
        dieselTrucks: 10,
        electricTrucks: 0,
        totalDistance: 500,
        fuelEfficiency: 0.25,
      },
    },
    {
      id: 'intervention-1',
      name: 'Intervention A - Enhanced Recycling',
      description: 'Increased recycling and composting, reduced landfill',
      isBaseline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      wasteComposition: {
        food: 35,
        paper: 20,
        plastic: 15,
        metal: 10,
        glass: 5,
        textile: 5,
        others: 10,
      },
      treatmentAllocation: {
        landfill: 40,
        composting: 20,
        anaerobicDigestion: 10,
        mbt: 0,
        recycling: 25,
        incineration: 5,
        openBurning: 0,
      },
      fleet: {
        dieselTrucks: 8,
        electricTrucks: 2,
        totalDistance: 450,
        fuelEfficiency: 0.22,
      },
    },
    {
      id: 'intervention-2',
      name: 'Intervention B - Zero Waste Target',
      description: 'Maximum recycling and energy recovery, minimal landfill',
      isBaseline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      wasteComposition: {
        food: 35,
        paper: 20,
        plastic: 15,
        metal: 10,
        glass: 5,
        textile: 5,
        others: 10,
      },
      treatmentAllocation: {
        landfill: 20,
        composting: 25,
        anaerobicDigestion: 20,
        mbt: 10,
        recycling: 20,
        incineration: 5,
        openBurning: 0,
      },
      fleet: {
        dieselTrucks: 5,
        electricTrucks: 5,
        totalDistance: 400,
        fuelEfficiency: 0.20,
      },
    },
  ];
}

/**
 * Reset to default scenarios
 */
export function resetToDefaults(): Scenario[] {
  const defaults = getDefaultScenarios();
  saveScenarios(defaults);
  return defaults;
}
