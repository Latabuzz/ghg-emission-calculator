'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Recycle,
  Calculator,
  Info,
  Save,
  RotateCcw,
  TrendingDown,
  Package
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RecyclingInput, EmissionResult } from '@/types/emission';
import { calculateRecycling } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function RecyclingModule() {
  const [input, setInput] = useState<RecyclingInput>({
    totalRecyclables: 0,
    composition: {
      paper: 30,
      plastic: 20,
      aluminium: 5,
      steel: 10,
      glass: 35,
    },
    fuelUse: {
      type: 'diesel',
      amount: 0,
    },
    electricityUse: 0,
    recyclability: 80,
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    const newResult = calculateRecycling(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof RecyclingInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCompositionChange = (material: keyof typeof input.composition, value: number) => {
    setInput(prev => ({
      ...prev,
      composition: { ...prev.composition, [material]: value }
    }));
  };

  const recyclingData = [
    { name: 'Paper', amount: input.totalRecyclables * input.composition.paper / 100, ef: 1.74 },
    { name: 'Plastic', amount: input.totalRecyclables * input.composition.plastic / 100, ef: 1.745 },
    { name: 'Aluminium', amount: input.totalRecyclables * input.composition.aluminium / 100, ef: 0.59 },
    { name: 'Steel', amount: input.totalRecyclables * input.composition.steel / 100, ef: 1.53 },
    { name: 'Glass', amount: input.totalRecyclables * input.composition.glass / 100, ef: 0.353 },
  ];

  const avoidedEmissions = recyclingData.reduce((sum, item) =>
    sum + (item.amount * item.ef * input.recyclability / 1000 / 100), 0);

  const chartData = [
    { name: 'Operational', value: Math.max((result.totalCO2e ?? 0) + avoidedEmissions, 0), color: '#4CA771' },
    { name: 'Avoided', value: avoidedEmissions, color: '#10B981' },
  ].filter(item => item.value > 0);

  const compositionChartData = recyclingData.map(item => ({
    name: item.name,
    value: item.amount,
    ef: item.ef,
  })).filter(item => item.value > 0);

  const getMaterialColor = (name: string) => {
    const colors: { [key: string]: string } = {
      'Paper': '#8B4513',
      'Plastic': '#FF6B6B',
      'Aluminium': '#C0C0C0',
      'Steel': '#4A5568',
      'Glass': '#60A5FA',
    };
    return colors[name] || '#4CA771';
  };

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
            <Recycle className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Recycling Emissions
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate avoided emissions from material recycling
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
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Recycling Parameters</h2>

          <div className="space-y-4">
            {/* Total recyclables */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Total Recyclables (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.totalRecyclables}
                onChange={(e) => handleInputChange('totalRecyclables', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter total recyclable material"
              />
            </div>

            {/* Recyclability */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Recyclability Rate (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.recyclability}
                onChange={(e) => handleInputChange('recyclability', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter recyclability percentage"
              />
            </div>

            {/* Material Composition */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Material Composition (%)
              </label>
              <div className="space-y-2">
                {Object.entries(input.composition).map(([material, percentage]) => (
                  <div key={material} className="flex items-center space-x-2">
                    <span className="w-20 text-sm text-gray-600 capitalize">{material}</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={percentage}
                      onChange={(e) => handleCompositionChange(material as keyof typeof input.composition, parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total: {Object.values(input.composition).reduce((sum, val) => sum + val, 0).toFixed(1)}%
                {Object.values(input.composition).reduce((sum, val) => sum + val, 0) !== 100 && (
                  <span className="text-red-600 ml-2">(Should equal 100%)</span>
                )}
              </div>
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
                  totalRecyclables: 0,
                  composition: { paper: 30, plastic: 20, aluminium: 5, steel: 10, glass: 35 },
                  fuelUse: { type: 'diesel', amount: 0 },
                  electricityUse: 0,
                  recyclability: 80,
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="recycling"
                  input={input}
                  result={result}
                  disabled={!result.totalCO2e}
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
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Operational Emissions</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  {Math.max((result.totalCO2e ?? 0) + avoidedEmissions, 0).toFixed(3)} ton CO₂e
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.2s ease' }}>
                <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                  <TrendingDown size={16} className="mr-1" />
                  Avoided Emissions
                </span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{avoidedEmissions.toFixed(3)} ton CO₂e</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">NET CO₂e</span>
                <span className="font-bold text-lg">{(result.totalCO2e ?? 0).toFixed(3)} ton</span>
              </div>
            </div>
          </div>

          {/* Material Avoidance Chart */}
          {compositionChartData.length > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Material Avoidance Potential</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={compositionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) => [
                      `${value.toFixed(2)} tonnes`,
                      name === 'value' ? 'Amount' : 'EF (kg CO₂e/tonne)'
                    ]}
                  />
                  <Bar dataKey="value" fill="#4CA771" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Emission Factors Reference */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
            <div className="flex items-start space-x-3">
              <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Avoided Emission Factors</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  {recyclingData.map(item => (
                    <div key={item.name} className="flex justify-between">
                      <span>{item.name}:</span>
                      <span>{item.ef} kg CO₂e/kg</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2 italic">
                  Source: Industry reports (BIR, Plastic Europe, World Steel, etc.)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Material Details */}
      <motion.div
        className="mt-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
          <Package className="mr-2" style={{ color: 'var(--primary)' }} size={20} />
          Material Breakdown & Avoidance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
              <tr>
                <th className="text-left py-2 px-4" style={{ color: 'var(--foreground)' }}>Material</th>
                <th className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>Amount (tonnes)</th>
                <th className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>Avoided EF (kg CO₂e/tonne)</th>
                <th className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>Avoided Emissions (ton CO₂e)</th>
              </tr>
            </thead>
            <tbody>
              {recyclingData.map((item, index) => {
                const actualAvoided = item.amount * item.ef * input.recyclability / 1000 / 100;
                return (
                  <tr key={index} style={{ borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{item.name}</td>
                    <td className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>{item.amount.toFixed(2)}</td>
                    <td className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>{item.ef}</td>
                    <td className="text-right py-2 px-4" style={{ color: 'var(--primary)' }}>
                      -{actualAvoided.toFixed(3)}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-semibold" style={{ borderBottomWidth: '2px', borderColor: 'var(--border)' }}>
                <td className="py-2 px-4" style={{ color: 'var(--foreground)' }}>Total</td>
                <td className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>{input.totalRecyclables.toFixed(2)}</td>
                <td></td>
                <td className="text-right py-2 px-4" style={{ color: 'var(--primary)' }}>
                  -{avoidedEmissions.toFixed(3)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
