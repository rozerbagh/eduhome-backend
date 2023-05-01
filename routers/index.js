import Router from "express";
import {
  adminController,
  userController,
  categoryController,
  courseController,
  subCategoryController,
} from "../controllers/index.js";

const router = Router();

router.use("/users", userController);
router.use("/admin", adminController);
router.use("/category", categoryController);
router.use("/subCategory", subCategoryController);
router.use("/course", courseController);

export { router };
