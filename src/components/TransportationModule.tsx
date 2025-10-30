'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Calculator, 
  Info, 
  Save, 
  RotateCcw,
  Zap,
  Fuel,
  Wind
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TransportationInput, EmissionResult } from '@/types/emission';
import { calculateTransportation } from '@/lib/calculations';
import SaveToScenarioButton from './SaveToScenarioButton';

const GRID_ELECTRICITY_EF = 0.855;

const fuelTypes = [
  { value: 'diesel', label: 'Diesel', icon: Fuel },
  { value: 'gasoline', label: 'Gasoline', icon: Fuel },
  { value: 'lpg', label: 'LPG', icon: Fuel },
  { value: 'naturalGas', label: 'Natural Gas', icon: Wind },
  { value: 'electric', label: 'Electric', icon: Zap },
];

export default function TransportationModule() {
  const [input, setInput] = useState<TransportationInput>({
    distance: 0,
    tripsPerMonth: 0,
    fuelConsumption: 0,
    fuelType: 'diesel',
    totalFuel: 0,
    wasteTransported: 0,
    electricity: 0,
  });

  const [result, setResult] = useState<EmissionResult>({
    co2: 0,
    ch4: 0,
    n2o: 0,
    totalCO2e: 0,
    totalEmission: 0,
  });

  useEffect(() => {
    if (input.fuelConsumption && input.distance && input.tripsPerMonth) {
      const totalFuel = input.distance * input.tripsPerMonth * input.fuelConsumption;
      setInput(prev => ({ ...prev, totalFuel }));
    }
  }, [input.fuelConsumption, input.distance, input.tripsPerMonth]);

  useEffect(() => {
    const newResult = calculateTransportation(input);
    setResult(newResult);
  }, [input]);

  const handleInputChange = (field: keyof TransportationInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const chartData = [
    { name: 'CO₂', value: result.co2, color: 'var(--primary)' },
    { name: 'CH₄', value: result.ch4, color: '#85B0BA' },
    { name: 'N₂O', value: result.n2o, color: '#FF8210' },
  ];

  const pieData = chartData.filter(item => item.value > 0);

  const fuelFactors = {
    diesel: { CO2: 2.68, CH4: 0.0003, N2O: 0.0006 },
    gasoline: { CO2: 2.31, CH4: 0.0003, N2O: 0.0006 },
    lpg: { CO2: 1.58, CH4: 0.0003, N2O: 0.0006 },
    naturalGas: { CO2: 2.18, CH4: 0.0003, N2O: 0.0001 },
  };

  const currentFactor = fuelFactors[input.fuelType as keyof typeof fuelFactors];

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
            <Truck style={{ color: 'var(--primary-foreground)' }} size={24} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 'bold', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
              Transportation Emissions
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
              Calculate GHG emissions from waste transportation
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
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '24px', transition: 'color 0.3s ease' }}>Transportation Data</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Distance per trip */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Distance per trip (km)
              </label>
              <input
                type="number"
                value={input.distance}
                onChange={(e) => handleInputChange('distance', parseFloat(e.target.value) || 0)}
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
                placeholder="Enter distance in kilometers"
              />
            </div>

            {/* Trips per month */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Trips per month
              </label>
              <input
                type="number"
                value={input.tripsPerMonth}
                onChange={(e) => handleInputChange('tripsPerMonth', parseInt(e.target.value) || 0)}
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
                placeholder="Enter number of trips"
              />
            </div>

            {/* Fuel type */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Fuel Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {fuelTypes.map(fuel => {
                  const Icon = fuel.icon;
                  const isSelected = input.fuelType === fuel.value;
                  return (
                    <button
                      key={fuel.value}
                      onClick={() => handleInputChange('fuelType', fuel.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '2px solid',
                        backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                        color: 'var(--foreground)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '14px'
                      }}
                    >
                      <Icon size={16} />
                      <span>{fuel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {input.fuelType !== 'electric' ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                    Fuel Consumption (L/km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={input.fuelConsumption}
                    onChange={(e) => handleInputChange('fuelConsumption', parseFloat(e.target.value) || 0)}
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
                    placeholder="Enter fuel consumption per km"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                    Total Fuel (L/month)
                  </label>
                  <div style={{ padding: '8px 16px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                    <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>{input.totalFuel.toFixed(2)} L</span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                  Electricity Consumption (kWh/month)
                </label>
                <input
                  type="number"
                  value={input.electricity}
                  onChange={(e) => handleInputChange('electricity', parseFloat(e.target.value) || 0)}
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
                  placeholder="Enter electricity consumption"
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
                Waste Transported (tonnes/month)
              </label>
              <input
                type="number"
                value={input.wasteTransported}
                onChange={(e) => handleInputChange('wasteTransported', parseFloat(e.target.value) || 0)}
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

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
              <button
                onClick={() => setInput({
                  distance: 0,
                  tripsPerMonth: 0,
                  fuelConsumption: 0,
                  fuelType: 'diesel',
                  totalFuel: 0,
                  wasteTransported: 0,
                  electricity: 0,
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
                  moduleType="transportation"
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
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Total Fuel</span>
                <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                  {input.fuelType === 'electric' ? `${input.electricity} kWh` : `${input.totalFuel.toFixed(2)} L`}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>CO₂</span>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{result.co2.toFixed(2)} kg</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>CH₄</span>
                <span style={{ fontWeight: '600', color: '#85B0BA' }}>{result.ch4.toFixed(2)} kg</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--muted)', borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>N₂O</span>
                <span style={{ fontWeight: '600', color: '#FF8210' }}>{result.n2o.toFixed(2)} kg</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                <span style={{ fontWeight: '600' }}>TOTAL CO₂e</span>
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{result.totalCO2e.toFixed(2)} ton</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          {pieData.length > 0 && (
            <div style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--foreground)', marginBottom: '16px', transition: 'color 0.3s ease' }}>Gas Composition</h3>
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
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Emission Factors Info */}
          {input.fuelType !== 'electric' && currentFactor && (
            <div style={{
              backgroundColor: 'var(--muted)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Info style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} size={16} />
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Emission Factors</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                    <p>EF_CO₂ = {currentFactor.CO2} kg/L</p>
                    <p>EF_CH₄ = {currentFactor.CH4} kg/L</p>
                    <p>EF_N₂O = {currentFactor.N2O} kg/L</p>
                    <p style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>
                      Source: Variables, IGES/IPCC 2006
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {input.fuelType === 'electric' && (
            <div style={{
              backgroundColor: 'var(--muted)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Info style={{ color: 'var(--primary)', marginTop: '4px', flexShrink: 0 }} size={16} />
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Emission Factor</h3>
                  <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                    EF = {GRID_ELECTRICITY_EF} kg CO₂-eq/kWh
                  </p>
                  <p style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic', color: 'var(--muted-foreground)' }}>
                    Source: Grid electricity production in China
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
