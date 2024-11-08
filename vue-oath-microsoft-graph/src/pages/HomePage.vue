<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import SignInButton from "@/components/SignInButton.vue";

export default defineComponent({
  name: "HomePage",
  components: {SignInButton},
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
  <!-- Set content at the middle of the page -->
  <div class="m-8 flex items-center justify-center h-full">
    <div class="relative z-10 text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">Hello {{ user ? user.username : 'there' }}!</h1>
        <p class="mb-5 text-lg">
          Welcome to the PRJ-ST2AWD!
        </p>
        <p class="mb-5 text-lg">
          This is a simple web application that demonstrates how to use Vue.js and ClimatiQ API.
        </p>
        <p v-if="!user" class="mb-5 text-lg">
          Please connect with your Microsoft/Google account to get started.
        </p>
        <p v-else class="mb-5 text-lg">
          You are now connected with your Microsoft/Google account. You can access to functionalities in the navigation bar.
        </p>
      </div>
      <div v-if="!user">
        <SignInButton color="primary" icon="user">Sign in</SignInButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
