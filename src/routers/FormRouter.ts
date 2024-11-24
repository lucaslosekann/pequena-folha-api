import { Router } from "express";
import FormController from "../controllers/FormController";
import { upload } from "../server";

const FormRouter = Router();

FormRouter.post(
    "/",
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

FormRouter.get("/", FormController.index);
FormRouter.get("/:id", FormController.show);
FormRouter.get("/image/:id", FormController.image);

export default FormRouter;
