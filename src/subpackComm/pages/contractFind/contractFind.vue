<template>
  <FindComponent ref="findComponent"
                 class="find-component"
                 :need-filter="false"
                 :need-tabs="false"
                 :default-index="1"
                 :is-contract="true"></FindComponent>
</template>

<script>
/**
 * 发现页
 */

import FindComponent from "@/components/find-component/findComponent";

export default {
  name: "ContractFind",
  components: {
    FindComponent
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  onShow () {
    this.$refs.findComponent && this.$refs.findComponent.componentShow()
  },
  onPageScroll () {
    this.$refs.findComponent && this.$refs.findComponent.componentScroll()
  },

};
</script>

<style lang="scss" scope>
.find-component {
  height: 100%;
  width: 100%;
}
</style>
