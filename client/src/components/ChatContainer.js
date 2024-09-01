import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveFriend, setNotification } from 'state';
import { resetActiveFriend } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import ChatInput from './ChatInput';
import Message from './Message';
import { io } from 'socket.io-client';
const ENDPOINT = 'http://localhost:3001';
var socket, selectedChatCompare;


const ChatContainer = () => {
    const [user, setUser] = useState(null);
    const theme = useTheme()
    const token = useSelector((state) => state.token);
    const activeFriend = useSelector((state) => state.activeFriend);
    const selectedChat = useSelector((state) => state.selectedChat);
    const { _id } = useSelector((state) => state.user);
    const [messages, setMessages] = useState('');
    const friends = useSelector((state)=>state.user.friends);
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);
    const notification = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", _id);
        socket.on("connected", () => {
            setSocketConnected(true)
        }
        );
    }, []);



    const getUser = async () => {
        if(activeFriend){
            const response = await fetch(`http://localhost:3001/users/${activeFriend}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
        }
    };

    useEffect(() => {
        socket.on("messagereceived", (newMessage) => {
          console.log("I'm there in chatcontainer", JSON.stringify(newMessage, null, 2));
          console.log("compare id",selectedChatCompare._id);
          console.log("newmessage.chat._id",newMessage.chat._id); 
          
         
                if (!notification.includes(newMessage)) {
                  console.log("in if condition");
                    dispatch(setNotification([newMessage, ...notification]));
                    /*  setFetchAgain(!fetchAgain); */
                    //        fetchMessages();
                }
                else {
                setMessages([...messages, newMessage]);
                }
        });
    },[dispatch, messages, notification]);

    const fetchMessages = async () => {
        
            try {
                setLoading(true);
                if (selectedChat._id !== undefined) {
                    const response = await fetch(`http://localhost:3001/message/${selectedChat._id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setMessages(data);
                    socket.emit("join chat", selectedChat._id);
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
            } finally {
                setLoading(false); // Ensure loading state is reset even if an error occurs
            }
        
    };


    useEffect(() => {
      if(!friends.some(friend => friend._id === activeFriend)){
        dispatch(setActiveFriend(null));
      }
      if (activeFriend === null) {
        setUser(null);
      } else {
        getUser();
      }
    }, [friends,activeFriend]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);// eslint-disable-line react-hooks/exhaustive-deps

   


    return (
        <FlexBetween flexDirection='column' width='100%' mx='1rem' my='1rem' >
            <Box width='100%' height='65vh' boxSizing='border-box'
                 >
                {user ? (
  <>
    <Box
      display="flex"
      gap="2rem"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.75rem",
        padding: ".3rem",
      }}
    >
      <UserImage size="60px" image={user.picturePath} />
      <Typography fontSize="1rem">
        {user.firstName} {user.lastName}
      </Typography>
    </Box>
    <Message messages={messages} />
    <Box
      width="100%"
      sx={{
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.75rem",
        padding: ".3rem",
      }}
    >
      <ChatInput fetchMessages={fetchMessages} />
    </Box>
  </>
) : friends.length === 0 ? (
  <Typography
    fontSize="1rem"
    textAlign="center"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    Add friends to start chatting.
  </Typography>
) : (
  <Typography
    fontSize="1rem"
    textAlign="center"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    Select Friend From Friend List To Chat.
  </Typography>
)}

            </Box>


        </FlexBetween>

    );
}

export default ChatContainer;