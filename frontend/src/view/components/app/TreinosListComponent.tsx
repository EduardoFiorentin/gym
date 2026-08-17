import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosListItem from "./TreinosListItem"
import { useNavigate } from "react-router"
import type { TreinoModel } from "../../../models/Treino.model"
import { useTreinos } from "../../../hooks/useTreinos"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TreinamentoClient } from "../../../client/treinamento.client"
import { STORAGE_KEYS } from "../../../utils/constants/storageKeys/storageKeys"


const TreinosListComponent = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { treinos, isLoading, error } = useTreinos()

    const startTreinamentoMutation = useMutation({
        mutationFn: (treinoId: string) => TreinamentoClient.startTreinamento(treinoId),
        onSuccess: (treinamento) => {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, treinamento)
            navigate("/training")
        }
    })

    const handleRedirect = (treino: TreinoModel) => {
        startTreinamentoMutation.mutate(treino.id)
    }
    
    return (
        <BaseContainer 
            height="auto"
            direction="column"
            verticalAlign="flex-start"
            justifyContent="flex-start"
        >
            <Box
                borderBottom={"1px solid black"}
                width={"100%"}
            >
                <Text fontWeight={"bolder"}>Treinos</Text>
            </Box>
            <Box
                w={"100%"}
            >                
                {isLoading ? (
                    <Text mt={"10px"}>Carregando treinos...</Text>
                ) : error ? (
                    <Text mt={"10px"}>Nao foi possivel carregar os treinos.</Text>
                ) : treinos.length === 0 ? (
                    <Text mt={"10px"}>Nenhum treino cadastrado.</Text>
                ) : (
                    treinos.map((tr: TreinoModel) => (
                        <TreinosListItem
                            key={tr.id}
                            name={tr.name}
                            disabled={startTreinamentoMutation.isPending}
                            onClickRedirect={() => handleRedirect(tr)}
                        />
                    ))
                )}

            </Box>
        </BaseContainer>
    )
}

export default TreinosListComponent
