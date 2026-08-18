import { Box, Button, Flex, Input, NativeSelect, SimpleGrid, Table, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { TreinamentoClient } from "../../client/treinamento.client";
import { TreinoClient } from "../../client/treino.client";
import type { SerieRequestDTO } from "../../client/DTOs/requests/SerieRequestDTO";
import type { SerieUpdateRequestDTO } from "../../client/DTOs/requests/SerieUpdateRequestDTO";
import type { SerieModel } from "../../models/Serie.model";
import { STORAGE_KEYS } from "../../utils/constants/storageKeys/storageKeys";
import { formatToLocalDate } from "../../utils/functions/date/formatToLocalDate";
import MainLayout from "../layouts/MainLayout";
import { usePreviousExercisePerformance } from "../../hooks/usePreviousExercisePerformance";
import { FiCheckCircle, FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";

interface ApiErrorResponse {
    message?: string
}

interface UpdateSerieVariables {
    serieId: string,
    payload: SerieUpdateRequestDTO
}

const parseRequiredNumber = (value: string): number | null => {
    const normalizedValue = value.trim();
    if (!normalizedValue) return null;

    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

const hasRequiredValue = (value: string): boolean => value.trim().length > 0;

const parseSerieValues = (magnitudeValue: string, execucoesValue: string): SerieUpdateRequestDTO | null => {
    const parsedMagnitude = parseRequiredNumber(magnitudeValue);
    const parsedExecucoes = parseRequiredNumber(execucoesValue);

    if (parsedMagnitude === null || parsedExecucoes === null) return null;
    if (parsedMagnitude < 0 || parsedExecucoes <= 0 || !Number.isInteger(parsedExecucoes)) return null;

    return {
        magnitude: parsedMagnitude,
        execucoes: parsedExecucoes
    };
}

const getMutationErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const responseMessage = error.response?.data?.message?.trim();
        if (responseMessage) return responseMessage;
    }

    return fallback;
}

const Training = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [exercicioId, setExercicioId] = useState("");
    const [magnitude, setMagnitude] = useState("");
    const [execucoes, setExecucoes] = useState("");
    const [editingSerieId, setEditingSerieId] = useState<string | null>(null);
    const [editMagnitude, setEditMagnitude] = useState("");
    const [editExecucoes, setEditExecucoes] = useState("");
    const [createSerieError, setCreateSerieError] = useState<string | null>(null);
    const [serieActionError, setSerieActionError] = useState<string | null>(null);
    const [finishTreinamentoError, setFinishTreinamentoError] = useState<string | null>(null);

    const currentTrainingQuery = useQuery({
        queryKey: STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY,
        queryFn: TreinamentoClient.getCurrentTreinamento,
        retry: false
    });

    const currentTraining = currentTrainingQuery.data;
    const canChangeSeries = Boolean(currentTraining && !currentTraining.finishedAt);
    const seriesQueryKey = useMemo(() => [
        STORAGE_KEYS.TREINAMENTO_SERIES_CACHE_KEY,
        currentTraining?.id
    ], [currentTraining?.id]);

    useEffect(() => {
        if (!currentTrainingQuery.isLoading && currentTraining === null) {
            navigate("/", { replace: true });
        }
    }, [currentTraining, currentTrainingQuery.isLoading, navigate]);

    const treinoQuery = useQuery({
        queryKey: [STORAGE_KEYS.TREINO_DETAILS_CACHE_KEY, currentTraining?.treinoId],
        queryFn: () => TreinoClient.getTreino(currentTraining!.treinoId),
        enabled: !!currentTraining
    });

    const seriesQuery = useQuery({
        queryKey: seriesQueryKey,
        queryFn: () => TreinamentoClient.getSeries(currentTraining!.id),
        enabled: !!currentTraining
    });

    const exercicios = useMemo(() => treinoQuery.data?.exercicios || [], [treinoQuery.data]);
    const selectedExercicio = useMemo(() => {
        return exercicios.find((exercicio) => exercicio.id === exercicioId);
    }, [exercicioId, exercicios]);

    const previousPerformanceQuery = usePreviousExercisePerformance(
        exercicioId,
        currentTraining?.id,
        Boolean(canChangeSeries && selectedExercicio)
    );

    useEffect(() => {
        if (!exercicioId && exercicios.length > 0) {
            setExercicioId(exercicios[0].id);
        }
    }, [exercicioId, exercicios]);

    const createSerieMutation = useMutation({
        mutationFn: (payload: SerieRequestDTO) => TreinamentoClient.createSerie(currentTraining!.id, payload),
        onMutate: () => {
            setCreateSerieError(null);
        },
        onSuccess: (createdSerie) => {
            queryClient.setQueryData<SerieModel[]>(seriesQueryKey, (currentSeries) => {
                return currentSeries ? [...currentSeries, createdSerie] : [createdSerie];
            });
            queryClient.invalidateQueries({ queryKey: seriesQueryKey });
            setMagnitude("");
            setExecucoes("");
        },
        onError: (error) => {
            setCreateSerieError(getMutationErrorMessage(error, "Nao foi possivel salvar a serie."));
        }
    });

    const updateSerieMutation = useMutation({
        mutationFn: ({ serieId, payload }: UpdateSerieVariables) => TreinamentoClient.updateSerie(currentTraining!.id, serieId, payload),
        onMutate: () => {
            setSerieActionError(null);
        },
        onSuccess: (updatedSerie) => {
            queryClient.setQueryData<SerieModel[]>(seriesQueryKey, (currentSeries) => {
                return currentSeries?.map((serie) => serie.id === updatedSerie.id ? updatedSerie : serie);
            });
            queryClient.invalidateQueries({ queryKey: seriesQueryKey });
            setEditingSerieId(null);
            setEditMagnitude("");
            setEditExecucoes("");
        },
        onError: (error) => {
            setSerieActionError(getMutationErrorMessage(error, "Nao foi possivel editar a serie."));
        }
    });

    const deleteSerieMutation = useMutation({
        mutationFn: (serieId: string) => TreinamentoClient.deleteSerie(currentTraining!.id, serieId),
        onMutate: () => {
            setSerieActionError(null);
        },
        onSuccess: (_data, serieId) => {
            queryClient.setQueryData<SerieModel[]>(seriesQueryKey, (currentSeries) => {
                return currentSeries?.filter((serie) => serie.id !== serieId);
            });
            queryClient.invalidateQueries({ queryKey: seriesQueryKey });
            if (editingSerieId === serieId) {
                setEditingSerieId(null);
                setEditMagnitude("");
                setEditExecucoes("");
            }
        },
        onError: (error) => {
            setSerieActionError(getMutationErrorMessage(error, "Nao foi possivel remover a serie."));
        }
    });

    const finishTreinamentoMutation = useMutation({
        mutationFn: () => TreinamentoClient.finishTreinamento(currentTraining!.id),
        onMutate: () => {
            setFinishTreinamentoError(null);
        },
        onSuccess: () => {
            queryClient.setQueryData(STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY, null);
            queryClient.invalidateQueries({ queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY });
            navigate("/");
        },
        onError: (error) => {
            setFinishTreinamentoError(getMutationErrorMessage(error, "Nao foi possivel finalizar o treinamento."));
            queryClient.invalidateQueries({ queryKey: STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY });
            queryClient.invalidateQueries({ queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY });
        }
    });

    const handleHeaderIconClick = () => {
        navigate("/");
    }

    const handleCreateSerie = () => {
        const parsedSerieValues = parseSerieValues(magnitude, execucoes);

        if (!exercicioId || !parsedSerieValues) {
            setCreateSerieError("Informe exercicio, carga valida e execucoes inteiras maiores que zero.");
            return;
        }

        createSerieMutation.mutate({
            exercicioId,
            magnitude: parsedSerieValues.magnitude,
            execucoes: parsedSerieValues.execucoes
        });
    }

    const handleStartEditSerie = (serie: SerieModel) => {
        setSerieActionError(null);
        setEditingSerieId(serie.id);
        setEditMagnitude(String(serie.magnitude));
        setEditExecucoes(String(serie.execucoes));
    }

    const handleCancelEditSerie = () => {
        setEditingSerieId(null);
        setEditMagnitude("");
        setEditExecucoes("");
        setSerieActionError(null);
    }

    const handleUpdateSerie = (serieId: string) => {
        const parsedSerieValues = parseSerieValues(editMagnitude, editExecucoes);

        if (!parsedSerieValues) {
            setSerieActionError("Informe carga valida e execucoes inteiras maiores que zero.");
            return;
        }

        updateSerieMutation.mutate({
            serieId,
            payload: parsedSerieValues
        });
    }

    const handleDeleteSerie = (serieId: string) => {
        if (!canChangeSeries || deleteSerieMutation.isPending) return;
        deleteSerieMutation.mutate(serieId);
    }

    const isSerieMutationPending = updateSerieMutation.isPending || deleteSerieMutation.isPending;
    const selectedUnidadeAbv = selectedExercicio?.unMedida.abv || "";

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

                    <Box>
                        <Button
                            bg={"#1f7a5b"}
                            color={"white"}
                            _hover={{ bg: "#176448" }}
                            onClick={() => finishTreinamentoMutation.mutate()}
                            disabled={!canChangeSeries || finishTreinamentoMutation.isPending}
                        >
                            <FiCheckCircle /> {finishTreinamentoMutation.isPending ? "Finalizando..." : "Finalizar"}
                        </Button>
                        {finishTreinamentoError && (
                            <Text mt={"8px"} color={"#b42318"} fontSize={"sm"} fontWeight={"600"} maxW={"280px"}>
                                {finishTreinamentoError}
                            </Text>
                        )}
                    </Box>
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
                            <NativeSelect.Root disabled={!canChangeSeries || treinoQuery.isLoading || exercicios.length === 0 || createSerieMutation.isPending}>
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
                                disabled={!canChangeSeries || createSerieMutation.isPending}
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
                                disabled={!canChangeSeries || createSerieMutation.isPending}
                                onChange={(event) => setExecucoes(event.target.value)}
                            />
                        </Box>

                        <Button
                            bg={"#1f7a5b"}
                            color={"white"}
                            _hover={{ bg: "#176448" }}
                            onClick={handleCreateSerie}
                            disabled={!canChangeSeries || createSerieMutation.isPending || !exercicioId || !hasRequiredValue(magnitude) || !hasRequiredValue(execucoes)}
                        >
                            <FiPlus /> {createSerieMutation.isPending ? "Salvando..." : "Salvar serie"}
                        </Button>
                    </Flex>

                    {selectedExercicio && (
                        <Box
                            mt={"14px"}
                            border={"1px solid"}
                            borderColor={"#e6edf5"}
                            borderRadius={"8px"}
                            bg={"#f8fafc"}
                            p={"12px"}
                        >
                            <Flex justify={"space-between"} align={"flex-start"} gap={"10px"} wrap={"wrap"}>
                                <Box>
                                    <Text color={"#334e68"} fontSize={"sm"} fontWeight={"900"}>Ultimo desempenho</Text>
                                    <Text color={"#627d98"} fontSize={"xs"} mt={"1px"}>{selectedExercicio.name}</Text>
                                </Box>
                                {previousPerformanceQuery.previousPerformance && (
                                    <Text color={"#627d98"} fontSize={"xs"} fontWeight={"700"}>
                                        {formatToLocalDate(previousPerformanceQuery.previousPerformance.finishedAt)}
                                    </Text>
                                )}
                            </Flex>

                            {previousPerformanceQuery.isLoading ? (
                                <Text mt={"10px"} color={"#627d98"} fontSize={"sm"}>Buscando referencia anterior...</Text>
                            ) : previousPerformanceQuery.error ? (
                                <Text mt={"10px"} color={"#b42318"} fontSize={"sm"} fontWeight={"600"}>
                                    Nao foi possivel carregar a referencia. Voce ainda pode registrar a serie atual.
                                </Text>
                            ) : previousPerformanceQuery.isFetched && !previousPerformanceQuery.previousPerformance ? (
                                <Text mt={"10px"} color={"#627d98"} fontSize={"sm"}>
                                    Nenhum desempenho anterior para este exercicio.
                                </Text>
                            ) : previousPerformanceQuery.previousPerformance ? (
                                <Flex mt={"10px"} direction={"column"} gap={"8px"}>
                                    {previousPerformanceQuery.previousPerformance.series.map((serie, index) => (
                                        <Flex
                                            key={serie.id}
                                            justify={"space-between"}
                                            align={"center"}
                                            gap={"10px"}
                                            wrap={"wrap"}
                                            border={"1px solid"}
                                            borderColor={"#edf2f7"}
                                            borderRadius={"8px"}
                                            bg={"white"}
                                            px={"10px"}
                                            py={"8px"}
                                        >
                                            <Text color={"#627d98"} fontSize={"sm"} fontWeight={"800"}>
                                                Serie {index + 1}
                                            </Text>
                                            <Flex gap={"10px"} wrap={"wrap"} justify={{ base: "flex-start", sm: "flex-end" }}>
                                                <Text color={"#102a43"} fontSize={"sm"} fontWeight={"900"}>
                                                    {serie.magnitude} {selectedUnidadeAbv}
                                                </Text>
                                                <Text color={"#334e68"} fontSize={"sm"} fontWeight={"700"}>
                                                    {serie.execucoes} execucoes
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            ) : null}
                        </Box>
                    )}

                    {createSerieError && (
                        <Text mt={"10px"} color={"#b42318"} fontWeight={"600"}>{createSerieError}</Text>
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
                    {serieActionError && (
                        <Text mt={"10px"} color={"#b42318"} fontWeight={"600"}>{serieActionError}</Text>
                    )}
                    <Box
                        maxHeight={"340px"}
                        overflowY={"auto"}
                        mt={"16px"}
                        border={"1px solid"}
                        borderColor={"#e6edf5"}
                        borderRadius={"8px"}
                        p={"10px"}
                    >
                        {seriesQuery.isLoading ? (
                            <Text color={"#627d98"}>Carregando series...</Text>
                        ) : seriesQuery.error ? (
                            <Text color={"#b42318"} fontWeight={"600"}>Nao foi possivel carregar as series.</Text>
                        ) : seriesQuery.data?.length === 0 ? (
                            <Text color={"#627d98"}>Nenhuma serie registrada.</Text>
                        ) : (
                            <Flex direction={"column"} gap={"10px"}>
                                {seriesQuery.data?.map((serie) => {
                                    const isEditing = editingSerieId === serie.id;
                                    const showEditForm = isEditing && canChangeSeries;

                                    return (
                                        <Box
                                            key={serie.id}
                                            border={"1px solid"}
                                            borderColor={showEditForm ? "#9ae6b4" : "#e6edf5"}
                                            borderRadius={"8px"}
                                            p={{ base: "12px", md: "14px" }}
                                            bg={showEditForm ? "#f0fff4" : "#ffffff"}
                                        >
                                            <Flex justify={"space-between"} gap={"12px"} align={"flex-start"} wrap={"wrap"}>
                                                <Box flex={"1 1 180px"}>
                                                    <Text fontWeight={"800"} color={"#243b53"}>{serie.exercicio.name}</Text>
                                                    <Text fontSize={"sm"} color={"#627d98"}>
                                                        {serie.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                                    </Text>
                                                </Box>

                                                {!showEditForm && (
                                                    <Flex gap={"8px"} align={"center"} wrap={"wrap"} justify={{ base: "flex-start", sm: "flex-end" }}>
                                                        <Text fontWeight={"800"} color={"#102a43"}>
                                                            {serie.magnitude} {serie.exercicio.unMedida.abv}
                                                        </Text>
                                                        <Text color={"#627d98"}>{serie.execucoes} execucoes</Text>
                                                        {canChangeSeries && (
                                                            <>
                                                                <Button
                                                                    size={"sm"}
                                                                    variant={"outline"}
                                                                    borderColor={"#bcccdc"}
                                                                    color={"#334e68"}
                                                                    disabled={isSerieMutationPending}
                                                                    onClick={() => handleStartEditSerie(serie)}
                                                                >
                                                                    <FiEdit2 />
                                                                    <Text display={{ base: "none", sm: "inline" }}>Editar</Text>
                                                                </Button>
                                                                <Button
                                                                    size={"sm"}
                                                                    variant={"outline"}
                                                                    color={"#b42318"}
                                                                    borderColor={"#f2b8b5"}
                                                                    disabled={isSerieMutationPending}
                                                                    onClick={() => handleDeleteSerie(serie.id)}
                                                                >
                                                                    <FiTrash2 />
                                                                    <Text display={{ base: "none", sm: "inline" }}>
                                                                        {deleteSerieMutation.isPending ? "Removendo..." : "Remover"}
                                                                    </Text>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Flex>
                                                )}
                                            </Flex>

                                            {showEditForm && (
                                                <Flex gap={"10px"} mt={"12px"} align={"end"} wrap={"wrap"}>
                                                    <Box flex={"1 1 120px"}>
                                                        <Text fontSize={"sm"} mb={"6px"} color={"#334e68"} fontWeight={"700"}>Carga</Text>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step="0.01"
                                                            value={editMagnitude}
                                                            borderColor={"#9ae6b4"}
                                                            bg={"white"}
                                                            _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                                            disabled={updateSerieMutation.isPending}
                                                            onChange={(event) => setEditMagnitude(event.target.value)}
                                                        />
                                                    </Box>

                                                    <Box flex={"1 1 120px"}>
                                                        <Text fontSize={"sm"} mb={"6px"} color={"#334e68"} fontWeight={"700"}>Execucoes</Text>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            step={1}
                                                            value={editExecucoes}
                                                            borderColor={"#9ae6b4"}
                                                            bg={"white"}
                                                            _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                                            disabled={updateSerieMutation.isPending}
                                                            onChange={(event) => setEditExecucoes(event.target.value)}
                                                        />
                                                    </Box>

                                                    <Text color={"#627d98"} fontWeight={"700"} pb={{ base: "0", sm: "9px" }}>
                                                        {serie.exercicio.unMedida.abv}
                                                    </Text>

                                                    <Flex gap={"8px"} wrap={"wrap"}>
                                                        <Button
                                                            size={"sm"}
                                                            bg={"#1f7a5b"}
                                                            color={"white"}
                                                            _hover={{ bg: "#176448" }}
                                                            disabled={updateSerieMutation.isPending || deleteSerieMutation.isPending || !hasRequiredValue(editMagnitude) || !hasRequiredValue(editExecucoes)}
                                                            onClick={() => handleUpdateSerie(serie.id)}
                                                        >
                                                            <FiSave /> {updateSerieMutation.isPending ? "Salvando..." : "Salvar"}
                                                        </Button>
                                                        <Button
                                                            size={"sm"}
                                                            variant={"outline"}
                                                            borderColor={"#bcccdc"}
                                                            color={"#334e68"}
                                                            disabled={updateSerieMutation.isPending}
                                                            onClick={handleCancelEditSerie}
                                                        >
                                                            <FiX /> Cancelar
                                                        </Button>
                                                    </Flex>
                                                </Flex>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Flex>
                        )}
                    </Box>
                </Box>
            </Flex>
        </MainLayout>
    )
}

export default Training
