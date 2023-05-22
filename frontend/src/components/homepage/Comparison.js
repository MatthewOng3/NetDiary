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
        "Struggle to remember a restaurant recommendation last week",
        "Tired of jumbled notes and disorganized links",
        "Sharing your favorite food places feel inconvenient"
    ];

    const newWay = [
        "Organised and quick",
        "Share with a click of a button and sending the link"
    ];

    return (
        <section className=" w-full  flex justify-center" style={{backgroundColor: 'orange', padding: '1%', height: 575}}>
            <div className="comparison-container">
                <Card sx={{  width: 370, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardMedia
                        sx={{ height: '60%' }}
                        image="/images/oldway1.jpg"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '45%'}}>
                        <Typography variant="body2" color="text.secondary" sx={{fontSize: '13px',fontWeight: 'bold'}}>
                        {oldWay.map((benefit, index) => (
                            <XIconComponent key={index}>{benefit}</XIconComponent>
                        ))}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{  width: 370, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <CardMedia
                        sx={{ height: '60%' }}
                        image="/images/betterway.PNG"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '45%'}}>
                        <Typography variant="body2" color="text.secondary" sx={{fontSize: '13px',fontWeight: 'bold'}}>
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