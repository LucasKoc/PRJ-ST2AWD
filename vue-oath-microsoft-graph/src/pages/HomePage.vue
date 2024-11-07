<script lang="ts">
import { defineComponent, computed} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "HomePage",
  components: {
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

<template>
  <div>
    <h1>HomePage.vue</h1>
    <p>Welcome {{ user }}</p>
  </div>
</template>

<style scoped>

</style>