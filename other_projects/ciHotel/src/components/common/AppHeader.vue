<template>
  <header class="app-header navbar">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background-color: #fff;
  border-bottom: 1px solid #c8ced3;
}

.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
</style>
