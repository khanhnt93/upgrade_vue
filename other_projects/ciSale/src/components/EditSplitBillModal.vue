<template>
  <b-modal centered hide-footer hide-header no-close-on-backdrop :id="'payment-split-bill'+id">
    <b-row>
      <b-col>
        <h5 class="text-center">{{title}}</h5>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col md="6">
        <input type="number" v-model.number="inputValue" class="form-control"/>
      </b-col>
      <b-col md="6">
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary px-4 default-btn-bg" style="margin-right: 5px" @click="submit">
            Xác nhận
          </button>
          <b-button @click="closeModal">
            Hủy bỏ
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>
<script>
export default {
  name:'EditSplitBillModal',
  props:['id','title','handleSubmit'],
  data(){
    return {
      inputValue:""
    }
  },
  methods:{
    closeModal(){
      this.$bvModal.hide("payment-split-bill"+this.id);
    },
    submit(){
      this.handleSubmit(this.id,this.inputValue)
      this.$bvModal.hide("payment-split-bill"+this.id);
    }
  }
}
</script>
