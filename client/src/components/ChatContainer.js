import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState,useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveFriend, setNotification } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import ChatInput from './ChatInput';
import Message from './Message';
import { io } from 'socket.io-client';
const ENDPOINT = `${process.env.REACT_APP_BASE_URL}`;
var socket;


const ChatContainer = () => {
    const [user, setUser] = useState(null);
    const theme = useTheme()
    const token = useSelector((state) => state.token);
    const activeFriend = useSelector((state) => state.activeFriend);
    const selectedChat = useSelector((state) => state.selectedChat);
    const { _id } = useSelector((state) => state.user);
    const [messages, setMessages] = useState('');
    const friends = useSelector((state)=>state.user.friends);
    const [socketConnected, setSocketConnected] = useState(false);
    const notification = useSelector((state) => state.notification);
    const dispatch = useDispatch();


    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", _id);
        socket.on("connected", () => {
            setSocketConnected(true)
        }
        );

        return () => {
          socket.disconnect(); 
          setSocketConnected(false);
        };

    }, [_id]);

    const getUser =useCallback(async () => {
        if(activeFriend){
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${activeFriend}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
        }
    },[activeFriend,token]);


    const fetchMessages = useCallback(async () => {
      if (!selectedChat._id) return; 
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/message/${selectedChat._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setMessages(data);
        socket.emit("join chat", selectedChat._id); 
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      } 
    }, [selectedChat._id, token]);

   


    const messageReceivedHandler =useCallback(() =>{
        if(!socketConnected) return;
        socket.on("messagereceived", (newMessage) => {
                if (!notification.includes(newMessage)) {
                    dispatch(setNotification([newMessage, ...notification]));
                    fetchMessages();
                }
                else {
                setMessages([...messages, newMessage]);
                }
        });
    },[dispatch,notification,messages,fetchMessages,socketConnected])
    


    useEffect(() => {
      messageReceivedHandler();
      return () => socket.off("messagereceived");
    }, [messages, notification,messageReceivedHandler]);

  
    useEffect(() => {
      if(!friends.some(friend => friend._id === activeFriend)){
        dispatch(setActiveFriend(null));
      }
      if (activeFriend === null) {
        setUser(null);
      } else {
        getUser();
      }
    }, [friends,activeFriend,getUser,dispatch]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

   


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