import { 
Avatar, Box, Flex, VStack, Text, Link, MenuButton, Menu, Portal, MenuList, MenuItem, 
useToast} from "@chakra-ui/react";
import { CgMore } from "react-icons/cg";
  
  const UserHeader = () => {

    const toast = useToast();

    const copyURL = () => {
      const currentURL = window.location.href;
      navigator.clipboard.writeText(currentURL).then(() => {
        toast({
            title: "Profile Link Copied",
            status: "success",
            duration: "3000",
            isClosable: true,
            
        });
      });
    };
  
    return (
      <VStack gap={4} alignItems="start">
        <Flex justifyContent="space-between" w="full">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Mark Zuckerberg
            </Text>
            <Flex gap={2} alignItems="center">
              <Text fontSize="sm">markzuckerberg</Text>
              <Text fontSize="xs" bg="gray.700" color="gray.100" p={1} borderRadius="full">
              ©raisit
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size="xl" />
          </Box>
        </Flex>
  
        <Text>Co-founder & CEO of "META"</Text>
        <Flex gap={2} alignItems="center">
          <Text color="gray.500">3.2k connections</Text>
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
                  <MenuItem onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>

        <Flex w={"full"}>
            <Flex flex= {1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
                <Text fontWeight={"bold"}> Topics</Text>    
            </Flex>
            <Flex
              flex={1}
              border-bottom={"1px solid gray"}
              justifyContent={"center"}
              color={"gray.light"}
              pb='3'
              cursor={"pointer"}
            >
                 <Text fontWeight={"bold"}> Discussions</Text>
              </Flex>
        </Flex>
      </VStack>
    );
  };
  
  export default UserHeader;
  