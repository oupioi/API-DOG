import axios from 'axios';
import { CustomError } from '../../api/Tools/ErrorHandler';

export class BreedService
{
    private baseUrl: string = process.env.DOG_API;

    public getBreedsFromApi()
    {
        const response: any = axios.get(`${this.baseUrl}/breeds/list/all`).then(
            (res) => {
                return res.data;
            },
            (err) => {
                throw new CustomError();
            }
        );
        
        return response;
    }
}