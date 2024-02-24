import { ParkDTO } from "./ParkDTO";

export class NoteDTO {
    id: number;

    note: number;

    content: string;

    createdAt: Date;

    park: ParkDTO;
}