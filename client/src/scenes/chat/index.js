import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import React from 'react';
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import ChatContainer from 'components/ChatContainer';




const Chat = () => {
    const theme = useTheme()
    const { _id } = useSelector((state) => state.user);
    
    return (
    <Box>
            <Navbar />
            <Box
                display='flex'
                justifyContent='center'
                alignItems='flex-start'
            >
                <WidgetWrapper
                    width='80%'
                    my={'1.2rem'}
                    height='85vh'
                >
                    <FlexBetween width='100%' height='75vh' gap='1rem' boxSizing='border-box'>
                        <Box display={'flex'}
                            justifyContent='flex-start'
                            height='100%'
                            flexDirection={'column'}
                        >
                            {/*      <GroupChat /> */}
                            <FriendListWidget
                                bgcolor={theme.palette.background.default} userId={_id}
                                isChat={true}

                            />
                        </Box>

                        <Box
                            width='100%'
                            height='80vh'
                            bgcolor={theme.palette.background.default}
                            boxSizing='border-box'
                            display='flex'
                            alignItems='stretch'
                        >

                            <ChatContainer />

                        </Box>
                    </FlexBetween>
                </WidgetWrapper>

            </Box>




        </Box>
    );
}

export default Chat;