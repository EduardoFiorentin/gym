import { Box, Button, Field, Fieldset, Flex, Input, Text } from "@chakra-ui/react"
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import type { LoginCredentialsModel } from "../../models/LoginCredentials.model";
import { FiArrowRight } from "react-icons/fi";

const Login = () => {
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    
    const { login, isLoggingIn, loginError } = useAuth();
    
    const handleLogin = async (event?: FormEvent<HTMLDivElement>) => {
        event?.preventDefault();
        if (!user || !password) return;

        const credentials: LoginCredentialsModel = {
            login: user,
            password: password
        };
        
        try {
            await login(credentials);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Erro no login:", error);
        }
    };
     
    return (
        <Flex
            minH={"100vh"}
            w={"100%"}
            bg={"#f4f7fb"}
            align={"center"}
            justify={"center"}
            px={"16px"}
            py={"32px"}
        >
            <Box
                as={"form"}
                onSubmit={handleLogin}
                w={"100%"}
                maxW={"420px"}
                bg={"white"}
                border={"1px solid"}
                borderColor={"#d9e2ec"}
                borderRadius={"8px"}
                boxShadow={"0 20px 45px rgba(15, 23, 42, 0.10)"}
                px={{ base: "22px", md: "30px" }}
                py={{ base: "26px", md: "34px" }}
            >
                <Box mb={"28px"}>
                    <Text color={"#1f7a5b"} fontWeight={"800"} fontSize={"sm"}>
                        Gym Tracker
                    </Text>
                    <Text as="h1" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900" color={"#102a43"} mt={"4px"}>
                        Entrar na conta
                    </Text>
                    <Text color={"#627d98"} fontSize={"sm"} mt={"8px"}>
                        Acompanhe suas fichas e registre as séries do treino.
                    </Text>
                </Box>
            
                <Fieldset.Root size="lg">
                    <Fieldset.Content gap={"16px"}>
                        <Field.Root>
                            <Field.Label color={"#334e68"} fontWeight={"700"}>Usuário</Field.Label>
                            <Input 
                                name="user" 
                                value={user}
                                autoComplete="username"
                                borderColor={"#bcccdc"}
                                _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                onChange={event => setUser(event.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label color={"#334e68"} fontWeight={"700"}>Senha</Field.Label>
                            <Input 
                                name="password" 
                                type="password"
                                value={password}
                                autoComplete="current-password"
                                borderColor={"#bcccdc"}
                                _focus={{ borderColor: "#1f7a5b", boxShadow: "0 0 0 1px #1f7a5b" }}
                                onChange={event => setPassword(event.target.value)}
                            />
                        </Field.Root>
                        
                        {loginError && (
                            <Text color="#b42318" fontSize="sm" fontWeight={"600"}>{loginError.message}</Text>
                        )}
                    </Fieldset.Content>

                    <Button
                        type="submit"
                        w={"100%"}
                        mt={"22px"}
                        h={"44px"}
                        bg={"#1f7a5b"}
                        color={"white"}
                        _hover={{ bg: "#176448" }}
                        loading={isLoggingIn}
                    >
                        Entrar <FiArrowRight />
                    </Button>
                </Fieldset.Root>
            </Box>
        </Flex>
    )
}

export default Login;
