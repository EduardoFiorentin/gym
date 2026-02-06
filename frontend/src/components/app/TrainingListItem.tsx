import { Flex, Text } from "@chakra-ui/react"
import { GrFormNextLink } from "react-icons/gr"

interface ITrainingListItem {
    onClickRedirect: () => void,
    name: string
}

const TrainingListItem = ({onClickRedirect, name}: ITrainingListItem) => {
    return (
        <Flex
            w="100%"
            mt={"10px"}
            px="10px"
            borderRadius={"10px"}
            h={"50px"}
            border={"1px solid black"}
            justifyContent={"space-between"}
            align={"center"}
        >
            <Text>{name}</Text>
            <Flex
                border={"2px solid blue"}
                borderRadius={"100%"}
                onClick={onClickRedirect}
            >
                <GrFormNextLink size={"36px"} color="blue"/>
            </Flex>
            
        </Flex>
    )
}

export default TrainingListItem