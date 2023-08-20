import Yup, { string, object, boolean, number, array } from "yup"

export default object({
    body: object({
        email: string().email("帳號須為 Email 格式").required("帳號為必填欄位"),
        name: string().required("姓名為必填欄位"),
        roles: array()
            .of(number().required("角色為必填欄位"))
            .min(1, "角色為必填欄位")
    }),
}).required()
