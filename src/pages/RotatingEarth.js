import React, { useEffect, useRef, useState } from "react";
import { CgEditBlackPoint } from "react-icons/cg";
import { LuVolume2 } from "react-icons/lu";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html } from "@react-three/drei";
import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Button } from "react-scroll";

const data = {
    planets: [
        { name: "Sun", population: "0 humans, 0 robots", src: "sun_4k.jpg" },
        {
            name: "Venus",
            population: "0 humans, 0 robots",
            src: "venus_8k.jpg",
        },
        {
            name: "Earth",
            population: "+6M humans, 54M - 105M robots",
            src: "earth_8k.jpg",
        },
        { name: "Moon", population: "0 humans, 0 robots", src: "moon_8k.jpg" },
        { name: "Mars", population: "0 humans, 5 robots", src: "mars_8k.jpg" },
    ],
};

export default function RotatingEarth() {
    const controlsRef = useRef();
    const [intensity, setIntensity] = useState(1.2);
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlanet, setCurrentPlanet] = useState("Earth");
    const [selectedPoint, setSelectedPoint] = useState(null);

    const changePlanet = (planetName) => {
        const intensities = {
            Sun: 5,
            Mars: 2.6,
            Moon: 3.2,
            Venus: 4,
            Earth: 2,
        };
        setIntensity(intensities[planetName] || 1.2);
        setCurrentPlanet(planetName);
        setSelectedPoint(null);
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = 1;
    }, []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 130, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 130, damping: 20 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouseX.set((clientX / window.innerWidth - 0.5) * 50);
        mouseY.set((clientY / window.innerHeight - 0.5) * 50);
    };

    return (
        <VStack
            justify="center"
            w="100vw"
            h="100vh"
            onMouseMove={handleMouseMove}
            overflow="hidden"
            position="relative"
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            >
                <source src="/video/deep_space.mp4" type="video/mp4" />
            </video>

            <audio ref={audioRef} loop autoPlay>
                <source
                    src="/audio/SpaceX_Webcast_Music_Formosat-5.mp3"
                    type="audio/mpeg"
                />
            </audio>

            <Box
                position="relative"
                _hover={{ cursor: "grab" }}
                w="100vw"
                h="100vh"
            >
                <Canvas camera={{ position: [0, 0, 2.5] }}>
                    <ambientLight intensity={intensity} />
                    <directionalLight position={[2, 2, 2]} />
                    <Earth
                        currentPlanet={currentPlanet}
                        onSelectPoint={setSelectedPoint}
                        selectedPoint={selectedPoint}
                    />
                    <OrbitControls
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={5}
                        zoomSpeed={0.3}
                        autoRotate
                        autoRotateSpeed={-0.2}
                        ref={controlsRef}
                    />
                </Canvas>

                {selectedPoint && (
                    <Box
                        position="absolute"
                        top="20px"
                        right="20px"
                        bg="blackAlpha.700"
                        p={4}
                        color="white"
                        borderRadius="md"
                        zIndex={20}
                    >
                        <Text fontWeight="bold">{selectedPoint.name}</Text>
                        <Text>{selectedPoint.info}</Text>
                    </Box>
                )}
            </Box>

            <Info
                position="absolute"
                bottom={0}
                right={0}
                onClick={toggleAudio}
                onPlanetChange={changePlanet}
                controlsRef={controlsRef}
                planet={currentPlanet}
            />
        </VStack>
    );
}

function Earth({ currentPlanet, onSelectPoint, selectedPoint }) {
    const texture = useTexture(
        `/image/spheres/${
            data.planets.find((p) => p.name === currentPlanet).src
        }`
    );

    const points = [
        {
            position: [0, 1, 1],
            name: "North America",
            info: "Population: 592 million",
        },
        {
            position: [-1, -1, 1],
            name: "South America",
            info: "Population: 430 million",
        },
        {
            position: [1.05, 0.4, 1.1],
            name: "Europe",
            info: "Population: 748 million",
        },
    ];

    return (
        <>
            <Sphere args={[1.5, 64, 64]} rotation={[0.35, 0, 0.05]}>
                <meshStandardMaterial map={texture} />
            </Sphere>

            {/* {points.map((point, i) => (
                <group key={i} position={point.position}>
                    <mesh
                        rotation={[0, 0, Math.PI]}
                        onClick={() =>
                            onSelectPoint(
                                point === selectedPoint ? null : point
                            )
                        }
                    >
                        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                        <meshStandardMaterial
                            color={selectedPoint === point ? "yellow" : "red"}
                            emissive={
                                selectedPoint === point ? "yellow" : "black"
                            }
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    <mesh
                        position={[0, -0.12, 0]}
                        onClick={() =>
                            onSelectPoint(
                                point === selectedPoint ? null : point
                            )
                        }
                    >
                        <sphereGeometry args={[0.04, 16, 16]} />
                        <meshStandardMaterial
                            color={selectedPoint === point ? "yellow" : "red"}
                            emissive={
                                selectedPoint === point ? "yellow" : "black"
                            }
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>
            ))} */}
        </>
    );
}

function Info({ onClick, onPlanetChange, controlsRef, planet, ...props }) {
    return (
        <VStack
            {...props}
            align="flex-end"
            zIndex={10}
            color="white"
            py="3rem"
            px="4rem"
        >
            <Button onClick={onClick}>
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
                    <Text
                        textAlign="right"
                        letterSpacing="0.4rem"
                        fontWeight="200"
                    >
                        Population:{" "}
                        {data.planets.find((p) => p.name === planet).population}
                    </Text>
                    <LuVolume2 style={{ display: "inline-block" }} />
                </HStack>
            </Button>
            <HStack align="center" spacing="1rem" py="0.5rem">
                <Button onClick={() => controlsRef.current.reset()}>
                    <CgEditBlackPoint />
                </Button>
                {data.planets.map((planet) => (
                    <Button
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
