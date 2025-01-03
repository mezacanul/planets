import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box, Text } from "@chakra-ui/react";
import ISS from "../../components/Main/3D/ISS";
import MainSphere from "./3D/models/MainSphere";

export default function MainCanvas({
    currentPlanet,
    intensity,
    data,
    dev,
    controlsRef,
    setSelectedPoint,
    selectedPoint,
}) {
    return (
        <Box
            position="relative"
            _hover={{ cursor: "grab" }}
            w="100vw"
            h="100vh"
        >
            <Canvas camera={{ position: [0, 0, 2.5] }}>
                <ambientLight intensity={intensity} />
                <directionalLight position={[2, 2, 2]} />
                {/* <Earth
                        currentPlanet={currentPlanet}
                        onSelectPoint={setSelectedPoint}
                        selectedPoint={selectedPoint}
                    /> */}
                <MainSphere
                    currentPlanet={currentPlanet}
                    onSelectPoint={setSelectedPoint}
                    selectedPoint={selectedPoint}
                    data={data}
                />
                <OrbitControls
                    enableZoom={true}
                    minDistance={1.7}
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
    );
}
