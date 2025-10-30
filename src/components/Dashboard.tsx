'use client';

import {
  Sprout,
  TrendingDown,
  Activity,
  Calendar,
  LayoutDashboard,
  PieChart,
  Lightbulb
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const monthlyData = [
  { month: 'Jan', emissions: 120 },
  { month: 'Feb', emissions: 115 },
  { month: 'Mar', emissions: 108 },
  { month: 'Apr', emissions: 95 },
  { month: 'May', emissions: 92 },
  { month: 'Jun', emissions: 88 },
];

const emissionData = [
  { name: 'Transportation', value: 35, color: 'var(--primary)' },
  { name: 'Landfill', value: 25, color: '#85B0BA' },
  { name: 'Composting', value: 15, color: '#FF8210' },
  { name: 'Recycling', value: 10, color: '#8B5CF6' },
  { name: 'Others', value: 15, color: 'var(--muted)' },
];

const summaryCards = [
  {
    title: 'Total Emissions',
    value: '88.5',
    unit: 'ton CO₂e/month',
    icon: Sprout,
    trend: '-12%',
    trendUp: false
  },
  {
    title: 'Reduction from Baseline',
    value: '31.5',
    unit: '%',
    icon: TrendingDown,
    trend: '-5%',
    trendUp: true
  },
  {
    title: 'Active Scenario',
    value: 'Intervention A',
    unit: 'Optimized fleet',
    icon: Activity,
    trend: null
  },
  {
    title: 'Last Updated',
    value: 'Oct 25, 2025',
    unit: 'Today',
    icon: Calendar,
    trend: null
  }
];

const aiInsight = {
  title: 'AI Analysis',
  insight: '60% of your emissions come from transportation. Consider: 1) Optimizing routes to reduce distance by 15%, 2) Switching 30% of diesel trucks to electric, or 3) Implementing GPS real-time monitoring. These changes could reduce total emissions by ~8.5 tons CO₂e monthly.',
  recommendations: [
    'Route optimization could save 5.2 tons CO₂e/month',
    'Electric fleet conversion: 3.1 tons CO₂e/month reduction',
    'Improved waste segregation: 2.1 tons CO₂e/month potential'
  ]
};

export default function Dashboard() {
  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'var(--primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <LayoutDashboard style={{ color: 'var(--primary-foreground)' }} size={24} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold" style={{ color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                KarWanua Dashboard
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>
                Real-time GHG emission monitoring and analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: 'var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Icon style={{ color: 'var(--primary-foreground)' }} size={24} />
                  </div>
                  {card.trend && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: !card.trendUp ? 'var(--primary)' : '#DC2626'
                    }}>
                      <TrendingDown size={16} />
                      <span>{card.trend}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'var(--foreground)',
                      fontFamily: 'Lato, sans-serif',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {card.value}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>{card.title}</p>
                  <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>{card.unit}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Emission Composition */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                Emission Composition
              </h2>
              <PieChart style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }} size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={emissionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend */}
          <div
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                Monthly Trend
              </h2>
              <LayoutDashboard style={{ color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }} size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  name="Emissions (ton CO₂e)"
                  dot={{ fill: 'var(--primary)', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div
          style={{
            backgroundColor: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'var(--primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <Lightbulb style={{ color: 'var(--primary-foreground)' }} size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>
                {aiInsight.title}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', transition: 'color 0.3s ease' }}>AI-powered recommendations</p>
            </div>
          </div>

          <p style={{ color: 'var(--foreground)', marginBottom: '16px', transition: 'color 0.3s ease' }}>{aiInsight.insight}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontWeight: '500', color: 'var(--foreground)', marginBottom: '8px', transition: 'color 0.3s ease' }}>
              Key Recommendations:
            </h3>
            {aiInsight.recommendations.map((rec, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '50%',
                    marginTop: '8px',
                    flexShrink: 0,
                    transition: 'all 0.3s ease'
                  }}
                />
                <p style={{ fontSize: '14px', color: 'var(--foreground)', transition: 'color 0.3s ease' }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
