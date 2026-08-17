import { Box, Button, Flex, Input, NativeSelect, Table, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router";
import { TreinamentoClient } from "../../client/treinamento.client";
import { TreinoClient } from "../../client/treino.client";
import type { SerieRequestDTO } from "../../client/DTOs/requests/SerieRequestDTO";
import { currentTreinamentoRepository } from "../../repositories/currentTreinamentoRepository";
import { STORAGE_KEYS } from "../../utils/constants/storageKeys/storageKeys";
import { formatToLocalDate } from "../../utils/functions/date/formatToLocalDate";
import MainLayout from "../layouts/MainLayout";

const Training = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTraining, setCurrentTraining] = useState(currentTreinamentoRepository.get());
    const [exercicioId, setExercicioId] = useState("");
    const [magnitude, setMagnitude] = useState("");
    const [execucoes, setExecucoes] = useState("");

    useEffect(() => {
        if (!currentTraining) {
            navigate("/");
        }
    }, [currentTraining, navigate]);

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
            currentTreinamentoRepository.clear();
            queryClient.invalidateQueries({ queryKey: STORAGE_KEYS.HISTORY_TREINAMENTOS_LIST_CACHE_KEY });
            setCurrentTraining(null);
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
            icon={<IoMdExit size={"36px"}/>}
            iconFunc={handleHeaderIconClick}
        >
            <Flex flexDir={"column"} pb={"20px"}>
                <Flex mx={"20px"} my={"10px"} justify={"space-between"} align={"center"} gap={"10px"} wrap={"wrap"}>
                    <Box>
                        <Text as={"h1"} fontWeight={"bold"} fontSize={"1.5rem"}>
                            {currentTraining?.treinoName || "Treinamento"}
                        </Text>
                        {currentTraining && (
                            <Text fontSize={"smaller"}>
                                Inicio: {formatToLocalDate(currentTraining.startedAt)}
                            </Text>
                        )}
                    </Box>

                    <Button
                        colorPalette={"blue"}
                        onClick={() => finishTreinamentoMutation.mutate()}
                        disabled={!currentTraining || finishTreinamentoMutation.isPending}
                    >
                        {finishTreinamentoMutation.isPending ? "Finalizando..." : "Finalizar"}
                    </Button>
                </Flex>

                <Box mx={"20px"} my={"10px"}>
                    <Text fontSize={"1.3rem"}>Registrar serie</Text>
                    <Flex gap={"10px"} mt={"10px"} wrap={"wrap"} align={"end"}>
                        <Box flex={"1 1 220px"}>
                            <Text fontSize={"smaller"} mb={"4px"}>Exercicio</Text>
                            <NativeSelect.Root disabled={treinoQuery.isLoading || exercicios.length === 0}>
                                <NativeSelect.Field
                                    value={exercicioId}
                                    onChange={(event) => setExercicioId(event.target.value)}
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
                            <Text fontSize={"smaller"} mb={"4px"}>Carga</Text>
                            <Input
                                type="number"
                                min={0}
                                step="0.01"
                                value={magnitude}
                                onChange={(event) => setMagnitude(event.target.value)}
                            />
                        </Box>

                        <Box flex={"1 1 120px"}>
                            <Text fontSize={"smaller"} mb={"4px"}>Execucoes</Text>
                            <Input
                                type="number"
                                min={1}
                                step={1}
                                value={execucoes}
                                onChange={(event) => setExecucoes(event.target.value)}
                            />
                        </Box>

                        <Button
                            colorPalette={"blue"}
                            onClick={handleCreateSerie}
                            disabled={createSerieMutation.isPending || !exercicioId || !magnitude || !execucoes}
                        >
                            {createSerieMutation.isPending ? "Salvando..." : "Salvar serie"}
                        </Button>
                    </Flex>
                    {createSerieMutation.error && (
                        <Text mt={"8px"} color={"red.600"}>Nao foi possivel salvar a serie.</Text>
                    )}
                </Box>

                <Box mx={"20px"} my={"10px"}>
                    <Text fontSize={"1.3rem"}>Series registradas</Text>
                    <Box maxHeight={"240px"} overflow={"auto"} mt={"10px"}>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Exercicio</Table.ColumnHeader>
                                    <Table.ColumnHeader>Carga</Table.ColumnHeader>
                                    <Table.ColumnHeader>Execucoes</Table.ColumnHeader>
                                    <Table.ColumnHeader>Hora</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {seriesQuery.data?.map((serie) => (
                                    <Table.Row key={serie.id}>
                                        <Table.Cell>{serie.exercicio.name}</Table.Cell>
                                        <Table.Cell>{serie.magnitude} {serie.exercicio.unMedida.abv}</Table.Cell>
                                        <Table.Cell>{serie.execucoes}</Table.Cell>
                                        <Table.Cell>{serie.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        {!seriesQuery.isLoading && seriesQuery.data?.length === 0 && (
                            <Text mt={"10px"}>Nenhuma serie registrada.</Text>
                        )}
                    </Box>
                </Box>

                <Box mx={"20px"} my={"10px"}>
                    <Text fontSize={"1.3rem"}>Exercicios da ficha</Text>
                    <Box maxHeight={"200px"} overflow={"auto"} mt={"10px"}>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
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
                    {treinoQuery.error && <Text mt={"10px"} color={"red.600"}>Nao foi possivel carregar a ficha.</Text>}
                </Box>
            </Flex>
        </MainLayout>
    )
}

export default Training
