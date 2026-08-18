import { Box, Button, Text } from "@chakra-ui/react"
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
import { FiRefreshCw } from "react-icons/fi"

interface ApiErrorResponse {
    message?: string
}

interface ITreinosListComponentProps {
    currentTraining?: TreinamentoModel | null
}

const getStartErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseMessage = error.response?.data?.message?.trim()
        if (responseMessage) return responseMessage
    }

    return "Nao foi possivel iniciar o treinamento."
}

const TreinosListComponent = ({ currentTraining = null }: ITreinosListComponentProps) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { treinos, isLoading, error } = useTreinos()
    const [startError, setStartError] = useState<string | null>(null)
    const [failedStartTreinoId, setFailedStartTreinoId] = useState<string | null>(null)

    const startTreinamentoMutation = useMutation({
        mutationFn: (treinoId: string) => TreinamentoClient.startTreinamento(treinoId),
        onMutate: (treinoId) => {
            setStartError(null)
            setFailedStartTreinoId(treinoId)
        },
        onSuccess: (treinamento) => {
            setFailedStartTreinoId(null)
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, treinamento)
            navigate("/training")
        },
        onError: async (mutationError) => {
            if (axios.isAxiosError(mutationError) && mutationError.response?.status === 409) {
                try {
                    const activeTraining = await TreinamentoClient.getCurrentTreinamento()
                    if (activeTraining) {
                        setFailedStartTreinoId(null)
                        queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, activeTraining)
                        navigate("/training")
                        return
                    }
                } catch {
                    setStartError("Nao foi possivel recuperar o treinamento em andamento.")
                    return
                }
            }

            setStartError(getStartErrorMessage(mutationError))
        }
    })

    const handleRedirect = (treino: TreinoModel) => {
        if (startTreinamentoMutation.isPending) return

        setStartError(null)
        if (currentTraining) {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, currentTraining)
            setFailedStartTreinoId(null)
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
                {startError && (
                    <Box border={"1px solid"} borderColor={"#f2b8b5"} borderRadius={"8px"} p={"12px"} bg={"#fffafa"}>
                        <Text color={"#b42318"} fontWeight={"600"}>{startError}</Text>
                        {failedStartTreinoId && !currentTraining && (
                            <Button
                                mt={"10px"}
                                size={"sm"}
                                minH={"44px"}
                                w={{ base: "100%", sm: "auto" }}
                                variant={"outline"}
                                borderColor={"#bcccdc"}
                                color={"#334e68"}
                                loading={startTreinamentoMutation.isPending}
                                disabled={startTreinamentoMutation.isPending}
                                onClick={() => startTreinamentoMutation.mutate(failedStartTreinoId)}
                            >
                                <FiRefreshCw /> Tentar novamente
                            </Button>
                        )}
                    </Box>
                )}
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
                            actionLabel={startTreinamentoMutation.isPending ? "Iniciando..." : currentTraining ? "Continuar" : "Iniciar"}
                            onClickRedirect={() => handleRedirect(tr)}
                        />
                    ))
                )}

            </Box>
        </BaseContainer>
    )
}

export default TreinosListComponent
