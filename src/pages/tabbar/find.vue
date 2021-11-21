<template>
    <FindComponent ref="findComponent" class="find-component" page-key="find"></FindComponent>
</template>

<script>
/**
	* 发现页
	*/

import FindComponent from "@/components/find-component/findComponent";

export default {
	name: "Find",
	components: {
        FindComponent
	},
    onShow() {
	    this.$refs.findComponent && this.$refs.findComponent.componentShow()
    },
    onHide() {
        this.$refs.findComponent && this.$refs.findComponent.componentHide()
    },
    onPageScroll() {
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
