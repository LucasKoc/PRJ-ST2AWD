<script lang="ts">
import { defineComponent } from "vue";
import BaseHeader from "@/components/BaseHeader.vue";
import BaseFooter from "@/components/BaseFooter.vue";

export default defineComponent ({
  name: "BaseLayout",
  components: {
    BaseHeader,
    BaseFooter,
  },
});
</script>

<template>
  <div class="layout min-h-screen flex flex-col">
    <base-header/>
    <div class="container">
      <slot></slot>
    </div>
    <base-footer />
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

footer {
  margin-top: auto;
}
</style>
