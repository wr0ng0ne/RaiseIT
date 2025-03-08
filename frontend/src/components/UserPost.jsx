import { useState } from "react";
import { Avatar, Flex, Box, Text, Image } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";

const UserPost = ({ posImg, postTitle, likes = 0, replies = 0, username = "Mark Zuckerberg", userAvatar = "/zuck-avatar.png" }) => {
  const [liked, setLiked] = useState(false);

  return (
    <Flex gap={3} mb={4} py={5}>
      <Box position="relative">
        <Avatar size="md" name={username} src={userAvatar} />
        <Box position="absolute" bottom="-10px" left="50%" transform="translateX(-50%)">
          <Avatar size="xs" name="John Doe" src="https://bit.ly/dan-abrmov" />
          <Avatar size="xs" name="Dan" src="https://bit.ly/sage-adbebayo" />
          <Avatar size="xs" name="Alexandra" src="https://bit.ly/prosper-baba" />
        </Box>
      </Box>

      <Box w="1px" h="full" bg="gray.200" my={2}></Box>

      <Box w="full">
        <Flex flex="1" flexDirection="column" gap={2}>
          <Flex justifyContent="space-between" w="full" alignItems="center">
            <Flex alignItems="center">
              <Text fontSize="sm" fontWeight="bold">{username}</Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <BsThreeDots />
          </Flex>

          <Text fontSize="sm" color="gray.500">1d</Text>
          <Text fontSize="sm">{postTitle}</Text>

          {posImg && ( 
            <Link to={`/${username}/post/1`}>
              <Box borderRadius={6} overflow="hidden" border="1px solid" borderColor="gray.200">
                <Image src={posImg} w="full" />
              </Box>
            </Link>
          )}

          <Actions liked={liked} setLiked={setLiked} />

          <Flex mt={2}>
            <Text fontSize="sm" color="gray.500" mr={2}>{likes} likes</Text>
            <Text fontSize="sm" color="gray.500">{replies} replies</Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default UserPost;
