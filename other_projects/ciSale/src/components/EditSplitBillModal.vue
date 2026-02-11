<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4 text-center">
                {{ title }}
              </DialogTitle>

              <div class="border-t border-gray-200 pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      v-model.number="inputValue"
                      class="form-control w-full"
                      placeholder="Nhập số tiền"/>
                  </div>
                  <div class="flex justify-center gap-2">
                    <button
                      class="btn btn-primary px-4 default-btn-bg"
                      @click="submit">
                      Xác nhận
                    </button>
                    <button
                      class="btn btn-outline-secondary px-4"
                      @click="closeModal">
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

export default {
  name:'EditSplitBillModal',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild
  },
  props: {
    id: [String, Number],
    title: String,
    handleSubmit: Function,
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data(){
    return {
      inputValue: ""
    }
  },
  methods:{
    closeModal(){
      this.$emit('close')
      this.inputValue = ""
    },
    submit(){
      this.handleSubmit(this.id, this.inputValue)
      this.$emit('close')
      this.inputValue = ""
    }
  }
}
</script>
