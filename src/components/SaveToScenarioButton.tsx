'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createScenarioFromModule } from '@/lib/moduleToScenario';
import { addScenario } from '@/lib/scenarioStorage';
import { EmissionResult } from '@/types/emission';

interface SaveToScenarioButtonProps {
  moduleType: 'transportation' | 'landfill' | 'composting' | 'anaerobic-digestion' | 'recycling' | 'incineration' | 'mbt' | 'open-burning';
  input: any; // Module-specific input
  result: EmissionResult;
  disabled?: boolean;
}

export default function SaveToScenarioButton({ 
  moduleType, 
  input, 
  result,
  disabled = false 
}: SaveToScenarioButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleSave = () => {
    // Show name prompt
    setShowPrompt(true);
  };

  const handleConfirmSave = (name: string) => {
    setIsSaving(true);
    
    try {
      // Convert module data to scenario format
      const scenarioData = createScenarioFromModule(moduleType, input, result, name);
      
      // Create full scenario object
      const newScenario = {
        id: `scenario-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...scenarioData,
      } as any;

      // Save to localStorage
      addScenario(newScenario);
      
      // Show success feedback
      setSaved(true);
      setShowPrompt(false);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSaved(false);
        setIsSaving(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving scenario:', error);
      alert('Error saving scenario. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleSave}
        disabled={disabled || isSaving || saved}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
        style={{ 
          backgroundColor: saved ? '#10B981' : 'var(--primary)', 
          color: 'var(--primary-foreground)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {saved ? (
          <>
            <Check size={16} />
            <span>Saved to Scenarios!</span>
          </>
        ) : (
          <>
            <Save size={16} />
            <span>Save to Scenario</span>
          </>
        )}
      </motion.button>

      {/* Name Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowPrompt(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Save as Scenario
              </h3>
              
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                This will create a new scenario based on your current calculation. You can edit the details later in the Scenarios page.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('scenarioName') as string;
                  if (name.trim()) {
                    handleConfirmSave(name.trim());
                  }
                }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Scenario Name *
                </label>
                <input
                  type="text"
                  name="scenarioName"
                  placeholder={`${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} Scenario`}
                  defaultValue={`${moduleType.charAt(0).toUpperCase() + moduleType.slice(1)} - ${new Date().toLocaleDateString()}`}
                  required
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  style={{ borderColor: 'var(--border)' }}
                  autoFocus
                />

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="px-4 py-2 border rounded-lg transition-colors hover:bg-gray-50"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <Save size={16} />
                    <span>Save Scenario</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> After saving, go to the Scenarios page to:
                  <br />• Adjust waste composition and treatment allocation
                  <br />• Compare with other scenarios
                  <br />• View AI-powered insights
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
