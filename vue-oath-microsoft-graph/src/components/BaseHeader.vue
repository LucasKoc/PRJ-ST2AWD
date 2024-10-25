<script lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import SignInButton from "@/components/SignInButton.vue";
import { defineComponent } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import SignOutButton from "@/components/SignOutButton.vue";

export default defineComponent ({
  name: "BaseHeader",
  components: {
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
<div id="header">
  <div class="header-container">
    <div>
      <router-link to="/" class="nav-link">
        <BaseButton icon="house" role="button" color="primary">Home</BaseButton>
      </router-link>
    </div>

    <div v-if="isLoggedIn">
    </div>
  </div>

  <div class="header-container">
    <div v-if="!isLoggedIn">
      <SignInButton color="primary" icon="user">Sign in</SignInButton>
    </div>
    <div v-else>
      <SignOutButton color="primary" icon="user"></SignOutButton>
    </div>
  </div>
</div>
</template>

<style scoped>

#header {
  display: flex;
  justify-content: space-between;
  padding: 1em 2em 1em 2em;
  background-color: var(--vt-c-brand);

  height: 3vh;
}

.header-container {
  display: inline-flex;
}

.header-container div {
  display: flex;
  align-items: center;
  margin: 0 0.5em 0 0.5em;
}

p {
  color: var(--vt-c-white-soft);
}

.nav-link {
  text-decoration: none;
}

</style>