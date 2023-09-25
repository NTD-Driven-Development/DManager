import { string, object, } from "yup"

export default object({
    body: object({
        email: string().email("帳號須為 Email 格式").required("帳號為必填欄位"),
        password: string().required("密碼為必填欄位"),
    })
}).required();