import { useNavigate } from "react-router";
import MainLayout from "../layouts/MainLayout"
import { IoMdExit } from "react-icons/io";

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
            Hello from MainLayout in child
        </MainLayout>
    )
}

export default Home