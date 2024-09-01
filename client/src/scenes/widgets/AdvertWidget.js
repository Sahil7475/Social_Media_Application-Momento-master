import { useState, useEffect } from "react";
import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const [memes, setMemes] = useState([]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

    // Fetch memes from the API
    useEffect(() => {
        const fetchMemes = async () => {
            try {
                const response = await fetch("https://api.imgflip.com/get_memes");
                const data = await response.json();
                if (data.success) {
                    setMemes(data.data.memes);
                }
            } catch (error) {
                console.error("Error fetching memes:", error);
            }
        };

        fetchMemes();
    }, []);

    // Rotate memes every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMemeIndex((prevIndex) =>
                prevIndex === memes.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000); 

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [memes]);

    // If there are no memes, don't render anything
    if (memes.length === 0) {
        return null;
    }

    // Get the current meme
    const currentMeme = memes[currentMemeIndex];

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                    Meme of the Moment
                </Typography>
                <Typography color={medium}>Powered by Momento</Typography>
            </FlexBetween>
            <img
                width="100%"
                height="auto"
                alt={currentMeme.name}
                src={currentMeme.url}
                style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <FlexBetween>
                <Typography color={main}>{currentMeme.name}</Typography>
                <Typography color={medium}>Momento</Typography>
            </FlexBetween>
            <Typography color={medium} m="0.5rem 0">
                Enjoy the meme and have a great day!
            </Typography>
        </WidgetWrapper>
    );
};

export default AdvertWidget;
