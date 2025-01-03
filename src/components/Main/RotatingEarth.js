import React, { useEffect, useRef, useState } from "react";
import { CgEditBlackPoint } from "react-icons/cg";
import { LuVolume2 } from "react-icons/lu";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ISS from "../../components/Main/3D/ISS"

const data = {
    planets: [
        { name: "Sun", population: "0 humans, 0 robots", src: "/8k_sun.jpg" },
        { name: "Mercury", population: "0 humans, 0 robots", src: "/planets/mercury_4k.webp" },
        {
            name: "Venus",
            population: "0 humans, 0 robots",
            src: "/planets/8k_venus_surface.jpg",
        },
        {
            name: "Earth",
            population: "+6M humans, 54M - 105M robots",
            src: "/planets/earth_8k.jpg",
        },
        {
            name: "Earth_Night",
            population: "+6M humans, 54M - 105M robots",
            src: "/planets/earth_8k.jpg",
        },
        { name: "Moon", population: "0 humans, 0 robots", src: "/8k_moon.jpg" },
        { name: "Mars", population: "0 humans, 5 robots", src: "/planets/8k_mars.jpg" },
        
        { name: "Jupiter", population: "0 humans, 0 robots", src: "/planets/8k_jupiter.jpg" },
        { name: "Saturn", population: "0 humans, 0 robots", src: "/planets/8k_saturn.jpg" },
        { name: "Uranus", population: "0 humans, 0 robots", src: "/planets/2k_uranus.jpg" },
        { name: "Neptune", population: "0 humans, 0 robots", src: "/planets/2k_neptune.jpg" },
    ],
};

export default function RotatingEarth({dev}) {
    const controlsRef = useRef();
    const [intensity, setIntensity] = useState(1.2);
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlanet, setCurrentPlanet] = useState("Earth");
    const [selectedPoint, setSelectedPoint] = useState(null);

    const changePlanet = (planetName) => {
        const intensities = {
            Sun: 6,
            Mars: 2.6,
            Moon: 3.2,
            Venus: 4,
            Earth: 2,
            Earth_Night: 6,
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
            bgImage={"/img/8k_stars_milky_way.webp"}
            // alt="Photo by form PxHere"
            // alitlink="https://wallpapers.com/wallpapers/8k-space-gnz57aqqjcxbieom.html"
            alitlink="https://wallpapers.com/wallpapers/8k-space-wscs8pasljdcl93c.html"
            bgSize={"cover"}
            bgPosition={"center"}
        >
            {dev == false && (
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
            )}

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
                        minDistance={1.9}
                        maxDistance={5.4}
                        zoomSpeed={0.3}
                        autoRotate={!dev}
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
    const [issPosition, setIssPosition] = useState(null);
    const texture = useTexture(
        `/img${
            data.planets.find((p) => p.name === currentPlanet).src
        }`
    );

    // Add these constants at the top of the component
    const ISS_HEIGHT = 408;
    const EARTH_RADIUS = 6371;
    const scale = 1.5;
    const heightScale = scale * (1 + ISS_HEIGHT / EARTH_RADIUS);

    useEffect(() => {
        const getISSLocation = async () => {
            try {
                const response = await fetch(
                    "http://api.open-notify.org/iss-now.json"
                );
                const data = await response.json();
                const { latitude, longitude } = data.iss_position;

                const phi = (90 - parseFloat(latitude)) * (Math.PI / 180);
                const theta = (parseFloat(longitude) + 180) * (Math.PI / 180);

                // Use heightScale here instead of 1.5
                // const x = -(heightScale * Math.sin(phi) * Math.cos(theta));
                // const y = heightScale * Math.cos(phi);
                // const z = heightScale * Math.sin(phi) * Math.sin(theta);

                const x = -(1.505 * Math.sin(phi) * Math.cos(theta));
                const y = 1.505 * Math.cos(phi);
                const z = 1.505 * Math.sin(phi) * Math.sin(theta);

                setIssPosition([x, y, z]);
            } catch (error) {
                console.error("Error fetching ISS position:", error);
            }
        };

        // getISSLocation();
        // const interval = setInterval(getISSLocation, 1000);
        // return () => clearInterval(interval);
    }, []);

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

            {/* <Sphere args={[1.5, 64, 64]} rotation={[0.2, -Math.PI /3, 0]}>
                <meshStandardMaterial map={texture} />
            </Sphere> */}

            {/* {issPosition && currentPlanet === "Earth" && (
                <mesh position={issPosition}>
                    <group position={issPosition}>
                        <ISS />
                    </group>
                </mesh>
            )} */}
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
