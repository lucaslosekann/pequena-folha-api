import { Router } from "express";
import AgendaController from "../controllers/AgendaController";
import { upload } from "../server";

const AgendaRouter = Router();

AgendaRouter.get("/", AgendaController.index);
AgendaRouter.get("/image/:id", AgendaController.image);
AgendaRouter.post("/", AgendaController.create);
AgendaRouter.put("/:id", AgendaController.update);
AgendaRouter.put("/previous/:id", upload.array("image"), AgendaController.updatePreviousEvent);
AgendaRouter.delete("/:id", AgendaController.delete);

export default AgendaRouter;
