'use client';

import { motion } from 'framer-motion';
import {
  Info,
  BookOpen,
  Calculator,
  ExternalLink,
  Globe,
  Beaker,
  FileText
} from 'lucide-react';

export default function AboutModule() {
  const methodology = [
    {
      icon: Calculator,
      title: 'IPCC 2006 Guidelines',
      description: 'All calculations follow the Intergovernmental Panel on Climate Change 2006 Guidelines for National Greenhouse Gas Inventories, Volume 5: Waste.',
    },
    {
      icon: Beaker,
      title: 'IGES Calculator vIII',
      description: 'Based on the Institute for Global Environmental Strategies GHG Calculator version VIII methodology and emission factors.',
    },
    {
      icon: Globe,
      title: 'China-Specific Factors',
      description: 'Utilizes China-specific waste composition data, grid electricity emission factors, and regional climate parameters.',
    },
  ];

  const dataSources = [
    {
      title: 'Climate Change Info-Net China',
      description: 'Energy content of fossil fuels and emission factors for fuel combustion processes.',
      link: 'http://en.ccchina.org.cn/archiver/ccchinaen/UpFile/Files/Default/20160302133600044691.pdf',
    },
    {
      title: 'IPCC Default Values',
      description: 'CH4 and N2O emission factors for composting, anaerobic digestion, and waste treatment processes.',
      link: '#',
    },
    {
      title: 'Industry Reports',
      description: 'Bureau of International Recycling, Plastic Europe, World Steel Association, and International Aluminium Institute data.',
      link: '#',
    },
  ];

  const calculationModules = [
    {
      name: 'Transportation',
      description: 'Emissions from waste collection and transport fleets using fuel-based emission factors.',
      formula: 'CO₂e = Fuel × EF_CO₂/L + Fuel × EF_CH₄/L × GWP_CH₄ + Fuel × EF_N₂O/L × GWP_N₂O',
    },
    {
      name: 'Landfilling',
      description: 'Methane generation from anaerobic decomposition of organic waste in landfills.',
      formula: 'CH₄ = MSW × DOC × DOCf × MCF × F × (16/12) × (1-R) × (1-OX)',
    },
    {
      name: 'Composting',
      description: 'Direct emissions from aerobic decomposition plus avoided fertilizer production.',
      formula: 'CO₂e = (CH₄_ef × W × GWP_CH₄ + N₂O_ef × W × GWP_N₂O) - Avoided_fertilizer',
    },
    {
      name: 'Recycling',
      description: 'Avoided emissions from virgin material substitution minus process energy.',
      formula: 'CO₂eAvoided = Σ(Material_amount × Avoided_EF) - Process_emissions',
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--primary)', transition: 'all 0.3s ease' }}>
          <Info style={{ color: 'var(--primary-foreground)' }} size={40} />
        </div>
        <h1 className="font-heading text-3xl font-bold mb-3" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
          KarWanua - GHG Emission Calculator
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
          KarWanua adalah comprehensive greenhouse gas emission calculator untuk municipal solid waste management systems,
          based on internationally recognized methodologies (IPCC 2006 & IGES) and region-specific data.
        </p>
      </motion.div>

      {/* Methodology */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-heading text-xl font-semibold mb-6 flex items-center" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
          <BookOpen className="mr-2" style={{ color: 'var(--primary)' }} size={24} />
          Methodology Framework
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methodology.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Icon style={{ color: 'var(--primary)' }} className="mb-3" size={24} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Calculation Modules */}
      <motion.div
        className="mb-8 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-heading text-xl font-semibold mb-6 flex items-center" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
          <Calculator className="mr-2" style={{ color: 'var(--primary)' }} size={24} />
          Emission Calculation Modules
        </h2>
        <div className="space-y-4">
          {calculationModules.map((module, index) => (
            <div key={index} className="border-l-4 pl-4 py-2" style={{ borderColor: 'var(--primary)' }}>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>{module.name}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>{module.description}</p>
              <div className="rounded-lg p-2 font-mono text-xs" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', transition: 'all 0.3s ease' }}>
                {module.formula}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-heading text-xl font-semibold mb-6 flex items-center" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
          <FileText className="mr-2" style={{ color: 'var(--primary)' }} size={24} />
          Data Sources & References
        </h2>
        <div className="space-y-3">
          {dataSources.map((source, index) => (
            <motion.div
              key={index}
              className="rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>{source.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>{source.description}</p>
                </div>
                {source.link && (
                  <a
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 transition-colors"
                    style={{ color: 'var(--primary)' }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Global Warming Potentials */}
      <motion.div
        className="mb-8 rounded-2xl p-6"
        style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Global Warming Potentials (GWP)</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>1</div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>CO₂ (Carbon Dioxide)</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>25</div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>CH₄ (Methane) - 100-year</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading" style={{ color: 'var(--primary)' }}>298</div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>N₂O (Nitrous Oxide) - 100-year</div>
          </div>
        </div>
        <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
          Source: IPCC Fourth Assessment Report (AR4)
        </p>
      </motion.div>

      {/* Version Info */}
      <motion.div
        className="text-center text-sm"
        style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>GHG Emission Calculator v1.0</p>
        <p>Based on IGES GHG Calculator vIII methodology</p>
        <p>Last updated: October 2025</p>
      </motion.div>
    </div>
  );
}
