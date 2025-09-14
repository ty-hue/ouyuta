<template>
  <view class="reset-container">
    <nav-bar bg-color="transparent">
      <template #left>
        <up-icon
          name="arrow-leftward"
          :size="28"
          @click="goBack"
          color="#fff"
        />
      </template>
    </nav-bar>
    <!-- #ifdef MP-WEIXIN || APP-PLUS -->
    <image src="./../../static/reset-bg.jpg" mode="aspectFill" class="bg-img" />
    <!-- #endif -->
    <view class="content">
      <view class="title webfont">修改密码</view>
      <view class="form-container">
        <view class="step" v-if="step === 0">
          <text class="step-title">指定用户名</text>
          <up-form
            :borderBottom="false"
            :rules="rules"
            :model="data"
            ref="stepFirstRef"
            label-position="top"
            labelWidth="auto"
            :label-style="{
              color: '#fff',
              paddingBottom: '20rpx',
            }"
          >
            <up-form-item
              prop="loginId"
              :borderBottom="false"
              label="请输入用户名"
            >
              <up-input
                v-model="data.loginId"
                placeholder="用户名"
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
        </view>
        <view class="step" v-else-if="step === 1">
          <text class="step-title">身份验证</text>
          <text class="tip"
            >为了保护你的账号安全，絮语需要验证你的身份，验证通过后即可找回你的密码。</text
          >
          <view class="check-mode-box" @click="chooseValidateMethod">
            <view class="left">
              <image
                class="check-icon"
                src="./../../static/phone.png"
                mode="aspectFill"
              />
            </view>
            <view class="right">
              <text class="right-title">手机号验证</text>
              <text class="right-sub-title"
                >通过{{ accountInfo.mobile }}接收短信验证码</text
              >
            </view>
          </view>
        </view>
        <view class="step" v-else-if="step === 2">
          <text class="step-title">找回密码</text>
          <view class="tip-box">
            <text class="top-text">手机号码验证</text>
            <text class="bottom-text"
              >请填写完整的手机号 {{ accountInfo.mobile }} 以验证身份</text
            >
          </view>
          <up-form
            :borderBottom="false"
            :rules="rules"
            :model="data"
            ref="stepThreeRef"
            label-position="top"
            labelWidth="auto"
            :label-style="{
              color: '#fff',
              paddingBottom: '20rpx',
            }"
          >
            <up-form-item prop="mobile" :borderBottom="false">
              <up-input
                v-model="data.mobile"
                placeholder="请输入完整的手机号"
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
                <template #prefix>
                  <up-text text="+86" margin="0 3px 0 0" type="tips"></up-text>
                </template>
              </up-input>
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
        </view>
        <view class="step" v-else>
          <text class="step-title">找回密码</text>
          <up-form
            :borderBottom="false"
            :rules="rules"
            :model="data"
            ref="stepFourRef"
            label-position="top"
            labelWidth="auto"
            :label-style="{
              color: '#fff',
              paddingBottom: '20rpx',
            }"
          >
            <up-form-item
              prop="loginPwd"
              :borderBottom="false"
              label="设置新密码"
            >
              <up-input
                v-model="data.loginPwd"
                placeholder="请输入新密码"
                type="password"
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
                placeholder="请再次输入新密码"
                type="password"
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
          <view class="tip-info">
            <text class="warn"
              ><i class="iconfont icon-icon"></i
              >密码由8-16位数字、字母或符号组成</text
            >
            <text class="warn"
              ><i class="iconfont icon-icon"></i>至少含3种以上字符
            </text>
          </view>
        </view>
        <up-button
          :disabled="disabled"
          @click="next"
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
          >{{ step === 3 ? "确定" : "下一步" }}</up-button
        >
        <text class="warn-tip" v-if="step === 3">
          安全提示：新密码请勿与旧密码过于相似。
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import useNavBarHook from "@/hooks/useNavBarHook";
import { computed, reactive, ref, watch } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useButtonDisableHook } from "@/hooks/useButtonDisableHook";
import {
  isLoginIdExistApi,
  getPhoneByLoginIdApi,
  resetApi,
  isMatchApi,
  getSmsCodeApi,
  isMatchPhoneAndCodeApi,
} from "@/request/apis/user";
import { SmsCodeType } from "@/types/enums";
const { goBack } = useNavBarHook();
enum StepEnum {
  FIRST = 0,
  SECOND = 1,
  THREE = 2,
  FOUR = 3,
}
const step = ref<StepEnum>(StepEnum.FIRST);
const rules = reactive({
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
    // 校验用户名是否存在
    {
      asyncValidator: async (
        rule: any,
        value: string,
        callback: (x?: any) => void
      ) => {
        const { isExist } = await isLoginIdExistApi(value);
        if (!isExist) {
          callback(new Error("该用户名不存在"));
        } else {
          callback();
        }
      },
      trigger: ["blur"],
    },
  ],
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
    // 校验手机号和用户名是否匹配
    {
      asyncValidator: async (
        rule: any,
        value: string,
        callback: (x?: any) => void
      ) => {
        const { isMatch } = await isMatchApi({
          loginId: data.loginId,
          mobile: data.mobile,
        });
        if (isMatch) {
          callback();
        } else {
          callback(new Error("手机号和用户名不匹配"));
        }
      },
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
const data = reactive({
  loginId: "",
  mobile: "",
  loginPwd: "",
  confirmPwd: "",
  code: "",
  ischecked: true,
});
let accountInfo = reactive({
  id: 0,
  mobile: "",
});
const next = async () => {
  try {
    if (step.value === StepEnum.FIRST) {
      accountInfo = await getPhoneByLoginIdApi(data.loginId);
    }
    if (step.value === StepEnum.THREE) {
      await isMatchPhoneAndCodeApi({
        mobile: data.mobile,
        type: SmsCodeType.RESET,
        code: data.code,
      });
    }
    if (step.value === StepEnum.FOUR) {
      uni.showLoading({ title: "正在修改密码", mask: true });
      await resetApi(data);
      uni.hideLoading();
      uni.$u.route({
        url: "/pages/result/index",
        params: {
          statusInfo: JSON.stringify({
            status: 0,
            title: "恭喜您，已成功修改密码!!",
            backUrl: "/pages/reset/index",
          }),
        },
        type: "redirect",
      });
    }

    step.value = step.value === 3 ? step.value : step.value + 1;
  } catch (e) {
    uni.hideLoading();
    return;
  }
};
const tips = ref("");
const codeChange = (text: string) => {
  tips.value = text;
};
const getCode = async () => {
  // 先判断用户是否填写了手机号
  if (!data.mobile) {
    return;
  }
  // 判断用户填写的手机号是否可以通过校验
  stepThreeRef.value!.validateField("mobile", (errArr) => {
    if (errArr.length !== 0) {
      return;
    }
  });
  if (uCodeRef.value!.canGetCode) {
    uni.showLoading({
      title: "正在获取验证码",
    });
    // 发送请求给后端，请求后端给用户手机发送验证码
    try {
      await getSmsCodeApi({ mobile: data.mobile, type: SmsCodeType.RESET });
      uni.hideLoading();
      uCodeRef.value!.start();
    } catch (e) {
      uni.hideLoading();
    }
  }
};
interface FormRef {
  validate: () => Promise<any>;
  validateField: (fieldName: string, callback: (errArr: []) => void) => void;
}
interface UpCodeInstance {
  canGetCode: boolean;
  start: () => void;
}
const uCodeRef = ref<UpCodeInstance | null>(null);
const stepThreeRef = ref<FormRef | null>(null);
const stepFirstRef = ref<FormRef | null>(null);
const stepFourRef = ref<FormRef | null>(null);

let disabled: ComputedRef<boolean>;
// 按钮状态动态切换功能
const { isDisable: firstDisable } = useButtonDisableHook({
  formData: data,
  formRef: stepFirstRef as Ref<FormRef>,
  fields: ["loginId"],
});
const { isDisable: threeDisable } = useButtonDisableHook({
  formData: data,
  formRef: stepThreeRef as Ref<FormRef>,
  fields: ["mobile", "code"],
});
const { isDisable: fourDisable, fieldStatus } = useButtonDisableHook({
  formData: data,
  formRef: stepFourRef as Ref<FormRef>,
  fields: ["loginPwd", "confirmPwd"],
});
// 当密码框的值发生改变时，手动触发确认密码框的校验规则
watch(
  () => data.loginPwd,
  () => {
    if (data.confirmPwd) {
      stepFourRef.value?.validateField("confirmPwd", (errArr) => {
        if (errArr.length !== 0) {
          fieldStatus.confirmPwd = false;
        } else {
          fieldStatus.confirmPwd = true;
        }
      });
    }
  }
);
// 计算第二步按钮的状态
const secondDisable = computed(() => {
  return data.ischecked;
});
watch(
  step,
  () => {
    if (step.value === StepEnum.FIRST) {
      disabled = firstDisable;
    }
    if (step.value === StepEnum.SECOND) {
      disabled = secondDisable;
    }
    if (step.value === StepEnum.THREE) {
      disabled = threeDisable;
    }
    if (step.value === StepEnum.FOUR) {
      disabled = fourDisable;
    }
  },
  { immediate: true }
);
const chooseValidateMethod = () => {
  data.ischecked = !data.ischecked;
};
</script>

<style lang="scss" scoped>
@import "./css/index.scss";
</style>
