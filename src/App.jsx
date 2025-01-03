import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import Main from "./pages/Main";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'white'
      }
    }
  }
});

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <Main dev={false}/>
        </ChakraProvider>
    );
}
