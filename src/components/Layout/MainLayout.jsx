import { Box } from "@chakra-ui/react";
import RotatingEarth from "../RotatingEarth";
import Time from "../Main/Time";
import InfoDrawer from "../Main/InfoDrawer";
import MainPanel from "../Main/MainPanel";

export default function MainLayout() {
    return (
        <Box>
            {/* Full - Left */}
            {/* <InfoDrawer/> */}

            {/* Top - Right  */}
            {/* <Time/> */}

            {/* Center */}
            <RotatingEarth dev={true}/>
            
            {/* Bottom - Right  */}
            <MainPanel/>
        </Box>
    )
}