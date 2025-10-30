'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Calculator,
  Info,
  Save,
  RotateCcw,
  TrendingDown,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { IncinerationInput, EmissionResult } from '@/types/emission';
import { calculateIncineration } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function IncinerationModule() {
  const [input, setInput] = useState<IncinerationInput>({
    incinerationType: 'both',
    wasteAmount: 0,
    fuelUse: {
      type: 'diesel',
      amount: 0,
    },
    electricityUse: 0,
    composition: {
      foodWaste: 40,
      gardenWaste: 10,
      plastics: 7,
      paper: 6,
      textile: 6,
      leather: 5,
      glass: 5,
      metal: 6,
      wood: 7,
      nappies: 2,
      hazardous: 3,
      others: 3,
    },
    energyRecovery: {
      electricityEfficiency: 25,
      electricityOnsitePercentage: 20,
      heatEfficiency: 50,
      heatOnsitePercentage: 30,
      replacedFuelType: 'naturalGas',
    },
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    const newResult = calculateIncineration(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof IncinerationInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCompositionChange = (component: keyof typeof input.composition, value: number) => {
    setInput(prev => ({
      ...prev,
      composition: { ...prev.composition, [component]: value }
    }));
  };

  const handleEnergyRecoveryChange = (field: keyof typeof input.energyRecovery, value: any) => {
    setInput(prev => ({
      ...prev,
      energyRecovery: { ...prev.energyRecovery, [field]: value }
    }));
  };

  const chartData = [
    { name: 'CO₂', value: result.co2, color: '#4CA771' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
  ].filter(item => item.value > 0);

  const energyPotential = {
    electricity: input.wasteAmount * 500, // kWh/tonne typical
    heat: input.wasteAmount * 3000, // MJ/tonne typical
    avoidedCO2Electricity: input.wasteAmount * 500 * 0.855 / 1000 * (input.energyRecovery.electricityEfficiency / 100),
    avoidedCO2Heat: input.wasteAmount * 3000 * 0.05 / 1000 * (input.energyRecovery.heatEfficiency / 100),
  };

  const totalAvoided = energyPotential.avoidedCO2Electricity + energyPotential.avoidedCO2Heat;

  const incinerationTypes = [
    { value: 'no-energy', label: 'No Energy Recovery' },
    { value: 'electricity', label: 'Electricity Generation Only' },
    { value: 'heat', label: 'Heat Recovery Only' },
    { value: 'both', label: 'Combined Heat & Power' },
  ];

  const fossilComponents = ['plastics', 'textile', 'leather', 'nappies', 'others'];
  const totalFossilCarbon = fossilComponents.reduce((sum, comp) => {
    const percentage = input.composition[comp as keyof typeof input.composition] / 100;
    const wasteMass = input.wasteAmount * percentage;
    return sum + wasteMass * 0.75 * 0.95; // Assuming 75% total carbon, 95% fossil
  }, 0);

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Incineration Emissions
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate emissions with energy recovery options
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Incineration Parameters</h2>

          <div className="space-y-4">
            {/* Waste amount */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Waste Incinerated (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.wasteAmount}
                onChange={(e) => handleInputChange('wasteAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter waste amount"
              />
            </div>

            {/* Incineration type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Incineration Type
              </label>
              <select
                value={input.incinerationType}
                onChange={(e) => handleInputChange('incinerationType', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                {incinerationTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel use */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Fuel Type for Operations
              </label>
              <select
                value={input.fuelUse?.type}
                onChange={(e) => handleInputChange('fuelUse', { ...input.fuelUse, type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
                <option value="lpg">LPG</option>
                <option value="naturalGas">Natural Gas</option>
                <option value="">No Fuel</option>
              </select>
            </div>

            {input.fuelUse?.type && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Fuel Consumption (L/month)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={input.fuelUse?.amount || 0}
                  onChange={(e) => handleInputChange('fuelUse', { ...input.fuelUse, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                  placeholder="Enter fuel consumption"
                />
              </div>
            )}

            {/* Electricity use */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Electricity Use (kWh/month)
              </label>
              <input
                type="number"
                step="1"
                value={input.electricityUse}
                onChange={(e) => handleInputChange('electricityUse', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter electricity consumption"
              />
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setInput({
                  ...input,
                  wasteAmount: 0,
                  fuelUse: { type: 'diesel', amount: 0 },
                  electricityUse: 0,
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="incineration"
                  input={input}
                  result={result}
                  disabled={!result.totalCO2e || result.totalCO2e === 0}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Emission Results */}
          <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Emission Results</h2>
              <Calculator style={{ color: 'var(--muted-foreground)' }} size={20} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Fossil CO₂</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{result.co2.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CH₄</span>
                <span className="font-semibold" style={{ color: '#85B0BA' }}>{result.ch4.toFixed(3)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>N₂O</span>
                <span className="font-semibold" style={{ color: '#FF8210' }}>{result.n2o.toFixed(3)} kg</span>
              </div>

              {totalAvoided > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                    <TrendingDown size={16} className="mr-1" />
                    Avoided Emissions
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{totalAvoided.toFixed(3)} ton CO₂e</span>
                </div>
              )}

              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">NET CO₂e</span>
                <span className="font-bold text-lg">{(result.totalCO2e ?? 0).toFixed(3)} ton</span>
              </div>
            </div>
          </div>

          {/* Energy Recovery Info */}
          {(input.incinerationType === 'electricity' || input.incinerationType === 'heat' || input.incinerationType === 'both') && input.wasteAmount > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
                <Zap className="mr-2" size={20} />
                Energy Recovery Potential
              </h3>
              <div className="space-y-3">
                {(input.incinerationType === 'electricity' || input.incinerationType === 'both') && (
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Electricity Generated</span>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {(energyPotential.electricity * (input.energyRecovery.electricityEfficiency / 100)).toFixed(0)} kWh
                    </span>
                  </div>
                )}
                {(input.incinerationType === 'heat' || input.incinerationType === 'both') && (
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Heat Generated</span>
                    <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {(energyPotential.heat * (input.energyRecovery.heatEfficiency / 100)).toFixed(0)} MJ
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Gas Composition</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Fossil Carbon Info */}
          {input.wasteAmount > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
              <div className="flex items-start space-x-3">
                <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Fossil Carbon Calculation</h3>
                  <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                    <p>Total fossil carbon: {(totalFossilCarbon * 0.44 / 12).toFixed(2)} tonnes CO₂</p>
                    <p>Components with fossil carbon:</p>
                    <ul className="ml-4 space-y-1">
                      {fossilComponents.map(comp => (
                        <li key={comp}>
                          • {comp.replace(/([A-Z])/g, ' $1').trim()}: {input.composition[comp as keyof typeof input.composition]}%
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs mt-2 italic">
                      Note: Biogenic CO₂ from organic waste is not counted in GHG accounting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Energy Recovery Settings */}
      {(input.incinerationType === 'electricity' || input.incinerationType === 'heat' || input.incinerationType === 'both') && (
        <motion.div
          className="mt-6 rounded-2xl shadow-sm p-6"
          style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Energy Recovery Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(input.incinerationType === 'electricity' || input.incinerationType === 'both') && (
              <div className="space-y-4">
                <h4 className="font-medium" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Electricity Recovery</h4>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Conversion Efficiency (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="40"
                    value={input.energyRecovery.electricityEfficiency}
                    onChange={(e) => handleEnergyRecoveryChange('electricityEfficiency', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="25%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Onsite Usage (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={input.energyRecovery.electricityOnsitePercentage}
                    onChange={(e) => handleEnergyRecoveryChange('electricityOnsitePercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="20%"
                  />
                </div>
              </div>
            )}

            {(input.incinerationType === 'heat' || input.incinerationType === 'both') && (
              <div className="space-y-4">
                <h4 className="font-medium" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Heat Recovery</h4>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Conversion Efficiency (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="70"
                    value={input.energyRecovery.heatEfficiency}
                    onChange={(e) => handleEnergyRecoveryChange('heatEfficiency', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="50%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Onsite Usage (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={input.energyRecovery.heatOnsitePercentage}
                    onChange={(e) => handleEnergyRecoveryChange('heatOnsitePercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="30%"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Waste Composition */}
      <motion.div
        className="mt-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Waste Composition</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(input.composition).map(([component, percentage]) => (
            <div key={component}>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                {component.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => handleCompositionChange(component as keyof typeof input.composition, parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-1 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderWidth: '1px', borderColor: 'var(--border)' }}
                />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Total: {Object.values(input.composition).reduce((sum, val) => sum + val, 0).toFixed(1)}%
          {Object.values(input.composition).reduce((sum, val) => sum + val, 0) !== 100 && (
            <span className="ml-2" style={{ color: 'var(--destructive)' }}>(Should equal 100%)</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
