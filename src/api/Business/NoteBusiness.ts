import { NoteDTO } from "../../api/RequestBodies/NoteDTO";
import Note from "../../database/models/Note";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Park from "../../database/models/Park";

export class NoteBusiness {
    /**
     * Create new note
     * @param noteDto 
     * @param idPark 
     * @returns Promise<Note>
     */
    public async createNote(noteDto: NoteDTO, idPark: number): Promise<Note> 
    {
        //Vérifier si le parc existe
        const park: Park = await Park.findByPk(idPark);

        try {
            const newNote: Note = await Note.create({
                note:       noteDto.note,
                content:    noteDto.content,
                createdAt:  noteDto.createdAt,
                idPark:     park.id
            })
            return newNote;
        } catch {
            throw new CustomError("Couldn't create park");
        }
    }

    /**
     * Get every notes for a parc
     * @param idPark Park id
     * @returns List of notes
     */
    public async getAllNotesByPark(idPark: number)
    {
        const notes: {rows: Note[], count: number} = await Note.findAndCountAll({
            where: {idPark: idPark}
        });
        return notes;
    }

    /**
     * Get note by id
     * @param id 
     * @returns note
     */
    public async getNote(id: number)
    {
        const note: Note | null = await Note.findByPk(id);
        return note;
    }

    /**
     * Modify a Note link to a Park
     * @param noteDto 
     * @param idPark 
     * @returns Note
     */
    public async modifyNote(noteDto: NoteDTO, idPark: number) 
    {
        let note: Note = await Note.findByPk(noteDto.id);
        let park: Park = await Park.findByPk(idPark);

        if(!note) {
            throw new CustomError("Not found", 404);
        }
        note.note       = noteDto.note;
        note.content    = noteDto.content;
        note.createdAt  = noteDto.createdAt;
        note.idPark     = park.id;

        await note.save();
        return await Note.findByPk(note.id);
    }

    /**
     * Delete Note
     * @param idNote 
     * @returns 
     */
    public async deleteNote(idNote: number) 
    {
        const note: Note = await Note.findByPk(idNote);

        if(note) {
            return note.destroy();
        } else {
            throw new CustomError("Note not found");
        }
    }
}