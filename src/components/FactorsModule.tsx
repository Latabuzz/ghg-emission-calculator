'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Search, 
  Filter, 
  Download,
  Info,
  Table2
} from 'lucide-react';

interface Factor {
  id: string;
  category: string;
  name: string;
  value: number;
  unit: string;
  source: string;
  description?: string;
}

const factorsData: Factor[] = [
  // Global Warming Potentials
  { id: 'gwp-co2', category: 'GWP', name: 'Carbon Dioxide (CO₂)', value: 1, unit: '-', source: 'IPCC AR4' },
  { id: 'gwp-ch4', category: 'GWP', name: 'Methane (CH₄)', value: 25, unit: '-', source: 'IPCC AR4' },
  { id: 'gwp-n2o', category: 'GWP', name: 'Nitrous Oxide (N₂O)', value: 298, unit: '-', source: 'IPCC AR4' },
  
  // Fuel Emission Factors
  { id: 'fuel-diesel', category: 'Fuel', name: 'Diesel', value: 2.68, unit: 'kg CO₂/L', source: 'IPCC 2006', description: 'Energy content: 36.4 MJ/L' },
  { id: 'fuel-gasoline', category: 'Fuel', name: 'Gasoline', value: 2.31, unit: 'kg CO₂/L', source: 'IPCC 2006', description: 'Energy content: 35.8 MJ/L' },
  { id: 'fuel-lpg', category: 'Fuel', name: 'LPG', value: 1.58, unit: 'kg CO₂/L', source: 'IPCC 2006', description: 'Energy content: 25.1 MJ/L' },
  { id: 'fuel-natural-gas', category: 'Fuel', name: 'Natural Gas', value: 2.18, unit: 'kg CO₂/m³', source: 'IPCC 2006', description: 'Energy content: 38.9 MJ/m³' },
  
  // Process Emission Factors
  { id: 'process-compost-ch4', category: 'Process', name: 'Composting CH₄', value: 4, unit: 'g/kg waste', source: 'IPCC Defaults' },
  { id: 'process-compost-n2o', category: 'Process', name: 'Composting N₂O', value: 0.3, unit: 'g/kg waste', source: 'IPCC Defaults' },
  { id: 'process-ad-ch4', category: 'Process', name: 'Anaerobic Digestion CH₄', value: 0.8, unit: 'g/kg waste', source: 'IPCC Defaults' },
  { id: 'process-ad-n2o', category: 'Process', name: 'Anaerobic Digestion N₂O', value: 0, unit: 'g/kg waste', source: 'IPCC Defaults' },
  
  // Landfill Parameters
  { id: 'landfill-doc-food', category: 'Landfill', name: 'DOC - Food Waste', value: 0.15, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-doc-garden', category: 'Landfill', name: 'DOC - Garden Waste', value: 0.20, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-doc-paper', category: 'Landfill', name: 'DOC - Paper', value: 0.40, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-doc-wood', category: 'Landfill', name: 'DOC - Wood', value: 0.43, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-docf', category: 'Landfill', name: 'DOC Decomposable Fraction', value: 0.5, unit: 'fraction', source: 'IPCC Default' },
  { id: 'landfill-f', category: 'Landfill', name: 'Methane Fraction in LFG', value: 0.5, unit: 'fraction', source: 'IPCC Default' },
  { id: 'landfill-mcf-deep', category: 'Landfill', name: 'MCF - Deep Unmanaged', value: 0.8, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-mcf-shallow', category: 'Landfill', name: 'MCF - Shallow Unmanaged', value: 0.4, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-mcf-managed', category: 'Landfill', name: 'MCF - Managed', value: 1.0, unit: 'fraction', source: 'IPCC 2006' },
  { id: 'landfill-ox', category: 'Landfill', name: 'Oxidation Factor', value: 0.1, unit: 'fraction', source: 'IPCC Default' },
  
  // Recycling Avoided Emissions
  { id: 'recycling-paper', category: 'Recycling', name: 'Paper Recycling', value: 1.74, unit: 'kg CO₂e/kg', source: 'BIR 2016' },
  { id: 'recycling-plastic', category: 'Recycling', name: 'Plastic Recycling', value: 1.745, unit: 'kg CO₂e/kg', source: 'APR 2018' },
  { id: 'recycling-aluminium', category: 'Recycling', name: 'Aluminium Recycling', value: 0.59, unit: 'kg CO₂e/kg', source: 'International Aluminium Institute 2020' },
  { id: 'recycling-steel', category: 'Recycling', name: 'Steel Recycling', value: 1.53, unit: 'kg CO₂e/kg', source: 'World Steel Association 2020' },
  { id: 'recycling-glass', category: 'Recycling', name: 'Glass Recycling', value: 0.353, unit: 'kg CO₂e/kg', source: 'US EPA 2019' },
  
  // Electricity
  { id: 'electricity-china', category: 'Energy', name: 'Grid Electricity China', value: 0.855, unit: 'kg CO₂e/kWh', source: 'China Climate Change Info-Net' },
  
  // Incineration
  { id: 'incineration-fossil-plastic', category: 'Incineration', name: 'Fossil Carbon - Plastics', value: 75, unit: '% of total carbon', source: 'IPCC 2006' },
  { id: 'incineration-fossil-textile', category: 'Incineration', name: 'Fossil Carbon - Textiles', value: 20, unit: '% of total carbon', source: 'IPCC 2006' },
  { id: 'incineration-efficiency', category: 'Incineration', name: 'Electricity Generation Efficiency', value: 500, unit: 'kWh/tonne', source: 'Typical values' },
  
  // Composting Fertilizer Replacement
  { id: 'fertilize-n', category: 'Agriculture', name: 'N Fertilizer Replacement', value: 7.1, unit: 'kg N/tonne compost', source: 'Bovea et al. 2010' },
  { id: 'fertilize-p', category: 'Agriculture', name: 'P₂O₅ Fertilizer Replacement', value: 4.1, unit: 'kg P₂O₅/tonne compost', source: 'Bovea et al. 2010' },
  { id: 'fertilize-k', category: 'Agriculture', name: 'K₂O Fertilizer Replacement', value: 5.4, unit: 'kg K₂O/tonne compost', source: 'Bovea et al. 2010' },
];

