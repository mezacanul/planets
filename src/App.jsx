import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import Main from "./pages/Main";

const theme = extendTheme({
    components: {
        Button: {
          baseStyle: {
            bg: 'transparent',
          },
        },
      },
});

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <Main/>
        </ChakraProvider>
    );
}
