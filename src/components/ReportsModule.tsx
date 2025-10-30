'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileDown, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Settings as SettingsIcon
} from 'lucide-react';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  format: 'pdf' | 'csv' | 'json' | 'excel';
}

const exportOptions: ExportOption[] = [
  {
    id: 'pdf',
    name: 'Export as PDF',
    description: 'Comprehensive report with charts, tables, and methodology',
    icon: FileText,
    color: '#DC2626',
    bgColor: '#FEE2E2',
    format: 'pdf'
  },
  {
    id: 'csv',
    name: 'Export as CSV',
    description: 'Spreadsheet-ready data for analysis in Excel or Google Sheets',
    icon: FileSpreadsheet,
    color: '#059669',
    bgColor: '#D1FAE5',
    format: 'csv'
  },
  {
    id: 'json',
    name: 'Export as JSON',
    description: 'Raw data format for API integration and custom processing',
    icon: FileJson,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    format: 'json'
  },
  {
    id: 'excel',
    name: 'Export as Excel',
    description: 'Full Excel workbook with multiple sheets and formulas',
    icon: FileSpreadsheet,
    color: '#2563EB',
    bgColor: '#DBEAFE',
    format: 'excel'
  }
];

const sampleData = {
  reportDate: new Date().toISOString(),
  projectName: 'KarWanua GHG Assessment',
  period: 'October 2025',
  modules: {
    transportation: {
      wasteTransported: 100,
      totalFuel: 500,
      fuelType: 'diesel',
      emissions: {
        co2: 1340,
        ch4: 0.0015,
        n2o: 0.0003,
        totalCO2e: 1340.09
      },
      unit: 'kg CO2-eq/tonne'
    },
    landfill: {
      wasteAmount: 100,
      mcf: 0.8,
      gasRecovery: 0,
      emissions: {
        ch4: 26.33,
        totalCO2e: 658.25
      },
      unit: 'kg CO2-eq/tonne'
    },
    composting: {
      organicWaste: 50,
      compostProduced: 15,
      emissions: {
        ch4: 0.2,
        n2o: 0.015,
        totalCO2e: 9.47,
        avoided: 21.3,
        net: -11.83
      },
      unit: 'kg CO2-eq/tonne'
    },
    recycling: {
      totalRecyclables: 30,
      emissions: {
        direct: 15.2,
        avoided: 52.2,
        net: -37.0
      },
      unit: 'kg CO2-eq/tonne'
    }
  },
  summary: {
    totalDirectEmissions: 2023.01,
    totalAvoidedEmissions: 73.5,
    netEmissions: 1949.51,
    unit: 'kg CO2-eq'
  }
};

