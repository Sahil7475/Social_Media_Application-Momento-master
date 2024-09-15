import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId, isChat }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);

    const getFriends = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/users/${userId}/friends`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    useEffect(() => {
        getFriends();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper mt={'1rem'}>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            {friends ?(
                 <Box display="flex" flexDirection="column" gap="1.5rem">
                 {friends.map((friend,index) => (
                     <Friend
                         key={friend._id || index}
                         friendId={friend._id}
                         name={`${friend.firstName} ${friend.lastName}`}
                         subtitle={friend.occupation}
                         userPicturePath={friend.picturePath}
                         isChat={isChat}
                     />
                 ))}
             </Box>
            ):(
                <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                No Friends
            </Typography>
            )}
           
        </WidgetWrapper>
    );
};

export default FriendListWidget;