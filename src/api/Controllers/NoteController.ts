import { NoteDTO } from "../../api/RequestBodies/NoteDTO";
import { NoteBusiness } from "../../api/Business/NoteBusiness";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Note from "../../database/models/Note";
import Park from "../../database/models/Park";
import express, { Router, Request, Response } from "express";
import { instanceToPlain, plainToInstance } from "class-transformer";

const router: Router = express.Router();
const noteBusiness: NoteBusiness = new NoteBusiness();

router.get('/park/:id', async (req: Request, res: Response, next) => {
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

router.get('/:id', async (req: Request, res: Response, next) => {
    try {
        const note: Note = await noteBusiness.getNote(parseInt(req.params.id));
        res.json(note);
    } catch (error) {
        next(error);
    }
})

router.post('/park/:id', async (req: Request, res: Response, next) => {
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

export default router;