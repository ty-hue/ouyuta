<template>
  <view class="login-container">
    <nar-bar bg-color="transparent">
      <template #left>
        <up-icon
          name="arrow-leftward"
          :size="28"
          @click="goBack"
          color="#fff"
        />
      </template>
    </nar-bar>
    <!-- #ifdef MP-WEIXIN || APP-PLUS -->
    <image src="./../../static/login-bg.jpg" mode="aspectFill" class="bg-img" />
    <!-- #endif -->
    <view class="content">
      <text class="login-title webfont">欢迎来到絮语</text>
      <!-- 注意，此处的placeholder-style,只是设置H5端的占位符字体样式，对app和小程序不生效 -->
      <view class="form-container">
        <up-form
          v-if="flag"
          :borderBottom="false"
          :rules="mobileFormRules"
          :model="mobileFormData"
          ref="formMobileRef"
          label-position="top"
        >
          <up-form-item prop="mobile" :borderBottom="false">
            <up-input
              v-model="mobileFormData.mobile"
              placeholder="请输入手机号"
              border="none"
              shape="circle"
              :clearable="false"
              :placeholder-style="{
                color: '#fff',
                fontSize: '30rpx',
                fontWeight: '400',
                letterSpacing: '-0.82rpx',
                lineHeight: 'normal',
              }"
              :customStyle="{
                background: 'rgba(255, 255, 255, .2)',
                height: '88rpx',
                paddingLeft: '40rpx',
                paddingRight: '40rpx',
              }"
              color="#fff"
              fontSize="34rpx"
            ></up-input>
          </up-form-item>
          <up-form-item prop="code" :borderBottom="false">
            <!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
            <!-- #ifndef APP-NVUE -->
            <up-input
              v-model="mobileFormData.code"
              placeholder="请输入验证码"
              border="none"
              shape="circle"
              :clearable="false"
              :placeholder-style="{
                color: '#fff',
                fontSize: '30rpx',
                fontWeight: '400',
                letterSpacing: '-0.82rpx',
                lineHeight: 'normal',
              }"
              :customStyle="{
                background: 'rgba(255, 255, 255, .2)',
                height: '88rpx',
                paddingLeft: '40rpx',
                paddingRight: '40rpx',
              }"
              color="#fff"
              fontSize="34rpx"
            >
              <!-- #endif -->
              <!-- #ifdef APP-NVUE -->
              <up-input
                placeholder="请输入验证码"
                border="none"
                shape="circle"
                :clearable="false"
                :placeholder-style="{
                  color: '#fff',
                  fontSize: '30rpx',
                  fontWeight: '400',
                  letterSpacing: '-0.82rpx',
                  lineHeight: 'normal',
                }"
                :customStyle="{
                  background: 'rgba(255, 255, 255, .2)',
                  height: '88rpx',
                  paddingLeft: '40rpx',
                  paddingRight: '40rpx',
                }"
                color="#fff"
                fontSize="34rpx"
              >
                <!-- #endif -->
                <template #suffix>
                  <up-code
                    ref="uCodeRef"
                    @change="codeChange"
                    seconds="60"
                    start-text="获取验证码"
                    changeText="X秒重新获取"
                    end-text="重新获取"
                  ></up-code>
                  <up-button
                    @tap="getCode"
                    type="success"
                    :custom-style="{
                      height: '46rpx',
                      fontSize: '20rpx',
                    }"
                    >{{ tips }}</up-button
                  >
                </template>
                <!-- #ifndef APP-NVUE -->
              </up-input>
              <!-- #endif -->
              <!-- #ifdef APP-NVUE -->
            </up-input>
            <!-- #endif -->
          </up-form-item>
        </up-form>
        <up-form
          v-else
          :borderBottom="false"
          :rules="pwdFormRules"
          :model="pwdFormData"
          ref="formPwdRef"
        >
          <up-form-item prop="loginId" :borderBottom="false">
            <up-input
              v-model="pwdFormData.loginId"
              placeholder="请输入手机号/用户名"
              border="none"
              shape="circle"
              :clearable="false"
              :placeholder-style="{
                color: '#fff',
                fontSize: '30rpx',
                fontWeight: '400',
                letterSpacing: '-0.82rpx',
                lineHeight: 'normal',
              }"
              :customStyle="{
                background: 'rgba(255, 255, 255, .2)',
                height: '88rpx',
                paddingLeft: '40rpx',
                paddingRight: '40rpx',
              }"
              color="#fff"
              fontSize="34rpx"
            ></up-input>
          </up-form-item>
          <up-form-item prop="loginPwd" :borderBottom="false">
            <up-input
              v-model="pwdFormData.loginPwd"
              type="password"
              :passwordVisibilityToggle="true"
              placeholder="请输入密码"
              border="none"
              shape="circle"
              :clearable="false"
              :placeholder-style="{
                color: '#fff',
                fontSize: '30rpx',
                fontWeight: '400',
                letterSpacing: '-0.82rpx',
                lineHeight: 'normal',
              }"
              :customStyle="{
                background: 'rgba(255, 255, 255, .2)',
                height: '88rpx',
                paddingLeft: '40rpx',
                paddingRight: '40rpx',
              }"
              color="#fff"
              fontSize="34rpx"
            ></up-input>
          </up-form-item>
        </up-form>
        <up-button
          :disabled="disabled"
          throttleTime="5000"
          @click="submit"
          :loading="isLoding"
          type="primary"
          loading-text="登陆"
          :custom-style="{
            borderRadius: '44rpx',
            border: 'none',
            background:
              'linear-gradient(219.63deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%)',
            color: '#fff',
            fontSize: '30rpx',
            fontWeight: '900',
            letterSpacing: '-0.72rpx',
            height: '88rpx',
            marginBottom: '30rpx',
            marginTop: '26rpx',
          }"
          >登陆</up-button
        >
        <view class="agree">
          <view class="checkbox-wrap">
            <up-checkbox
              size="30rpx"
              v-model:checked="checked"
              label=""
              usedAlone
            ></up-checkbox>
          </view>
          <view class="text">
            我已阅读并同意
            <navigator
              class="agree-name"
              :url="
                '/pages/webview/index?url=' +
                encodeURIComponent('https://lanhuapp.com/')
              "
              >服务协议</navigator
            >
            和
            <navigator
              class="agree-name"
              :url="
                '/pages/webview/index?url=' +
                encodeURIComponent('https://lanhuapp.com/')
              "
              >隐私协议</navigator
            >
          </view>
        </view>
        <view class="bottom-tip">
          <text class="register-text" @click="goRegisterPage"
            >没有账号？去注册</text
          >
          <text class="tip" @click="changeMode"
            >{{ flag ? "密码登陆" : "手机验证码登陆"
            }}<i class="iconfont icon-youjiantou"></i
          ></text>
        </view>
        <view class="bottom-tip">
          <text @click="goResetPage">忘记密码？</text>
        </view>
      </view>
      <!-- 模态框 -->
      <up-modal
        :show="show"
        title="提示"
        @confirm="handleConfirm"
        :showCancelButton="true"
        @cancel="handleCancel"
      >
        <view class="modal-content">
          点击确定代表您已同意 <text class="protocol">服务协议</text> 和
          <text class="protocol">隐私协议</text>
        </view>
      </up-modal>
    </view>
  </view>
