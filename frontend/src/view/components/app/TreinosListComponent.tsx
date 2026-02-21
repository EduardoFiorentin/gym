import { Box, Text } from "@chakra-ui/react"
import BaseContainer from "./BaseContainer"
import TreinosListItem from "./TreinosListItem"
import { useNavigate } from "react-router"
import type { TreinoModel } from "../../../models/Treino.model"


const treinos: TreinoModel[] = [{id: "1", name: "mock"}]

const TreinosListComponent = () => {
    const navigate = useNavigate()


    const handleRedirect = (treino: TreinoModel) => {
        console.log("Treino escolhido: ", treino)
        navigate("/training")
    }

    // if (isLoading) return (
    //     <Text>Carregando treinos...</Text>
    // )

    // if (!isLoading && error) {
    //     <Text>{error}</Text>
    // }
    
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
                {treinos.map( (tr: TreinoModel) => (
                    <TreinosListItem key={tr.id.toString()} name={tr.name.toString()} onClickRedirect={() => handleRedirect(tr)} />
                ))}

            </Box>
        </BaseContainer>
    )
}

export default TreinosListComponent