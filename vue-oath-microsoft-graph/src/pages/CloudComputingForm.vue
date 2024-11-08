<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch, computed } from 'vue';
import {
  calculateCloudComputingVMFootprint,
  calculateCloudComputingCPUFootprint,
  calculateCloudComputingStorageFootprint,
  calculateCloudComputingMemoryFootprint,
  getCloudComputingProviders,
} from '@/lib/climatiqService';
import AsyncButton from '@/components/AsyncButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'CloudComputingForm',
  components: {
    AsyncButton,
    FontAwesomeIcon,
  },
  setup() {
    const loading = ref(false);
    const result = ref(null);

    const form = reactive({
      provider: '',
      region: '',
      duration: 1,
      instance: '',
      cpuCount: 1,
      storageType: '',
      dataAmount: 0,
      memoryAmount: 0,
    });

    interface ProviderInfo {
      provider_id: string;
      provider_full_name: string;
      regions: string[];
      virtual_machine_instances: string[];
    }

    interface ProviderData {
      [key: string]: ProviderInfo;
    }

    const providerData = reactive<ProviderData>({});

    const providers = ref<string[]>([]);
    const instances = ref<string[]>([]);
    const regions = ref<string[]>([]);

    const selectedMethod = ref('vm');

    const fetchProviders = async () => {
      try {
        const data = await getCloudComputingProviders();
        if (data && data.cloud_providers) {
          Object.assign(providerData, data.cloud_providers);
          providers.value = Object.keys(data.cloud_providers);
        } else {
          console.error('Unexpected data structure:', data);
          providers.value = [];
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        providers.value = [];
      }
    };

    const fetchInstancesAndRegions = () => {
      if (form.provider) {
        const providerInfo = providerData[form.provider];

        if (providerInfo) {
          instances.value = providerInfo.virtual_machine_instances || [];
          regions.value = providerInfo.regions || [];
        } else {
          instances.value = [];
          regions.value = [];
        }
      } else {
        instances.value = [];
        regions.value = [];
      }
    };

    onMounted(() => {
      Object.keys(providerData).forEach((key: string) => {
        delete providerData[key];
      });
      fetchProviders();
    });

    const handleProviderChange = () => {
      form.instance = '';
      form.region = '';
      fetchInstancesAndRegions();
    };

    watch(selectedMethod, () => {
      form.instance = '';
      form.cpuCount = 1;
      form.storageType = '';
      form.dataAmount = 0;
      form.memoryAmount = 0;
      form.duration = 1;
      result.value = null;
    });

    const isFormValid = computed(() => {
      if (!form.provider || !form.region) {
        return false;
      }
      if (selectedMethod.value === 'vm') {
        return form.instance !== '' && form.duration > 0;
      } else if (selectedMethod.value === 'cpu') {
        return form.cpuCount > 0 && form.duration > 0;
      } else if (selectedMethod.value === 'storage') {
        return form.storageType !== '' && form.dataAmount > 0 && form.duration > 0;
      } else if (selectedMethod.value === 'memory') {
        return form.memoryAmount > 0 && form.duration > 0;
      }
      return false;
    });

    const handleSubmit = async () => {
      loading.value = true;
      try {
        let response;
        switch (selectedMethod.value) {
          case 'vm':
            response = await calculateCloudComputingVMFootprint(
                form.provider,
                form.instance,
                form.region,
                form.duration
            );
            break;
          case 'cpu':
            response = await calculateCloudComputingCPUFootprint(
                form.provider,
                form.region,
                form.cpuCount,
                form.duration
            );
            break;
          case 'storage':
            response = await calculateCloudComputingStorageFootprint(
                form.provider,
                form.region,
                form.storageType,
                form.dataAmount,
                form.duration
            );
            break;
          case 'memory':
            response = await calculateCloudComputingMemoryFootprint(
                form.provider,
                form.region,
                form.memoryAmount,
                form.duration
            );
            break;
          default:
            throw new Error('Invalid calculation method selected.');
        }

        result.value = response;
      } catch (error) {
        console.error('Error calculating emissions:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      handleSubmit,
      loading,
      result,
      providers,
      instances,
      regions,
      handleProviderChange,
      selectedMethod,
      isFormValid,
    };
  },
});
</script>


<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Calculate Cloud Computing Carbon Footprint</h1>

    <!-- Tabs for Calculation Methods -->
    <div class="flex justify-around">
      <button
          class="btn btn-ghost"
          :class="{ 'btn-active': selectedMethod === 'vm' }"
          @click="selectedMethod = 'vm'"
      >
        Virtual Machine
      </button>
      <button
          class="btn btn-ghost"
          :class="{ 'btn-active': selectedMethod === 'cpu' }"
          @click="selectedMethod = 'cpu'"
      >
        CPU Usage
      </button>
      <button
          class="btn btn-ghost"
          :class="{ 'btn-active': selectedMethod === 'storage' }"
          @click="selectedMethod = 'storage'"
      >
        Storage Usage
      </button>
      <button
          class="btn btn-ghost"
          :class="{ 'btn-active': selectedMethod === 'memory' }"
          @click="selectedMethod = 'memory'"
      >
        Memory Usage
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
      <!-- Provider Selection -->
      <div>
        <label for="provider" class="block text-sm font-medium">Cloud Provider</label>
        <select
            v-model="form.provider"
            @change="handleProviderChange"
            id="provider"
            class="select select-bordered mt-1 w-full"
            required
        >
          <option disabled value="">Select a provider</option>
          <option v-for="provider in providers" :key="provider" :value="provider">
            {{ provider }}
          </option>
        </select>
      </div>

      <!-- Region Selection -->
      <div>
        <label for="region" class="block text-sm font-medium">Region</label>
        <select
            v-model="form.region"
            id="region"
            class="select select-bordered mt-1 w-full"
            :disabled="!form.provider || regions.length === 0"
            required
        >
          <option disabled value="">Select a region</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </div>

      <!-- Calculation Method Specific Inputs -->
      <!-- Virtual Machine Instance -->
      <div v-if="selectedMethod === 'vm'">
        <div>
          <label for="instance" class="block text-sm font-medium">Instance Type</label>
          <select
              v-model="form.instance"
              id="instance"
              class="select select-bordered mt-1 w-full"
              :disabled="!form.provider || instances.length === 0"
              required
          >
            <option disabled value="">Select an instance type</option>
            <option v-for="instance in instances" :key="instance" :value="instance">
              {{ instance }}
            </option>
          </select>
        </div>

        <div>
          <label for="duration" class="block text-sm font-medium">Duration (hours)</label>
          <input
              v-model.number="form.duration"
              id="duration"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>
      </div>

      <!-- CPU Usage -->
      <div v-else-if="selectedMethod === 'cpu'">
        <div>
          <label for="cpuCount" class="block text-sm font-medium">CPU Count</label>
          <input
              v-model.number="form.cpuCount"
              id="cpuCount"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>

        <div>
          <label for="duration" class="block text-sm font-medium">Duration (hours)</label>
          <input
              v-model.number="form.duration"
              id="duration"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>
      </div>

      <!-- Storage Usage -->
      <div v-else-if="selectedMethod === 'storage'">
        <div>
          <label for="storageType" class="block text-sm font-medium">Storage Type</label>
          <select
              v-model="form.storageType"
              id="storageType"
              class="select select-bordered mt-1 w-full"
              required
          >
            <option disabled value="">Select a storage type</option>
            <option value="ssd">SSD</option>
            <option value="hdd">HDD</option>
          </select>
        </div>

        <div>
          <label for="dataAmount" class="block text-sm font-medium">Data Amount (GB)</label>
          <input
              v-model.number="form.dataAmount"
              id="dataAmount"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>

        <div>
          <label for="duration" class="block text-sm font-medium">Duration (hours)</label>
          <input
              v-model.number="form.duration"
              id="duration"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>
      </div>

      <!-- Memory Usage -->
      <div v-else-if="selectedMethod === 'memory'">
        <div>
          <label for="memoryAmount" class="block text-sm font-medium">Memory Amount (GB)</label>
          <input
              v-model.number="form.memoryAmount"
              id="memoryAmount"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>

        <div>
          <label for="duration" class="block text-sm font-medium">Duration (hours)</label>
          <input
              v-model.number="form.duration"
              id="duration"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="1"
              required
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <async-button
            :disabled="!isFormValid || loading"
            :color="'primary'"
            icon="calculator"
            @click="handleSubmit"
        >
          <span v-if="loading">Calculating...</span>
          <span v-else>Calculate Emissions</span>
        </async-button>
      </div>
    </form>

    <!-- Display Result -->
    <div v-if="result" class="mt-8">
      <div class="stats">
        <div class="stat">
          <div class="stat-figure text-primary">
            <font-awesome-icon icon="leaf" class="text-green-500" />
          </div>

          <div class="stat-title">Carbon Footprint</div>
          <div class="stat-value">
            <div v-if="selectedMethod === 'vm'">
              {{ result.total_co2e }} {{ result.total_co2e_unit }}
            </div>
            <div v-else-if="selectedMethod === 'cpu'">
              {{ result.co2e }} {{ result.co2e_unit }}
            </div>
            <div v-else-if="selectedMethod === 'storage'">
              {{ result.co2e }} {{ result.co2e_unit }}
            </div>
            <div v-else-if="selectedMethod === 'memory'">
              {{ result.co2e }} {{ result.co2e_unit }}
            </div>
          </div>

          <div class="stat-desc">
            <template v-if="selectedMethod === 'vm'">
              Instance Type: {{ form.instance }}<br />
              Duration: {{ form.duration }} hours
            </template>
            <template v-else-if="selectedMethod === 'cpu'">
              CPU Count: {{ form.cpuCount }}<br />
              Duration: {{ form.duration }} hours
            </template>
            <template v-else-if="selectedMethod === 'storage'">
              Storage Type: {{ form.storageType }}<br />
              Data Amount: {{ form.dataAmount }} GB<br />
              Duration: {{ form.duration }} hours
            </template>
            <template v-else-if="selectedMethod === 'memory'">
              Memory Amount: {{ form.memoryAmount }} GB<br />
              Duration: {{ form.duration }} hours
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>