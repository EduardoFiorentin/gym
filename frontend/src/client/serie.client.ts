import type { SerieDTO } from './DTOs/Serie.dto';
import { SerieConverter } from '../converters/serie.converter';
import type { SerieModel } from '../models/Serie.model';
import { api } from './api.client';


export const SerieClient = {
  buscarSeries: async (): Promise<SerieModel[]> => {
    const response = await api.get<SerieDTO[]>('/tests');
    return response.data.map(SerieConverter.toModel)
  }
};
