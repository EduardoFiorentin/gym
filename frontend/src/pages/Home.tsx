import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";
import CurrentTrainingComponent from "../components/app/CurrentTrainingComponent";
import TrainingListComponent from "../components/app/TrainingListComponent";
import TrainingHistoryComponent from "../components/app/TrainingHistoryComponent";


const currentTrainingExistsMock = {
    id: "e0dcdf43-1fa5-4d72-9bb3-cf1ce8db8af9",
    name: "Treino A"
}

const Home = () => {

    const navigate = useNavigate();

    const handleHeaderIconClick = () => {
        // TODO Remove login info from cache
        navigate("/login")
    }

    return (
        <MainLayout 
            title="Inicio" 
            icon={<IoMdExit size={"36px"}/>}
            iconFunc={handleHeaderIconClick}
        > 
            
            <CurrentTrainingComponent training={currentTrainingExistsMock}/>
            <TrainingListComponent/>
            <TrainingHistoryComponent/>

        </MainLayout>
    )
}

export default Home