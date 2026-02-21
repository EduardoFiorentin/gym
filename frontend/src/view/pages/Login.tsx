import { Box, Button, Field, Fieldset, Flex, HStack, Input, Text } from "@chakra-ui/react"
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { LoginCredentialsModel } from "../../models/LoginCredentials.model";

const Login = () => {
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    
    const { login, userInfo: userModel, isLoggingIn, loginError } = useAuth();
    
    useEffect(() => {
        if (userModel) {
            navigate("/", { replace: true });
        }
    }, [userModel, navigate]);

    useEffect(() => {
        console.log("Erro: ", loginError)
    }, [loginError])
    
    const handleLogin = async () => {
        if (!user || !password) return;

        const credentials: LoginCredentialsModel = {
            login: user,
            password: password
        };
        
        try {
            await login(credentials); // send response data directly to userModel
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Erro no login:", error);
        }
    };
     
    return (
        <Box bg="white" h="100vh" w="95vw" m="auto">
            <Flex w="100%" justify="center" alignItems="center" pt="10%" direction="column">
                <Text as="h1" fontSize="2xl" fontWeight="bold" mb={4}>Treino</Text>
            
                <Fieldset.Root size="lg" maxW="md" alignItems="center">
                    <Fieldset.Content alignItems="center">
                        <Field.Root>
                            <Field.Label>Usuário</Field.Label>
                            <Input 
                                name="user" 
                                value={user}
                                onChange={event => setUser(event.target.value)}
                            />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label>Senha</Field.Label>
                            <Input 
                                name="password" 
                                type="password"
                                value={password}
                                autoComplete="off"
                                onChange={event => setPassword(event.target.value)}
                            />
                        </Field.Root>
                        
                        {loginError && (
                            <Text color="red.500" fontSize="sm">{loginError.message}</Text>
                        )}
                    </Fieldset.Content>

                    <HStack mt={4}>
                        <Button 
                            type="button" // Alterado para button, pois não há um form html
                            w="130px" 
                            variant="solid" 
                            colorPalette="blue"
                            onClick={handleLogin}
                            loading={isLoggingIn} // Chakra UI gerencia o spinner nativamente
                        >
                            Entrar
                        </Button>

                        <Button type="button" w="130px" variant="outline" colorPalette="gray" onClick={() => {}}>
                            Cadastrar
                        </Button>
                    </HStack>
                </Fieldset.Root>
            </Flex>
        </Box>
    )
}

export default Login;