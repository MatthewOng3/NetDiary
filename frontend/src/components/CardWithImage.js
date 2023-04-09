import Card from 'react-bootstrap/Card';

function CardWithImage({children, title, source}){
    return(
        <Card style={{ width: '390px' , height: '500px'}}>
            <Card.Img variant="top" src={source} />
            <Card.Body style={{backgroundColor: '#e2e4eb', overflow: 'hidden' }}>
                <Card.Title style={{display: 'flex', justifyContent: 'center'}}><h4>{title}</h4></Card.Title>
                <Card.Text style={{ marginTop: '10%', fontFamily: 'sans-serif', fontSize: '20px'}}>
                {children}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default CardWithImage;