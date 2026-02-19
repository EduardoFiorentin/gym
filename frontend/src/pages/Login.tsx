import { Box, Button, Field, Fieldset, Flex, HStack, Input, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router";
import axios from 'axios';
import { SerieService } from "../services/serie.service";

const BASE_URL = "http://localhost:8080"
console.log("Rota designada: ", BASE_URL)


const api = axios.create({
  baseURL: BASE_URL // fallback para dev local
});

const Login = () => {
    
    const [user, setUser] = useState<string>();
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log("HL: ", user, " - ", password)
        navigate("/")
    }

    const handleTest = () => {
        api.post("/auth/login", {"login": "eduardo", "password": "123"})
        .then(data => {
            console.log("Sucesso: ", data)
        })
        .catch(err => {
            console.log("Erro :", err)
        })

    }
     
    return (
        <Box 
            bg="white"
            h="100vh"
            w="95vw"
            m={"auto"}
            
        >
            <Flex 
                w="100%" 
                justify={"center"}
                alignItems={"center"}
                pt={"10%"}
                direction="column"
            >
                <Text 
                    as="h1"
                    fontSize="2xl"
                    fontWeight="bold"
                >Treino</Text>
            
                <Fieldset.Root size="lg" maxW="md" alignItems={"center"}>

                <Fieldset.Content alignItems={"center"}>
                    <Field.Root>
                    <Field.Label>Usuario</Field.Label>
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

                </Fieldset.Content>
                <HStack>
                    <Button 
                        type="submit" 
                        w={"130px"} 
                        variant={"solid"} 
                        colorPalette={"blue"}
                        onClick={handleLogin}
                    >
                        Entrar
                    </Button>

                    <Button type="submit" w={"130px"} variant={"outline"} colorPalette={"gray"} onClick={SerieService.buscarSeries}>
                        Cadastrar
                    </Button>
                </HStack>

                </Fieldset.Root>
            
            </Flex>
        </Box>
    )
}

export default Login