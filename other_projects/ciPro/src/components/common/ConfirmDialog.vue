<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="onCancel"
      ></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <!-- Icon + Message -->
        <div class="flex items-start gap-4 mb-6">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <i class="fa fa-exclamation-triangle text-red-600"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Xác nhận</h3>
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button
            @click="onCancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            @click="onConfirm"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm'

const { visible, message, onConfirm, onCancel } = useConfirm()
</script>
