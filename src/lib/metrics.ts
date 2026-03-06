import { ChurchData } from '../data';

export const calculateMetrics = (data: ChurchData[]) => {
  const totalVotos = data.reduce((acc, curr) => acc + curr.cierre, 0);
  const metaVotos = data.reduce((acc, curr) => acc + curr.totalReferidos, 0);
  const avanceVotos = metaVotos > 0 ? Math.round((totalVotos / metaVotos) * 100) : 0;

  const totalIglesias = data.length;
  const iglesiasActivas = data.filter(d => d.cierre > 0).length;
  const avanceIglesias = totalIglesias > 0 ? Math.round((iglesiasActivas / totalIglesias) * 100) : 0;

  const totalLideres = data.reduce((acc, curr) => acc + curr.totalLideres, 0);
  const lideresReportados = data.reduce((acc, curr) => acc + curr.lideresConReferidos, 0);
  const avanceLideres = totalLideres > 0 ? Math.round((lideresReportados / totalLideres) * 100) : 0;

  return {
    votos: { reportados: totalVotos, total: metaVotos, avance: avanceVotos },
    iglesias: { activas: iglesiasActivas, total: totalIglesias, avance: avanceIglesias },
    lideres: { reportados: lideresReportados, total: totalLideres, avance: avanceLideres }
  };
};

export const getChartData = (data: ChurchData[]) => {
  const hours = ['h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16'];
  const labels = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
  return labels.map((label, index) => {
    const hourKey = hours[index] as keyof ChurchData;
    const totalForHour = data.reduce((acc, curr) => acc + (curr[hourKey] as number || 0), 0);
    return { name: label, value: totalForHour };
  });
};

export const getTopIglesias = (data: ChurchData[]) => {
  return [...data]
    .filter(iglesia => iglesia.porcentajeAvance > 0)
    .sort((a, b) => {
      if (b.porcentajeAvance !== a.porcentajeAvance) {
        return b.porcentajeAvance - a.porcentajeAvance;
      }
      return b.cierre - a.cierre; // Tie-breaker: higher votes
    })
    .slice(0, 5);
};

export const getIglesiasCriticas = (data: ChurchData[]) => {
  return [...data]
    .filter(iglesia => iglesia.porcentajeAvance < 70)
    .sort((a, b) => {
      if (a.porcentajeAvance !== b.porcentajeAvance) {
        return a.porcentajeAvance - b.porcentajeAvance;
      }
      return a.cierre - b.cierre; // Tie-breaker: lower votes
    })
    .slice(0, 5);
};
