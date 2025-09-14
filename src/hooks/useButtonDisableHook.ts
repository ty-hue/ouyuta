import { reactive, watch, computed } from "vue";
import type { Ref } from "vue";
interface UseFormValidationParams<T> {
  formData: T;
  formRef: Ref<FormRef>;
  fields?: (keyof T)[];
}
interface FormRef {
  validate: () => Promise<any>;
  validateField: (fieldName: string, callback: (errArr: []) => void) => void;
}
export function useButtonDisableHook<T extends Record<string, any>>(
  params: UseFormValidationParams<T>
) {
  const { formData, formRef, fields } = params;
  const targetFields = fields || (Object.keys(formData) as (keyof T)[]);

  // 初始化字段状态
  const initialStatus: Record<keyof T, boolean> = {} as Record<
    keyof T,
    boolean
  >;
  targetFields.forEach((key) => {
    initialStatus[key] = false;
  });

  // 响应式存储字段校验状态
  const fieldStatus = reactive<Record<keyof T, boolean>>(initialStatus);

  // 遍历字段创建监听（修复类型警告的核心部分）
  targetFields.forEach((key) => {
    watch(
      () => formData[key],
      () => {
        if (formRef.value?.validateField) {
          formRef.value.validateField(key as string, (errArr) => {
            if (errArr.length === 0) {
              (fieldStatus[key as keyof typeof fieldStatus] as boolean) = true;
            } else {
              (fieldStatus[key as keyof typeof fieldStatus] as boolean) = false;
            }
          });
        }
      }
    );
  });

  // 计算按钮禁用状态
  const isDisable = computed(() => {
    return targetFields.some(
      (key) => !fieldStatus[key as keyof typeof fieldStatus]
    );
  });

  return { fieldStatus, isDisable };
}
