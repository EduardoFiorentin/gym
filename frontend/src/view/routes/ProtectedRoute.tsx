import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = () => {
    const location = useLocation();
    const { userInfo, isInitializing, authError, refetchUserInfo } = useAuth();

    if (isInitializing || (userInfo === undefined && !authError)) {
        return (
            <Flex minH={"100vh"} align={"center"} justify={"center"} direction={"column"} gap={"12px"} bg={"#f4f7fb"}>
                <Spinner color={"#1f7a5b"} />
                <Text color={"#627d98"} fontWeight={"700"}>Verificando sessao...</Text>
            </Flex>
        );
    }

    if (authError) {
        return (
            <Flex minH={"100vh"} align={"center"} justify={"center"} direction={"column"} gap={"12px"} bg={"#f4f7fb"} px={"16px"}>
                <Text color={"#102a43"} fontWeight={"900"} fontSize={"lg"} textAlign={"center"}>
                    Nao foi possivel verificar sua sessao.
                </Text>
                <Text color={"#627d98"} textAlign={"center"}>
                    Confira sua conexao e tente novamente.
                </Text>
                <Button bg={"#1f7a5b"} color={"white"} _hover={{ bg: "#176448" }} onClick={() => refetchUserInfo()}>
                    Tentar novamente
                </Button>
            </Flex>
        );
    }

    if (userInfo === null) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
