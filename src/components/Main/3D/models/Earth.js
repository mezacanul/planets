import { Box, Heading } from "@chakra-ui/react";

export default function Earth() {
    return (
        <Box w={"100vw"} h={"100vh"} bgImage={"/space.jpg"} bgSize={"cover"} color={"white"}>
            <Heading>Earth 0.1</Heading>
        </Box>
    );
}
