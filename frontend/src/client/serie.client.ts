import axios from 'axios';
import type { SerieDTO } from './DTOs/Serie.dto';
import { SerieConverter } from '../converters/serie.converter';
import type { SerieModel } from '../models/Serie.model';


export const SerieClient = {
  buscarSeries: async (): Promise<SerieModel[]> => {
    const response = await axios.get<SerieDTO[]>('http://localhost:8080/tests');
    return response.data.map(SerieConverter.toModel)
  }
};