<script lang="ts">
import { defineComponent, computed} from 'vue';
import { useStore } from 'vuex';

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
  <div class="main">
    <div>
      <p>Here is the content of the HomePage</p>
    </div>

    <div>
      <p v-if="user">User connected: {{ user.username }}</p>
    </div>
  </div>
</template>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}

div.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>