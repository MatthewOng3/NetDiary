import './Comparison.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { TickIconComponent, XIconComponent } from '../ComparisonComponents';

/**
 * @description The section of the home page where we display benefits of net diary
 * @author Matt
 * @access public
 * @path /
 */
function Comparison(){

    const oldWay = [
        "Old benefit 1",
        "Old benefit 2",
        "Old benefit 3"
    ];

    const newWay = [
        "New benefit 1",
        "New benefit 2",
        "New benefit 3"
    ];

    return (
        <section className=" w-full  flex justify-center" style={{backgroundColor: 'orange', padding: '2%', height: 550}}>
            <div className="comparison-container">
                <Card sx={{  width: 370, height: '100%'}}>
                    <CardMedia
                        sx={{ height: 300 }}
                        image="/images/oldway1.jpg"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray'}}>
                        <Typography gutterBottom variant="h5" component="div">
                        The Old Way
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {oldWay.map((benefit, index) => (
                            <XIconComponent key={index}>{benefit}</XIconComponent>
                        ))}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{  width: 370, height: '100%'}}>
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray'}}>
                        <Typography gutterBottom variant="h5" component="div">
                        The Better Way
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {newWay.map((benefit, index) => (
                            <TickIconComponent key={index}>{benefit}</TickIconComponent>
                        ))}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </section>
        
    );
}

export default Comparison;