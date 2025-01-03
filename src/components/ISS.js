import {  useGLTF } from "@react-three/drei";

export default function ISS() {
  const { scene } = useGLTF('/3D/ISS_small.glb');
  
  return <primitive object={scene} scale={0.04} />; // Adjust scale as needed
}