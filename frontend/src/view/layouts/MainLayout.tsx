import { Box, Button, Flex, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import AvatarComponent from "../components/app/AvatarComponent";
import { useAuth } from "../../hooks/useAuth";

interface BasicPageProps extends React.PropsWithChildren {
    title: string;
    icon: ReactNode;
    iconFunc: () => void;
}

const getSimpleUserName = (name?: string) => {
    if (!name) return "Atleta"
    const nameList = name.trim().split(" ").filter(Boolean)
    if (nameList.length === 0) return "Atleta"
    if (nameList.length === 1) return nameList[0]
    return `${nameList[0]} ${nameList[nameList.length - 1]}`
}

const MainLayout = ({children, title, icon, iconFunc}: BasicPageProps) => {
    const { userInfo } = useAuth();
    const userName = getSimpleUserName(userInfo?.user.name);

    return (
        <Box 
            minH={"100vh"}
            w={"100%"}
            bg={"#f4f7fb"}
            color={"#102a43"}
        >
            <Flex
                as={"header"}
                bg={"rgba(255, 255, 255, 0.94)"}
                borderBottom={"1px solid"}
                borderColor={"#d9e2ec"}
                h={"64px"}
                w={"100%"}
                align={"center"}
                px={{ base: "16px", md: "28px" }}
                position={"sticky"}
                top={0}
                zIndex={10}
                boxShadow={"0 8px 24px rgba(15, 23, 42, 0.05)"}
            >
                <Button
                    aria-label={title}
                    variant={"ghost"}
                    size={"sm"}
                    minW={"42px"}
                    h={"42px"}
                    px={0}
                    color={"#1f4b99"}
                    onClick={() => iconFunc()}
                >
                    {icon}
                </Button>
                <Text
                    ml={"12px"}
                    fontWeight={"800"}
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing={0}
                >
                    {title}
                </Text>

                <Flex
                    ml={"auto"}
                    align={"center"}
                    gap={"10px"}
                >
                    <Text display={{ base: "none", sm: "block" }} fontSize={"sm"} color={"#52616f"} fontWeight={"600"}>
                        {userName}
                    </Text>
                    <AvatarComponent name={userName}/>
                </Flex>
            </Flex>

            <Box
                w={"100%"}
                maxW={"1040px"}
                mx={"auto"}
                px={{ base: "14px", md: "24px" }}
                py={{ base: "18px", md: "28px" }}
            >
                {children}
            </Box>
        </Box>
    );
}

export default MainLayout
