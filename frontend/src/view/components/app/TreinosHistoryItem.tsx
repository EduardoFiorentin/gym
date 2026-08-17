import { Flex, Text } from "@chakra-ui/react"
import { formatDateTo_MM_DD_AAAA } from "../../../utils/functions/date/formatDateTo_MM_DD_AAAA"


interface ITrainingHistoryItem {
    name: string,
    date: Date
}

const TreinosHistoryItem = ({name, date}: ITrainingHistoryItem) => {
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
            
            <Text color={"#627d98"} fontSize={"sm"} whiteSpace={"nowrap"}>{formatDateTo_MM_DD_AAAA(date)}</Text>
            
        </Flex>
    )
}

export default TreinosHistoryItem
