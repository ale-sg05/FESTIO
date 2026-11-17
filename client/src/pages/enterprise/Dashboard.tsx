import MainLayout from "@/layouts/Layout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import Chart from "react-apexcharts";

interface DashboardData {
  empresa: {
    razon_social: string;
    festivales: any[];
  };
  metricas: {
    totalClientes: number;
    totalAbonos: number;
    totalFestivales: number;
    festivalesActivos: number;
  };
  financiero: {
    ingresosTotales: number;
    ingresosPorCompraAbonos: number;
    ingresosPorRecargaAbonos: number;
    saldoPendiente: number;
    ventasPorTipoAbono: Array<{
      tipo: string;
      nombreTipo: string;
      cantidad: number;
      precioUnitario: number;
      ingresoTotal: number;
    }>;
  };
  actividadReciente: Array<{
    id: string;
    cantidad: string;
    moneda: string;
    propietario: string;
    timestamp: string;
  }>;
}

export default function EnterpriseDashboard() {
  const enterprise = getAuthUser();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!enterprise) return;
      try {
        const response = await api.get(
          `/enterprise/${enterprise.id}/dashboard`,
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [enterprise?.id]);

  if (!enterprise) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-red-500">No se pudo cargar la empresa.</p>
        </div>
      </MainLayout>
    );
  }

  // Preparar datos para el gráfico de ventas por tipo de abono
  const ventasChartOptions: any = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories:
        dashboardData?.financiero.ventasPorTipoAbono.map((v) => v.nombreTipo) ||
        [],
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "hsl(var(--muted-foreground))",
        },
        formatter: (val: number) => `€${val.toLocaleString()}`,
      },
    },
    colors: [
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#06B6D4", // Cyan
      "#F59E0B", // Amber
      "#10B981", // Emerald
      "#EF4444", // Red
      "#3B82F6", // Blue
      "#6366F1", // Indigo
    ],
    grid: {
      borderColor: "hsl(var(--border))",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `€${val.toLocaleString()}`,
      },
      style: {
        fontSize: "12px",
      },
    },
    fill: {
      opacity: 0.8,
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.15,
        },
      },
    },
  };

  const ventasChartSeries = [
    {
      name: "Ingresos",
      data:
        dashboardData?.financiero.ventasPorTipoAbono.map(
          (v) => v.ingresoTotal,
        ) || [],
    },
  ];

  // Preparar datos para el gráfico de distribución de ingresos
  const ingresosPieOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      sparkline: { enabled: false },
    },
    labels: ["Compra de Abonos", "Recarga de Abonos"],
    colors: ["#8B5CF6", "#06B6D4"],
    legend: {
      position: "bottom",
      labels: {
        colors: "hsl(var(--foreground))",
        useSeriesColors: false,
      },
      fontSize: 12,
      offsetY: 5,
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              fontSize: "12px",
            },
            value: {
              fontSize: "16px",
              fontWeight: "bold",
              formatter: (val: number) => `€${val.toLocaleString()}`,
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `€${val.toLocaleString()}`,
      },
      style: {
        fontSize: "12px",
      },
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.15,
        },
      },
    },
  };

  const ingresosPieSeries = dashboardData
    ? [
        dashboardData.financiero.ingresosPorCompraAbonos,
        dashboardData.financiero.ingresosPorRecargaAbonos,
      ]
    : [];

  // Formatear fecha relativa
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
          {/* Stats Card 1 - Total Ingresos */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm font-medium text-muted-foreground">
                Total Ingresos
              </div>
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">
                  €{dashboardData?.financiero.ingresosTotales.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Stats Card 2 - Total Clientes */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm font-medium text-muted-foreground">
                Total Clientes
              </div>
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">
                  {dashboardData?.metricas.totalClientes}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {dashboardData?.metricas.totalAbonos} abonos activos
              </div>
            </div>
          </div>

          {/* Stats Card 3 - Festivales */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm font-medium text-muted-foreground">
                Total Festivales
              </div>
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">
                  {dashboardData?.metricas.totalFestivales}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {dashboardData?.metricas.festivalesActivos} activos actualmente
              </div>
            </div>
          </div>

          {/* Stats Card 4 - Saldo Pendiente */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm font-medium text-muted-foreground">
                Devoluciones
              </div>
              {loading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">
                  €{dashboardData?.financiero.saldoPendiente.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Large Chart - Ventas por Tipo de Abono */}
          <div className="col-span-12 lg:col-span-8 row-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Ventas por Tipo de Abono
              </h3>
              <div className="text-sm text-muted-foreground">
                Ingresos totales
              </div>
            </div>
            {loading ? (
              <div className="h-full w-full bg-muted animate-pulse rounded" />
            ) : (
              <div className="h-[calc(100%-2rem)]">
                <Chart
                  options={ventasChartOptions}
                  series={ventasChartSeries}
                  type="bar"
                  height="100%"
                />
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="col-span-12 lg:col-span-4 row-span-2 rounded-xl border bg-card p-6 shadow-sm overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-[300px]">
                {dashboardData?.actividadReciente
                  .slice(0, 8)
                  .map((actividad) => (
                    <ActivityItem
                      key={actividad.id}
                      title="Compra realizada"
                      description={`€${parseFloat(actividad.cantidad).toLocaleString()} - ${actividad.propietario}`}
                      time={formatRelativeTime(actividad.timestamp)}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Distribución de Ingresos - Donut Chart */}
          <div className="col-span-12 lg:col-span-6 row-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Distribución de Ingresos
            </h3>
            {loading ? (
              <div className="h-full w-full bg-muted animate-pulse rounded" />
            ) : (
              <div className="h-[calc(100%-2rem)]">
                <Chart
                  options={ingresosPieOptions}
                  series={ingresosPieSeries}
                  type="donut"
                  height="100%"
                />
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="col-span-12 lg:col-span-6 row-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">Compra de Abonos</span>
                <span className="text-lg font-bold text-primary">
                  €
                  {dashboardData?.financiero.ingresosPorCompraAbonos.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">
                  Recarga de Abonos
                </span>
                <span className="text-lg font-bold text-green-700 dark:text-green-900">
                  €
                  {dashboardData?.financiero.ingresosPorRecargaAbonos.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20 w-full col-span-12">
            <span className="text-sm font-medium">Total General</span>
            <span className="text-xl font-bold text-primary">
              €{dashboardData?.financiero.ingresosTotales.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <div className="h-2 w-2 rounded-full bg-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}
