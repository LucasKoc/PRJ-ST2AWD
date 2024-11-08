<script lang="ts">
import {computed, defineComponent, watchEffect, ref} from 'vue';

export default defineComponent({
  name: "BaseButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "primary",
      validator: (value: string): boolean => {
        return ["primary", "secondary", "accent", "ghost", "info", "success", "warning", "error"]
            .includes(value);
      },
    },
    icon: {
      type: String,
      default: "",
    }
  },
  setup(props) {
    const isDarkMode = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);

    watchEffect(() => {
      const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        isDarkMode.value = darkModeMediaQuery.matches;
      };

      darkModeMediaQuery.addEventListener("change", handleChange);
      return () => darkModeMediaQuery.removeEventListener("change", handleChange);
    });

    const colorClass = computed(() => [
      isDarkMode.value ? "btn btn-outline" : "btn btn-active",
      `btn-${props.color}`,
      "btn-sm",
      !isDarkMode.value ? "text-neutral-content" : "",
    ]);

    const handleClick = (event: Event) => {
      if (props.disabled) {
        event.preventDefault();
      }
    };

    return {
      colorClass,
      handleClick,
    };
  },
});
</script>

<template>
  <button
      v-bind="$attrs"
      :disabled="disabled"
      :class="[...colorClass, { 'disabled': disabled }]"
      @click="handleClick">
    <slot></slot>

    <font-awesome-icon class="ml-2" v-if="icon" :icon="['google', 'microsoft'].includes(icon) ? ['fab', icon] : ['fas', icon]" />
  </button>
</template>

<style scoped>

</style>