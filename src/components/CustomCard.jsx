import { Button, Card, Image, Text } from "@chakra-ui/react"
import { useState } from "react";

const CustomCard = (props) => {
  return (
    <Card.Root maxW="sm" minW="85%" h="370px">
      <Image
        src={props.image?props.image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
        alt={props.name} 
        h="50%"
      />
      <Card.Body gap="0.5" h="50%">
        <Card.Title>{props.name.slice(0,25)}</Card.Title>
        <Card.Description>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces. Located in {props.location}
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2" display="flex" justifyContent={"space-between"} >
        <Button variant="solid">Book Now</Button>
        <Text textStyle="2xl" fontWeight="light" letterSpacing="tight" mt="2" color="grey" >
          $450
        </Text>

        {/* <Button variant="ghost">Add to cart</Button> */}
      </Card.Footer>
    </Card.Root>
  )
}
export default CustomCard
