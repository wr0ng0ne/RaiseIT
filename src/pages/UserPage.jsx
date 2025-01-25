import { Avatar, Box, Flex, VStack,Text } from "@chakra-ui/react";

const UserPage = () => {
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"}>Mark Zukerberg</Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>markzuckerburg</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                        threads.next
                    </Text>
                </Flex>
            </Box>
            <Box>
                <Avatar
                name="Mark Zuckerberg"
                src="/zuck-avatar.png"
                size={"xl"}
                />
            </Box>
        </Flex>
      <Box></Box>
    </VStack>
  );
};

export default UserPage;
