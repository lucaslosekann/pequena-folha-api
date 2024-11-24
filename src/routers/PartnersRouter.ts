import { Router } from "express";
import PartnersController from "../controllers/PartnersController";
import { upload } from "../server";
import VerifyToken from "../middlewares/VerifyToken";

const PartnersRouter = Router();

PartnersRouter.get("/", PartnersController.index);
PartnersRouter.post("/", VerifyToken(true), upload.single("image"), PartnersController.create);
PartnersRouter.get("/image/:id", PartnersController.image);
PartnersRouter.delete("/:id", VerifyToken(true), PartnersController.delete);
PartnersRouter.put("/:id", VerifyToken(true), upload.single("image"), PartnersController.update);

export default PartnersRouter;
