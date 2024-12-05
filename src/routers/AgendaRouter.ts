import { Router } from "express";
import AgendaController from "../controllers/AgendaController";
import VerifyToken from "../middlewares/VerifyToken";
import { upload } from "../server";

const AgendaRouter = Router();

AgendaRouter.get("/", AgendaController.index);
AgendaRouter.get("/image/:id", AgendaController.image);
AgendaRouter.post("/", VerifyToken(true), AgendaController.create);
AgendaRouter.put("/:id", VerifyToken(true), AgendaController.update);
AgendaRouter.put("/previous/:id", VerifyToken(true), upload.array("image"), AgendaController.updatePreviousEvent);
AgendaRouter.delete("/:id", VerifyToken(true), AgendaController.delete);
AgendaRouter.delete("/image/:id", VerifyToken(true), AgendaController.delete_image);

export default AgendaRouter;
