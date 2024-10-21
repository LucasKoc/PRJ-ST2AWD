<script lang="ts">
export default {
  name: "BaseFooter"
}
</script>

<template>
<div id="footer">
  <div>
    <p>This is the footer of Lab 3 | © 2024 | <a href="https://efrei.fr">efrei.fr</a></p>
  </div>
</div>
</template>

<style scoped>
#footer {
  display: flex;
  justify-content: center;
  padding: 0em 1em 0em 1em;
  background-color: var(--vt-c-brand-dark);

  height: 5vh;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
}

#footer div {
  display: flex;
  align-items: center;
  margin: 0 0.5em 0 0.5em;
}

#footer p {
  color: var(--vt-c-white-soft);
}

#footer a,
#footer a:visited {
  color: var(--vt-c-white-soft);
  text-decoration: none;
}

#footer a:hover {
  color: var(--vt-c-text-3);
  text-decoration: underline;
  text-decoration-thickness: 0.5px;
}

</style>