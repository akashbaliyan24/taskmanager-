import { body } from "express-validator"

const userRegisthrationValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty().withMessage("username is required")
            .isLength({ min: 3 }).withMessage("minimum length shoul be 3")
            .isLength({ max: 13 }).withMessage("max lenght is 13")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .isEmail().withMessage("Email is not valid"),
        body("password")
            .notEmpty().withMessage("password cannot be empty")
    ];
};


export { userRegisthrationValidator,userLoginValidator}

