import { Avatar } from "@chakra-ui/react"

const AvatarComponent = () => {
    return (
    <Avatar.Root>
        <Avatar.Fallback name="Eduardo Fiorentin" />
        <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
    )
}

export default AvatarComponent