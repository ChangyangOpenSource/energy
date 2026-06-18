<template>
  <div class="box1">
    <div class="text2"> C</div>
    <a-spin :spinning="confirmLoading">
      <div class="box1_item">
        <div class="box1_item_tr1">
          <div class="box1_item_tr1_label">{{t('carbon.message.User_Accounts')}}</div>
        </div>
        <a-input :placeholder="t('carbon.message.Please_enter_the_user_account')" v-model="model.username" :disabled="true"
                 style="margin: 10px 0;"/>
      </div>
      <div class="box1_item">
        <div class="box1_item_tr1">
          <div class="box1_item_tr1_label"><span>*</span>{{t('carbon.message.User_name')}}</div>
          <div class="box1_item_tr1_btn" @click="onEdit('realnameDisabled')" v-if="realnameDisabled">{{t('carbon.message.Edit')}}</div>
          <div class="box1_item_tr1_btn" @click="handleSubmit('realname')" v-else>{{t('carbon.message.Save')}}</div>
        </div>
        <a-input :placeholder="t('carbon.message.Please_enter_the_user_name')" v-model="model.realname" :disabled="realnameDisabled"
                 style="margin: 10px 0;"/>
      </div>
      <div class="box1_item">
        <div class="box1_item_tr1">
          <div class="box1_item_tr1_label"><span>*</span>{{t('carbon.message.phone')}}</div>
          <div class="box1_item_tr1_btn" @click="updatePhone()">{{t('carbon.message.phone_modification')}}</div>
        </div>
        <a-input :placeholder="t('carbon.message.Please_enter_phone')"  v-model="model.phone" :disabled="true"
                 style="margin: 10px 0;"/>
      </div>
      <div class="box1_item">
        <div class="box1_item_tr1">
          <div class="box1_item_tr1_label"><span>*</span>{{t('carbon.message.email')}}</div>
          <div class="box1_item_tr1_btn" @click="onEdit('emailDisabled')" v-if="emailDisabled">{{t('carbon.message.Edit')}}</div>
          <div class="box1_item_tr1_btn" @click="handleSubmit('email')" v-else>{{t('carbon.message.Save')}}</div>
        </div>
        <a-input :placeholder="t('carbon.message.Please_enter_email')" v-model="model.email" :disabled="emailDisabled"
                 style="margin: 10px 0;"/>
      </div>
      <div class="box1_item">
        <div class="box1_item_tr1">
          <div class="box1_item_tr1_label"><span>*</span>{{t('carbon.message.password')}}</div>
          <div class="box1_item_tr1_btn" @click="updatePassword()">{{t('carbon.message.password_modification')}}</div>
        </div>
      </div>
    </a-spin>
    <user-password @ok="updateOk" ref="userPassword"></user-password>
    <user-phone @ok="updateOk" ref="userPhone"></user-phone>
  </div>
</template>

<script>

import dayjs from "dayjs";
import {getAction, postAction} from '@/api/manage';
import {duplicateCheck} from '@/api/api'
import {mapActions, mapGetters} from "vuex";
import {remove_TPYZ_SearchRecords} from "@/common/storage";
import UserPassword from "@comp/tools/UserPassword.vue";
import UserPhone from "@comp/tools/UserPhone.vue";

export default {
  name: 'userInfoFrom',
  components: {UserPassword,UserPhone},
  data() {
    return {
      model: {},
      confirmLoading: false,
      url: {
        save: "/orgUser/save",
        curUser: "/orgUser/cur",
      },
      realnameDisabled: true, //
      phoneDisabled: true, //
      emailDisabled: true, //
      passwordDisabled: true, //
    }
  },
  created() {
    this.getCurUser()
  },
  methods: {
    ...mapGetters(["userInfo"]),
    dayjs,
    ...mapActions(["Logout"]),
    /**
     * 编辑
     * @param type
     */
    onEdit(type) {
      if (this.realnameDisabled && this.phoneDisabled && this.emailDisabled && this.passwordDisabled) {
        this[type] = false
      } else {
        this.$message.warning(this.t('carbon.message.Only_one_item_can_be_edited_at_a_time'))
      }
    },
    /**
     * 获取用户信息
     */
    getCurUser() {
      this.realnameDisabled = true;
      this.phoneDisabled = true;
      this.emailDisabled = true;
      this.passwordDisabled = true;
      this.confirmLoading = true;
      getAction(this.url.curUser).then(res => {
        if (res.success) {
          this.model = res.result
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    /**
     * 校验手机号
     */
    checkPhone(value) {
      if (new RegExp(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/).test(value)) {
        return true
      } else {
        return false
      }
    },
    /**
     * 校验邮箱格式
     */
    checkEmail(value) {
      if (new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
        return true
      } else {
        return false
      }
    },
    /**
     * 保存用户信息
     * @param type 点的哪个保存
     */
    handleSubmit(type) {
      if (!this.model[type]) {
        if (type == 'realname') {
          this.$message.warning(this.t('carbon.message.The_users_name_cannot_be_empty'))
          return
        }
        if (type == 'phone') {
          this.$message.warning(this.t('carbon.message.The_mobile_phone_number_cannot_be_empty'))
          return
        }
        if (type == 'email') {
          this.$message.warning(this.t('carbon.message.The_mailbox_cannot_be_empty'))
          return
        }
        if (type == 'password') {
          this.$message.warning(this.t('carbon.message.The_password_cannot_be_empty'))
          return
        }
      }
      if (this.model[type] && !(new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/).test(this.model[type])) && type == 'password') {
        this.$message.warning(this.t('carbon.message.upper_and_lower_case_letters_and_special_symbols'))
        return
      }


      if (type == 'phone' && !this.checkPhone(this.model[type])) {
        this.$message.warning(this.t('carbon.message.Please_enter_the_mobile_phone_number_in_the_correct_format'))

        return
      }
      if (type == 'email' && !this.checkEmail(this.model[type])) {
        this.$message.warning(this.t('carbon.message.Please_enter_the_email_address_in_the_correct_format'))
        return
      }
      this.confirmLoading = true;
      postAction(this.url.save, this.model).then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          if (type == 'password') {
            // 修改密码重新登录
            this.Logout({}).then(() => {
              remove_TPYZ_SearchRecords()
              window.location.reload()
            }).catch(err => {
              this.$message.error({title: t('carbon.message.Error'), description: err.message})
            })
          } else {
            // 修改其他信息，重新获取用户信息
            this.getCurUser()
          }
        } else {
          this.$message.warning(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      })
    },
    /**
     * 修改密码
     */
    updatePassword() {
      let username = this.userInfo().username;
      this.$refs.userPassword.show(username);
    },
    updateOk(){
      // 修改密码重新登录
      this.Logout({}).then(() => {
        remove_TPYZ_SearchRecords()
        window.location.reload()
      }).catch(err => {
        this.$message.error({title: t('carbon.message.Error'), description: err.message})
      })
    },
    /**
     * 修改手机号
     */
    updatePhone() {
      let phone = this.userInfo().phone;
      this.$refs.userPhone.show(phone);
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
  background: #F5F8F7;
}



.text2 {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #FFFFFF;
  border-radius: 50%;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 36px;
  color: #148958;
}

.box1 {
  margin: 24px auto 0;
  width: 700px;
}

.box1_item {
  margin-top: 24px;
}

.box1_item_tr1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.box1_item_tr1_label {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;

  span {
    color: #CF0D66;
  }
}

.box1_item_tr1_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  height: 32px;
  background: #FFFFFF;
  border-radius: 3px;
  border: 1px solid #148958;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #148958;
  cursor: pointer;
}
</style>
