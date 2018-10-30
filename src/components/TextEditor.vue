<template>
    <div>
        <group>
            <x-textarea @keyup.native.27="confirm()" @keyup.native.4="confirm()" ref="input" :title="title" :placeholder="placeholder" :rows="8" :value="value" @input.native="updateValue($event.target.value)" :autosize="true"></x-textarea>
        </group>
        <div style="padding:15px;">
            <x-button type="warn" @click.native="confirm()">确定</x-button>
            <x-button type="default" @click.native="cancel()">返回</x-button>
        </div>
    </div>
</template>

<script>
import { Group, XTextarea, XButton } from 'vux'

export default {
  name: 'TextEditor',
  components: {
    Group,
    XButton,
    XTextarea
  },
  props: {
      placeholder: String,
      title: String,
      value: String
  },
  data() {
      return {

      }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    },
    confirm(){
        this.$emit('confirm')
    },
    cancel(){
        this.$emit('cancel')
    }
  }
}
</script>

<style lang="less">
.weui-textarea {font-size:12px !important;}
</style>
