import React, { useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Bar, Pie, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  Download, 
  BarChart, 
  PieChart, 
  LineChart, 
  FileSpreadsheet 
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { 
    communications, 
    companies, 
    communicationMethods 
  } = useSelector((state: RootState) => state.app);
  
  const { 
    communicationMethodFrequency = {}, 
    engagementEffectiveness = {},
    communicationTrends = { total: 0, overdue: 0, completed: 0 }
  } = useSelector((state: RootState) => state.reporting);

  // Refs for chart containers
  const frequencyChartRef = useRef(null);
  const effectivenessChartRef = useRef(null);
  const trendsChartRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('Communication Methods:', communicationMethods);
    console.log('Engagement Effectiveness:', engagementEffectiveness);
    console.log('Communication Method Frequency:', communicationMethodFrequency);
  }, [communicationMethods, engagementEffectiveness, communicationMethodFrequency]);

  // Communication Method Frequency Data
  const communicationMethodFrequencyData = useMemo(() => {
    const methodCount = communicationMethods.length;
    const defaultData = methodCount > 0 
      ? communicationMethods.map(method => ({
          method: method.name,
          frequency: communicationMethodFrequency[method.id] || 0
        }))
      : [{ method: 'No Data', frequency: 0 }];

    return {
      labels: defaultData.map(item => item.method),
      datasets: [{
        label: 'Communication Method Frequency',
        data: defaultData.map(item => item.frequency),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', 
          '#4BC0C0', '#9966FF', '#FF9F40'
        ].slice(0, defaultData.length)
      }]
    };
  }, [communicationMethods, communicationMethodFrequency]);

  // Engagement Effectiveness Data
  const engagementEffectivenessData = useMemo(() => {
    const methodCount = communicationMethods.length;
    const defaultData = methodCount > 0 
      ? communicationMethods.map(method => ({
          method: method.name,
          effectiveness: engagementEffectiveness[method.id] || Math.floor(Math.random() * 100)
        }))
      : [{ method: 'No Data', effectiveness: 100 }];

    return {
      labels: defaultData.map(item => item.method),
      datasets: [{
        label: 'Engagement Effectiveness (%)',
        data: defaultData.map(item => item.effectiveness),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', 
          '#4BC0C0', '#9966FF', '#FF9F40'
        ].slice(0, defaultData.length)
      }]
    };
  }, [communicationMethods, engagementEffectiveness]);

  // Communication Trends Data
  const communicationTrendsData = useMemo(() => ({
    labels: ['Total', 'Overdue', 'Completed'],
    datasets: [{
      label: 'Communication Trends',
      data: [
        communicationTrends.total || 0, 
        communicationTrends.overdue || 0, 
        communicationTrends.completed || 0
      ],
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0']
    }]
  }), [communicationTrends]);

  // Chart configuration options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Communication Insights'
      }
    }
  };

  // Download PDF Report
  const downloadPDFReport = async () => {
    const pdf = new jsPDF('landscape');
    
    // Add title
    pdf.setFontSize(20);
    pdf.text('Communication Reports', 15, 15);

    // Capture charts
    const chartRefs = [
      { ref: frequencyChartRef, title: 'Communication Method Frequency' },
      { ref: effectivenessChartRef, title: 'Engagement Effectiveness' },
      { ref: trendsChartRef, title: 'Communication Trends' }
    ];

    for (let i = 0; i < chartRefs.length; i++) {
      const chartRef = chartRefs[i].ref.current;
      if (chartRef) {
        const canvas = await html2canvas(chartRef);
        const imgData = canvas.toDataURL('image/png');
        
        // Add page for each chart after the first
        if (i > 0) pdf.addPage();
        
        // Add chart title
        pdf.setFontSize(16);
        pdf.text(chartRefs[i].title, 15, 15);
        
        // Add chart image
        pdf.addImage(imgData, 'PNG', 15, 25, 270, 150);
      }
    }

    // Save PDF
    pdf.save(`communication_report_${new Date().toISOString()}.pdf`);
  };

  // Download CSV Report
  const downloadCSVReport = () => {
    // Prepare data for CSV
    const csvData = {
      'Communication Method Frequency': communicationMethods.map(method => ({
        Method: method.name,
        Frequency: communicationMethodFrequency[method.id] || 0
      })),
      'Engagement Effectiveness': communicationMethods.map(method => ({
        Method: method.name,
        Effectiveness: engagementEffectiveness[method.id] || 0
      })),
      'Communication Trends': [
        { 
          Metric: 'Total Communications', 
          Value: communicationTrends.total || 0
        },
        { 
          Metric: 'Overdue Communications', 
          Value: communicationTrends.overdue || 0
        },
        { 
          Metric: 'Completed Communications', 
          Value: communicationTrends.completed || 0
        }
      ]
    };

    // Generate and download CSV files
    Object.entries(csvData).forEach(([key, data]) => {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${key.toLowerCase().replace(/\s+/g, '_')}_report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Communication Reports
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gain insights into your communication strategies and performance
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={downloadPDFReport}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Download className="h-5 w-5 mr-2 text-gray-500" />
              Download PDF
            </button>
            <button
              onClick={downloadCSVReport}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2 text-gray-500" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Communication Method Frequency */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart className="h-6 w-6 mr-3 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Communication Method Frequency
              </h2>
            </div>
            <div ref={frequencyChartRef} className="h-64">
              <Bar 
                data={communicationMethodFrequencyData} 
                options={chartOptions} 
              />
            </div>
          </div>

          {/* Engagement Effectiveness */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 mr-3 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Engagement Effectiveness
              </h2>
            </div>
            <div ref={effectivenessChartRef} className="h-64">
              <Pie 
                data={engagementEffectivenessData} 
                options={chartOptions} 
              />
            </div>
          </div>

          {/* Communication Trends */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
            <div className="flex items-center mb-4">
              <LineChart className="h-6 w-6 mr-3 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Communication Trends
              </h2>
            </div>
            <div ref={trendsChartRef} className="h-64">
              <Bar 
                data={communicationTrendsData} 
                options={chartOptions} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}