import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setActiveFriend, setChat, setSelectedChat } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useState } from "react";

const 
Friend = ({ friendId, name, subtitle, userPicturePath, isChat, isSearch, isGroupChat }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const users = useSelector((state)=>state.user);
    const friends = useSelector((state) => state.user.friends);
    const chat = useSelector((state) => state.chat);
    const selectedChat = useSelector((state) => state.selectedChat);
    const [loadingChat, setLoadingChat] = useState(true)

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find((friend) => friend._id === friendId);  // Check if post author is a friend
    const isUser = friendId === _id;


    const accessChat = async () => {
        try {
            setLoadingChat(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat`, {
                method: "POST",
                body: JSON.stringify({
                    userId: _id,
                    friendId: friendId,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!chat.find((c) => c._id === data._id)) {
                dispatch(setChat([data, ...chat]));
            }

            dispatch(setSelectedChat(data));
            setLoadingChat(false);
        } catch (error) {
            console.log("error on access chat")
        }
    };
    const handleClick = () => {
       
            dispatch(setActiveFriend(friendId)); // Dispatch setActiveFriend action when the friend is clicked
     
            accessChat()
        
    };



    const patchFriend = async () => {
        try{
            const response = await fetch(
                `${process.env.REACT_APP_BASE_URL}/users/${_id}/${friendId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            dispatch(setFriends({ friends: data }));
        }catch(error){
            console.log("Error for patchfriend is"+error);
        }
        
    };

    const handleProfileClick = () => {
        if (!isChat || isSearch) {
            navigate(`/profile/${friendId}?`); // Append the isChat query parameter to the URL
            navigate(0);
        }
        if (isChat) {

        }
    };


    return (
        <FlexBetween onClick={() => handleClick()}>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => handleProfileClick()}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {!isChat && (<IconButton
                
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
                {isUser ? <></> : isFriend ? (
  <PersonRemoveOutlined sx={{ color: primaryDark }} onClick={() => patchFriend()}/>
) : (
  <PersonAddOutlined sx={{ color: primaryDark }} onClick={() => patchFriend()}/>
)}
            </IconButton>)
            }
            {!isSearch && isGroupChat && (<IconButton
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
               {isUser ? <></> : isFriend ? (
  <PersonRemoveOutlined sx={{ color: primaryDark }} onClick={() => patchFriend()}/>
) : (
  <PersonAddOutlined sx={{ color: primaryDark }} onClick={() => patchFriend()}/>
)}
            </IconButton>)
            }
        </FlexBetween>
    );
};

export default Friend;