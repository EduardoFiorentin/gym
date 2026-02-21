import axios from 'axios';
import type { TreinoModel } from '../models/Treino.model';
import { TreinoConverter } from '../converters/treino.converter';
import type { TreinoDTO } from './DTOs/Treino.dto';
import { api } from './api.client';


export const TreinoClient = {
  // buscarTreinos: async (): Promise<TreinoModel[]> => {
  buscarTreinos: async (): Promise<void> => {
    const response = await api.get("/auth/test/role/manager");
    console.log("Teste manager", response)
    // return response.data.map(TreinoConverter.toModel)
  }
};