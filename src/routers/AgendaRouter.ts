import { Router } from "express";
import AgendaController from "../controllers/AgendaController";
import VerifyToken from "../middlewares/VerifyToken";

const AgendaRouter = Router();

AgendaRouter.get("/", VerifyToken(), AgendaController.index);
AgendaRouter.post("/", VerifyToken(true), AgendaController.create);
AgendaRouter.put("/:id", VerifyToken(true), AgendaController.update);
AgendaRouter.delete("/:id", VerifyToken(true), AgendaController.delete);

export default AgendaRouter;
