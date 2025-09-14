<template>
  <view class="register-container">
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
    <image
      src="./../../static/register-bg.jpg"
      mode="aspectFill"
      class="bg-img"
    />
    <!-- #endif -->
    <view class="content">
      <text class="resgiter-title webfont">欢迎加入絮语</text>
      <view class="form-container">
        <up-form
          :borderBottom="false"
          :rules="rules"
          :model="data"
          ref="formRef"
          label-position="top"
        >
          <up-form-item prop="loginId" :borderBottom="false">
            <up-input
              v-model="data.loginId"
              placeholder="请输入用户名"
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
              v-model="data.loginPwd"
              placeholder="请输入密码"
              type="password"
              :passwordVisibilityToggle="true"
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
          <up-form-item prop="confirmPwd" :borderBottom="false">
            <up-input
              v-model="data.confirmPwd"
              type="password"
              :passwordVisibilityToggle="true"
              placeholder="请再次输入密码"
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
          <up-form-item prop="mobile" :borderBottom="false">
            <up-input
              v-model="data.mobile"
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
              v-model="data.code"
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
        <up-button
          :disabled="isDisable"
          throttle-time="5000"
          @click="submit"
          loading-text="注册"
          :loading="isLoding"
          type="primary"
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
          >注册</up-button
        >
        <view class="bottom-tip">
          <text class="tip" @click="goLoginPage">
            已有账号？去登陆
            <i class="iconfont icon-youjiantou"></i>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import NarBar from "@/components/NavBar/index.vue";
import useNavBarHook from "@/hooks/useNavBarHook";
import { reactive, ref, watch } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useButtonDisableHook } from "@/hooks/useButtonDisableHook";

import {
  isLoginIdExistApi,
  getSmsCodeApi,
  registerApi,
} from "./../../request/apis/user";
import { SmsCodeType } from "@/types/enums";
const { goBack } = useNavBarHook();
const data = reactive({
  loginId: "",
  loginPwd: "",
  mobile: "",
  code: "",
  confirmPwd: "",
});
const rules = reactive({
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
    // 校验用户是否已存在
    // {
    //   asyncValidator: (rule:any, value:string, callback:(x?:any)=>void) => {
    //     uni.$u.http.post("/xxx/xxx", { name: value }).then((res:any) => {
    //       // 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
    //       if (res.error) {
    //         callback(new Error("该手机已注册"));
    //       } else {
    //         // 如果校验通过，也要执行callback()回调
    //         callback();
    //       }
    //     });
    //   },
    // },
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
  loginId: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["blur"],
    },
    {
      validator: (rule: any, value: string, callback: () => void) => {
        const loginIdRegex = /^[a-zA-Z0-9]{5,8}$/;
        return loginIdRegex.test(value);
      },
      message: "用户名格式不正确",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
    // 校验用户名是否已被占用
    {
      asyncValidator: async (
        rule: any,
        value: string,
        callback: (x?: any) => void
      ) => {
        const { isExist } = await isLoginIdExistApi(value);
        if (isExist) {
          callback(new Error("该用户名已被占用"));
        } else {
          // 如果校验通过，也要执行callback()回调
          callback();
        }
      },
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
  confirmPwd: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: ["blur"],
    },
    {
      validator: (rule: any, value: string, callback: () => void) => {
        return data.loginPwd === value;
      },
      message: "两次输入的密码不一致",
      // 触发器可以同时用blur和change
      trigger: ["blur"],
    },
  ],
});
const tips = ref("");
const codeChange = (text: string) => {
  tips.value = text;
};
interface FormRef {
  validate: () => Promise<any>;
  validateField: (fieldName: string, callback: (errArr: []) => void) => void;
}
interface UpCodeInstance {
  canGetCode: boolean;
  start: () => void;
}
const formRef = ref<FormRef | null>(null);
const uCodeRef = ref<UpCodeInstance | null>(null);
const isLoding = ref(false);
const getCode = async () => {
  // 先判断用户是否填写了手机号
  if (!data.mobile) {
    return;
  }
  // 判断用户填写的手机号是否可以通过校验
  formRef.value!.validateField("mobile", (errArr) => {
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
    await getSmsCodeApi({ mobile: data.mobile, type: SmsCodeType.REGISTER });
    uni.hideLoading();
    uCodeRef.value!.start();
  }
};
// 提交方法
const submit = async () => {
  const valid = await formRef.value!.validate();
  if (valid) {
    try {
      isLoding.value = true;
      // 校验通过,发起注册请求
      await registerApi(data);
      uni.showToast({ title: "注册成功", duration: 2000 });
      isLoding.value = false;
    } catch (e) {
      isLoding.value = false;
    }
  }
};
const goLoginPage = () => {
  uni.navigateTo({ url: "/pages/login/index" });
};
const { isDisable, fieldStatus } = useButtonDisableHook({
  formData: data,
  formRef: formRef as Ref<FormRef>,
  fields: ["code", "loginId", "confirmPwd", "loginPwd", "mobile"],
});
// 当密码框的值发生改变时，手动触发确认密码框的校验规则
watch(
  () => data.loginPwd,
  () => {
    if (data.confirmPwd) {
      formRef.value?.validateField("confirmPwd", (errArr) => {
        if (errArr.length !== 0) {
          fieldStatus.confirmPwd = false;
        } else {
          fieldStatus.confirmPwd = true;
        }
      });
    }
  }
);
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
