import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import { useState } from 'react';
import * as React from 'react';

function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) + :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));


/**
 * @description The section of the home page where we display benefits of net diary
 * @path /
 * @see HomePage
 */
function Applications() {

    return (
        <section className=" w-full  flex justify-center" style={{ backgroundColor: '#0a0a0a', padding: '1%', height: 575 }}>
            <Root>
                <h1 style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>Applications</h1>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Card sx={{ maxWidth: 350, height: '400px' }}>
                        <CardMedia
                            sx={{ height: '60%' }}
                            image="/images/application_workflow.png"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                <Divider >One-Click Workflow</Divider>
                            </Typography>
                            <List
                                sx={{
                                    listStyleType: 'disc',
                                    listStylePosition: 'inside'
                                }}
                            >
                                <ListItem sx={{ display: 'list-item', fontSize: '17px' }}>
                                    Create a cluster and easily access all websites related to your workflow with just a click of a button
                                </ListItem>

                            </List>
                        </CardContent>
                    </Card>
                    <Card sx={{ maxWidth: 350, height: '400px' }}>
                        <CardMedia
                            sx={{ height: '60%' }}
                            image="/images/food_small.jpg"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                <Divider sx={{}}>Share favourite, well anything :D</Divider>
                            </Typography>
                            <List
                                sx={{
                                    listStyleType: 'disc',
                                    listStylePosition: 'inside'
                                }}
                            >
                                <ListItem sx={{ display: 'list-item', fontSize: '17px' }} >
                                    Save and share favourite list of restaurant spots amongst other things!
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card sx={{ maxWidth: 350, height: '400px' }}>
                        <CardMedia
                            sx={{ height: '60%' }}
                            image="/images/essay.png"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                <Divider>School Report Writing</Divider>
                            </Typography>
                            <List
                                sx={{
                                    listStyleType: 'disc',
                                    listStylePosition: 'inside'
                                }}
                            >
                                <ListItem sx={{ display: 'list-item', fontSize: '17px' }}>
                                    Store all your essay sources with easy accessibility
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </div>
            </Root>
        </section>
    );
}

export default Applications;