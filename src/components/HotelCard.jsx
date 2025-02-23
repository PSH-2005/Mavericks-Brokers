import { Button, Card, Image, Text,RatingGroup } from "@chakra-ui/react"
import { useState } from "react";
import { LuStar } from "react-icons/lu";
const HotelCard = (props) => {
  return (
    <Card.Root maxW="sm" minW="85%" h="450px" shadow="xl">
      <Image
        src={props.image?props.image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
        alt={props.name} 
        h="50%"
      />
      <Card.Body gap="0.5" h="50%" shadow={"md"}>
        <Card.Title>{props.name}</Card.Title>
        <RatingGroup.Root readOnly count={5} defaultValue={3} size="sm" colorPalette="yellow">
            <RatingGroup.HiddenInput />
            <RatingGroup.Control>
            {Array.from({ length: 5 }).map((_, index) => (
            <RatingGroup.Item key={index} index={index + 1}>
                <RatingGroup.ItemIndicator/>
            </RatingGroup.Item>
        ))}
      </RatingGroup.Control>
    </RatingGroup.Root>
        <Card.Description>
          This sofa is perfect for modern tropical spaces, baroque inspired
          spaces. Located in {props.location}
        </Card.Description>
      </Card.Body>
      <Card.Footer p="2" gap="2" display="flex" justifyContent="space-between" alignItems="center" >
        <Button variant="solid" w="1/2" h="12" bgColor={"blue.900"}>Book Now</Button>
        <Text textStyle="2xl" fontWeight="light" letterSpacing="tight" mt="2" color="grey" >
          $450
        </Text>

        {/* <Button variant="ghost">Add to cart</Button> */}
      </Card.Footer>
    </Card.Root>
  )
}
export default HotelCard
