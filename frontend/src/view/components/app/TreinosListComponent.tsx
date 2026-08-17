import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosListItem from "./TreinosListItem"
import { useNavigate } from "react-router"
import type { TreinoModel } from "../../../models/Treino.model"
import { useTreinos } from "../../../hooks/useTreinos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TreinamentoClient } from "../../../client/treinamento.client"
import { STORAGE_KEYS } from "../../../utils/constants/storageKeys/storageKeys"
import type { TreinamentoModel } from "../../../models/Treinamento.model"
import axios from "axios"
import { useState } from "react"


interface ITreinosListComponentProps {
    currentTraining?: TreinamentoModel | null
}

const TreinosListComponent = ({ currentTraining = null }: ITreinosListComponentProps) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { treinos, isLoading, error } = useTreinos()
    const [startError, setStartError] = useState<string | null>(null)

    const startTreinamentoMutation = useMutation({
        mutationFn: (treinoId: string) => TreinamentoClient.startTreinamento(treinoId),
        onMutate: () => {
            setStartError(null)
        },
        onSuccess: (treinamento) => {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, treinamento)
            navigate("/training")
        },
        onError: async (mutationError) => {
            if (axios.isAxiosError(mutationError) && mutationError.response?.status === 409) {
                try {
                    const activeTraining = await TreinamentoClient.getCurrentTreinamento()
                    if (activeTraining) {
                        queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, activeTraining)
                        navigate("/training")
                        return
                    }
                } catch {
                    setStartError("Nao foi possivel recuperar o treinamento em andamento.")
                    return
                }
            }

            setStartError("Nao foi possivel iniciar o treinamento.")
        }
    })

    const handleRedirect = (treino: TreinoModel) => {
        setStartError(null)
        if (currentTraining) {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, currentTraining)
            navigate("/training")
            return
        }

        startTreinamentoMutation.mutate(treino.id)
    }
    
    return (
        <BaseContainer 
            height="auto"
            direction="column"
            verticalAlign="flex-start"
            justifyContent="flex-start"
        >
            <Box width={"100%"}>
                <Text fontWeight={"900"} color={"#102a43"} fontSize={"lg"}>Treinos</Text>
                <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Escolha uma ficha para começar uma nova execução.</Text>
            </Box>
            <Box
                w={"100%"}
                display={"flex"}
                flexDirection={"column"}
                gap={"10px"}
            >
                {startError && <Text color={"#b42318"} fontWeight={"600"}>{startError}</Text>}
                {isLoading ? (
                    <Text color={"#627d98"}>Carregando treinos...</Text>
                ) : error ? (
                    <Text color={"#b42318"} fontWeight={"600"}>Nao foi possivel carregar os treinos.</Text>
                ) : treinos.length === 0 ? (
                    <Text color={"#627d98"}>Nenhum treino cadastrado.</Text>
                ) : (
                    treinos.map((tr: TreinoModel) => (
                        <TreinosListItem
                            key={tr.id}
                            name={tr.name}
                            disabled={startTreinamentoMutation.isPending}
                            actionLabel={currentTraining ? "Continuar" : "Iniciar"}
                            onClickRedirect={() => handleRedirect(tr)}
                        />
                    ))
                )}

            </Box>
        </BaseContainer>
    )
}

export default TreinosListComponent
