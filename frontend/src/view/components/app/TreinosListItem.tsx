import { Flex, Text } from "@chakra-ui/react"
import { GrFormNextLink } from "react-icons/gr"

interface ITrainingListItem {
    onClickRedirect: () => void,
    name: string,
    disabled?: boolean
}

const TreinosListItem = ({onClickRedirect, name, disabled}: ITrainingListItem) => {
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
                onClick={() => !disabled && onClickRedirect()}
                cursor={disabled ? "not-allowed" : "pointer"}
                opacity={disabled ? .5 : 1}
            >
                <GrFormNextLink size={"36px"} color="blue"/>
            </Flex>
            
        </Flex>
    )
}

export default TreinosListItem
