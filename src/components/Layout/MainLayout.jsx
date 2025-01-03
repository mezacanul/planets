import Time from "../Main/Time";
import InfoDrawer from "../Main/InfoDrawer";
import MainPanel from "../Main/MainPanel";
import RotatingEarth from "../Main/RotatingEarth";
import MainCanvas from "../Main/MainCanvas";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { VStack } from "@chakra-ui/react";

export default function MainLayout({ dev }) {
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
            bgImage={"/img/space_2.jpeg"}
            _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,0.4)', // Adjust opacity to control brightness
                backdropFilter: 'blur(0.9px)', // Adjust pixel value for blur intensity

                // Or use filter for different effects:
                // filter: 'brightness(0.5)'
                // filter: 'contrast(0.8)'
            }}
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

            <InfoDrawer/>

            <MainCanvas
                intensity={intensity}
                data={data}
                dev={dev}
                controlsRef={controlsRef}
                currentPlanet={currentPlanet}
                onSelectPoint={setSelectedPoint}
                selectedPoint={selectedPoint}
            />

            <Time/>

            <MainPanel
                position="absolute"
                bottom={0}
                right={0}
                onClick={toggleAudio}
                onPlanetChange={changePlanet}
                controlsRef={controlsRef}
                planet={currentPlanet}
                data={data}
            />
        </VStack>
    );
}

const data = {
    planets: [
        { name: "Sun", population: "0 humans, 0 robots", src: "/8k_sun.jpg" },
        {
            name: "Mercury",
            population: "0 humans, 0 robots",
            src: "/planets/mercury_4k.webp",
        },
        {
            name: "Venus",
            population: "0 humans, 0 robots",
            src: "/planets/8k_venus_surface.jpg",
        },
        {
            name: "Earth",
            population: "+8.2M humans, +100M robots",
            src: "/planets/earth_8k.jpg",
        },
        {
            name: "Earth_Night",
            population: "+8.2M humans, 54M - 105M robots",
            src: "/planets/8k_earth_nightmap.jpg",
        },
        { name: "Moon", population: "0 humans, 0 robots", src: "/8k_moon.jpg" },
        {
            name: "Mars",
            population: "0 humans, 5 robots",
            src: "/planets/8k_mars.jpg",
        },

        {
            name: "Jupiter",
            population: "0 humans, 0 robots",
            src: "/planets/8k_jupiter.jpg",
        },
        {
            name: "Saturn",
            population: "0 humans, 0 robots",
            src: "/planets/8k_saturn.jpg",
        },
        {
            name: "Uranus",
            population: "0 humans, 0 robots",
            src: "/planets/2k_uranus.jpg",
        },
        {
            name: "Neptune",
            population: "0 humans, 0 robots",
            src: "/planets/2k_neptune.jpg",
        },
    ],
};