import { useState } from "react";
import { setNotification, setSelectedChat, setActiveFriend } from "state";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    Badge,
    Menu
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu as MenuIcon,
    Close,

} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";

const Navbar = () => {

    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchOpen, SetSearchOpen] = useState(false);

    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const fullName = `${user.firstName} ${user.lastName}`;
    const notifications = useSelector((state) => state.notification);
    const selectedChat = useSelector((state) => state.selectedChat);

    const [anchorEl, setAnchorEl] = useState(null);

    const groupedNotifications = notifications.reduce((acc, notification) => {
        const senderId = notification.sender._id;
        if (!acc[senderId]) {
            acc[senderId] = {
                sender: notification.sender,
                count: 0,
                notifications: []
            };
        }
        acc[senderId].count += 1;
        acc[senderId].notifications.push(notification);
        return acc;
    }, {});

    const totalMessagesCount = Object.values(groupedNotifications).reduce((total, group) => {
        return  group.count;
    }, 0);


    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setNotification([]);
    };

    const handleSearch = async () => {
        SetSearchOpen(true)
        if (!search) {
            console.log('No search')
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users?search=${search}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            console.log("error")
        }
    };
    const handleSearchClose = () => {
        SetSearchOpen(false)
        setSearch('')
    }

 //   console.log(notifications);
    return (
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate("/home")}
                    sx={{
                        "&:hover": {
                            color: primaryLight,
                            cursor: "pointer",
                        },
                    }}
                >
                    {/* ConnectU */}
                    Momento
                </Typography>
                {isNonMobileScreens && (
                    <FlexBetween
                        backgroundColor={neutralLight}
                        borderRadius="9px"
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                        position='relative'
                    >
                        <InputBase placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                        <IconButton onClick={() => handleSearch()} >
                            <Search />
                        </IconButton>
                        {searchOpen && (
                            <Box
                                position='absolute'
                                top={40}
                                left={0}
                                sx={{
                                    background: background,
                                    padding: '1rem',
                                    borderRadius: '10px'
                                }}
                            >
                                {loading && <CircularProgress color="inherit" />}
                                {searchResult && (<IconButton onClick={handleSearchClose}>
                                    <Close />
                                </IconButton>)}
                                {searchResult.map((friend) =>

                                    <Friend
                                        key={friend._id}
                                        friendId={friend._id}
                                        name={`${friend.firstName} ${friend.lastName}`}
                                        subtitle={friend.occupation}
                                        userPicturePath={friend.picturePath}
                                        isChat={true}
                                        isSearch={true}
                                    />

                                )}

                            </Box>
                        )}
                    </FlexBetween>
                )}
            </FlexBetween>

            {/* DESKTOP NAV */}
            {isNonMobileScreens ? (
                <FlexBetween gap="2rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === "dark" ? (
                            <DarkMode sx={{ fontSize: "25px" }} />
                        ) : (
                            <LightMode sx={{ color: dark, fontSize: "25px" }} />
                        )}
                    </IconButton>
                    <IconButton onClick={() => navigate('/chat')}>
                        <Message sx={{ fontSize: "25px" }} />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <Badge badgeContent={totalMessagesCount} color="error">
                            <NotificationsIcon sx={{ fontSize: "25px" }} />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        
                        {Object.values(groupedNotifications).map((group, index) => (
        <MenuItem
            key={index}
            onClick={() => {
                const { sender, notifications: senderNotifications } = group;
                
                // Set active friend and selected chat
                dispatch(setActiveFriend(sender._id));
                dispatch(setSelectedChat(senderNotifications[0].chat._id));
                console.log(sender._id);

                // Remove notifications from this sender
                dispatch(setNotification(notifications.filter((n) => n.sender._id !== sender._id)));
                
                handleMenuClose();
            }}
        >
            You got {group.count} message(s) from: {group.sender.firstName}
        </MenuItem>
    ))}
                    </Menu>

                    <Help sx={{ fontSize: "25px" }} />
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem",
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: neutralLight,
                                },
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                        </Select>
                    </FormControl>
                </FlexBetween>
            ) : (
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* MOBILE NAV */}
            {!isNonMobileScreens && isMobileMenuToggled && (
                <Box
                    position="fixed"
                    right="0"
                    bottom="0"
                    height="100%"
                    zIndex="10"
                    maxWidth="500px"
                    minWidth="300px"
                    backgroundColor={background}
                >
                    {/* CLOSE ICON */}
                    <Box display="flex" justifyContent="flex-end" p="1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                        >
                            <Close />
                        </IconButton>
                    </Box>

                    {/* MENU ITEMS */}
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap="3rem"
                    >
                        <IconButton
                            onClick={() => dispatch(setMode())}
                            sx={{ fontSize: "25px" }}
                        >
                            {theme.palette.mode === "dark" ? (
                                <DarkMode sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightMode sx={{ color: dark, fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <IconButton onClick={() => navigate('/chat')}>
                            <Message sx={{ fontSize: "25px" }} />
                        </IconButton>
                        <Notifications sx={{ fontSize: "25px" }} />
                        <Help sx={{ fontSize: "25px" }} />
                        <FormControl variant="standard" value={fullName}>
                            <Select
                                value={fullName}
                                sx={{
                                    backgroundColor: neutralLight,
                                    width: "150px",
                                    borderRadius: "0.25rem",
                                    p: "0.25rem 1rem",
                                    "& .MuiSvgIcon-root": {
                                        pr: "0.25rem",
                                        width: "3rem",
                                    },
                                    "& .MuiSelect-select:focus": {
                                        backgroundColor: neutralLight,
                                    },
                                }}
                                input={<InputBase />}
                            >
                                <MenuItem value={fullName}>
                                    <Typography>{fullName}</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => dispatch(setLogout())}>
                                    Log Out
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </FlexBetween>
                </Box>
            )}
        </FlexBetween>
    );
};

export default Navbar;