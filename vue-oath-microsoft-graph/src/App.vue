<template>
  <div>
    <base-layout>
      <router-view />
    </base-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import BaseLayout from "@/layouts/BaseLayout.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  components: {
    BaseLayout,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);

    return {
      user,
    };
  },
});
</script>

<style>

</style>