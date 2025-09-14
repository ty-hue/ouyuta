import {SysPermissionNameType} from './enums'
// 保存权限状态的类型
export interface PermissionStatusType{
    id:number
    status:boolean
    permissionName:SysPermissionNameType,
    iconName:string
}