</template>

<script setup lang="ts">
import NarBar from "@/components/NavBar/index.vue";
import useNavBarHook from "@/hooks/useNavBarHook";
import { reactive, ref, watch } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useButtonDisableHook } from "@/hooks/useButtonDisableHook";
import {
  getSmsCodeApi,
} from "@/request/apis/user";
import {useUserInfoStore} from '@/store/useUserInfoStore'
import { LoginType, SmsCodeType } from "@/types/enums";
const store = useUserInfoStore();
const {login} = store;
const { goBack } = useNavBarHook();
const tips = ref(""); // 按钮提示文字
// 根据up-code组件内部逻辑，自动触发该函数，再合适的时间点给予应该显示提示文字
const codeChange = (text: string) => {
  tips.value = text;
};
interface UpCodeInstance {
  canGetCode: boolean;
  start: () => void;
}
const uCodeRef = ref<UpCodeInstance | null>(null);
// 请求验证码

const getCode = async () => {
  // 先判断用户是否填写了手机号
  if (!mobileFormData.mobile) {
    return;
  }
  // 判断用户填写的手机号是否可以通过校验
  formMobileRef.value!.validateField("mobile", (errArr) => {
    if (errArr.length !== 0) {
      return;
    }
  });
  if (uCodeRef.value!.canGetCode) {
    uni.showLoading({
      title: "正在获取验证码",
      mask: true,
    });
    // 发送请求给后端，请求后端给用户手机发送验证码
    await getSmsCodeApi({
      mobile: mobileFormData.mobile,
      type: SmsCodeType.LOGIN,
    });
    uni.hideLoading();
    uCodeRef.value!.start();
  }
};
interface FormRef {
  validate: () => Promise<any>;
  validateField: (fieldName: string, callback: (errArr: []) => void) => void;
}
const formMobileRef = ref<FormRef | null>(null); // 手机号登陆表单的ref
//手机号登陆表单的数据对象
const mobileFormData = reactive({
  mobile: "",
  code: "",
  type: LoginType.MOBILE,
});
// 手机号表单的检验规则
const mobileFormRules = reactive({
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: ["blur"],
    },
    {
      // 自定义验证函数，见上说明
      validator: (rule: any, value: string, callback: () => void) => {
        // 上面有说，返回true表示校验通过，返回false表示不通过
        // uni.$u.test.mobile()就是返回true或者false的
        return uni.$u.test.mobile(+value);
      },
      message: "手机号码格式不正确",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: ["blur"],
    },
    {
      validator: (rule: any, value: string, callback: () => void) => {
        const codeRegex = /^[^\u4e00-\u9fa5]{1,9}$/;
        return codeRegex.test(value);
      },
      message: "验证码格式不正确",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
});
// 提交方法
const submit = async () => {
  const formRef = flag.value ? formMobileRef : formPwdRef;
  const valid = await formRef.value!.validate();
  if (valid) {
    isLoding.value = true;
    // 验证通过，查看用户是否已经勾选协议,已经勾选则直接发送请求，如果没有勾选则弹出提示框让用户点击同意或取消
    if (!checked.value) {
      show.value = true;
      isLoding.value = false;
      return;
    } else {
      try {
        const parmas = flag.value ? mobileFormData : pwdFormData;
        await login(parmas);
        isLoding.value = false;
        // 登陆成功，跳转到首页
        uni.$u.route({
          url:"/pages/index/index",
          type:'switchTab'
        })
      } catch (e) {
        isLoding.value = false;
      }
    }
  }
};
const flag = ref(true); //默认为true ，代表使用手机号登陆

