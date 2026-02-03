import { Box, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import AvatarComponent from "../components/app/AvatarComponent";
// import { Icon } from "@chakra-ui/react";

interface BasicPageProps extends React.PropsWithChildren {
    title: string;
    icon: ReactNode;
    iconFunc: () => void;
}

const nome = "  Eduardo Vinicius Perissinotto Fiorentin   "

const getSimpleUserName = (name: string) => {
    let name_list = name.trim().split(" ")
    if (name_list.length === 1) return name_list[0]
    else return name_list[0] + " " + name_list[name_list.length - 1]
}

const MainLayout = ({children, title, icon, iconFunc}: BasicPageProps) => {
    return (
        <Box 
            w={"100vw"}
            h={"100vh"}
            bg={"red.100"}
        >
            {/* Barra superior */}
            <Flex
                bg={"blue.200"}
                h={"50px"}
                w={"100%"}
                align={"center"}
            >
                <Box
                    ml={"10px"}
                    onClick={() => iconFunc()}
                >{icon}</Box>
                <Text
                    ml={"10px"}
                >{title.toLocaleUpperCase()}</Text>

                {/* Informações do perfil */}
                <Flex
                    ml={"auto"}
                    mr={"10px"}
                    align={"center"}
                >
                    <Text mr={"10px"} fontSize={".9rem"}>{getSimpleUserName(nome)}</Text>
                    <AvatarComponent/>
                </Flex>
            </Flex>

            {/* página */}
            <Box>
                {children}
            </Box>
        </Box>
    );
}

export default MainLayout