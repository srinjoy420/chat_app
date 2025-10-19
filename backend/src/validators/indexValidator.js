import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("username").trim().isEmpty().withMessage("Username required"),
        body("email").trim().isEmpty().withMessage("Email is required").isEmail().withMessage("email is required"),
        body("password").trim().isEmpty().withMessage("password is required").isLength({ min: 4 }).withMessage("minimun lenght is four").isLength({ max: 8 }).withMessage("maximum length is eight")

    ]

}
const loginValidator = () => {
    return [
        body("email").trim().isEmpty().withMessage("Email is required").isEmail().withMessage("email is required"),
        body("password").trim().isEmpty().withMessage("password is required").isLength({ min: 4 }).withMessage("minimun lenght is four").isLength({ max: 8 }).withMessage("maximum length is eight")

    ]

}
export  {userRegisterValidator,loginValidator}