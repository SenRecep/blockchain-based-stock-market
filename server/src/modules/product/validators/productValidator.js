import { body } from "express-validator";

export const productValidator = [
  body("name")
    .not()
    .isEmpty().withMessage("Please enter a name")
    .isLength({ min: 2, max: 20 })
    .isString()
    .withMessage("Please enter a name"),
  body("description")
    .not()
    .isEmpty()
    .isString()
    .withMessage("Please enter a description"),
  body("image").isEmpty().withMessage("Please upload an image"),
  body("amount")
    .not()
    .isEmpty()
    .isLength({ min: 2, max: 10 })
    .withMessage("Please enter amount"),
];
