import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    activeFriend: null,
    chat: [],
    selectedChat: [],
    messages: [],
    notification: [],
    friends:[]
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = initialState.user;
            state.token = initialState.token;
            state.selectedChat = initialState.selectedChat;
            state.user = initialState.user;
            state.notification = initialState.notification;
            state.activeFriend = initialState.activeFriend;
            state.mode=initialState.mode;
            state.messages=initialState.messages;
            state.posts=initialState.posts;
            state.chat=initialState.chat;
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non-existent :(");
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPostComment: (state, action) => {
            const { postId, comments } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex].comments = comments;
            }
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
        setActiveFriend: (state, action) => {
            state.activeFriend = action.payload;
        },
        setChat: (state, action) => {
            state.chat = action.payload;
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        resetActiveFriend: (state) => {
            state.activeFriend = null;
        },
       

    },
});

export const { setMode,
    setLogin,
    setLogout,
    setFriends,
    setPosts,
    setPost,
    setActiveFriend,
    setSelectedChat,
    setChat,
    setNotification,
    resetActiveFriend,
    setPostComment,
     } =
    authSlice.actions;
export default authSlice.reducer;