export default function ReportsModulev2() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async (format: string) => {
    setSelectedFormat(format);
    setIsExporting(true);
    setExportStatus('idle');

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      if (format === 'csv') {
        exportToCSV();
      } else if (format === 'json') {
        exportToJSON();
      } else if (format === 'pdf') {
        exportToPDF();
      } else if (format === 'excel') {
        exportToExcel();
      }
      setExportStatus('success');
    } catch (error) {
      setExportStatus('error');
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportStatus('idle');
        setSelectedFormat(null);
      }, 3000);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['KarWanua GHG Emission Report'],
      ['Report Date', new Date().toLocaleDateString()],
      ['Period', sampleData.period],
      [''],
      ['Module', 'Waste Amount (tonnes)', 'Direct Emissions (kg CO2e)', 'Avoided Emissions (kg CO2e)', 'Net Emissions (kg CO2e)'],
      ['Transportation', '100', '1340.09', '0', '1340.09'],
      ['Landfill', '100', '658.25', '0', '658.25'],
      ['Composting', '50', '9.47', '21.3', '-11.83'],
      ['Recycling', '30', '15.2', '52.2', '-37.0'],
      [''],
      ['Summary'],
      ['Total Direct Emissions', sampleData.summary.totalDirectEmissions.toFixed(2), 'kg CO2e'],
      ['Total Avoided Emissions', sampleData.summary.totalAvoidedEmissions.toFixed(2), 'kg CO2e'],
      ['Net Emissions', sampleData.summary.netEmissions.toFixed(2), 'kg CO2e']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `karwanua_report_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `karwanua_report_${Date.now()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // For PDF, we'll create a simple HTML content and use browser print
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>KarWanua GHG Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #4CA771; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #4CA771; color: white; }
              .summary { background-color: #F5F9F6; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .footer { margin-top: 40px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>🦉 KarWanua GHG Emission Report</h1>
            <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Period:</strong> ${sampleData.period}</p>
            
            <h2>Emission Summary by Module</h2>
            <table>
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Waste Amount (tonnes)</th>
                  <th>Direct Emissions (kg CO2e)</th>
                  <th>Avoided Emissions (kg CO2e)</th>
                  <th>Net Emissions (kg CO2e)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Transportation</td>
                  <td>100</td>
                  <td>1,340.09</td>
                  <td>0</td>
                  <td>1,340.09</td>
                </tr>
                <tr>
                  <td>Landfill</td>
                  <td>100</td>
                  <td>658.25</td>
                  <td>0</td>
                  <td>658.25</td>
                </tr>
                <tr>
                  <td>Composting</td>
                  <td>50</td>
                  <td>9.47</td>
                  <td>21.30</td>
                  <td>-11.83</td>
                </tr>
                <tr>
                  <td>Recycling</td>
                  <td>30</td>
                  <td>15.20</td>
                  <td>52.20</td>
                  <td>-37.00</td>
                </tr>
              </tbody>
            </table>
            
            <div class="summary">
              <h2>Overall Summary</h2>
              <p><strong>Total Direct Emissions:</strong> ${sampleData.summary.totalDirectEmissions.toFixed(2)} kg CO2e</p>
              <p><strong>Total Avoided Emissions:</strong> ${sampleData.summary.totalAvoidedEmissions.toFixed(2)} kg CO2e</p>
              <p><strong>Net Emissions:</strong> ${sampleData.summary.netEmissions.toFixed(2)} kg CO2e</p>
            </div>
            
            <div class="footer">
              <p>Generated by KarWanua GHG Emission Calculator</p>
              <p>Based on IPCC 2006 Guidelines & IGES Calculator vIII</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const exportToExcel = () => {
    // For now, Excel will export as CSV (can be enhanced with a library like xlsx)
    alert('Excel export akan menggunakan format CSV yang compatible dengan Excel. Klik OK untuk download.');
    exportToCSV();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#4CA771' }}
          >
            <FileDown className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Reports & Export
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Download your calculation results in various formats
            </p>
          </div>
        </div>
      </motion.div>

      {/* Export Status Message */}
      {exportStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {exportStatus === 'success' && (
            <div 
              className="rounded-xl p-4 flex items-center space-x-3"
              style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--primary)', transition: 'all 0.3s ease' }}
            >
              <CheckCircle2 style={{ color: 'var(--primary)' }} size={24} />
              <div>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>Export Successful!</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Your file has been downloaded</p>
              </div>
            </div>
          )}
          {exportStatus === 'error' && (
            <div 
              className="rounded-xl p-4 flex items-center space-x-3"
              style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--destructive)', transition: 'all 0.3s ease' }}
            >
              <XCircle style={{ color: 'var(--destructive)' }} size={24} />
              <div>
                <p className="font-medium text-red-900">Export Failed</p>
                <p className="text-sm text-red-700">Please try again</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exportOptions.map((option, index) => {
          const Icon = option.icon;
          const isExportingThis = isExporting && selectedFormat === option.id;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all"
              style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
              onClick={() => !isExporting && handleExport(option.id)}
              style={{
                opacity: isExporting && selectedFormat !== option.id ? 0.5 : 1,
                pointerEvents: isExporting ? 'none' : 'auto'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: option.bgColor }}
                  >
                    <Icon size={24} style={{ color: option.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">
                    {option.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                    {option.description}
                  </p>
                  <button
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: isExportingThis ? '#E5E7EB' : option.bgColor,
                      color: option.color
                    }}
                    disabled={isExporting}
                  >
                    {isExportingThis ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Export</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview Section */}
      <motion.div
        className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Eye size={20} style={{ color: 'var(--muted-foreground)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Data Preview</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--muted)', borderBottomWidth: '1px', borderColor: 'var(--border)' }}>
              <tr>
                <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Module</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Waste (tonnes)</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Direct (kg CO2e)</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Avoided (kg CO2e)</th>
                <th className="text-right py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Net (kg CO2e)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Transportation</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>100</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>1,340.09</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>0</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>1,340.09</td>
              </tr>
              <tr className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Landfill</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>100</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>658.25</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>0</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>658.25</td>
              </tr>
              <tr className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Composting</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>50</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>9.47</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>21.30</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--primary)' }}>-11.83</td>
              </tr>
              <tr className="transition-colors" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--muted)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--foreground)' }}>Recycling</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>30</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>15.20</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--foreground)' }}>52.20</td>
                <td className="py-3 px-4 text-right" style={{ color: 'var(--primary)' }}>-37.00</td>
              </tr>
              <tr className="font-semibold" style={{ backgroundColor: 'var(--muted)', transition: 'all 0.2s ease' }}>
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-right">280</td>
                <td className="py-3 px-4 text-right">2,023.01</td>
                <td className="py-3 px-4 text-right">73.50</td>
                <td className="py-3 px-4 text-right">1,949.51</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border)', transition: 'all 0.3s ease' }}>
          <div className="flex items-start space-x-2">
            <SettingsIcon style={{ color: 'var(--primary)', marginTop: '4px' }} size={20} />
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>Note:</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                Data di atas adalah sample data. Untuk export data aktual dari perhitungan Anda, 
                pastikan sudah melakukan input di setiap modul terlebih dahulu.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Export History (Optional future feature) */}
      <motion.div
        className="mt-6 rounded-2xl shadow-sm p-6"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', transition: 'all 0.3s ease' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>Export Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">1</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>CSV Format</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Best for data analysis in Excel, Google Sheets, or statistical software
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">2</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>JSON Format</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Ideal for API integration, data backup, or custom processing scripts
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">3</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>PDF Format</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Professional report format for presentations, documentation, and sharing with stakeholders
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
