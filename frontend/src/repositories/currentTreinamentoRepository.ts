import type { TreinamentoModel } from "../models/Treinamento.model";
import { STORAGE_KEYS } from "../utils/constants/storageKeys/storageKeys";

const parseTreinamento = (value: string | null): TreinamentoModel | null => {
    if (!value) return null;

    try {
        const parsed: TreinamentoModel = JSON.parse(value);
        return {
            ...parsed,
            startedAt: new Date(parsed.startedAt),
            finishedAt: parsed.finishedAt ? new Date(parsed.finishedAt) : null
        }
    } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TREINAMENTO);
        return null;
    }
}

export const currentTreinamentoRepository = {
    get: (): TreinamentoModel | null => {
        return parseTreinamento(localStorage.getItem(STORAGE_KEYS.CURRENT_TREINAMENTO));
    },

    save: (treinamento: TreinamentoModel) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_TREINAMENTO, JSON.stringify(treinamento));
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_TREINAMENTO);
    }
}
