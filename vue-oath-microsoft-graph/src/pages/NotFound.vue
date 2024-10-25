<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "404Page",
  components: {
  },
});

</script>

<template>
  <main>
    <div>
      <h1>404 - Page not Found</h1>
    </div>

    <div>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>Maybe it has been absorbed by the stratosphere.</p>
    </div>
  </main>
</template>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
  margin: 0;
}

div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  margin-top: 10%;
}
</style>