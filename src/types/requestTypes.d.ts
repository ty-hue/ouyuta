export interface RequestConfig extends UniApp.RequestOptions{
    showLoading?:boolean 
}

// 后端响应数据的类型
export interface ResponseData{
    code:number,
    data:any,
    msg:string
}
