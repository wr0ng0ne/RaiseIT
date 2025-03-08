import { Avatar, Box, Flex, VStack, Text, Link, MenuButton, Menu, Portal, MenuList, MenuItem, Button, useToast } from "@chakra-ui/react";
import { CgMore } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from 'react-router-dom';
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user.followers.includes(currentUser._id));
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Profile Link Copied",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        setFollowing(false);
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        setFollowing(true);
      }
    } catch (error) {
      showToast("Error", error.message || "Something went wrong", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems="start">
      <Flex justifyContent="space-between" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user.name}
          </Text>
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm">{user.username}</Text>
            <Text fontSize="xs" bg="gray.700" color="gray.100" p={1} borderRadius="full">
              ©raisit
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic || 'https://bit.ly/broken-link'}
            size={{ base: "md", md: "xl" }}
          />
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser._id === user._id ? (
        <Link as={RouterLink} to="/update">
          <Button size="sm">Update Profile</Button>
        </Link>
      ) : (
        <Button size="sm" onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex gap={2} alignItems="center">
        <Text color="gray.500">{user.followers.length} connections</Text>
        <Box w="1" h="1" bg="gray.500" borderRadius="full"></Box>
        <Link href="https://raiseit.org" color="blue.500" isExternal>
          raiseit.org
        </Link>
        <Box>
          <Menu>
            <MenuButton>
              <CgMore size={24} cursor="pointer" />
            </MenuButton>
            <Portal>
              <MenuList bg="gray.700" color="white">
                <MenuItem onClick={copyURL}>Copy link</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
      </Flex>

      <Flex w="full">
        <Flex flex={1} borderBottom="1.5px solid white" justifyContent="center" pb="3" cursor="pointer">
          <Text fontWeight="bold">Topics</Text>
        </Flex>
        <Flex flex={1} borderBottom="1px solid gray" justifyContent="center" color="gray.light" pb="3" cursor="pointer">
          <Text fontWeight="bold">Discussions</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;