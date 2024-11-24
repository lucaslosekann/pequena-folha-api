import { Router } from "express";
import AgendaController from "../controllers/AgendaController";

const AgendaRouter = Router();

AgendaRouter.get("/", AgendaController.index);
AgendaRouter.post("/", AgendaController.create);
AgendaRouter.put("/:id", AgendaController.update);
AgendaRouter.delete("/:id", AgendaController.delete);

export default AgendaRouter;