// 密码登陆表单的数据对象
const pwdFormData = reactive({
  loginId: "",
  loginPwd: "",
  type: LoginType.PWD,
});
// 密码表单ref
const formPwdRef = ref<FormRef | null>(null);
const pwdFormRules = reactive({
  loginId: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["blur"],
    },
    {
      validator: (rule: any, value: string, callback: () => void) => {
        const loginIdRegex =  /^(1[3-9]\d{9}|[a-zA-Z0-9]{5,8})$/;
        return loginIdRegex.test(value);
      },
      message: "手机号/用户名格式不正确",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
  loginPwd: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur"],
    },
    {
      validator: (rule: any, value: string, callback: () => void) => {
        const passwordRegex =
          /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])|(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])|(?=.{8,})(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/;
        return passwordRegex.test(value);
      },
      message: "密码必须包含至少3种不同字符且长度不小于8位",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
});
const isLoding = ref(false); // 登陆按钮的状态
const checked = ref(false); // 是否同意协议
const goRegisterPage = () => {
  uni.navigateTo({ url: "/pages/register/index" });
};
const changeMode = () => {
  flag.value = !flag.value;
  checked.value = false;
  isLoding.value = false;
};

const goResetPage = () => {
  uni.navigateTo({ url: "/pages/reset/index" });
};
const handleConfirm = async () => {
  //发送请求
  try {
    const parmas = flag.value ? mobileFormData : pwdFormData;
    await login(parmas);
    show.value = false;
    uni.navigateTo({ url: "/pages/index/index" });
  } catch (e) {
    isLoding.value = false;
    show.value = false;
  }
};
const handleCancel = () => {
  show.value = false;
};
const show = ref(false);
let disabled: ComputedRef<boolean>;
const { isDisable: isDisableMobile } = useButtonDisableHook({
  formData: mobileFormData,
  formRef: formMobileRef as Ref<FormRef>,
  fields: ["mobile", "code"],
});
const { isDisable: isDisablePwd } = useButtonDisableHook({
  formData: pwdFormData,
  formRef: formPwdRef as Ref<FormRef>,
  fields: ["loginId", "loginPwd"],
});
watch(
  flag,
  () => {
    disabled = flag.value ? isDisableMobile : isDisablePwd;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>