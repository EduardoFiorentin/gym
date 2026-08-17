import { Button, Flex, Text } from "@chakra-ui/react"
import { FiChevronRight } from "react-icons/fi"
import { formatDateTo_MM_DD_AAAA } from "../../../utils/functions/date/formatDateTo_MM_DD_AAAA"


interface ITrainingHistoryItem {
    name: string,
    date: Date,
    onClick: () => void
}

const TreinosHistoryItem = ({name, date, onClick}: ITrainingHistoryItem) => {
    return (
        <Button
            type="button"
            w="100%"
            h={"auto"}
            px={"14px"}
            py={"12px"}
            borderRadius={"8px"}
            border={"1px solid"}
            borderColor={"#e6edf5"}
            bg={"#fbfdff"}
            justifyContent={"space-between"}
            gap={"12px"}
            variant={"outline"}
            onClick={onClick}
            _hover={{ bg: "#f2f7fd", borderColor: "#bcccdc" }}
            _active={{ bg: "#e6edf5" }}
        >
            <Flex minW={0} direction={"column"} align={"flex-start"} gap={"2px"}>
                <Text fontWeight={"800"} color={"#243b53"} lineClamp={1}>{name}</Text>
                <Text color={"#627d98"} fontSize={"sm"} whiteSpace={"nowrap"}>{formatDateTo_MM_DD_AAAA(date)}</Text>
            </Flex>

            <Flex color={"#627d98"} flexShrink={0}>
                <FiChevronRight/>
            </Flex>
        </Button>
    )
}

export default TreinosHistoryItem
