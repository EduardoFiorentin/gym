import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useTreinos } from "../../../hooks/useTreinos";
import BaseContainer from "./BaseContainer";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";

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
            <Box width={"100%"}>
                <Text fontWeight={"900"} color={"#102a43"} fontSize={"lg"}>Cadastrar ficha</Text>
                <Text color={"#627d98"} fontSize={"sm"} mt={"2px"}>Monte uma rotina simples para iniciar execuções rapidamente.</Text>
            </Box>

            <Flex direction={"column"} gap={"12px"} w={"100%"}>
                <Input
                    placeholder="Nome do treino"
                    value={name}
                    maxLength={25}
                    h={"44px"}
                    borderColor={"#bcccdc"}
                    _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                    onChange={(event) => setName(event.target.value)}
                />

                {exercicios.map((exercicio, index) => (
                    <Flex key={index} gap={"8px"} w={"100%"} align={"center"}>
                        <Input
                            placeholder={`Exercicio ${index + 1}`}
                            value={exercicio}
                            h={"44px"}
                            minW={0}
                            borderColor={"#bcccdc"}
                            _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                            onChange={(event) => handleExercicioChange(index, event.target.value)}
                        />
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            color={"#b42318"}
                            borderColor={"#f2b8b5"}
                            minW={"44px"}
                            minH={"44px"}
                            px={{ base: "10px", sm: "12px" }}
                            onClick={() => removeExercicio(index)}
                            disabled={exercicios.length === 1 || isCreating}
                        >
                            <FiTrash2 />
                            <Text display={{ base: "none", sm: "inline" }}>Remover</Text>
                        </Button>
                    </Flex>
                ))}

                {createError && <Text color={"#b42318"} fontSize={"sm"} fontWeight={"600"}>Nao foi possivel cadastrar a ficha.</Text>}

                <Flex justify={"space-between"} gap={"10px"} wrap={"wrap"}>
                    <Button
                        variant={"outline"}
                        w={{ base: "100%", sm: "auto" }}
                        minH={"44px"}
                        borderColor={"#bcccdc"}
                        color={"#334e68"}
                        onClick={addExercicio}
                        disabled={isCreating}
                    >
                        <FiPlus /> Adicionar exercicio
                    </Button>
                    <Button
                        bg={"#1f7a5b"}
                        w={{ base: "100%", sm: "auto" }}
                        minH={"44px"}
                        color={"white"}
                        _hover={{ bg: "#176448" }}
                        onClick={handleSubmit}
                        disabled={isCreating || !name.trim() || exercicios.every((exercicio) => !exercicio.trim())}
                    >
                        <FiSave /> {isCreating ? "Salvando..." : "Salvar ficha"}
                    </Button>
                </Flex>
            </Flex>
        </BaseContainer>
    );
}

export default TreinoCreateComponent;
