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
function Comparison() {

    const oldWay = [
        "Inconvenient to share favourite saved webpages/links",
        "Unappealing user interface",
    ];

    const newWay = [
        "Organised and customisable descriptions",
        "Create a cluster which opens all the webpages in new tabs with just one click!",
    ];

    return (
        <section className=" w-full  flex justify-center" style={{ backgroundColor: '#151515', padding: '1%', height: 575 }}>
            <div className="comparison-container">
                <Card sx={{ width: 370, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                        sx={{ height: '60%' }}
                        image="/images/chrome_bookmark1.png"
                        title="bookmark"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '45%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                            {oldWay.map((benefit, index) => (
                                <XIconComponent key={index}>{benefit}</XIconComponent>
                            ))}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ width: 370, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                        sx={{ height: '60%' }}
                        image="/images/workflow.PNG"
                        title="green iguana"
                    />
                    <CardContent sx={{ borderTop: '1px solid gray', display: 'flex', flexDirection: 'column', height: '45%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
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