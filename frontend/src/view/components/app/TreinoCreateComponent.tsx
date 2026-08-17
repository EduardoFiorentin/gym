import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTreinos } from "../../../hooks/useTreinos";
import BaseContainer from "./BaseContainer";

const emptyExercises = [""] as string[];

const TreinoCreateComponent = () => {
    const { createTreino, isCreating, createError } = useTreinos();
    const [name, setName] = useState("");
    const [exercicios, setExercicios] = useState<string[]>(emptyExercises);

    const handleExercicioChange = (index: number, value: string) => {
        setExercicios((current) => current.map((exercicio, currentIndex) => {
            return currentIndex === index ? value : exercicio;
        }));
    }

    const addExercicio = () => {
        setExercicios((current) => [...current, ""]);
    }

    const removeExercicio = (index: number) => {
        setExercicios((current) => {
            if (current.length === 1) return current;
            return current.filter((_, currentIndex) => currentIndex !== index);
        });
    }

    const handleSubmit = async () => {
        const exerciciosPayload = exercicios
            .map((exercicio) => exercicio.trim())
            .filter(Boolean)
            .map((exercicio) => ({ name: exercicio }));

        if (!name.trim() || exerciciosPayload.length === 0) return;

        await createTreino({
            name: name.trim(),
            exercicios: exerciciosPayload
        });

        setName("");
        setExercicios(emptyExercises);
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
                pb={"5px"}
            >
                <Text fontWeight={"bolder"}>Cadastrar ficha</Text>
            </Box>

            <Flex direction={"column"} gap={"10px"} w={"100%"} mt={"12px"}>
                <Input
                    placeholder="Nome do treino"
                    value={name}
                    maxLength={25}
                    onChange={(event) => setName(event.target.value)}
                />

                {exercicios.map((exercicio, index) => (
                    <Flex key={index} gap={"8px"} w={"100%"}>
                        <Input
                            placeholder={`Exercicio ${index + 1}`}
                            value={exercicio}
                            onChange={(event) => handleExercicioChange(index, event.target.value)}
                        />
                        <Button
                            variant={"outline"}
                            onClick={() => removeExercicio(index)}
                            disabled={exercicios.length === 1 || isCreating}
                        >
                            Remover
                        </Button>
                    </Flex>
                ))}

                {createError && <Text color={"red.600"}>Nao foi possivel cadastrar a ficha.</Text>}

                <Flex justify={"space-between"} gap={"10px"} wrap={"wrap"}>
                    <Button
                        variant={"outline"}
                        onClick={addExercicio}
                        disabled={isCreating}
                    >
                        Adicionar exercicio
                    </Button>
                    <Button
                        colorPalette={"blue"}
                        onClick={handleSubmit}
                        disabled={isCreating || !name.trim() || exercicios.every((exercicio) => !exercicio.trim())}
                    >
                        {isCreating ? "Salvando..." : "Salvar ficha"}
                    </Button>
                </Flex>
            </Flex>
        </BaseContainer>
    );
}

export default TreinoCreateComponent;
