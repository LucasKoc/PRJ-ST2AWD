<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import SignInButton from "@/components/SignInButton.vue";
import { defineComponent } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import SignOutButton from "@/components/SignOutButton.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default defineComponent ({
  name: "BaseHeader",
  components: {
    FontAwesomeIcon,
    SignOutButton,
    BaseButton,
    SignInButton,
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const isLoggedIn = computed(() => user.value !== null);

    return {
      user,
      isLoggedIn
    };
  },
});
</script>

<template>
<header class="navbar bg-base-300 text-neutral-content">
  <div class="navbar-start ml-2 flex space-x-2">
    <router-link to="/" class="nav-link">
      <BaseButton icon="house" role="button" color="accent">Home</BaseButton>
    </router-link>
    <router-link to="/cloud-computing" class="nav-link" v-if="isLoggedIn">
      <BaseButton icon="cloud" role="button" color="default">Cloud Computing</BaseButton>
    </router-link>
    <router-link to="/flight-activity" class="nav-link" v-if="isLoggedIn">
      <BaseButton icon="plane" role="button" color="default">Flight Activity</BaseButton>
    </router-link>
  </div>

  <div class="navbar-center">
    <div class="btn btn-ghost text-info">
      Climatiq Project
    <font-awesome-icon icon="earth-americas" class="text-info"></font-awesome-icon>
    </div>
  </div>

  <div class="navbar-end mr-2">
    <div v-if="!isLoggedIn">
      <SignInButton color="primary" icon="user">Sign in</SignInButton>
    </div>
    <div v-else>
      <SignOutButton color="secondary" icon="user"></SignOutButton>
    </div>
  </div>
</header>
</template>

<style scoped>

</style>