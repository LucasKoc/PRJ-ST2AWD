<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import AsyncButton from "@/components/AsyncButton.vue";
import {signOutFromGoogle} from "@/lib/googleAuth";
import {msalInstance} from "@/lib/microsoftGraph";

export default defineComponent({
  name: 'SignOutButton',
  components: { AsyncButton },
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

    const handleSignOut = () => {
      if (user.value) {
        if (user.value.provider === "microsoft") {
          msalInstance.logoutPopup().then(() => {
            store.commit("setUser", null);
          });
        } else if (user.value.provider === "google") {
          signOutFromGoogle();
          // store.commit('setUser', null) already in signOutFromGoogle
        }
      }
    };

    return {
      user,
      handleSignOut,
    };
  },
});
</script>

<template>
  <div v-if="user">
    <async-button @click="handleSignOut" icon="user" role="button" :color="color">{{ user.username }} | Sign Out</async-button>
  </div>
</template>

<style scoped>

</style>