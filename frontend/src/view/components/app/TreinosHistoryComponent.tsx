import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosHistoryItem from "./TreinosHistoryItem"



const TreinoHistoryComponent = () => {
    return (
        <BaseContainer 
            height="auto"
            direction="column"
            verticalAlign="flex-start"
            justifyContent="flex-start"
        >
            <Box
                borderBottom={"1px solid black"}
                width={"100%"}
            >
                <Text fontWeight={"bolder"}>Histórico</Text>
            </Box>
            <Box
                w={"100%"}
                // borderRadius={"10px"}
            >

                <TreinosHistoryItem onClickRedirect={() => {}} name="Treino A" date={new Date()}/>
                <TreinosHistoryItem onClickRedirect={() => {}} name="Treino B" date={new Date()}/>

            </Box>
        </BaseContainer>
    )
}

export default TreinoHistoryComponent