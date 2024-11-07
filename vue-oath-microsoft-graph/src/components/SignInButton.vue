<script lang="ts">
import { defineComponent, computed } from 'vue';
import {signInAndGetUser} from '@/lib/microsoftGraph';
import { useStore } from 'vuex';
import AsyncButton from "@/components/AsyncButton.vue";
import {signInWithGoogle} from "@/lib/googleAuth";

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
        return ["primary", "secondary", "accent", "ghost", "info", "success", "warning", "error"]
            .includes(value);
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
    const isLoggedIn = computed(() => user.value !== null);

    const isDisabled = (provider: string) => {
      return user.value !== null && user.value.provider === provider;
    };

    const handleMicrosoftSignIn = async () => {
      try {
        const newUser = await signInAndGetUser();
        store.commit('setUser', newUser);
      } catch (error) {
        console.error('Error during Microsoft sign-in:', error);
      }
    };

    const handleGoogleSignIn = async () => {
      try {
        signInWithGoogle();
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    };

    return {
      user,
      isLoggedIn,
      isDisabled,
      handleMicrosoftSignIn,
      handleGoogleSignIn,
    };
  },
});
</script>

<template>
  <!--<async-button role="button" :color="color" @click="handleSignIn" :disabled="this.disabled" :icon="icon"> {{ user ? "Signed as " + user.username : "Sign in" }}</async-button>-->
  <div v-if="!isLoggedIn" class="flex space-x-2">
    <async-button role="button" :color="color" @click="handleMicrosoftSignIn" :disabled="isDisabled('microsoft')" icon="microsoft">Sign in with Microsoft</async-button>
    <async-button role="button" :color="color" @click="handleGoogleSignIn" :disabled="isDisabled('google')" icon="google">Sign in with Google</async-button>
  </div>
</template>

<style scoped>

</style>