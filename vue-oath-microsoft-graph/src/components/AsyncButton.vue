<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from "@/components/BaseButton.vue";

export default defineComponent({
  name: "AsyncButton",
  components: {
    BaseButton,
  },
  inheritAttrs: false,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "error",
      validator: (value: string): boolean => {
        return ["primary", "secondary", "accent", "ghost", "info", "success", "warning", "error"]
            .includes(value);
      },
    },
    icon: {
      type: String,
      default: "",
    },
  },

  data () {
    return {
      isPending: false
    }
  },

  methods: {
    handleClick() {
      const originalOnClick = this.$attrs.onClick as unknown as () => any;
      this.isPending = true;
      Promise.resolve(originalOnClick()).finally(() => {
        this.isPending = false;
      });
    },
  },
});
</script>

<template>
    <base-button :disabled="disabled || isPending" @click.stop.prevent="handleClick" :icon="icon" :color="color">
      <span v-if="isPending" class="loading loading-spinner loading-xs"></span>
      <slot/>
    </base-button>
</template>

<style scoped>
</style>
