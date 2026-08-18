import { Box, Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { FiArrowLeft, FiClock, FiList, FiRefreshCw } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { useTreinamentoDetails } from "../../hooks/useTreinamentoDetails";
import type { ExercicioModel } from "../../models/Exercicio.model";
import type { SerieDetailsModel } from "../../models/SerieDetails.model";
import { formatToLocalDate } from "../../utils/functions/date/formatToLocalDate";
import MainLayout from "../layouts/MainLayout";

const formatSerieTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

const getSeriesForExercicio = (series: SerieDetailsModel[], exercicioId: string) => {
    return series.filter((serie) => serie.exercicioId === exercicioId);
}

const TrainingHistoryDetails = () => {
    const navigate = useNavigate();
    const { treinamentoId } = useParams<{ treinamentoId: string }>();
    const detailsQuery = useTreinamentoDetails(treinamentoId, Boolean(treinamentoId));
    const treinamento = detailsQuery.treinamentoDetails;

    const exercicioById = useMemo(() => {
        const exercicios = new Map<string, ExercicioModel>();
        treinamento?.treino.exercicios.forEach((exercicio) => {
            exercicios.set(exercicio.id, exercicio);
        });
        return exercicios;
    }, [treinamento]);

    const exerciciosRealizados = useMemo(() => {
        if (!treinamento) return [];

        const exerciciosComSerie = new Set(treinamento.series.map((serie) => serie.exercicioId));
        return treinamento.treino.exercicios.filter((exercicio) => exerciciosComSerie.has(exercicio.id));
    }, [treinamento]);

    const handleBackToHistory = () => {
        navigate("/");
    }

    const renderState = () => {
        if (detailsQuery.isLoading) {
            return (
                <Box bg={"white"} border={"1px solid"} borderColor={"#dde6f0"} borderRadius={"8px"} p={{ base: "16px", md: "20px" }}>
                    <Text color={"#627d98"} fontWeight={"700"}>Carregando treinamento...</Text>
                </Box>
            );
        }

        if (!treinamentoId || detailsQuery.isNotFound) {
            return (
                <Box bg={"white"} border={"1px solid"} borderColor={"#dde6f0"} borderRadius={"8px"} p={{ base: "16px", md: "20px" }}>
                    <Text fontWeight={"900"} color={"#102a43"} fontSize={"lg"}>Treinamento nao encontrado</Text>
                    <Text color={"#627d98"} mt={"4px"}>Nao foi possivel encontrar esse registro no seu historico.</Text>
                    <Button mt={"14px"} variant={"outline"} borderColor={"#bcccdc"} color={"#334e68"} onClick={handleBackToHistory}>
                        <FiArrowLeft /> Voltar ao historico
                    </Button>
                </Box>
            );
        }

        if (detailsQuery.error) {
            return (
                <Box bg={"white"} border={"1px solid"} borderColor={"#dde6f0"} borderRadius={"8px"} p={{ base: "16px", md: "20px" }}>
                    <Text fontWeight={"900"} color={"#102a43"} fontSize={"lg"}>Nao foi possivel carregar</Text>
                    <Text color={"#b42318"} mt={"4px"} fontWeight={"600"}>Tente atualizar o detalhe do treinamento.</Text>
                    <Flex mt={"14px"} gap={"10px"} wrap={"wrap"}>
                        <Button variant={"outline"} borderColor={"#bcccdc"} color={"#334e68"} onClick={handleBackToHistory}>
                            <FiArrowLeft /> Voltar
                        </Button>
                        <Button bg={"#1f7a5b"} color={"white"} _hover={{ bg: "#176448" }} onClick={() => detailsQuery.refetch()}>
                            <FiRefreshCw /> Tentar novamente
                        </Button>
                    </Flex>
                </Box>
            );
        }

        if (!treinamento) {
            return (
                <Box bg={"white"} border={"1px solid"} borderColor={"#dde6f0"} borderRadius={"8px"} p={{ base: "16px", md: "20px" }}>
                    <Text color={"#627d98"} fontWeight={"700"}>Nenhum detalhe disponivel.</Text>
                </Box>
            );
        }

        return (
            <Flex direction={"column"} gap={"16px"}>
                <Box
                    bg={"white"}
                    border={"1px solid"}
                    borderColor={"#dde6f0"}
                    borderRadius={"8px"}
                    boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                    p={{ base: "16px", md: "20px" }}
                >
                    <Flex justify={"space-between"} gap={"14px"} align={"flex-start"} wrap={"wrap"}>
                        <Box>
                            <Text color={"#1f7a5b"} fontSize={"xs"} fontWeight={"800"} textTransform={"uppercase"}>
                                Historico
                            </Text>
                            <Text as={"h1"} fontWeight={"900"} fontSize={{ base: "2xl", md: "3xl" }} color={"#102a43"}>
                                {treinamento.treino.name}
                            </Text>
                            <Text color={"#627d98"} fontSize={"sm"} mt={"4px"}>
                                Inicio: {formatToLocalDate(treinamento.startedAt)}
                            </Text>
                            <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>
                                Fim: {treinamento.finishedAt ? formatToLocalDate(treinamento.finishedAt) : "Em andamento"}
                            </Text>
                        </Box>

                        <Button
                            variant={"outline"}
                            borderColor={"#bcccdc"}
                            color={"#334e68"}
                            onClick={handleBackToHistory}
                        >
                            <FiArrowLeft /> Voltar ao historico
                        </Button>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, sm: 3 }} gap={"10px"} mt={"16px"}>
                        <Box border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"} p={"12px"} bg={"#fbfdff"}>
                            <Text color={"#627d98"} fontSize={"sm"}>Exercicios</Text>
                            <Text color={"#102a43"} fontWeight={"900"} fontSize={"xl"}>{exerciciosRealizados.length}</Text>
                        </Box>
                        <Box border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"} p={"12px"} bg={"#fbfdff"}>
                            <Text color={"#627d98"} fontSize={"sm"}>Series</Text>
                            <Text color={"#102a43"} fontWeight={"900"} fontSize={"xl"}>{treinamento.series.length}</Text>
                        </Box>
                        <Box border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"} p={"12px"} bg={"#fbfdff"}>
                            <Text color={"#627d98"} fontSize={"sm"}>Ficha</Text>
                            <Text color={"#102a43"} fontWeight={"900"} lineClamp={1}>{treinamento.treino.name}</Text>
                        </Box>
                    </SimpleGrid>
                </Box>

                <Box
                    bg={"white"}
                    border={"1px solid"}
                    borderColor={"#dde6f0"}
                    borderRadius={"8px"}
                    boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                    p={{ base: "16px", md: "20px" }}
                >
                    <Text fontSize={"lg"} fontWeight={"900"} color={"#102a43"}>Exercicios realizados</Text>
                    <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Movimentos com series registradas neste treinamento.</Text>

                    {exerciciosRealizados.length === 0 ? (
                        <Text mt={"16px"} color={"#627d98"}>Nenhum exercicio realizado.</Text>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={"10px"} mt={"16px"}>
                            {exerciciosRealizados.map((exercicio) => {
                                const seriesDoExercicio = getSeriesForExercicio(treinamento.series, exercicio.id);

                                return (
                                    <Box key={exercicio.id} border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"} p={"12px"} bg={"#fbfdff"}>
                                        <Flex justify={"space-between"} gap={"10px"} align={"center"}>
                                            <Box>
                                                <Text fontWeight={"800"} color={"#243b53"}>{exercicio.name}</Text>
                                                <Text color={"#627d98"} fontSize={"sm"}>{exercicio.unMedida.abv}</Text>
                                            </Box>
                                            <Text color={"#1f7a5b"} fontWeight={"900"} whiteSpace={"nowrap"}>
                                                {seriesDoExercicio.length} series
                                            </Text>
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    )}
                </Box>

                <Box
                    bg={"white"}
                    border={"1px solid"}
                    borderColor={"#dde6f0"}
                    borderRadius={"8px"}
                    boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                    p={{ base: "16px", md: "20px" }}
                >
                    <Text fontSize={"lg"} fontWeight={"900"} color={"#102a43"}>Series registradas</Text>
                    <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Ordem original do treinamento.</Text>

                    {treinamento.series.length === 0 ? (
                        <Text mt={"16px"} color={"#627d98"}>Nenhuma serie registrada neste treinamento.</Text>
                    ) : (
                        <Flex direction={"column"} gap={"10px"} mt={"16px"}>
                            {treinamento.series.map((serie, index) => {
                                const exercicio = exercicioById.get(serie.exercicioId);

                                return (
                                    <Box key={serie.id} border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"} p={"12px"} bg={"#ffffff"}>
                                        <Flex justify={"space-between"} align={"flex-start"} gap={"12px"} wrap={"wrap"}>
                                            <Box flex={"1 1 180px"}>
                                                <Text color={"#627d98"} fontSize={"xs"} fontWeight={"800"} textTransform={"uppercase"}>
                                                    Serie {index + 1}
                                                </Text>
                                                <Text fontWeight={"800"} color={"#243b53"}>
                                                    {exercicio?.name || "Exercicio removido"}
                                                </Text>
                                                <Flex align={"center"} gap={"6px"} mt={"4px"} color={"#627d98"} fontSize={"sm"}>
                                                    <FiClock />
                                                    <Text>{formatSerieTime(serie.createdAt)}</Text>
                                                </Flex>
                                            </Box>

                                            <Flex gap={"8px"} wrap={"wrap"} justify={{ base: "flex-start", sm: "flex-end" }}>
                                                <Flex align={"center"} gap={"6px"} px={"10px"} py={"6px"} borderRadius={"8px"} bg={"#edf7f2"} color={"#1f7a5b"} fontWeight={"900"}>
                                                    <FiList />
                                                    <Text>{serie.magnitude} {exercicio?.unMedida.abv || ""}</Text>
                                                </Flex>
                                                <Box px={"10px"} py={"6px"} borderRadius={"8px"} bg={"#f8fafc"} color={"#334e68"} fontWeight={"800"}>
                                                    {serie.execucoes} execucoes
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </Flex>
                    )}
                </Box>
            </Flex>
        );
    }

    return (
        <MainLayout
            title="Detalhe"
            icon={<FiArrowLeft size={"24px"}/>}
            iconFunc={handleBackToHistory}
        >
            {renderState()}
        </MainLayout>
    );
}

export default TrainingHistoryDetails;
