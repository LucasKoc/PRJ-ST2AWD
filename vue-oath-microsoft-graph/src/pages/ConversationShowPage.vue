<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ConversationShowPage',
  setup() {
    const route = useRoute();

    const conversationId = computed(() => route.params.id as string);

    return {
      conversationId,
    };
  },
});
</script>

<template>
  <div>
    <h1>ConversationShowPage page</h1>
    <p>Conversation ID: {{ conversationId }}</p>
  </div>
</template>

<style scoped>

</style>