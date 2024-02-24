import { NoteDTO } from "../../api/RequestBodies/NoteDTO";
import { NoteBusiness } from "../../api/Business/NoteBusiness";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Note from "../../database/models/Note";
import Park from "../../database/models/Park";
import express, { Router, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { AlertDTO } from "../../api/RequestBodies/AlertDTO";

const router: Router = express.Router();
const noteBusiness: NoteBusiness = new NoteBusiness();

router.get('/park/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Vérifier si le parc existe
        const park: Park = await Park.findByPk(parseInt(req.params.id));
        if (park) {
            const result: {rows: Note[], count: number} = await noteBusiness.getAllNotesByPark(park.id);
            res.json({
                total_items: result.count,
                notes: result.rows
            });
        } else {
            throw new CustomError ("Can't find park");
        }
    } catch (error) {
        next(error);
    }
})

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const note: Note = await noteBusiness.getNote(parseInt(req.params.id));
        res.json(note);
    } catch (error) {
        next(error);
    }
})

router.post('/park/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Vérifier si la parc existe
        const park: Park = await Park.findByPk(parseInt(req.params.id));
        if (park) {
            const noteDto: NoteDTO = plainToInstance(NoteDTO, req.body);
            const newNote: Note = await noteBusiness.createNote(noteDto, park.id);
            const note: Note = await Note.findByPk(newNote.id);
            res.status(201).json(note);
        } else {
            throw new CustomError ("Can't find park");
        }
    } catch (error) {
        next(error);
    }
})

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const noteDto: NoteDTO = plainToInstance(NoteDTO, req.body);
        const note: Note = await noteBusiness.modifyNote(noteDto, parseInt(req.params.id));

        res.status(200).json(note);
    } catch(error) {
        next(error);
    }
})

router.delete('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await noteBusiness.deleteNote(parseInt(req.params.id));
        res.status(200).json({
            message: "Note deleted"
        })
    } catch(error) {
        next(error);
    }
})

export default router;