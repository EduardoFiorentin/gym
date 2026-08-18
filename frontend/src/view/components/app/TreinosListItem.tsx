import { Button, Flex, Text } from "@chakra-ui/react"
import { FiPlay } from "react-icons/fi"

interface ITrainingListItem {
    onClickRedirect: () => void,
    name: string,
    disabled?: boolean,
    actionLabel?: string
}

const TreinosListItem = ({onClickRedirect, name, disabled, actionLabel = "Iniciar"}: ITrainingListItem) => {
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
            wrap={"wrap"}
        >
            <Text flex={"1 1 160px"} minW={0} fontWeight={"800"} color={"#243b53"} lineClamp={1}>{name}</Text>
            <Button
                size={"sm"}
                minH={"44px"}
                w={{ base: "100%", sm: "auto" }}
                variant={"outline"}
                borderColor={"#b7d8cc"}
                color={"#1f7a5b"}
                onClick={() => !disabled && onClickRedirect()}
                cursor={disabled ? "not-allowed" : "pointer"}
                opacity={disabled ? .5 : 1}
            >
                <FiPlay /> {actionLabel}
            </Button>
            
        </Flex>
    )
}

export default TreinosListItem
