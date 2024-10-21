<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from "@/components/BaseButton.vue";

export default defineComponent({
  name: 'ConversationsIndexPage',
  components: {BaseButton},
  setup() {
    const conversationIds = [1, 2, 3];

    return {
      conversationIds,
    };
  },
});
</script>

<template>
  <div>
    <p>Here is the content of the ConversationsIndexPage</p>
  </div>
  <div>
    <ul>
      <base-button v-for="id in conversationIds" :key="id" icon="comments" role="button" color="primary">
        <router-link class="router-link" :to="`/conversations/${id}`">Conversation {{ id }}</router-link>
      </base-button>
    </ul>
  </div>
</template>

<style scoped>
.router-link {
  color: white;
  text-decoration: none;
}
</style>