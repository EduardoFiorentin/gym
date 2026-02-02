import { Box, Button, Field, Fieldset, Flex, HStack, Input, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

const Login = () => {
    
    const [user, setUser] = useState<string>();
    const [password, setPassword] = useState<string>();

    const handleLogin = () => {
        console.log("HL: ", user, " - ", password)
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

                    <Button type="submit" w={"130px"} variant={"outline"} colorPalette={"gray"}>
                        Cadastrar
                    </Button>
                </HStack>

                </Fieldset.Root>
            
            </Flex>
        </Box>
    )
}

export default Login