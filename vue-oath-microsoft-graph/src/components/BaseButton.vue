<script lang="ts">
import { defineComponent } from 'vue';

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
        return ["primary", "warn", "danger"].includes(value);
      },
    },
    icon: {
      type: String,
      default: "",
    }
  },
  computed: {
    colorClass(): string {
      return `btn-${this.$props.color}`;
    },
  },
  methods: {
    handleClick(event: Event) {
      if (this.disabled) {
        event.preventDefault();
      }
    },
  },
});
</script>

<template>
  <button
      v-bind="$attrs"
      :disabled="disabled"
      :class="[colorClass, { 'disabled': disabled }]"
      @click="handleClick">
    <slot></slot>

    <font-awesome-icon class="icon" v-if="icon" :icon="['fas', icon]" :style="{color: 'white'}" />
  </button>
</template>

<style scoped>
button {
  margin: 0.5em;
  padding: 10px 20px;
  background-color: var(--vt-c-brand);
  color: var(--vt-c-white-soft);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row-reverse;
}

.icon {
  margin-right: 0.5em;
}

button:hover:not(.disabled),
button:focus:not(.disabled) {
  background-color: var(--vt-c-brand-dark);
  transform: scale(1.10);
}

button:active:not(.disabled) {
  transform: scale(1.00);
}


button.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-warn {
  background-color: var(--vt-c-warn);
}

.btn-warn:hover:not(.disabled),
.btn-warn:focus:not(.disabled) {
  background-color: var(--vt-c-warn-dark);
}

.btn-danger {
  background-color: var(--vt-c-danger);
}

.btn-danger:hover:not(.disabled),
.btn-danger:focus:not(.disabled) {
  background-color: var(--vt-c-danger-dark);
}

.btn-primary {
  background-color: var(--vt-c-primary);
}

.btn-primary:hover:not(.disabled),
.btn-primary:focus:not(.disabled) {
  background-color: var(--vt-c-primary-dark);
}

</style>