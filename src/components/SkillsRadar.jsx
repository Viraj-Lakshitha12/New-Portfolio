import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/lib/theme-context';

const data = [
  { subject: 'Backend', A: 95, fullMark: 100 },
  { subject: 'Frontend', A: 85, fullMark: 100 },
  { subject: 'Database', A: 90, fullMark: 100 },
  { subject: 'DevOps', A: 75, fullMark: 100 },
  { subject: 'Architecture', A: 85, fullMark: 100 },
  { subject: 'UI/UX', A: 70, fullMark: 100 },
];

export default function SkillsRadar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }} 
          />
          <Radar
            name="Skill Level"
            dataKey="A"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: 'var(--accent)',
              borderRadius: '12px',
              borderWidth: '1px',
              color: isDark ? '#fff' : '#000',
              fontFamily: 'var(--font-mono)'
            }}
            itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
