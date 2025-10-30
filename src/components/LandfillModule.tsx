'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Archive, 
  Calculator, 
  Info, 
  Save, 
  RotateCcw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LandfillInput, EmissionResult } from '@/types/emission';
import { calculateLandfill } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

export default function LandfillModule() {
  const [input, setInput] = useState<LandfillInput>({
    wastePerMonth: 0,
    doc: 0.15,
    docf: 0.5,
    mcf: 0.8,
    oxidation: 0,
    gasRecovery: 0,
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
    fuelUse: {
      type: 'diesel',
      amount: 0,
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
    const newResult = calculateLandfill(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof LandfillInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleCompositionChange = (component: keyof typeof input.composition, value: number) => {
    setInput(prev => ({
      ...prev,
      composition: { ...prev.composition, [component]: value }
    }));
  };

  const chartData = [
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
  ];

  const pieData = chartData.filter(item => item.value > 0);

  const wasteCompositionData = Object.entries(input.composition).map(([key, value]) => ({
    name: key.replace(/([A-Z])/g, ' $1').trim(),
    value: value,
  }));

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--background)', color: 'var(--foreground)', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <motion.div
        style={{ marginBottom: '24px' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
            <Archive style={{ color: 'var(--primary-foreground)' }} size={24} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 'bold', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
              Landfill Emissions
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
              Calculate methane emissions from waste disposal
            </p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Input Form */}
        <motion.div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow)',
            transition: 'all 0.3s ease'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '24px', transition: 'color 0.3s ease' }}>Landfill Parameters</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Waste amount */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Waste to Landfill (tonnes/month)
              </label>
              <input
                type="number"
                value={input.wastePerMonth}
                onChange={(e) => handleInputChange('wastePerMonth', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--input)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                placeholder="Enter waste amount"
              />
            </div>

            {/* DOC */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Degradable Organic Carbon (DOC)
              </label>
              <input
                type="number"
                step="0.01"
                value={input.doc}
                onChange={(e) => handleInputChange('doc', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--input)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                placeholder="0.15"
              />
            </div>

            {/* MCF */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Methane Correction Factor (MCF)
              </label>
              <select
                value={input.mcf}
                onChange={(e) => handleInputChange('mcf', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--input)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value={0.8}>Unmanaged deep (&gt;5m)</option>
                <option value={0.4}>Unmanaged shallow (&lt;5m)</option>
                <option value={0.6}>Uncategorized</option>
                <option value={1}>Managed</option>
              </select>
            </div>

            {/* Gas Recovery */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Gas Recovery Efficiency (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={input.gasRecovery}
                onChange={(e) => handleInputChange('gasRecovery', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--input)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                placeholder="0"
              />
            </div>

            {/* Oxidation */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Methane Oxidation Factor
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={input.oxidation}
                onChange={(e) => handleInputChange('oxidation', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: 'var(--input)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                placeholder="0"
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
              <button
                onClick={() => setInput({
                  ...input,
                  wastePerMonth: 0,
                  doc: 0.15,
                  mcf: 0.8,
                  gasRecovery: 0,
                  oxidation: 0,
                })}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border)',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <div style={{ flex: 1 }}>
                <SaveToScenarioButton
                  moduleType="landfill"
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
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Emission Results */}
          <div style={{
            backgroundColor: 'var(--card)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Calculation Results</h2>
              <Calculator style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }} size={20} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>CH₄ Generated</span>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{result.ch4.toFixed(2)} kg</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>CO₂ (Biogenic)</span>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>Not counted</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <span style={{ fontWeight: '600' }}>TOTAL CO₂e</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{result.totalCO2e.toFixed(2)} ton</span>
              </div>
            </div>
          </div>

          {/* Methane Chart */}
          {pieData.length > 0 && (
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '16px', transition: 'color 0.3s ease' }}>CH₄ Emissions</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Calculation Info */}
          <div style={{
            backgroundColor: 'var(--muted)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Info style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} size={16} />
              <div>
                <h3 style={{ fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Calculation Method</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  <p>CH₄ = MSW × DOC × DOCf × MCF × F × (16/12) × (1-R) × (1-OX)</p>
                  <p>Where F = 0.5 (methane fraction)</p>
                  <p style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                    Source: IPCC 2006 Guidelines, Volume 5 Waste
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Waste Composition Section */}
      <motion.div
        style={{
          marginTop: '24px',
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow)',
          transition: 'all 0.3s ease'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '24px', transition: 'color 0.3s ease' }}>Waste Composition</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          {Object.entries(input.composition).map(([component, percentage]) => (
            <div key={component}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                {component.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => handleCompositionChange(component as keyof typeof input.composition, parseFloat(e.target.value) || 0)}
                  style={{
                    flex: 1,
                    padding: '4px 12px',
                    backgroundColor: 'var(--input)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                    borderWidth: '1px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>%</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
          Total: {Object.values(input.composition).reduce((sum, val) => sum + val, 0).toFixed(1)}%
          {Object.values(input.composition).reduce((sum, val) => sum + val, 0) !== 100 && (
            <span style={{ color: 'var(--destructive)', marginLeft: '8px' }}>(Should equal 100%)</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
