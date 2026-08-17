import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";
import CurrentTreinoComponent from "../components/app/CurrentTreinoComponent";
import TreinosListComponent from "../components/app/TreinosListComponent";
import TreinoHistoryComponent from "../components/app/TreinosHistoryComponent";
import { useAuth } from "../../hooks/useAuth";
import TreinoCreateComponent from "../components/app/TreinoCreateComponent";
import { useEffect, useState } from "react";
import { currentTreinamentoRepository } from "../../repositories/currentTreinamentoRepository";
import type { TreinamentoModel } from "../../models/Treinamento.model";

const Home = () => {

    const navigate = useNavigate();
    const { logout} = useAuth();
    const [currentTraining, setCurrentTraining] = useState<TreinamentoModel | null>(null);

    useEffect(() => {
        setCurrentTraining(currentTreinamentoRepository.get());
    }, []);

    const handleHeaderIconClick = () => {
        logout()
        navigate("/login")
    }

    return (
        <MainLayout 
            title="Inicio" 
            icon={<IoMdExit size={"36px"}/>}
            iconFunc={handleHeaderIconClick}
        > 
            
            <CurrentTreinoComponent
                training={currentTraining}
                onClickRedirect={() => navigate("/training")}
            />
            <TreinoCreateComponent/>
            <TreinosListComponent/>
            <TreinoHistoryComponent/>

        </MainLayout>
    )
}

export default Home
