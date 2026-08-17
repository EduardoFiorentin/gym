import { Box, Button, Flex, Input, NativeSelect, SimpleGrid, Table, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { TreinamentoClient } from "../../client/treinamento.client";
import { TreinoClient } from "../../client/treino.client";
import type { SerieRequestDTO } from "../../client/DTOs/requests/SerieRequestDTO";
import { STORAGE_KEYS } from "../../utils/constants/storageKeys/storageKeys";
import { formatToLocalDate } from "../../utils/functions/date/formatToLocalDate";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import { FiCheckCircle, FiPlus } from "react-icons/fi";

const Training = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { userInfo, isInitializing: isAuthInitializing } = useAuth();
    const [exercicioId, setExercicioId] = useState("");
    const [magnitude, setMagnitude] = useState("");
    const [execucoes, setExecucoes] = useState("");

    const currentTrainingQuery = useQuery({
        queryKey: STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY,
        queryFn: TreinamentoClient.getCurrentTreinamento,
        enabled: !!userInfo,
        retry: false
    });

    const currentTraining = currentTrainingQuery.data;

    useEffect(() => {
        if (!isAuthInitializing && userInfo === null) {
            navigate("/login", { replace: true });
        }
    }, [isAuthInitializing, navigate, userInfo]);

    useEffect(() => {
        if (!isAuthInitializing && userInfo && !currentTrainingQuery.isLoading && !currentTraining) {
            navigate("/", { replace: true });
        }
    }, [currentTraining, currentTrainingQuery.isLoading, isAuthInitializing, navigate, userInfo]);

    const treinoQuery = useQuery({
        queryKey: [STORAGE_KEYS.TREINO_DETAILS_CACHE_KEY, currentTraining?.treinoId],
        queryFn: () => TreinoClient.getTreino(currentTraining!.treinoId),
        enabled: !!currentTraining
    });

    const seriesQuery = useQuery({
        queryKey: [STORAGE_KEYS.TREINAMENTO_SERIES_CACHE_KEY, currentTraining?.id],
        queryFn: () => TreinamentoClient.getSeries(currentTraining!.id),
        enabled: !!currentTraining
    });

    const exercicios = useMemo(() => treinoQuery.data?.exercicios || [], [treinoQuery.data]);

    useEffect(() => {
        if (!exercicioId && exercicios.length > 0) {
            setExercicioId(exercicios[0].id);
        }
    }, [exercicioId, exercicios]);

    const createSerieMutation = useMutation({
        mutationFn: (payload: SerieRequestDTO) => TreinamentoClient.createSerie(currentTraining!.id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STORAGE_KEYS.TREINAMENTO_SERIES_CACHE_KEY, currentTraining?.id] });
            setMagnitude("");
            setExecucoes("");
        }
    });

    const finishTreinamentoMutation = useMutation({
        mutationFn: () => TreinamentoClient.finishTreinamento(currentTraining!.id),
        onSuccess: () => {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, null);
            queryClient.invalidateQueries({ queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY });
            navigate("/");
        }
    });

    const handleHeaderIconClick = () => {
        navigate("/");
    }

    const handleCreateSerie = async () => {
        const parsedMagnitude = Number(magnitude);
        const parsedExecucoes = Number(execucoes);

        if (!exercicioId || Number.isNaN(parsedMagnitude) || Number.isNaN(parsedExecucoes)) return;
        if (parsedMagnitude < 0 || parsedExecucoes <= 0) return;

        await createSerieMutation.mutateAsync({
            exercicioId,
            magnitude: parsedMagnitude,
            execucoes: parsedExecucoes
        });
    }

    return (
        <MainLayout
            title="Treinamento"
            icon={<IoMdExit size={"28px"}/>}
            iconFunc={handleHeaderIconClick}
        >
            <Flex flexDir={"column"} gap={"16px"} pb={"20px"}>
                <Flex
                    bg={"white"}
                    border={"1px solid"}
                    borderColor={"#dde6f0"}
                    borderRadius={"8px"}
                    boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                    p={{ base: "16px", md: "20px" }}
                    justify={"space-between"}
                    align={"center"}
                    gap={"14px"}
                    wrap={"wrap"}
                >
                    <Box>
                        <Text color={"#1f7a5b"} fontSize={"xs"} fontWeight={"800"} textTransform={"uppercase"}>
                            Execucao ativa
                        </Text>
                        <Text as={"h1"} fontWeight={"900"} fontSize={{ base: "2xl", md: "3xl" }} color={"#102a43"}>
                            {currentTraining?.treinoName || "Treinamento"}
                        </Text>
                        {currentTraining && (
                            <Text fontSize={"sm"} color={"#627d98"} mt={"4px"}>
                                Inicio: {formatToLocalDate(currentTraining.startedAt)}
                            </Text>
                        )}
                    </Box>

                    <Button
                        bg={"#1f7a5b"}
                        color={"white"}
                        _hover={{ bg: "#176448" }}
                        onClick={() => finishTreinamentoMutation.mutate()}
                        disabled={!currentTraining || finishTreinamentoMutation.isPending}
                    >
                        <FiCheckCircle /> {finishTreinamentoMutation.isPending ? "Finalizando..." : "Finalizar"}
                    </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, lg: 2 }} gap={"16px"}>
                    <Box
                        bg={"white"}
                        border={"1px solid"}
                        borderColor={"#dde6f0"}
                        borderRadius={"8px"}
                        boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                        p={{ base: "16px", md: "20px" }}
                    >
                        <Text fontSize={"lg"} fontWeight={"900"} color={"#102a43"}>Registrar serie</Text>
                        <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Informe exercício, carga e repetições.</Text>
                        <Flex gap={"12px"} mt={"16px"} wrap={"wrap"} align={"end"}>
                        <Box flex={"1 1 220px"}>
                            <Text fontSize={"sm"} mb={"6px"} color={"#334e68"} fontWeight={"700"}>Exercicio</Text>
                            <NativeSelect.Root disabled={treinoQuery.isLoading || exercicios.length === 0}>
                                <NativeSelect.Field
                                    value={exercicioId}
                                    onChange={(event) => setExercicioId(event.target.value)}
                                    borderColor={"#bcccdc"}
                                >
                                    {exercicios.map((exercicio) => (
                                        <option key={exercicio.id} value={exercicio.id}>
                                            {exercicio.name}
                                        </option>
                                    ))}
                                </NativeSelect.Field>
                            </NativeSelect.Root>
                        </Box>

                        <Box flex={"1 1 120px"}>
                            <Text fontSize={"sm"} mb={"6px"} color={"#334e68"} fontWeight={"700"}>Carga</Text>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={magnitude}
                                borderColor={"#bcccdc"}
                                _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                onChange={(event) => setMagnitude(event.target.value)}
                            />
                        </Box>

                        <Box flex={"1 1 120px"}>
                            <Text fontSize={"sm"} mb={"6px"} color={"#334e68"} fontWeight={"700"}>Execucoes</Text>
                            <Input
                                type="number"
                                min={1}
                                step={1}
                                value={execucoes}
                                borderColor={"#bcccdc"}
                                _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                onChange={(event) => setExecucoes(event.target.value)}
                            />
                        </Box>

                        <Button
                            bg={"#1f7a5b"}
                            color={"white"}
                            _hover={{ bg: "#176448" }}
                            onClick={handleCreateSerie}
                            disabled={createSerieMutation.isPending || !exercicioId || !magnitude || !execucoes}
                        >
                            <FiPlus /> {createSerieMutation.isPending ? "Salvando..." : "Salvar serie"}
                        </Button>
                    </Flex>
                    {createSerieMutation.error && (
                        <Text mt={"10px"} color={"#b42318"} fontWeight={"600"}>Nao foi possivel salvar a serie.</Text>
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
                        <Text fontSize={"lg"} fontWeight={"900"} color={"#102a43"}>Exercicios da ficha</Text>
                        <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Movimentos disponiveis para registrar series.</Text>
                        <Box maxHeight={"260px"} overflow={"auto"} mt={"16px"} border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"}>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg={"#f8fafc"}>
                                    <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                    <Table.ColumnHeader>Unidade</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {exercicios.map((exercicio) => (
                                    <Table.Row key={exercicio.id}>
                                        <Table.Cell>{exercicio.name}</Table.Cell>
                                        <Table.Cell>{exercicio.unMedida.abv}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        </Box>
                        {treinoQuery.error && <Text mt={"10px"} color={"#b42318"} fontWeight={"600"}>Nao foi possivel carregar a ficha.</Text>}
                    </Box>
                </SimpleGrid>

                <Box
                    bg={"white"}
                    border={"1px solid"}
                    borderColor={"#dde6f0"}
                    borderRadius={"8px"}
                    boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
                    p={{ base: "16px", md: "20px" }}
                >
                    <Text fontSize={"lg"} fontWeight={"900"} color={"#102a43"}>Series registradas</Text>
                    <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Acompanhe o volume feito nesta execução.</Text>
                    <Box maxHeight={"300px"} overflow={"auto"} mt={"16px"} border={"1px solid"} borderColor={"#e6edf5"} borderRadius={"8px"}>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row bg={"#f8fafc"}>
                                    <Table.ColumnHeader>Exercicio</Table.ColumnHeader>
                                    <Table.ColumnHeader>Carga</Table.ColumnHeader>
                                    <Table.ColumnHeader>Execucoes</Table.ColumnHeader>
                                    <Table.ColumnHeader>Hora</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {seriesQuery.data?.map((serie) => (
                                    <Table.Row key={serie.id}>
                                        <Table.Cell fontWeight={"700"} color={"#243b53"}>{serie.exercicio.name}</Table.Cell>
                                        <Table.Cell>{serie.magnitude} {serie.exercicio.unMedida.abv}</Table.Cell>
                                        <Table.Cell>{serie.execucoes}</Table.Cell>
                                        <Table.Cell>{serie.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        {!seriesQuery.isLoading && seriesQuery.data?.length === 0 && (
                            <Text p={"14px"} color={"#627d98"}>Nenhuma serie registrada.</Text>
                        )}
                    </Box>
                </Box>
            </Flex>
        </MainLayout>
    )
}

export default Training
