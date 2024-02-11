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

            if (park) {
            let newNote: Note = new Note({
                note:       noteDto.note,
                content:    noteDto.content,
                createdAt:  noteDto.createdAt,
                idPark:     park.id
            });
            await newNote.save();
            return await this.getNote(newNote.id);
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
        if (!note) {
            throw new CustomError("Not found", 404);
        }
        return note;
    }
}