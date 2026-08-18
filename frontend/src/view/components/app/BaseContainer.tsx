import { Flex, type FlexProps } from "@chakra-ui/react"

interface IBaseAppContainerProps extends React.PropsWithChildren {
    height?: string,
    direction: FlexProps["direction"],
    verticalAlign: FlexProps["align"],
    justifyContent?: FlexProps["justifyContent"],
    maxHeight?: string
}

const BaseContainer = ({ children, height, direction, verticalAlign, justifyContent, maxHeight}: IBaseAppContainerProps) => {
    return (
        <Flex 
            direction={direction}
            h={height || "auto"}
            maxHeight={maxHeight}
            w={"100%"}
            minW={0}
            borderRadius={"8px"}
            border={"1px solid"}
            borderColor={"#dde6f0"}
            bg={"white"}
            boxShadow={"0 12px 30px rgba(15, 23, 42, 0.06)"}
            py={{ base: "16px", md: "18px" }}
            px={{ base: "16px", md: "20px" }}
            align={verticalAlign}
            justifyContent={justifyContent || "space-between"}
            gap={"14px"}
            wrap={"wrap"}
        >
            {children}
        </Flex>
    )
}

export default BaseContainer
