import { Sphere, useTexture } from "@react-three/drei";
import { useEffect, useState, useMemo } from "react";
import * as THREE from "three";

export default function MainSphere({
    currentPlanet,
    onSelectPoint,
    selectedPoint,
    data,
}) {
    const [issPosition, setIssPosition] = useState(null);
    const texture = useTexture(
        `/img${data.planets.find((p) => p.name === currentPlanet).src}`
    );

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

                const x = -(1.505 * Math.sin(phi) * Math.cos(theta));
                const y = 1.505 * Math.cos(phi);
                const z = 1.505 * Math.sin(phi) * Math.sin(theta);

                setIssPosition([x, y, z]);
            } catch (error) {
                console.error("Error fetching ISS position:", error);
            }
        };

        // Uncomment the following lines to enable ISS position updates
        // getISSLocation();
        // const interval = setInterval(getISSLocation, 1000);
        // return () => clearInterval(interval);
    }, []);

    // Create ring geometry with custom UV mapping
    const ringGeometry = useMemo(() => {
        const geometry = new THREE.RingGeometry(1.6, 2.3, 128, 1);
        const uv = geometry.attributes.uv.array;

        for (let i = 0; i < uv.length; i += 2) {
            const x = uv[i] - 0.5;
            const y = uv[i + 1] - 0.5;
            const angle = Math.atan2(y, x);
            const radius = Math.sqrt(x * x + y * y);

            uv[i] = (angle + Math.PI) / (2 * Math.PI); // Map angle to [0, 1]
            uv[i + 1] = radius * 1.65; // Map radius to [0, 1]
        }

        geometry.attributes.uv.needsUpdate = true;
        return geometry;
    }, []);

    const ringTexture = useTexture("/img/rings.jpg");
    // ringTexture.wrapS = THREE.RepeatWrapping;
    // ringTexture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical wrapping
    // ringTexture.repeat.set(1, 1); // Ensure no extra repetition

    return (
        <>
            {/* Main Sphere */}
            <Sphere
                args={[1.4, 64, 64]}
                rotation={[currentPlanet == "Earth" ? 0.4 : -0.2, 0, 0]}
            >
                <meshStandardMaterial map={texture} />
            </Sphere>

            {/* Saturn Rings */}
            {currentPlanet == "Saturn" && (
                <mesh geometry={ringGeometry} rotation={[Math.PI / 1.9, 0.2, 0]}>
                    <meshBasicMaterial
                        map={ringTexture}
                        side={THREE.DoubleSide}
                        transparent={true}
                        opacity={0.9}
                        alphaTest={0.4}
                    />
                </mesh>
            )}

            {/* Optional ISS Position */}
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
