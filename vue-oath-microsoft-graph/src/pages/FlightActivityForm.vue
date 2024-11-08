<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue';
import {
  calculateCargoFlightEmissions,
  calculatePassengerFlightEmissions,
} from '@/lib/climatiqService';
import AsyncButton from '@/components/AsyncButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default defineComponent({
  name: 'FlightActivityForm',
  components: {
    AsyncButton,
    FontAwesomeIcon,
  },
  setup() {
    const loading = ref(false);
    const result = ref(null);
    const error = ref('');

    const form = reactive({
      flightType: 'passenger', // passanger/cargo
      origin: '',
      destination: '',
      travelMode: 'air',
      weight: 0, // For cargo flights
      aircraftType: 'belly_freight', // freighter/belly_freight
    });

    // Form validation
    const isFormValid = computed(() => {
      if (!form.origin || !form.destination) {
        return false;
      }

      // ORIGIN and DESTINATION should be 3-letter IATA codes (REGEX: /^[A-Z]{3}$/)
      const iataCodeRegex = /^[A-Z]{3}$/;
      if (
          !iataCodeRegex.test(form.origin.toUpperCase()) ||
          !iataCodeRegex.test(form.destination.toUpperCase())
      ) {
        return false;
      }
      if (form.flightType === 'passenger') {
        return true; // No additional fields required
      } else if (form.flightType === 'cargo') {
        return form.weight > 0 && form.aircraftType !== '';
      }
      return false;
    });

    const handleSubmit = async () => {
      loading.value = true;
      try {
        let response;
        if (form.flightType === 'passenger') {
          response = await calculatePassengerFlightEmissions(
              form.origin,
              form.destination,
              form.travelMode
          );
        } else if (form.flightType === 'cargo') {
          response = await calculateCargoFlightEmissions(
              form.origin,
              form.destination,
              form.weight,
              form.aircraftType
          );
        } else {
          throw new Error('Invalid flight type selected.');
        }

        result.value = response;
        error.value = '';
      } catch (err) {
        console.error('Error calculating emissions:', err);
        error.value = 'An error occurred while calculating emissions. Please try again.' +
            'Error: ' + err;
      } finally {
        loading.value = false;
      }
    };

    // Reset result and error when flight type changes
    watch(
        () => form.flightType,
        () => {
          result.value = null;
          error.value = '';
        }
    );

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
    <h1 class="text-2xl font-bold mb-4">Calculate Flight Carbon Footprint</h1>

    <!-- Flight Type Selection -->
    <div class="mb-4">
      <div class="flex justify-around">
        <button
            class="btn"
            :class="{ 'btn-active': form.flightType === 'passenger' }"
            @click="form.flightType = 'passenger'"
        >
          Passenger
        </button>
        <button
            class="btn"
            :class="{ 'btn-active': form.flightType === 'cargo' }"
            @click="form.flightType = 'cargo'"
        >
          Cargo
        </button>
      </div>
    </div>

    <!-- Flight Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Origin Airport -->
      <div>
        <label for="origin" class="block text-sm font-medium">Origin Airport (IATA Code)</label>
        <input
            v-model="form.origin"
            id="origin"
            type="text"
            class="input input-bordered mt-1 w-full"
            required
            placeholder="eg. CDG"
            maxlength="3"
        />
      </div>

      <!-- Destination Airport -->
      <div>
        <label for="destination" class="block text-sm font-medium">Destination Airport (IATA Code)</label>
        <input
            v-model="form.destination"
            id="destination"
            type="text"
            class="input input-bordered mt-1 w-full"
            required
            placeholder="eg. YUL"
            maxlength="3"
        />
      </div>

      <!-- Passenger Flight Inputs -->
      <div v-if="form.flightType === 'passenger'">
      </div>

      <!-- Cargo Flight Inputs -->
      <div v-else-if="form.flightType === 'cargo'">
        <div>
          <label for="weight" class="block text-sm font-medium">Cargo Weight (tonnes)</label>
          <input
              v-model.number="form.weight"
              id="weight"
              type="number"
              class="input input-bordered mt-1 w-full"
              min="0.001"
              step="0.001"
              required
          />
        </div>
        <div>
          <label for="aircraftType" class="block text-sm font-medium">Aircraft Type</label>
          <select
              v-model="form.aircraftType"
              id="aircraftType"
              class="select select-bordered mt-1 w-full"
              required
          >
            <option value="freighter">Freighter (Cargo Plane)</option>
            <option value="belly_freight">Belly Freight (Passenger Plane)</option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <async-button
            :disabled="!isFormValid || loading"
            :color="'primary'"
            icon="plane"
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
            <template v-if="form.flightType === 'passenger'">
              Origin: {{ result.origin.name }}<br />
              Destination: {{ result.destination.name }}<br />
              Distance: {{ result.distance_km }} km<br />
            </template>
            <template v-else-if="form.flightType === 'cargo'">
              Cargo Weight: {{ form.weight }} tonnes<br />
              Aircraft Type: {{ form.aircraftType }}<br />
              Origin: {{ form.origin }}<br />
              Destination: {{ form.destination }}<br />
              Distance: {{ result.distance_km }} km<br />
            </template>
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