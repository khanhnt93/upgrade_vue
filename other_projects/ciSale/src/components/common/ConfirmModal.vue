<template>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <!-- Header -->
        <div class="px-4 py-2 border-b">
          <h3 class="font-semibold text-gray-800 text-center">
            {{ title }}
          </h3>
        </div>
  
        <!-- Body -->
        <div class="px-4 py-3 text-gray-700 text-center">
          {{ message }}
        </div>
  
        <!-- Footer -->
        <div class="px-4 py-2 border-t flex justify-center gap-3">
          <button
            class="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100"
            @click="cancel"
          >
            Hủy
          </button>
  
          <button
            class="px-3 py-1.5 rounded text-white"
            :class="confirmClass"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name: 'ConfirmModal',
    data() {
      return {
        visible: false,
        title: 'Xác nhận',
        message: '',
        confirmText: 'Xác nhận',
        confirmClass: 'bg-red-600 hover:bg-red-700',
        resolver: null,
      }
    },
    methods: {
      open(options = {}) {
        this.title = options.title || 'Xác nhận'
        this.message = options.message || ''
        this.confirmText = options.confirmText || 'Xác nhận'
        this.confirmClass = options.confirmClass || 'bg-red-600 hover:bg-red-700'
        this.visible = true
  
        return new Promise(resolve => {
          this.resolver = resolve
        })
      },
      confirm() {
        this.visible = false
        this.resolver(true)
      },
      cancel() {
        this.visible = false
        this.resolver(false)
      },
    },
  }
  </script>
  