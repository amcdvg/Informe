import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { getChartData } from '../lib/metrics';
import { ChurchData } from '../data';

interface ChartProps {
  data: ChurchData[];
}

export function Chart({ data }: ChartProps) {
  const chartData = getChartData(data);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <span className="text-indigo-600">📈</span> Votos reportados — Evolución hora a hora (8:00 a.m. - 4:00 p.m.)
        </CardTitle>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">Todas las Iglesias</span>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748B', fontSize: 12 }} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4F46E5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
