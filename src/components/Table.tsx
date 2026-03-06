import React from 'react';
import { ChurchData } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Search } from 'lucide-react';

interface TableProps {
  data: ChurchData[];
}

export function Table({ data }: TableProps) {
  const totalLideres = data.reduce((acc, curr) => acc + curr.totalLideres, 0);
  const totalLideresConReferidos = data.reduce((acc, curr) => acc + curr.lideresConReferidos, 0);
  const totalMetaVotos = data.reduce((acc, curr) => acc + curr.totalReferidos, 0);
  const totalVotosReportados = data.reduce((acc, curr) => acc + curr.cierre, 0);
  const totalPorcentajeAvance = totalMetaVotos > 0 ? Math.round((totalVotosReportados / totalMetaVotos) * 100) : 0;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">{data.length} municipios</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar iglesia..." 
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-indigo-900 uppercase bg-indigo-50/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Iglesia ▲</th>
              <th className="px-6 py-4 font-semibold">Votos Reportados ⇅</th>
              <th className="px-6 py-4 font-semibold">% Avance ⇅</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Meta Votos ⇅</th>
              <th className="px-6 py-4 font-semibold">Total Líderes ⇅</th>
              <th className="px-6 py-4 font-semibold">Líderes con Referidos ⇅</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-6 w-6 text-slate-300" />
                    <span>No se encontraron resultados</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{row.temploZona}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{row.cierre}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {row.porcentajeAvance}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {row.porcentajeAvance >= 80 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Óptimo
                      </span>
                    ) : row.porcentajeAvance >= 50 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Regular
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        Crítico
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.totalReferidos}</td>
                  <td className="px-6 py-4 text-slate-600">{row.totalLideres}</td>
                  <td className="px-6 py-4 text-slate-600">{row.lideresConReferidos}</td>
                </tr>
              ))
            )}
            {data.length > 0 && (
              <tr className="bg-indigo-50/80 border-t-2 border-indigo-100 font-bold text-slate-900">
                <td className="px-6 py-4 uppercase text-indigo-900">Total General</td>
                <td className="px-6 py-4">{totalVotosReportados}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-200 text-indigo-900">
                    {totalPorcentajeAvance}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  {totalPorcentajeAvance >= 80 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Óptimo
                    </span>
                  ) : totalPorcentajeAvance >= 50 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Regular
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      Crítico
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{totalMetaVotos}</td>
                <td className="px-6 py-4">{totalLideres}</td>
                <td className="px-6 py-4">{totalLideresConReferidos}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
