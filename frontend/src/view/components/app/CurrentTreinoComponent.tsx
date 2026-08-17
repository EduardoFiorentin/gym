import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { FiActivity, FiArrowRight } from "react-icons/fi";
import BaseContainer from "./BaseContainer";

interface ICurrentTraining {
    id: string,
    treinoName: string
}


const CurrentTreinoComponent = ({training, onClickRedirect}: {training: ICurrentTraining | null, onClickRedirect: () => void}) => {
    return (
        <BaseContainer
            height={"auto"}
            direction="row"
            verticalAlign="center"
        >
            <Flex align={"center"} gap={"14px"} minW={0}>
                <Flex
                    w={"42px"}
                    h={"42px"}
                    borderRadius={"8px"}
                    bg={training ? "#dff3ea" : "#edf2f7"}
                    color={training ? "#1f7a5b" : "#627d98"}
                    align={"center"}
                    justify={"center"}
                    flexShrink={0}
                >
                    <FiActivity size={"22px"} />
                </Flex>
                <Box minW={0}>
                    <Text fontSize={"xs"} color={"#627d98"} fontWeight={"700"} textTransform={"uppercase"}>
                        {training ? "Em andamento" : "Status do treino"}
                    </Text>
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight={"900"} color={"#102a43"} lineClamp={1}>
                        {training?.treinoName || "Nenhum treino em andamento"}
                    </Text>
                </Box>
            </Flex>
            {training && (
                <Button
                    size={"sm"}
                    bg={"#1f7a5b"}
                    color={"white"}
                    _hover={{ bg: "#176448" }}
                    onClick={onClickRedirect}
                >
                    Continuar <FiArrowRight />
                </Button>
            )}
        </BaseContainer>
    )
}

export default CurrentTreinoComponent
