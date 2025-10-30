'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Calculator, 
  Info, 
  Save, 
  RotateCcw,
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CompostingInput, EmissionResult } from '@/types/emission';
import { calculateComposting } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function CompostingModule() {
  const [input, setInput] = useState<CompostingInput>({
    foodWaste: 0,
    gardenWaste: 0,
    fuelUse: {
      type: 'diesel',
      amount: 0,
    },
    compostProduction: 0,
    compostUsePercentage: 100,
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    const newResult = calculateComposting(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof CompostingInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const chartData = [
    { name: 'CO₂', value: result.co2, color: '#4CA771' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
    { name: 'Avoided', value: Math.abs(Math.min(result.totalCO2e * 1000 - result.co2 - result.ch4 - result.n2o, 0)), color: '#10B981' },
  ];

  const pieData = chartData.filter(item => item.value > 0);

  const totalOrganicWaste = input.foodWaste + input.gardenWaste;
  const avoidedEmissions = result.totalCO2e < 0 ? Math.abs(result.totalCO2e) : 0;

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
            <Leaf className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Composting Emissions
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Calculate emissions from organic waste composting and fertilizer avoidance
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          className="rounded-2xl shadow-sm p-6"
          style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Composting Parameters</h2>
          
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

            {/* Compost production */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Compost Production (tonnes/month)
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
                Compost Use in Agriculture (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={input.compostUsePercentage}
                onChange={(e) => handleInputChange('compostUsePercentage', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
                placeholder="Enter percentage used"
              />
            </div>

            {/* Fuel type */}
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

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setInput({
                  foodWaste: 0,
                  gardenWaste: 0,
                  fuelUse: { type: 'diesel', amount: 0 },
                  compostProduction: 0,
                  compostUsePercentage: 100,
                })}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div className="flex-1">
                <SaveToScenarioButton
                  moduleType="composting"
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
              
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CO₂</span>
                <span className="font-semibold" style={{ color: 'var(--primary)' }}>{result.co2.toFixed(2)} kg</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>CH₄</span>
                <span className="font-semibold" style={{ color: '#85B0BA' }}>{result.ch4.toFixed(2)} kg</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>N₂O</span>
                <span className="font-semibold" style={{ color: '#FF8210' }}>{result.n2o.toFixed(2)} kg</span>
              </div>

              {avoidedEmissions > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)' }}>
                  <span className="text-sm flex items-center" style={{ color: 'var(--muted-foreground)' }}>
                    <TrendingDown size={16} className="mr-1" />
                    Avoided Emissions
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>-{avoidedEmissions.toFixed(2)} ton CO₂e</span>
                </div>
              )}
              
              <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', transition: 'all 0.3s ease' }}>
                <span className="font-semibold">NET CO₂e</span>
                <span className="font-bold text-lg">{result.totalCO2e.toFixed(2)} ton</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          {pieData.length > 0 && (
            <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Emission Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
                  <p>CH₄: 4 g/kg organic waste (wet basis)</p>
                  <p>N₂O: 0.3 g/kg organic waste (wet basis)</p>
                  <p className="text-xs mt-2 italic">
                    Source: IPCC default values for composting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fertilizer Avoidance Info */}
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}>
            <div className="flex items-start space-x-3">
              <TrendingDown style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Fertilizer Replacement</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  <p>Compost replaces chemical fertilizers:</p>
                  <p>• N: 7.1 kg/tonne compost</p>
                  <p>• P₂O₅: 4.1 kg/tonne compost</p>
                  <p>• K₂O: 5.4 kg/tonne compost</p>
                  <p className="text-xs mt-2 italic">
                    Avoided emissions: 21.3 kg CO₂e/tonne compost
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
