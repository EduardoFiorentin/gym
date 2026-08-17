import { Flex, Text } from "@chakra-ui/react"
import { GrFormNextLink } from "react-icons/gr";
import BaseContainer from "./BaseContainer";

interface ICurrentTraining {
    id: string,
    treinoName: string
}


const CurrentTreinoComponent = ({training, onClickRedirect}: {training: ICurrentTraining | null, onClickRedirect: () => void}) => {
    return (
        <BaseContainer
            height={"70px"}
            direction="row"
            verticalAlign="center"
        >
            <Flex direction={"column"}>
                <Text fontSize={"smaller"}>{training ? "Treinamento em andamento" : "Nenhum treino em andamento"}</Text>
                {training && 
                    <Text fontSize={"xl"} fontWeight={"bold"}>{training.treinoName}</Text>}
            </Flex>
            {
            training && 
                <Flex 
                    border={"2px solid blue"}
                    borderRadius={"100%"}
                    onClick={onClickRedirect}
                    cursor={"pointer"}
                >
                    <GrFormNextLink size={"36px"} color="blue"/>
                </Flex>
            }
        </BaseContainer>
    )
}

export default CurrentTreinoComponent
