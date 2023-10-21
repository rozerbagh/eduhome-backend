import Router from "express";
import {
  adminController,
  userController,
  categoryController,
  courseController,
  subCategoryController,
  messageController,
} from "../controllers/index.js";

const router = Router();

router.use("/users", userController);
router.use("/message", messageController);
router.use("/notification", messageController);
router.use("/admin", adminController);
router.use("/category", categoryController);
router.use("/subCategory", subCategoryController);
router.use("/course", courseController);

export { router };
