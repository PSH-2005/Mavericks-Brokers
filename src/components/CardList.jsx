import React from 'react'
import { useHotelContext } from '@/contexts/HotelContext'
import CustomCard from './CustomCard';
import { Container, Heading, HStack,Button } from '@chakra-ui/react';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
// const hotels=[
//     {name:"Radisson Royale",location:"Vasant Kunj, Delhi"},
//     {name:"Raddisson Blue",location:"Mahipalpur, Delhi"}
// ]
const CardList = () => {
    const navigate = useNavigate();
    const {hotels}=useHotelContext()
    const {events}=useEventContext()
    return (
        <HStack gap="2" overflowX={"scroll"} p="2" h="min-content">
        {
            hotels.length>0?
            hotels.map((element)=>{
                return (
                    <CustomCard image={element.image} name={element.name} location={element.location}/>
                )
            })
            :
            // events.map((element:Event)=>{
            //     return (
            //         <CustomCard image={element.image} name={element.name} location={element.location}/> 
            //     )
            // })
            events.map((element)=>(
                <div className="dark-variant" style={{backgroundImage:`url('${element.image}')`}}>
                  <Container className="nested-complication" p="0" >
                    <Container className="inner-border-box" display="flex" gap="3" flexDir="column" p="0">
                      <Heading as="h2" fontSize="1.3rem">{element.name}</Heading>
                    <p>
                        {element.description}
                        {element.location}
                    </p>
                   
                    <Button border="1px solid white" w="11/12" onClick={()=>navigate(`/concerts/${element.id}`)} >Book Now</Button>
                    
                    </Container>
                  </Container>
                </div>
            ))
        }
        </HStack>
    )
}

export default CardList