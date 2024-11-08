<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue';
import { calculateCustomActivityEmissions } from '@/lib/climatiqService';
import AsyncButton from '@/components/AsyncButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'CustomActivityForm',
  components: {
    AsyncButton,
    FontAwesomeIcon,
  },
  setup() {
    const loading = ref(false);
    const result = ref(null);
    const error = ref('');

    const form = reactive({
      activityLabel: 'coal',
      energy: 0,
      energyUnit: 'kwh',
      region: '',
    });

    const isFormValid = computed(() => {
      return form.activityLabel !== '' && form.energy > 0 && form.energyUnit !== '';
    });

    const handleSubmit = async () => {
      loading.value = true;
      try {
        const response = await calculateCustomActivityEmissions(
            form.activityLabel,
            form.energy,
            form.energyUnit,
            form.region,
        );

        result.value = response;
        error.value = '';
      } catch (err) {
        console.error('Error calculating emissions:', err);
        error.value = 'An error occurred while calculating emissions. Error: ' + err;
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      result,
      error,
      handleSubmit,
      isFormValid,
    };
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Calculate Custom Activity Carbon Footprint</h1>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Activity Label -->
      <div>
        <label for="activityLabel" class="block text-sm font-medium">Activity Label</label>
        <select
            v-model="form.activityLabel"
            id="activityLabel"
            class="input input-bordered mt-1 w-full"
            required
        >
          <option value="coal">Electricity generated from coal</option>
        </select>
      </div>

      <!-- Energy Amount -->
      <div>
        <label for="energy" class="block text-sm font-medium">Energy Consumed (kWh)</label>
        <input
            v-model.number="form.energy"
            id="energy"
            type="number"
            class="input input-bordered mt-1 w-full"
            min="0.01"
            step="0.01"
            required
            placeholder="eg. 100"
        />
      </div>

      <!-- Region (Optional) -->
      <div>
        <label for="region" class="block text-sm font-medium">Region (Optional)</label>
        <input
            v-model="form.region"
            id="region"
            type="text"
            class="input input-bordered mt-1 w-full"
            placeholder="eg. US"
        />
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
          <div class="stat-value">{{ result.co2e }} {{ result.co2e_unit }}</div>

          <div class="stat-desc">
            Activity: {{ form.activityLabel }}<br />
            Energy: {{ form.energy }} {{ form.energyUnit }}<br />
            Region: {{ form.region || 'Not specified' }}<br />
            Emission Factor Source: {{ result.emission_factor.source }}<br />
            Emission Factor Year: {{ result.emission_factor.year }}
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="error" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Error</h3>
        <p class="py-4">{{ error }}</p>
        <div class="modal-action">
          <button class="btn" @click="error = ''">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
