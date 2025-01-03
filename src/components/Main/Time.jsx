import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuVolume2, LuVolumeOff } from "react-icons/lu";

export default function Time() {
    const [time, setTime] = useState(new Date());
    const [showColon, setShowColon] = useState(true);
    const [isMuted, setIsMuted] = useState(false);


    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 10000);

        const colonTimer = setInterval(() => {
            setShowColon((prev) => !prev);
        }, 1000);

        return () => {
            clearInterval(timer);
            clearInterval(colonTimer);
        };
    }, []);

    const [hours, minutes] = time
        .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
        .split(":");

    return (
        <VStack
            position={"absolute"}
            top={0}
            right={0}
            p={"2rem"}
            align={"flex-end"}
            spacing={0.5}
        >
            <Text fontSize={"md"} textAlign={"right"}>
                {hours}
                <span style={{ opacity: showColon ? 1 : 0 }}>:</span>
                {minutes}
                <br />

                {/* <LuVolume2/> */}
            </Text>
            <HStack>
                <Text
                    color="white"
                    cursor="pointer"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isMuted ? <LuVolumeOff /> : <LuVolume2 />}
                </Text>
                <Text color="white">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </Text>
            </HStack>
        </VStack>
    );
}
