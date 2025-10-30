'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Plus,
  Trash2,
  Calculator,
  TrendingDown,
  TrendingUp,
  Activity,
  Edit2,
  Copy,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ScenarioModal from './ScenarioModal';
import { getScenarios, addScenario, updateScenario, deleteScenario, duplicateScenario, exportScenarios, importScenarios, resetToDefaults, type Scenario } from '@/lib/scenarioStorage';
import { calculateScenarioEmissions, generateAIInsights, compareScenarios } from '@/lib/scenarioCalculations';

interface ScenarioData extends Scenario {
  emissions: {
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
}

const categories = [
  { key: 'transportation', label: 'Transportation', color: '#4CA771' },
  { key: 'landfill', label: 'Landfill', color: '#85B0BA' },
  { key: 'composting', label: 'Composting', color: '#FF8210' },
  { key: 'anaerobicDigestion', label: 'Anaerobic Digestion', color: '#8B5CF6' },
  { key: 'mbt', label: 'MBT', color: '#EC4899' },
  { key: 'recycling', label: 'Recycling', color: '#10B981' },
  { key: 'incineration', label: 'Incineration', color: '#F59E0B' },
  { key: 'openBurning', label: 'Open Burning', color: '#EF4444' },
];

export default function ScenariosModule() {
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load scenarios from localStorage on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    setIsLoading(true);
    const loaded = getScenarios();

    // Calculate emissions for each scenario
    const withEmissions = loaded.map(scenario => {
      const emissions = calculateScenarioEmissions(
        scenario.wasteComposition,
        scenario.treatmentAllocation,
        scenario.fleet
      );
      return {
        ...scenario,
        emissions,
      };
    });

    setScenarios(withEmissions);

    // Auto-select all scenarios
    setSelectedScenarios(withEmissions.map(s => s.id));
    setIsLoading(false);
  };

  const handleSaveScenario = (scenarioData: any) => {
    if (editingScenario) {
      updateScenario(editingScenario.id, scenarioData);
    } else {
      addScenario(scenarioData);
    }
    loadScenarios();
    setIsModalOpen(false);
    setEditingScenario(undefined);
  };

  const handleEditScenario = (scenario: ScenarioData) => {
    setEditingScenario(scenario);
    setIsModalOpen(true);
  };

