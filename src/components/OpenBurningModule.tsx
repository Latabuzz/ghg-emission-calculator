'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wind,
  Calculator,
  Info,
  Save,
  RotateCcw,
  Flame
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { OpenBurningInput, EmissionResult } from '@/types/emission';
import { calculateOpenBurning } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function OpenBurningModule() {
  const [input, setInput] = useState<OpenBurningInput>({
    wasteAmount: 0,
    composition: {
      foodWaste: 40,
      gardenWaste: 10,
      plastics: 7,
      paper: 6,
      textile: 6,
      leather: 5,
      glass: 5,
      metal: 6,
      nappies: 2,
      hazardous: 3,
      others: 3,
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
    const newResult = calculateOpenBurning(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof OpenBurningInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCompositionChange = (component: keyof typeof input.composition, value: number) => {
    setInput(prev => ({
      ...prev,
      composition: { ...prev.composition, [component]: value }
    }));
  };

  const chartData = [
    { name: 'CO₂', value: result.co2, color: '#4CA771' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
  ].filter(item => item.value > 0);

  const fossilComponents = ['plastics', 'textile', 'leather', 'nappies', 'others'];
  const biogenicComponents = ['foodWaste', 'gardenWaste', 'paper', 'wood'];

  const emissionBreakdown = {
    fossilCO2: fossilComponents.reduce((sum, comp) => {
      const percentage = input.composition[comp as keyof typeof input.composition] / 100;
      const wasteMass = input.wasteAmount * percentage;
      const ef = comp === 'plastics' ? 1.0 : comp === 'textile' || comp === 'leather' || comp === 'nappies' ? 0.67 : 0.2;
      return sum + wasteMass * ef * (44 / 12) * 0.58; // CO2 from fossil carbon only
    }, 0),
    biogenicCO2: biogenicComponents.reduce((sum, comp) => {
      const percentage = input.composition[comp as keyof typeof input.composition] / 100;
      if (comp === 'wood') return 0; // wood not in open burning composition
      const wasteMass = input.wasteAmount * percentage;
      const ef = comp === 'foodWaste' ? 0.38 : comp === 'gardenWaste' ? 0.49 : 0.46;
      return sum + wasteMass * ef * (44 / 12) * 0.58; // Biogenic CO2 (not counted in GHG)
    }, 0),
  };

  const highRiskComponents = ['hazardous', 'plastics', 'nappies'];
  const highRiskPercentage = highRiskComponents.reduce((sum, comp) =>
    sum + input.composition[comp as keyof typeof input.composition], 0);

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
            <Wind className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Open Burning Emissions
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate emissions from uncontrolled waste burning
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
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Open Burning Parameters</h2>

          <div className="space-y-4">
            {/* Waste amount */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Waste Open Burned (tonnes/month)
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

            {/* Warning about hazardous materials */}
            {highRiskPercentage > 10 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Flame className="text-red-600 mt-1" size={16} />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">⚠️ High Risk Composition</p>
                    <p>Contains {highRiskPercentage}% hazardous materials that release toxic fumes when burned.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setInput({
                  wasteAmount: 0,
                  composition: {
                    foodWaste: 40,
                    gardenWaste: 10,
                    plastics: 7,
                    paper: 6,
                    textile: 6,
                    leather: 5,
                    glass: 5,
                    metal: 6,
                    nappies: 2,
                    hazardous: 3,
                    others: 3,
                  },
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="open-burning"
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
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{emissionBreakdown.fossilCO2.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Biogenic CO₂ (not counted)</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{emissionBreakdown.biogenicCO2.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CH₄ (incomplete combustion)</span>
                <span className="font-semibold" style={{ color: '#85B0BA' }}>{result.ch4.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>N₂O (higher than controlled burning)</span>
                <span className="font-semibold" style={{ color: '#FF8210' }}>{result.n2o.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">TOTAL CO₂e</span>
                <span className="font-bold text-lg">{(result.totalCO2e ?? 0).toFixed(3)} ton</span>
              </div>
            </div>
          </div>

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

          {/* Health & Environmental Impact */}
          {input.wasteAmount > 0 && highRiskPercentage > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--destructive)', transition: 'all 0.3s ease' }}>
              <div className="flex items-start space-x-3">
                <Flame style={{ color: 'var(--destructive)', marginTop: '4px' }} size={16} />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Health & Environmental Impact</h3>
                  <div className="space-y-2 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                    <p>⚠️ Open burning releases toxic compounds including:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• Dioxins and furans from plastic combustion</li>
                      <li>• Heavy metals from electronic/hazardous waste</li>
                      <li>• Particulate matter (PM2.5, PM10)</li>
                      <li>• Volatile organic compounds (VOCs)</li>
                    </ul>
                    <p className="font-medium mt-2" style={{ color: 'var(--destructive)' }}>
                      Recommendation: Consider controlled incineration with proper pollution controls
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emission Factors Info */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
            <div className="flex items-start space-x-3">
              <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Emission Factors (Open Burning)</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  <p>Higher emission factors than controlled burning:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• CH₄: 5 g/kg waste (vs &lt;0.1 g/kg controlled)</li>
                    <li>• N₂O: 0.2 g/kg waste (vs 0.05 g/kg controlled)</li>
                    <li>• Oxidation factor: 58% (vs 100% in controlled)</li>
                  </ul>
                  <p className="text-xs mt-2 italic">
                    Source: IPCC 2006 Guidelines, waste combustion section
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Waste Composition */}
      <motion.div
        className="mt-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Waste Composition</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(input.composition).map(([component, percentage]) => {
            const isHighRisk = highRiskComponents.includes(component);
            return (
              <div key={component}>
                <label className={`block text-sm font-medium ${isHighRisk ? 'text-red-700' : 'text-gray-700'} mb-1`}>
                  {component.replace(/([A-Z])/g, ' $1').trim()}
                  {isHighRisk && ' ⚠️'}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => handleCompositionChange(component as keyof typeof input.composition, parseFloat(e.target.value) || 0)}
                    className={`flex-1 px-3 py-1 border ${isHighRisk ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total: {Object.values(input.composition).reduce((sum, val) => sum + val, 0).toFixed(1)}%
          {Object.values(input.composition).reduce((sum, val) => sum + val, 0) !== 100 && (
            <span className="text-red-600 ml-2">(Should equal 100%)</span>
          )}
        </div>

        {/* Alternative Technologies */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
          <h4 className="font-medium mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>🌱 Better Alternatives to Open Burning</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--primary)' }}>Immediate Reduction:</p>
              <ul className="ml-4 space-y-1">
                <li>• Segregate plastic & hazardous waste</li>
                <li>• Establish collection points</li>
                <li>• Community education programs</li>
              </ul>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--primary)' }}>Long-term Solutions:</p>
              <ul className="ml-4 space-y-1">
                <li>• Waste-to-energy facilities</li>
                <li>• Enhanced recycling programs</li>
                <li>• Composting facilities</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
