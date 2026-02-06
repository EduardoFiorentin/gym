import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TrainingListItem from "./TrainingListItem"
import type { ITraining } from "../../interfaces/ITraining"
import Training from "../../models/training.model"



const trainings: Training[] = [
    new Training("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f1", "A - Costas e Triceps", new Date(), new Date()),
    new Training("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f2", "B - Peito e Biceps", new Date(), new Date()),
    new Training("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f3", "C - Pernas", new Date(), new Date()),
    new Training("5fac5d69-6240-401c-a1cc-ea7a7e5aa7fd", "D - Ombros", new Date(), new Date()),
]


const TrainingListComponent = () => {
    
    const handleRedirect = (training: ITraining) => {
        console.log(training)
    }
    
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
                <Text fontWeight={"bolder"}>Treinos</Text>
            </Box>
            <Box
                w={"100%"}
                // borderRadius={"10px"}
            >
                
                {
                    trainings.map( tr => (
                        <TrainingListItem key={tr.id} name={tr.name} onClickRedirect={() => handleRedirect(tr)} />
                    ))
                }
                {/* <TrainingListItem onClickRedirect={() => {}} name="Treino A"/>
                <TrainingListItem onClickRedirect={() => {}} name="Treino B"/> */}

            </Box>
        </BaseContainer>
    )
}

export default TrainingListComponent