import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TrainingListItem from "./TrainingListItem"
import type { ITraining } from "../../interfaces/ITraining"
import TrainingModel from "../../models/training.model"
import { useNavigate } from "react-router"
import useLocalStorage from "../../hooks/useLocalStorage"



const trainings: TrainingModel[] = [
    new TrainingModel("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f1", "A - Costas e Triceps", new Date(), new Date()),
    new TrainingModel("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f2", "B - Peito e Biceps", new Date(), new Date()),
    new TrainingModel("5fac5d69-6240-401c-a1cc-ea7a7e5aa7f3", "C - Pernas", new Date(), new Date()),
    new TrainingModel("5fac5d69-6240-401c-a1cc-ea7a7e5aa7fd", "D - Ombros", new Date(), new Date()),
]


const TrainingListComponent = () => {
    const navigate = useNavigate()

    const [training, setTraining] = useLocalStorage('TREINO_EM_ANDAMENTO')

    console.log(training)

    const handleRedirect = (training: ITraining) => {
        
        // TODO Colocar treino escolhido no cache 
        setTraining(training)

        // Direcionar para página de treinamento
        navigate("/training")
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
            >                
                {trainings.map( tr => (
                    <TrainingListItem key={tr.id} name={tr.name} onClickRedirect={() => handleRedirect(tr)} />
                ))}

            </Box>
        </BaseContainer>
    )
}

export default TrainingListComponent