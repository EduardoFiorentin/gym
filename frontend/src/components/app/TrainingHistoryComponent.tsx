import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TrainingHistoryItem from "./TrainingHistoryItem"



const TrainingHistoryComponent = () => {
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

                <TrainingHistoryItem onClickRedirect={() => {}} name="Treino A" date={new Date()}/>
                <TrainingHistoryItem onClickRedirect={() => {}} name="Treino B" date={new Date()}/>

            </Box>
        </BaseContainer>
    )
}

export default TrainingHistoryComponent