import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import Earth from "./pages/Earth";
import RotatingEarth from "./pages/RotatingEarth";
// import {  } from '@chakra-ui/react'

const theme = extendTheme({});

export default function App() {
    return (
        <ChakraProvider theme={theme}>
          
            {/* <Heading>Hello Earth</Heading> */}
            {/* <Earth/> */}
            
            <RotatingEarth />
        </ChakraProvider>
    );
}
