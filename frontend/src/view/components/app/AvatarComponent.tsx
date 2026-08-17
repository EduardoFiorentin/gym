import { Avatar } from "@chakra-ui/react"

const AvatarComponent = ({ name = "Atleta" }: { name?: string }) => {
    return (
        <Avatar.Root size={"sm"} bg={"#102a43"} color={"white"}>
            <Avatar.Fallback name={name} />
        </Avatar.Root>
    )
}

export default AvatarComponent
