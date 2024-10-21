<script lang="ts">
import { defineComponent, computed } from 'vue';
import { signInAndGetUser } from '@/lib/microsoftGraph';
import { useStore } from 'vuex';
import AsyncButton from "@/components/AsyncButton.vue";

export default defineComponent({
  name: 'SigninButton',
  components: {
    AsyncButton,
  },
  props: {
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
    },
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);

    const disabled = computed(() => user.value !== null);

    const handleSignIn = async () => {
      try {
        const newUser = await signInAndGetUser();
        store.commit('setUser', newUser);
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
    };

    return {
      user,
      handleSignIn,
      disabled,
    };
  },
});
</script>

<template>
  <async-button role="button" :color="color" @click="handleSignIn" :disabled="this.disabled" :icon="icon"> {{ user ? "Signed as " + user.username : "Sign in" }}</async-button>
</template>

<style scoped>

</style>