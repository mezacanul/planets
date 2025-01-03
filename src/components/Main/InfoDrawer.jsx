import { Heading, Text, VStack } from "@chakra-ui/react";
import { IoPlanetOutline } from "react-icons/io5";
import { IoIosPlanet } from "react-icons/io";

export default function InfoDrawer() {
    return (
        <VStack
            position={"absolute"}
            top={0}
            left={0}
            height={"100%"}
            justify={"center"}
            p={"1.5rem"}
            _hover={{cursor: "pointer"}}
            zIndex={"2"}
        >
            <Heading fontWeight={"200"} size={"xl"}>
                {/* + */}
                {/* <IoPlanetOutline/> */}
                <IoIosPlanet/>
            </Heading>
        </VStack>
    );
}
