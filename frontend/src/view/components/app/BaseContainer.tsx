import { Flex } from "@chakra-ui/react"

interface IBaseAppContainerProps extends React.PropsWithChildren {
    height: string,
    direction: string,
    verticalAlign: string,
    justifyContent?: string,
    maxHeight?: string
}

const BaseContainer = ({ children, height, direction, verticalAlign, justifyContent, maxHeight}: IBaseAppContainerProps) => {
    return (
        <Flex 
            direction={direction}
            h={height}
            maxHeight={maxHeight}
            mt={"20px"}
            mx={"10px"}
            borderRadius={"10px"}
            border={"1px solid black"}
            py={"10px"}
            px={"20px"}
            align={verticalAlign}
            justifyContent={justifyContent || "space-between"}
        >
            {children}
        </Flex>
    )
}

export default BaseContainer