export default function FactorsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(factorsData.map(f => f.category)))];
    return cats;
  }, []);

  const filteredFactors = useMemo(() => {
    return factorsData.filter(factor => {
      const matchesSearch = factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           factor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           factor.unit.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || factor.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const exportToCSV = () => {
    const headers = ['Category', 'Name', 'Value', 'Unit', 'Source', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredFactors.map(f => 
        [f.category, f.name, f.value, f.unit, f.source, f.description || ''].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emission_factors.csv';
    a.click();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Emission Factors & Parameters
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              View and search all emission factors used in calculations
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="mb-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search factors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        className="mb-4 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Found {filteredFactors.length} factors
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        <div className="flex items-center space-x-2">
          <Table2 style={{ color: 'var(--muted-foreground)' }} size={16} />
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Table View</span>
        </div>
      </motion.div>

      {/* Factors Table */}
      <motion.div
        className="rounded-2xl shadow-sm overflow-hidden"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--muted)', borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
              <tr>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Category</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Name</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Value</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Unit</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Source</th>
                <th className="text-center py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactors.map((factor, index) => (
                <motion.tr
                  key={factor.id}
                  className="transition-colors"
                  style={{ borderBottomWidth: '1px', borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                >
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', opacity: 0.8 }}>
                      {factor.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>{factor.name}</td>
                  <td className="py-3 px-4 text-right tabular-nums" style={{ color: 'var(--foreground)' }}>{factor.value}</td>
                  <td className="py-3 px-4 text-right" style={{ color: 'var(--muted-foreground)' }}>{factor.unit}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>{factor.source}</td>
                  <td className="py-3 px-4 text-center">
                    {factor.description && (
                      <button
                        onClick={() => setShowInfo(showInfo === factor.id ? null : factor.id)}
                        className="transition-colors"
                        style={{ color: 'var(--primary)' }}
                      >
                        <Info size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded Info Row */}
        {showInfo && (
          <motion.div
            className="px-4 py-3"
            style={{ borderTopWidth: '1px', borderColor: 'var(--border)', backgroundColor: 'var(--muted)', transition: 'all 0.3s ease' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-start space-x-2">
              <Info style={{ color: 'var(--primary)', marginTop: '4px' }} size={16} />
              <div>
                <h4 className="font-medium mb-1" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                  {factorsData.find(f => f.id === showInfo)?.name}
                </h4>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                  {factorsData.find(f => f.id === showInfo)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Category Statistics */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {categories.slice(1).map(category => {
          const count = factorsData.filter(f => f.category === category).length;
          return (
            <div key={category} className="rounded-xl shadow-sm p-4" style={{ backgroundColor: 'var(--card)', transition: 'all 0.3s ease' }}>
              <div className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>{category}</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{count}</div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>factors</div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
