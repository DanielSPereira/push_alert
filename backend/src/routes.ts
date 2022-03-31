import { Router } from "express";
import pushController from "./controllers/pushController"

const router = Router();

router.post("/channel/:id", pushController.notifyPush);

export { router };
 