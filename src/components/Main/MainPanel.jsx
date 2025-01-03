import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { CgEditBlackPoint } from "react-icons/cg";

export default function MainPanel({
    onClick,
    onPlanetChange,
    controlsRef,
    planet,
    data,
    ...props
}) {
    return (
        <VStack {...props} align="flex-end" zIndex={10} py="3rem" px="4rem">
            <Box onClick={onClick} _hover={{ cursor: "pointer" }}>
                <Heading
                    size="3xl"
                    textAlign="right"
                    letterSpacing="0.4rem"
                    fontWeight="200"
                    mb="0.7rem"
                >
                    {data.planets.find((p) => p.name === planet).name}
                </Heading>
                <HStack align="center">
                    <VStack align={"flex-end"}>
                        <Text
                            textAlign="right"
                            letterSpacing="0.4rem"
                            fontWeight="200"
                        >
                            Population{" "}
                        </Text>
                        <Text
                            textAlign="right"
                            letterSpacing="0.4rem"
                            fontWeight="200"
                        >
                            {
                                data.planets.find((p) => p.name === planet)
                                    .population
                            }
                        </Text>
                    </VStack>
                </HStack>
            </Box>
            <HStack align="center" spacing="1rem" py="0.5rem">
                <Button
                    color={"white"}
                    variant={"link"}
                    onClick={() => controlsRef.current.reset()}
                >
                    <CgEditBlackPoint />
                </Button>
                {data.planets.map((planet) => (
                    <Button
                        color={"white"}
                        variant={"link"}
                        key={planet.name}
                        onClick={() => onPlanetChange(planet.name)}
                    >
                        {planet.name}
                    </Button>
                ))}
            </HStack>
        </VStack>
    );
}
