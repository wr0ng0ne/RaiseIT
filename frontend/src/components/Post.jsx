import { useEffect, useState } from "react";
import { Avatar, Flex, Box, Text, Image } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import {formatDistanceToNow} from "date-fns";

const Post = ({ post, postedBy }) => {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();




  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  if (!user) return null;

  return (
    <Flex gap={3} mb={4} py={5}>
      <Flex flexDirection="column" alignItems="center">
        <Avatar
          size="md"
          name={user?.name}
          src={user?.profilePic}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/${user.username}`);
          }}
        />
        <Box w="1px" h="full" bg="gray.200" my={2}></Box>
        <Box position="relative" w="full">
          {post?.replies?.length === 0 && (
            <Text textAlign="center" fontSize="sm" color="gray.200">
              🥱
            </Text>
          )}
          {post?.replies?.map((reply, index) => (
            <Avatar
              key={index}
              size="xs"
              name={reply.username || "User"}
              src={reply.userProfilePic}
              position="absolute"
              top={`${index * 10}px`}
              left="15px"
              padding="2px"
            />
          ))}
        </Box>
      </Flex>

      <Flex flex={1} flexDirection="column" gap={2}>
        <Flex justifyContent="space-between" w={"full"}>
          <Flex w={"full"} alignItems="center">
            <Text
              fontSize="sm"
              fontWeight="bold"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user.name}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
          <BsThreeDots />
        </Flex>

        <Text fontSize="sm" color="gray.500">
          {formatDistanceToNow(new Date(post.createdAt))} ago
        </Text>
        
        <Link to={`/${user.username}/post/${post._id}`} onClick={(e) => e.stopPropagation()}>
          <Text fontSize="sm">{post.text}</Text>
        </Link>

        {post.img && (
          <Box borderRadius={6} overflow="hidden" border="1px solid" borderColor="gray.200">
            <Image src={post.img} w="full" />
          </Box>
        )}

        <Flex gap={3} my={1}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>

        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.200"} fontSize={"sm"}>{post.replies?.length || 0} Replies</Text>
          <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.200"}></Box>
          <Text color={"gray.200"} fontSize={"sm"}>{post.likes?.length || 0} Likes</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Post;
