import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";
import CurrentTreinoComponent from "../components/app/CurrentTreinoComponent";
import TreinosListComponent from "../components/app/TreinosListComponent";
import TreinoHistoryComponent from "../components/app/TreinosHistoryComponent";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { TreinoClient } from "../../client/treino.client";



const currentTrainingExistsMock = {
    id: "e0dcdf43-1fa5-4d72-9bb3-cf1ce8db8af9",
    name: "Treino A"
}

const Home = () => {

    const navigate = useNavigate();
    const { logout} = useAuth();

    const handleHeaderIconClick = () => {
        // TODO Remove login info from cache
        // logout()
        // navigate("/login")
        TreinoClient.buscarTreinos()
    }

    return (
        <MainLayout 
            title="Inicio" 
            icon={<IoMdExit size={"36px"}/>}
            iconFunc={handleHeaderIconClick}
        > 
            
            <CurrentTreinoComponent training={currentTrainingExistsMock}/>
            <TreinosListComponent/>
            <TreinoHistoryComponent/>

        </MainLayout>
    )
}

export default Home