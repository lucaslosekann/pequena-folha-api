import { Router } from "express";
import FormController from "../controllers/FormController";
import { upload } from "../server";
import VerifyToken from "../middlewares/VerifyToken";

const FormRouter = Router();

FormRouter.post(
    "/",
    VerifyToken(),
    upload.fields([
        {
            name: "organicResidueComposition",
            maxCount: 5,
        },
        {
            name: "inorganicResidueComposition",
            maxCount: 5,
        },
    ]),
    FormController.create
);

FormRouter.get("/", VerifyToken(true), FormController.index);
FormRouter.get("/:id", VerifyToken(true), FormController.show);
FormRouter.get("/image/:id", FormController.image);

export default FormRouter;
