import { Box, Button, Flex, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosHistoryItem from "./TreinosHistoryItem"
import { useTreinamentoHistory } from "../../../hooks/useTreinamentoHistory"
import { FiRefreshCw } from "react-icons/fi"
import { useNavigate } from "react-router"

const TreinoHistoryComponent = () => {
    
    const { treinamentoHistory, error, updateStartingFrom, isLoading, isInitializing } = useTreinamentoHistory();
    const navigate = useNavigate();

    return (
        <BaseContainer 
            height="auto"
            direction="column"
            verticalAlign="flex-start"
            justifyContent="flex-start"
        >
            <Flex
                width={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
                gap={"10px"}
            >
                <Box>
                    <Text fontWeight={"900"} color={"#102a43"} fontSize={"lg"}>Meu historico</Text>
                    <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Ultimas execuções registradas.</Text>
                </Box>
                <Button
                    onClick={() => updateStartingFrom()}
                    variant={"outline"}
                    size={"sm"}
                    borderColor={"#bcccdc"}
                    color={"#334e68"}
                    disabled={isLoading || isInitializing} 
                >
                    <FiRefreshCw /> {isLoading ? "Atualizando..." : "Atualizar"}
                </Button>
            </Flex>
            <Box w={"100%"} display={"flex"} flexDirection={"column"} gap={"10px"}>
                {(isLoading || isInitializing) ? (
                    <Text color={"#627d98"}>Carregando meu historico...</Text>
                ) : error ? (
                    <Text color={"#b42318"} fontWeight={"600"}>{error.message}</Text>
                ) : !treinamentoHistory || treinamentoHistory.length === 0 ? (
                    <Text color={"#627d98"}>Nenhuma execução registrada.</Text>
                ) : (
                    treinamentoHistory && treinamentoHistory.map(th => (
                        <TreinosHistoryItem 
                            key={th.id} 
                            name={th.treinoName} 
                            date={th.startedAt}
                            onClick={() => navigate(`/history/${th.id}`)}
                        />        
                    ))
                )}
            </Box>
        </BaseContainer>
    );
}

export default TreinoHistoryComponent
