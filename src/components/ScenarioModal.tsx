'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: any) => void;
  editingScenario?: any;
}

export default function ScenarioModal({ isOpen, onClose, onSave, editingScenario }: ScenarioModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isBaseline: false,
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
      anaerobicDigestion: 5,
      mbt: 0,
      recycling: 15,
      incineration: 5,
      openBurning: 5,
    },
    fleet: {
      dieselTrucks: 10,
      electricTrucks: 0,
      totalDistance: 500,
      fuelEfficiency: 0.25,
    },
  });

  useEffect(() => {
    if (editingScenario) {
      setFormData({
        name: editingScenario.name || '',
        description: editingScenario.description || '',
        isBaseline: editingScenario.isBaseline || false,
        wasteComposition: editingScenario.wasteComposition || formData.wasteComposition,
        treatmentAllocation: editingScenario.treatmentAllocation || formData.treatmentAllocation,
        fleet: editingScenario.fleet || formData.fleet,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        description: '',
        isBaseline: false,
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
          anaerobicDigestion: 5,
          mbt: 0,
          recycling: 15,
          incineration: 5,
          openBurning: 5,
        },
        fleet: {
          dieselTrucks: 10,
          electricTrucks: 0,
          totalDistance: 500,
          fuelEfficiency: 0.25,
        },
      });
    }
  }, [editingScenario, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const compositionTotal = Object.values(formData.wasteComposition).reduce((sum, val) => sum + val, 0);
    const allocationTotal = Object.values(formData.treatmentAllocation).reduce((sum, val) => sum + val, 0);
    
    if (Math.abs(compositionTotal - 100) > 0.1) {
      alert('Waste composition must total 100%');
      return;
    }
    
    if (Math.abs(allocationTotal - 100) > 0.1) {
      alert('Treatment allocation must total 100%');
      return;
    }
    
    onSave({
      ...formData,
      id: editingScenario?.id || `scenario-${Date.now()}`,
      createdAt: editingScenario?.createdAt || new Date(),
      updatedAt: new Date(),
    });
    
    onClose();
  };

  const updateWasteComposition = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      wasteComposition: {
        ...prev.wasteComposition,
        [key]: value,
      },
    }));
  };

  const updateTreatmentAllocation = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      treatmentAllocation: {
        ...prev.treatmentAllocation,
        [key]: value,
      },
    }));
  };

  const compositionTotal = Object.values(formData.wasteComposition).reduce((sum, val) => sum + val, 0);
  const allocationTotal = Object.values(formData.treatmentAllocation).reduce((sum, val) => sum + val, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              {editingScenario ? 'Edit Scenario' : 'Create New Scenario'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Scenario Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="e.g., Intervention A - Increased Recycling"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ borderColor: 'var(--border)' }}
                  rows={3}
                  placeholder="Describe the key features of this scenario..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isBaseline"
                  checked={formData.isBaseline}
                  onChange={(e) => setFormData(prev => ({ ...prev, isBaseline: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isBaseline" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Mark as Baseline Scenario
                </label>
              </div>
            </div>

            {/* Waste Composition */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                  Waste Composition
                </h3>
                <span className={`text-sm font-medium ${Math.abs(compositionTotal - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {compositionTotal.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.wasteComposition).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize" style={{ color: 'var(--foreground)' }}>
                      {key}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateWasteComposition(key, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        style={{ borderColor: 'var(--border)' }}
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                ))}
              </div>

              {Math.abs(compositionTotal - 100) > 0.1 && (
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  <span>Waste composition must total 100%</span>
                </div>
              )}
            </div>

            {/* Treatment Allocation */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
                  Treatment Allocation
                </h3>
                <span className={`text-sm font-medium ${Math.abs(allocationTotal - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {allocationTotal.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.treatmentAllocation).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2 capitalize" style={{ color: 'var(--foreground)' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateTreatmentAllocation(key, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        style={{ borderColor: 'var(--border)' }}
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                ))}
              </div>

              {Math.abs(allocationTotal - 100) > 0.1 && (
                <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  <span>Treatment allocation must total 100%</span>
                </div>
              )}
            </div>

            {/* Fleet Configuration */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>Fleet Configuration</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Diesel Trucks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fleet.dieselTrucks}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fleet: { ...prev.fleet, dieselTrucks: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Electric Trucks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fleet.electricTrucks}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fleet: { ...prev.fleet, electricTrucks: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Total Distance (km/month)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.fleet.totalDistance}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fleet: { ...prev.fleet, totalDistance: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Fuel Efficiency (L/km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fleet.fuelEfficiency}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      fleet: { ...prev.fleet, fuelEfficiency: parseFloat(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                disabled={Math.abs(compositionTotal - 100) > 0.1 || Math.abs(allocationTotal - 100) > 0.1}
              >
                <Save size={16} />
                <span>{editingScenario ? 'Update' : 'Create'} Scenario</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
