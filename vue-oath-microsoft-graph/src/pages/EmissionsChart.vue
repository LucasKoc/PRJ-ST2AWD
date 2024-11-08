<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import Papa from 'papaparse';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
);

export default defineComponent({
  name: 'CO2EmissionsChart',
  components: {FontAwesomeIcon},
  setup() {
    interface ChartDataType {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
      }>;
    }

    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: []
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Global CO₂ Emissions Over Time'
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
        legend: {
          display: true,
          position: 'top' as const,
        },
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        },
        y: {
          title: {
            display: true,
            text: 'CO₂ Emissions (Million tonnes)'
          },
          beginAtZero: true,
        },
      },
    });

    const chartInstance = ref<Chart | null>(null);
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    const CACHE_KEY = 'chartData';
    const CACHE_TIMESTAMP_KEY = 'chartDataTimestamp';
    const CACHE_DURATION = 1000 * 60 * 60 * 24;

    const getColor = (index: number): string => {
      const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
      ];
      return colors[index % colors.length];
    };

    const loadChartData = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = Date.now();

      if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < CACHE_DURATION) {
        console.log('Loading data from localStorage');
        chartData.value = JSON.parse(cachedData);
      } else {
        try {
          const data = await fetchCO2EmissionsData();
          console.log("Data keys:", Object.keys(data[0] || {}));

          const processedData = processEmissionsData(data);
          console.log("Processed data:", processedData);

          if (processedData.years.length > 0 && processedData.datasets.length > 0) {
            chartData.value = {
              labels: processedData.years,
              datasets: processedData.datasets,
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(chartData.value));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
          }
        } catch (error) {
          console.error('Error loading chart data:', error);
        }
      }
    };

    const fetchCO2EmissionsData = async () => {
      const response = await fetch(
          'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv'
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const csvText = await response.text();

      return new Promise<any[]>((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            console.log("CSV Parsing Complete:", results.data);
            resolve(results.data);
          },
          error: (error: any) => {
            console.error('Error parsing CSV data:', error);
            reject(error);
          },
        });
      });
    };

    const processEmissionsData = (data: any[]) => {
      const countries = ['USA', 'CHN', 'IND', 'RUS', 'JPN', 'DEU'];
      const countryNames: { [key: string]: string } = {
        USA: 'United States',
        CHN: 'China',
        IND: 'India',
        RUS: 'Russia',
        JPN: 'Japan',
        DEU: 'Germany',
      };

      const emissionsMap: { [key: string]: Map<string, number> } = {};
      countries.forEach((country) => {
        emissionsMap[country] = new Map<string, number>();
      });

      const yearsSet: Set<string> = new Set();

      data.forEach((entry) => {
        const countryCode = entry['iso_code'];
        if (countries.includes(countryCode)) {
          const year = entry['year'];
          const co2Value = parseFloat(entry['co2']);
          if (year && !isNaN(co2Value)) {
            yearsSet.add(year);
            emissionsMap[countryCode].set(year, co2Value);
          }
        }
      });

      // Sort years in ascending order
      const sortedYears = Array.from(yearsSet).sort((a, b) => parseInt(a) - parseInt(b));

      // Prepare datasets for each country
      const datasets = countries.map((country, index) => {
        const emissions = sortedYears.map(year => emissionsMap[country].get(year) || 0);
        const color = getColor(index);

        return {
          label: countryNames[country],
          data: emissions,
          borderColor: color,
          backgroundColor: color,
          fill: false,
        };
      });

      return {
        years: sortedYears,
        datasets,
      };
    };

    const initializeChart = async () => {
      await loadChartData();
      await nextTick();

      if (canvasRef.value) {
        if (chartInstance.value) {
          chartInstance.value.destroy();
        }

        chartInstance.value = new Chart(canvasRef.value, {
          type: 'line',
          data: chartData.value,
          options: chartOptions.value,
        });
      }
    };

    onMounted(() => {
      initializeChart();
    });

    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
    });

    return {
      chartData,
      chartOptions,
      canvasRef,
    };
  },
});
</script>

<template>
  <div class="p-4">
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold mb-4">Global CO₂ Emissions Over Time</h2>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="flex justify-center items-center my-4">
          <div class="flex items-center space-x-2">
            <font-awesome-icon icon="spinner" class="animate-spin text-primary-500 text-2xl"></font-awesome-icon>
            <span>Loading data...</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-error shadow-lg my-4">
          <div>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- Chart Container -->
        <div v-if="!isLoading && !error" class="chart-container w-full h-96">
          <canvas ref="canvasRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
