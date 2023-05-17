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
        "Messy notes",
        "Long and unorganised",
        "Forget that you have them"
    ];

    const newWay = [
        "Organised and quick",
        "Free",
        "Easy storage"
    ];

    return (
        <section className=" w-full  flex justify-center" style={{backgroundColor: 'orange', padding: '2%', height: 550}}>
            <div className="comparison-container">
                <Card sx={{  width: 370, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardMedia
                        sx={{ height: 300 }}
                        image="/images/oldway1.jpg"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '40%'}}>
                        <Typography gutterBottom variant="h6" component="div">
                        Does storing your links look something like this?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {oldWay.map((benefit, index) => (
                            <XIconComponent key={index}>{benefit}</XIconComponent>
                        ))}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{  width: 370, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardMedia
                        sx={{ height: 320 }}
                        image="/images/betterway.PNG"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '40%'}}>
                        <Typography gutterBottom variant="h6" component="div">
                        The Solution
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