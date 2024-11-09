import { Router } from "express";
import PartnersController from "../controllers/PartnersController";
import { upload } from "../server";

const PartnersRouter = Router();

PartnersRouter.get("/", PartnersController.index);
PartnersRouter.post("/", upload.single("image"), PartnersController.create);
PartnersRouter.get("/image/:id", PartnersController.image);
PartnersRouter.delete("/:id", PartnersController.delete);
PartnersRouter.put("/:id", upload.single("image"), PartnersController.update);

export default PartnersRouter;
