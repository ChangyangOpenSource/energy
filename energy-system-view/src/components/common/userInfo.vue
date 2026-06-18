<template>
  <j-modal :title="t('carbon.message.Personal_Information_Redacted')" :visible="personalCenterVisible" :fullscreen="true" @cancel="cancel"  :footer="null">
    <user-info-from  ref="user-info-from"></user-info-from>
  </j-modal>
</template>

<script>


import userInfoFrom from '@comp/common/userInfoFrom.vue'
export default {
  components: {
    userInfoFrom
  },
  name: 'personalCenter',
  data() {
    return {
      personalCenterVisible:false
    }

  },
  created() {

  },
  methods: {
    show(){
      this.personalCenterVisible = true
    },
    cancel(){
      this.personalCenterVisible = false
    }
  },
}
</script>

<style lang="less" scoped>

</style>
