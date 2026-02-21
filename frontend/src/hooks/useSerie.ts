import { useState, useEffect, useCallback } from 'react';
import type { SerieModel } from '../models/Serie.model';
import { SerieClient } from '../client/serie.client';
import type { IBasicHookResponse } from './IBasicHookResponse';

interface IUseSerie extends IBasicHookResponse {
  series: SerieModel[],
  reload: () => void
}

export const useSeries = () => {
  const [series, setSeries] = useState<SerieModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSeries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const models: SerieModel[]  = await SerieClient.buscarSeries();
      setSeries(models);
    } catch (err) {
      setError('Não foi possível carregar as séries. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  const response: IUseSerie = {
    series,
    isLoading,
    error,
    reload: loadSeries
  };
  return response
};