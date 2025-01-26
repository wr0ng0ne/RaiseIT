import { Avatar, Flex, Box, Text, Image } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";

const UserPost = () => {
  return (
    <Link to="markzugerberg/post/1">
      <Flex gap={3} mb={4} py={5}>
        <Box position="relative">
          <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
          <Box position="absolute" bottom="-10px" left="50%" transform="translateX(-50%)">
            <Avatar
              size="xs"
              name="John doe"
              src="https://bit.ly/dan-abrmov"
              position="absolute"
              bottom="0px"
              left="-10px"
              padding="2px"
            />
            <Avatar
              size="xs"
              name="Dan"
              src="https://bit.ly/sage-adbebayo"
              position="absolute"
              top="0px"
              right="-5px"
              padding="2px"
            />
            <Avatar
              size="xs"
              name="Alexandra"
              src="https://bit.ly/prosper-baba"
              position="absolute"
              top="0px"
              left="4px"
              border="2px"
            />
          </Box>
        </Box>
        <Box w="1px" h="full" bg="gray.200" my={2}></Box>
        <Box w="full">
          <Flex flex="1" flexDirection="column" gap={2}>
            <Flex justifyContent="space-between" w="full" alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                markzukerberg
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>This is my first post</Text>
          <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
            <Image src="/post1.png" w={"full"}/>
          </Box>
        </Box>
      </Flex>
    </Link>
  );
};

export default UserPost;
