<template>
    <div v-if="show" class="loading-wrapper">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false
    }
  })
  </script>
  
  <style scoped>
  .loading-wrapper {
    width: 100%;
    height: 100%;
    min-height: 80px;          /* chiều cao tối thiểu của khối */
    display: flex;
    align-items: center;      /* căn giữa dọc */
    justify-content: center;  /* căn giữa ngang */
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top-color: #16a34a; /* xanh lá */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  