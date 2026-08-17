import { Button, Flex, Text } from "@chakra-ui/react"
import { FiPlay } from "react-icons/fi"

interface ITrainingListItem {
    onClickRedirect: () => void,
    name: string,
    disabled?: boolean
}

const TreinosListItem = ({onClickRedirect, name, disabled}: ITrainingListItem) => {
    return (
        <Flex
            w="100%"
            px={"14px"}
            py={"12px"}
            borderRadius={"8px"}
            border={"1px solid"}
            borderColor={"#e6edf5"}
            bg={"#fbfdff"}
            justifyContent={"space-between"}
            align={"center"}
            gap={"12px"}
        >
            <Text fontWeight={"800"} color={"#243b53"} lineClamp={1}>{name}</Text>
            <Button
                size={"sm"}
                variant={"outline"}
                borderColor={"#b7d8cc"}
                color={"#1f7a5b"}
                onClick={() => !disabled && onClickRedirect()}
                cursor={disabled ? "not-allowed" : "pointer"}
                opacity={disabled ? .5 : 1}
            >
                <FiPlay /> Iniciar
            </Button>
            
        </Flex>
    )
}

export default TreinosListItem
