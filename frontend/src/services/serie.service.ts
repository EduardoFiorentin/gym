// import { api } from './api'; // Instância do Axios
import axios from 'axios';
import type { SerieDTO } from './DTOs/Serie.dto';


export const SerieService = {
  buscarSeries: async (): Promise<void> => {
    // Service só se preocupa com a rede
    const response = await axios.get<SerieDTO[]>('http://localhost:8080/tests');
    
    console.log(response.data)
    
    // return;
    // Converter faz o meio de campo
    // return response.data.map(SerieAdapter.toModel); 
  }
};