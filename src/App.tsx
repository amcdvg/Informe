import React, { useState, useEffect } from 'react';
import { ChurchData } from './data';
import { calculateMetrics, getTopIglesias, getIglesiasCriticas } from './lib/metrics';
import { Card, CardContent } from './components/ui/Card';
import { CircularProgress } from './components/ui/CircularProgress';
import { Chart } from './components/Chart';
import { Table } from './components/Table';
import { MapPin, Trophy, AlertTriangle, ChevronDown, Loader2, BarChart3 } from 'lucide-react';
import { fetchSheetData } from './services/googleSheets';

export default function App() {
  const [selectedIglesia, setSelectedIglesia] = useState('Todas las iglesias');
  const [data, setData] = useState<ChurchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sheetData = await fetchSheetData();
        setData(sheetData);
        setError(null);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Error al cargar los datos. Por favor, intente de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Actualización en tiempo real (cada 10 segundos)
    const interval = setInterval(loadData, 10 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredData = selectedIglesia === 'Todas las iglesias' 
    ? data 
    : data.filter(d => d.temploZona === selectedIglesia);

  const metrics = calculateMetrics(filteredData);
  const topIglesias = getTopIglesias(data);
  const iglesiasCriticas = getIglesiasCriticas(data);

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-slate-600 font-medium">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-rose-100 max-w-md w-full text-center">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Error de conexión</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Panel Central de Reportes de Votos</h1>
            <p className="text-xs text-slate-500 font-medium">Risaralda · Dashboard de Avance de Metas</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <span className="text-sm font-semibold text-slate-700">administrador</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <label className="text-sm font-semibold text-slate-700">Iglesia:</label>
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
              value={selectedIglesia}
              onChange={(e) => setSelectedIglesia(e.target.value)}
            >
              <option value="Todas las iglesias">Todas las iglesias</option>
              {data.map(d => (
                <option key={d.temploZona} value={d.temploZona}>{d.temploZona}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Resumen de progreso */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-indigo-950 mb-4 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
            Resumen de progreso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center py-8">
              <CircularProgress value={metrics.votos.avance} label="avance" color="text-indigo-500" />
              <h3 className="mt-4 font-bold text-slate-800">Votos Reportados</h3>
              <p className="text-sm mt-1">
                <span className="font-semibold text-emerald-600">{metrics.votos.reportados} rep.</span> 
                <span className="text-slate-400 mx-1">/</span> 
                <span className="text-slate-500 font-medium">{metrics.votos.total} total.</span>
              </p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-8">
              <CircularProgress value={metrics.iglesias.avance} label="activos" color="text-sky-400" />
              <h3 className="mt-4 font-bold text-slate-800">Iglesias Reportadas</h3>
              <p className="text-sm mt-1">
                <span className="font-semibold text-emerald-600">{metrics.iglesias.activas} rep.</span> 
                <span className="text-slate-400 mx-1">/</span> 
                <span className="text-slate-500 font-medium">{metrics.iglesias.total} total.</span>
              </p>
            </Card>

            <Card className="flex flex-col justify-center py-6 px-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">
                    {selectedIglesia === 'Todas las iglesias' ? 'Metas Globales' : 'Metas de la Iglesia'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedIglesia === 'Todas las iglesias' ? 'Progreso general' : selectedIglesia}
                  </p>
                </div>
              </div>
              <div className="w-full space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-600">Votos Reportados</span>
                    <span className="font-bold text-indigo-600">{metrics.votos.reportados}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(metrics.votos.avance, 100)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-600">Meta Total</span>
                    <span className="font-bold text-slate-800">{metrics.votos.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-slate-300 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Top & Critical */}
        {selectedIglesia === 'Todas las iglesias' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="transition-all duration-200">
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="text-amber-500" size={20} />
                    <h3 className="font-bold text-slate-800">Top 5 Iglesias</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Destacados</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-100">
                  <ul className="space-y-3">
                    {topIglesias.map((iglesia, idx) => (
                      <li key={iglesia.temploZona} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-400 w-4">{idx + 1}.</span>
                          <span className="text-sm font-medium text-slate-700">{iglesia.temploZona}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-emerald-600">{iglesia.cierre} votos</span>
                          <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">{iglesia.porcentajeAvance}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200">
              <CardContent className="p-4 flex flex-col">
                <div className="flex items-center justify-between w-full mb-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-rose-500" size={20} />
                    <h3 className="font-bold text-slate-800">Iglesias Críticas</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">En Riesgo</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {iglesiasCriticas.length === 0 ? (
                    <div className="py-6 text-center text-sm text-slate-500 font-medium">
                      No hay iglesias en estado crítico (todas superan el 70%)
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {iglesiasCriticas.map((iglesia, idx) => (
                        <li key={iglesia.temploZona} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-400 w-4">{idx + 1}.</span>
                            <span className="text-sm font-medium text-slate-700">{iglesia.temploZona}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-rose-600">{iglesia.cierre} votos</span>
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">{iglesia.porcentajeAvance}%</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chart */}
        <Chart data={filteredData} />

        {/* Tabs */}
        <div className="mt-12 mb-6 border-b border-slate-200 flex gap-8">
          <button className="pb-4 font-bold text-indigo-900 border-b-2 border-indigo-900">
            Detalle por Iglesia
          </button>
        </div>

        {/* Table Section */}
        <div>
          <h2 className="text-lg font-bold text-indigo-950 mb-4 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
            Detalle por Iglesia
          </h2>
          <Table data={filteredData} />
        </div>

      </main>
    </div>
  );
}
