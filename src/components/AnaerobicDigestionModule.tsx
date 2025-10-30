'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Calculator,
  Info,
  Save,
  RotateCcw,
  Flame,
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AnaerobicDigestionInput, EmissionResult } from '@/types/emission';
import { calculateAnaerobicDigestion } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function AnaerobicDigestionModule() {
  const [input, setInput] = useState<AnaerobicDigestionInput>({
    foodWaste: 0,
    gardenWaste: 0,
    fuelUse: {
      type: 'diesel',
      amount: 0,
    },
    electricityUse: 0,
    moistureContent: 70,
    biogasUtilization: 'both',
    gasRecoveryEfficiency: 90,
    leakageRate: 2,
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    const newResult = calculateAnaerobicDigestion(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof AnaerobicDigestionInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const totalOrganicWaste = input.foodWaste + input.gardenWaste;

  // Biogas calculation estimates
  const biogasYield = 150; // m3 per tonne
  const methaneContent = 0.6; // 60%
  const totalBiogas = totalOrganicWaste * biogasYield;
  const methaneVolume = totalBiogas * methaneContent;
  const biogasEnergy = totalBiogas * 22; // MJ/m3 (average heating value)
  const electricityFromBiogas = biogasEnergy / 3.6; // Convert MJ to kWh

  const avoidedEmissions = (result.totalCO2e ?? 0) < 0 ? Math.abs(result.totalCO2e ?? 0) : 0;

  const chartData = [
    { name: 'CO₂', value: result.co2, color: '#4CA771' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
    { name: 'Avoided', value: avoidedEmissions * 1000, color: '#10B981' },
  ].filter(item => item.value > 0);

  const utilizationOptions = [
    { value: 'thermal', label: 'Thermal Energy Only' },
    { value: 'electricity', label: 'Electricity Generation Only' },
    { value: 'both', label: 'Combined Heat & Power' },
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
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Anaerobic Digestion Emissions
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate emissions and energy recovery from biogas production
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
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>AD Parameters</h2>

          <div className="space-y-4">
            {/* Food waste */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Food Waste (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.foodWaste}
                onChange={(e) => handleInputChange('foodWaste', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter food waste amount"
              />
            </div>

            {/* Garden waste */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Garden Waste (tonnes/month)
              </label>
              <input
                type="number"
                step="0.1"
                value={input.gardenWaste}
                onChange={(e) => handleInputChange('gardenWaste', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter garden waste amount"
              />
            </div>

            {/* Moisture content */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Moisture Content (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.moistureContent}
                onChange={(e) => handleInputChange('moistureContent', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter moisture content"
              />
            </div>

            {/* Biogas utilization */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Biogas Utilization Method
              </label>
              <select
                value={input.biogasUtilization}
                onChange={(e) => handleInputChange('biogasUtilization', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                {utilizationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gas recovery efficiency */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Gas Recovery Efficiency (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.gasRecoveryEfficiency}
                onChange={(e) => handleInputChange('gasRecoveryEfficiency', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter recovery efficiency"
              />
            </div>

            {/* Leakage rate */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Gas Leakage Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={input.leakageRate}
                onChange={(e) => handleInputChange('leakageRate', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter leakage rate"
              />
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
                  foodWaste: 0,
                  gardenWaste: 0,
                  fuelUse: { type: 'diesel', amount: 0 },
                  electricityUse: 0,
                  moistureContent: 70,
                  biogasUtilization: 'both',
                  gasRecoveryEfficiency: 90,
                  leakageRate: 2,
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="anaerobic-digestion"
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
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Organic Waste</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{totalOrganicWaste.toFixed(2)} tonnes</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CO₂</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{result.co2.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CH₄</span>
                <span className="font-semibold" style={{ color: '#85B0BA' }}>{result.ch4.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>N₂O</span>
                <span className="font-semibold" style={{ color: '#FF8210' }}>{result.n2o.toFixed(2)} kg</span>
              </div>

              {avoidedEmissions > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                    <TrendingDown size={16} className="mr-1" />
                    Avoided Emissions
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{avoidedEmissions.toFixed(3)} ton CO₂e</span>
                </div>
              )}

              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">NET CO₂e</span>
                <span className="font-bold text-lg">{(result.totalCO2e ?? 0).toFixed(3)} ton</span>
              </div>
            </div>
          </div>

          {/* Biogas Production Info */}
          {totalOrganicWaste > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--foreground)' }}>
                <Flame className="mr-2" size={20} />
                Biogas Production Estimates
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Biogas</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{totalBiogas.toFixed(0)} m³/month</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Methane Content</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{methaneVolume.toFixed(0)} m³/month</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Energy Potential</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{biogasEnergy.toFixed(0)} MJ/month</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Electricity Potential</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{electricityFromBiogas.toFixed(0)} kWh/month</span>
                </div>
              </div>
            </div>
          )}

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

          {/* Emission Factors Info */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
            <div className="flex items-start space-x-3">
              <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Default Emission Factors</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  <p>CH₄: 0.8 g/kg organic waste (wet basis)</p>
                  <p>N₂O: 0 g/kg organic waste (wet basis)</p>
                  <p>Biogas yield: 150 m³/tonne organic waste</p>
                  <p>Methane content: 60% (typical)</p>
                  <p className="text-xs mt-2 italic">
                    Source: IPCC default values for anaerobic digestion
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
