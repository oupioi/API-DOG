import { ParkDTO } from "./ParkDTO";

export class NoteDTO {
    id: number;

    note: string;

    content: string;

    createdAt: Date;

    park: ParkDTO;
}