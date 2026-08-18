import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";
import CurrentTreinoComponent from "../components/app/CurrentTreinoComponent";
import TreinosListComponent from "../components/app/TreinosListComponent";
import TreinoHistoryComponent from "../components/app/TreinosHistoryComponent";
import { useAuth } from "../../hooks/useAuth";
import TreinoCreateComponent from "../components/app/TreinoCreateComponent";
import { useQuery } from "@tanstack/react-query";
import { STORAGE_KEYS } from "../../utils/constants/storageKeys/storageKeys";
import { TreinamentoClient } from "../../client/treinamento.client";
import { Flex } from "@chakra-ui/react";

const Home = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const { data: currentTraining } = useQuery({
        queryKey: STORAGE_KEYS.CURRENT_TREINAMENTO_CACHE_KEY,
        queryFn: TreinamentoClient.getCurrentTreinamento,
        retry: false
    });

    const handleHeaderIconClick = async () => {
        await logout()
        navigate("/login", { replace: true })
    }

    return (
        <MainLayout 
            title="Inicio"
            icon={<IoMdExit size={"28px"}/>}
            iconFunc={handleHeaderIconClick}
        > 
            <Flex direction={"column"} gap={"16px"}>
                <CurrentTreinoComponent
                    training={currentTraining || null}
                    onClickRedirect={() => navigate("/training")}
                />
                <TreinoCreateComponent/>
                <TreinosListComponent currentTraining={currentTraining || null}/>
                <TreinoHistoryComponent/>
            </Flex>

        </MainLayout>
    )
}

export default Home
