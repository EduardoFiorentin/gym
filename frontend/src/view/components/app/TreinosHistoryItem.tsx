import { Flex, Text } from "@chakra-ui/react"
import { GrFormNextLink } from "react-icons/gr"


interface ITrainingHistoryItem {
    onClickRedirect: () => void,
    name: string,
    date: Date
}

const formatDateTo_MM_DD_AAAA = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TreinosHistoryItem = ({onClickRedirect, name, date}: ITrainingHistoryItem) => {
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
            
            <Text>{formatDateTo_MM_DD_AAAA(date)}</Text>

            <Flex
                border={"2px solid lightgray"}
                borderRadius={"100%"}
                onClick={() => onClickRedirect()}
            >
                <GrFormNextLink size={"36px"} color="lightgray"/>
            </Flex>
            
        </Flex>
    )
}

export default TreinosHistoryItem