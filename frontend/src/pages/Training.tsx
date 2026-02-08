import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";
import useLocalStorage from "../hooks/useLocalStorage";
import { Box, Flex, Table, Text } from "@chakra-ui/react";
import TrainingModel from "../models/training.model";
import { useEffect, useState } from "react";

// const items = [
//   { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
//   { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
//   { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
//   { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
//   { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
// ]

// const exercise = {
//     "_id": "",
//     "_name": "",
//     "_equipment": "",
//     "_un": "",              // unit of measurement of the equipment
//     "_num_executions": "",
//     "_last_resume": "(peso a) ex ex ex (peso b) ex"
// }

// const training = {
//     "_id": "5fac5d69-6240-401c-a1cc-ea7a7e5aa7f1",
//     "_name": "A - Costas e Triceps",
//     "_createdAt": "2026-02-07T00:33:07.513Z",
//     "_updatedAt": "2026-02-07T00:33:07.513Z",

//     "_exercises": [

//     ]
// }


const Training = () => {

    const navigate = useNavigate();
    const [value] = useLocalStorage('TREINO_EM_ANDAMENTO')
    const [training, setTraining] = useState<TrainingModel|null>(null);

    useEffect(() => {
        if (!value) return
        setTraining(TrainingModel.fromJSON(value))
    }, [value])

    const handleHeaderIconClick = () => {
        // TODO Remove login info from cache
        navigate("/")
    }

    return (
        <MainLayout 
            title="Treinamento" 
            icon={<IoMdExit size={"36px"}/>}
            iconFunc={handleHeaderIconClick}
        > 
            
            <Flex
                flexDir={"column"}
            >
                <Text 
                    as={"h1"}
                    fontWeight={"bold"}
                    ml={"20px"}
                    my={"10px"}
                    fontSize={"1.5rem"}
                    >
                        {training?.name}
                </Text>

                {/* Lista de séries */}
                <Box
                    mx={"20px"}
                    my={"10px"}
                >

                    <Text
                        fontSize={"1.3rem"}
                    >Séries</Text>
                    <Box 
                        maxHeight={"200px"}
                        overflow={"auto"}
                        >
                            
                            
                            <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                <Table.ColumnHeader>Product</Table.ColumnHeader>
                                <Table.ColumnHeader>Category</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {/* {items.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.name}</Table.Cell>
                                    <Table.Cell>{item.category}</Table.Cell>
                                    <Table.Cell textAlign="end">{item.price}</Table.Cell>
                                </Table.Row>
                                ))} */}
                            </Table.Body>
                            </Table.Root>
                    </Box>
                </Box>


                {/* Lista de exercicios */}
                 <Box
                    mx={"20px"}
                    my={"10px"}
                >

                    <Text
                        fontSize={"1.3rem"}
                    >Exercicios</Text>
                    <Box 
                        maxHeight={"200px"}
                        overflow={"auto"}
                        >
                            
                            
                            <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                <Table.ColumnHeader>Product</Table.ColumnHeader>
                                <Table.ColumnHeader>Category</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {/* {items.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{item.name}</Table.Cell>
                                    <Table.Cell>{item.category}</Table.Cell>
                                    <Table.Cell textAlign="end">{item.price}</Table.Cell>
                                </Table.Row>
                                ))} */}
                            </Table.Body>
                            </Table.Root>
                    </Box>
                </Box>


            </Flex>

        </MainLayout>
    )
}

export default Training