'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw as MBTIcon,
  Calculator,
  Info,
  Save,
  RotateCcw,
  Leaf,
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MBTInput, EmissionResult } from '@/types/emission';
import { calculateMBT } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function MBTModule() {
  const [input, setInput] = useState<MBTInput>({
    mixedWaste: 0,
    biodegradablePercentage: 60,
    fuelUse: {
      type: 'diesel',
      amount: 0,
    },
    electricityUse: 0,
    compostProduction: 0,
    compostUsePercentage: 80,
    plasticUtilization: 'none',
    plasticAmount: 0,
    crudeOilProduction: 0,
    crudeOilUsePercentage: 100,
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    const newResult = calculateMBT(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof MBTInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const chartData = [
    { name: 'CO₂', value: result.co2, color: '#4CA771' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
    { name: 'Avoided', value: Math.abs(Math.min((result.totalCO2e ?? 0) - (result.co2 + result.ch4 * 25 + result.n2o * 298) / 1000, 0)), color: '#10B981' },
  ].filter(item => item.value > 0);

  const biodegradableWaste = input.mixedWaste * input.biodegradablePercentage / 100;
  const compostAvoidedEmissions = input.compostProduction * 21.3 / 1000 * (input.compostUsePercentage / 100);
  const crudeOilAvoidedEmissions = input.plasticUtilization === 'crudeOil' && input.crudeOilProduction
    ? input.crudeOilProduction * 0.8 * ((input.crudeOilUsePercentage ?? 0) / 100) * 2.68 / 1000
    : 0;
  const totalAvoidedEmissions = compostAvoidedEmissions + crudeOilAvoidedEmissions;

  const plasticOptions = [
    { value: 'none', label: 'No Plastic Utilization' },
    { value: 'rdf', label: 'Refuse-Derived Fuel (RDF)' },
    { value: 'crudeOil', label: 'Crude Oil Production' },
  ];

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
            <MBTIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              MBT Emissions
            </h1>
            <h2 className="text-lg font-semibold text-secondary">Mechanical Biological Treatment</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate emissions from combined mechanical and biological waste processing
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
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>MBT Parameters</h2>

          <div className="space-y-4">
            {/* Mixed waste */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Mixed Waste Input (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.mixedWaste}
                onChange={(e) => handleInputChange('mixedWaste', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter mixed waste amount"
              />
            </div>

            {/* Biodegradable percentage */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Biodegradable Waste Percentage (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.biodegradablePercentage}
                onChange={(e) => handleInputChange('biodegradablePercentage', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="60"
              />
            </div>

            {/* Compost production */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Compost-like Production (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.compostProduction}
                onChange={(e) => handleInputChange('compostProduction', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter compost production"
              />
            </div>

            {/* Compost use percentage */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Compost Use in Agriculture (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.compostUsePercentage}
                onChange={(e) => handleInputChange('compostUsePercentage', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="80"
              />
            </div>

            {/* Plastic utilization */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Plastic Waste Utilization
              </label>
              <select
                value={input.plasticUtilization}
                onChange={(e) => handleInputChange('plasticUtilization', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                {plasticOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Plastic specific inputs */}
            {input.plasticUtilization === 'crudeOil' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Plastic Amount (tonnes/month)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={input.plasticAmount}
                    onChange={(e) => handleInputChange('plasticAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="Enter plastic amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Crude Oil Production (L/month)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={input.crudeOilProduction}
                    onChange={(e) => handleInputChange('crudeOilProduction', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="Enter crude oil production"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Crude Oil Energy Use (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={input.crudeOilUsePercentage}
                    onChange={(e) => handleInputChange('crudeOilUsePercentage', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    placeholder="100"
                  />
                </div>
              </>
            )}

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

            {/* Fuel amount */}
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
                  mixedWaste: 0,
                  biodegradablePercentage: 60,
                  fuelUse: { type: 'diesel', amount: 0 },
                  electricityUse: 0,
                  compostProduction: 0,
                  compostUsePercentage: 80,
                  plasticUtilization: 'none',
                  plasticAmount: 0,
                  crudeOilProduction: 0,
                  crudeOilUsePercentage: 100,
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="mbt"
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
              <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Calculation Results</h2>
              <Calculator style={{ color: 'var(--muted-foreground)' }} size={20} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Biodegradable Waste</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{biodegradableWaste.toFixed(2)} tonnes</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CO₂</span>
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

              {totalAvoidedEmissions > 0 && (
                <>
                  <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.2s ease' }}>
                    <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                      <TrendingDown size={16} className="mr-1" />
                      Compost Avoidance
                    </span>
                    <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{compostAvoidedEmissions.toFixed(3)} ton CO₂e</span>
                  </div>
                  {crudeOilAvoidedEmissions > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.2s ease' }}>
                      <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                        <TrendingDown size={16} className="mr-1" />
                        Crude Oil Avoidance
                      </span>
                      <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{crudeOilAvoidedEmissions.toFixed(3)} ton CO₂e</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">NET CO₂e</span>
                <span className="font-bold text-lg">{(result.totalCO2e ?? 0).toFixed(3)} ton</span>
              </div>
            </div>
          </div>

          {/* Process Summary */}
          <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
              <Leaf className="mr-2" size={20} />
              Process Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Material Processed</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{input.mixedWaste.toFixed(2)} tonnes</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Biodegradable Fraction</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{biodegradableWaste.toFixed(2)} tonnes ({input.biodegradablePercentage}%)</span>
              </div>
              {input.compostProduction > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Compost Production</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{input.compostProduction.toFixed(2)} tonnes</span>
                </div>
              )}
              {input.plasticUtilization !== 'none' && (input.plasticAmount ?? 0) > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Plastic Recovery</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{(input.plasticAmount ?? 0).toFixed(2)} tonnes ({input.plasticUtilization})</span>
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Emission Breakdown</h3>
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

          {/* Process Info */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
            <div className="flex items-start space-x-3">
              <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>MBT Process Information</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  <p>MBT combines mechanical sorting with biological treatment:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Mechanical separation of recyclables</li>
                    <li>• Biological treatment for organic fractions</li>
                    <li>• Production of compost-like materials</li>
                    <li>• Recovery of plastic waste (optional)</li>
                  </ul>
                  <p className="text-xs mt-2 italic">
                    Emission factors follow IPCC 2006 guidelines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
