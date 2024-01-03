import express from "express";
import { Compose, Inbox, DeleteMsg, SaveDraft,
    GetDraft, TrashBin, MarkStarredMsg,
    GetImportantMsg, GetStarredMsg,
    MarkImportantMsg, OutboxMsg, DelateTrashMsg } from "..//Controller/emailControllers.js";
import handler from "../Middleware/fileupload.js";


const router = express.Router();

//Compose and send a message
router.post("/compose", Compose);

//Check inbox
router.get("/inbox",Inbox);

//Get Outbox message
router.get("/outbox", OutboxMsg);

//Mark as a Starred msg
router.post("/starred", MarkStarredMsg);

//Read a Starred msg
router.get("/starred", GetStarredMsg);

//Mark as a Important Messages
router.post("/imp",MarkImportantMsg)

//Read a Important Messages
router.get("/imp",GetImportantMsg);

//Delete Message
router.delete("/delete",DeleteMsg);

//Save as a Draft message
router.post("/CreateDraft",SaveDraft);

//Get a Draft message
router.get("/GetDraft",GetDraft);

//Get a Trash message
router.get("/trash",TrashBin);

//Delete Trash messages
router.delete("/emptyTrash",DelateTrashMsg);

//Upload files
router.post("/upload",handler);

export const emailRouter = router;