  const handleDeleteScenario = (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (scenario?.isBaseline) {
      alert('Cannot delete baseline scenario');
      return;
    }

    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(id);
      loadScenarios();
    }
  };

  const handleDuplicateScenario = (id: string) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    const newName = prompt('Enter name for duplicated scenario:', `${scenario.name} (Copy)`);
    if (newName) {
      duplicateScenario(id, newName);
      loadScenarios();
    }
  };

  const handleExportScenarios = () => {
    const json = exportScenarios();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghg-scenarios-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportScenarios = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result as string;
            importScenarios(json);
            loadScenarios();
            alert('Scenarios imported successfully!');
          } catch (error) {
            alert('Error importing scenarios. Please check file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset to default scenarios? This will delete all custom scenarios.')) {
      resetToDefaults();
      loadScenarios();
    }
  };

  const getComparisonData = () => {
    return scenarios
      .filter(s => selectedScenarios.includes(s.id))
      .map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        isBaseline: scenario.isBaseline,
        transportation: scenario.emissions.transportation,
        landfill: scenario.emissions.landfill,
        composting: scenario.emissions.composting,
        anaerobicDigestion: scenario.emissions.anaerobicDigestion,
        mbt: scenario.emissions.mbt,
        recycling: scenario.emissions.recycling,
        incineration: scenario.emissions.incineration,
        openBurning: scenario.emissions.openBurning,
        total: scenario.emissions.total
      }));
  };

  const getStackedChartData = () => {
    return categories.map(category => {
      const dataPoint: any = { name: category.label };
      scenarios
        .filter(s => selectedScenarios.includes(s.id))
        .forEach(scenario => {
          dataPoint[scenario.id] = scenario.emissions[category.key as keyof typeof scenario.emissions];
        });
      return dataPoint;
    });
  };

  const selectedBaseline = scenarios.find(s => selectedScenarios.includes(s.id) && s.isBaseline);
  const comparisonData = getComparisonData();

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--sidebar-primary)' }}>
              <BarChart3 size={24} style={{ color: 'var(--sidebar-primary-foreground)' }} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                Scenario Comparison
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Compare emissions across different intervention scenarios
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingScenario(undefined);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={16} />
              <span>New Scenario</span>
            </button>
            <button
              onClick={handleExportScenarios}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Export Scenarios"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleImportScenarios}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Import Scenarios"
            >
              <Upload size={18} />
            </button>
            <button
              onClick={handleResetToDefaults}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Reset to Defaults"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scenario Selection */}
      <motion.div
        className="mb-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Select Scenarios to Compare</h2>

        {isLoading ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>Loading scenarios...</div>
        ) : scenarios.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>No scenarios found</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Create First Scenario
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {scenarios.map(scenario => (
              <div
                key={scenario.id}
                className="flex items-center space-x-3 p-3 rounded-lg"
                style={{ transition: 'background-color 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedScenarios([...selectedScenarios, scenario.id]);
                    } else {
                      setSelectedScenarios(selectedScenarios.filter(id => id !== scenario.id));
                    }
                  }}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="flex-1 font-medium" style={{ color: 'var(--foreground)' }}>{scenario.name}</span>
                {scenario.isBaseline && (
                  <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    Baseline
                  </span>
                )}
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {scenario.emissions.total.toFixed(1)} ton CO₂e
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditScenario(scenario)}
                    className="p-2 rounded transition-colors"
                    style={{ color: 'var(--foreground)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDuplicateScenario(scenario.id)}
                    className="p-2 rounded transition-colors"
                    style={{ color: 'var(--foreground)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Duplicate"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteScenario(scenario.id)}
                    className="p-2 rounded transition-colors"
                    style={{ color: scenario.isBaseline ? 'var(--muted-foreground)' : 'var(--destructive)' }}
                    onMouseEnter={(e) => !scenario.isBaseline && (e.currentTarget.style.backgroundColor = 'var(--destructive)', e.currentTarget.style.opacity = '0.1')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.opacity = '1')}
                    title="Delete"
                    disabled={scenario.isBaseline}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Comparison Table */}
      {selectedScenarios.length > 1 && (
        <motion.div
          className="mb-6 rounded-2xl shadow-sm p-6"
          style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Emission Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
                <tr>
                  <th className="text-left py-2 px-4" style={{ color: 'var(--foreground)' }}>Module</th>
                  {comparisonData.map(scenario => (
                    <th key={scenario.id} className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>
                      {scenario.name}
                    </th>
                  ))}
                  {comparisonData.length > 1 && <th className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>Δ Change</th>}
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.key} style={{ borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{category.label}</td>
                    {comparisonData.map((scenario, index) => {
                      const value = (scenario[category.key as keyof typeof scenario] as number) || 0;
                      const isNegative = value < 0;
                      return (
                        <td key={scenario.id} className="text-right py-2 px-4">
                          <span style={{ color: isNegative ? 'var(--primary)' : 'var(--foreground)' }}>
                            {value.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                    {comparisonData.length > 1 && (
                      <td className="text-right py-2 px-4">
                        {(() => {
                          const baseline = (comparisonData[0][category.key as keyof typeof comparisonData[0]] as number) || 0;
                          const intervention = (comparisonData[1][category.key as keyof typeof comparisonData[1]] as number) || 0;
                          const change = intervention - baseline;
                          return (
                            <span className="font-medium" style={{ color: change < 0 ? 'var(--primary)' : change > 0 ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
                              {change > 0 ? '+' : ''}{change.toFixed(1)}
                            </span>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                ))}
                <tr className="font-semibold" style={{ borderBottomWidth: '2px', borderColor: 'var(--border)' }}>
                  <td className="py-2 px-4" style={{ color: 'var(--foreground)' }}>Total</td>
                  {comparisonData.map(scenario => (
                    <td key={scenario.id} className="text-right py-2 px-4" style={{ color: 'var(--foreground)' }}>
                      {scenario.total.toFixed(1)}
                    </td>
                  ))}
                  {comparisonData.length > 1 && comparisonData[0] && comparisonData[1] && (
                    <td className="text-right py-2 px-4">
                      {(() => {
                        const baselineTotal = comparisonData[0].total;
                        const interventionTotal = comparisonData[1].total;
                        const change = interventionTotal - baselineTotal;
                        const percentChange = baselineTotal !== 0 ? (change / baselineTotal * 100) : 0;
                        return (
                          <span className="font-bold" style={{ color: change < 0 ? 'var(--primary)' : change > 0 ? 'var(--destructive)' : 'var(--muted-foreground)' }}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)} ({percentChange.toFixed(1)}%)
                          </span>
                        );
                      })()}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      {selectedScenarios.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stacked Bar Chart */}
          <motion.div
            className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Emission Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStackedChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                {scenarios
                  .filter(s => selectedScenarios.includes(s.id))
                  .map((scenario, index) => (
                    <Bar
                      key={scenario.id}
                      dataKey={scenario.id}
                      stackId="a"
                      fill={index === 0 ? '#4CA771' : index === 1 ? '#85B0BA' : '#FF8210'}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Total Comparison Chart */}
          {selectedScenarios.length > 1 && (
            <motion.div
              className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Total Emissions Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4CA771" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* AI Insights */}
      {selectedScenarios.length > 1 && comparisonData.length >= 2 && (() => {
        const baseline = comparisonData.find(s => (s as any).isBaseline) || comparisonData[0];
        const intervention = comparisonData.find(s => !(s as any).isBaseline) || comparisonData[1];

        if (!baseline || !intervention) return null;

        const baselineScenario = scenarios.find(s => s.id === (baseline as any).id);
        const interventionScenario = scenarios.find(s => s.id === (intervention as any).id);

        if (!baselineScenario || !interventionScenario) return null;

        const insights = generateAIInsights(
          baselineScenario.emissions,
          interventionScenario.emissions
        );

        return (
          <motion.div
            className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="text-primary" size={24} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>AI Analysis</h3>
            </div>

            <p className="text-gray-700 mb-4">
              {insights.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.keyReductions.length > 0 && (
                <div className="flex items-start space-x-2">
                  <TrendingDown className="text-green-600 mt-1" size={16} />
                  <div>
                    <p className="font-medium text-dark">Key Reduction Areas:</p>
                    {insights.keyReductions.map((reduction, index) => (
                      <p key={index} className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {reduction.category}: {reduction.reduction} ton CO₂e reduced
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {insights.recommendations.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Activity className="text-primary mt-1" size={16} />
                  <div>
                    <p className="font-medium text-dark">Recommendations:</p>
                    {insights.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm text-gray-600 mb-1">
                        • {rec}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })()}

      {/* Scenario Modal */}
      <ScenarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScenario(undefined);
        }}
        onSave={handleSaveScenario}
        editingScenario={editingScenario}
      />
    </div>
  );
}
