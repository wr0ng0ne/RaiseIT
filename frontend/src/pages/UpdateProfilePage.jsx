'use client';

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useState, useEffect, useRef } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: '',
  });

  useEffect(() => {
    setInputs({
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      password: '',
    });
  }, [user]);

  const fileRef = useRef(null);
  const showToast = useShowToast(); // ✅ FIXED: Now correctly invoking the hook
  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // ✅ FIXED: Corrected typo
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }), // ✅ FIXED: Removed incorrect semicolon
      });

      const data = await res.json();
      if(data.error){
        showToast("Error",data.error,"error");
        return;
      }
      showToast("Sucess","Profile Updated Successfully","success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>

          <FormControl id="userAvatar">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <input type="file" hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              value={inputs.name}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name="name"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Username"
              value={inputs.username}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name="username"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="email"
              name="email"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio"
              value={inputs.bio}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="text"
              name="bio"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={handleChange}
              _placeholder={{ color: 'gray.500' }}
              type="password"
              name="password"
            />
          </FormControl>

          <Stack spacing={6} direction={['column', 'row']}>
            <Button bg={'red.400'} color={'white'} w="full" _hover={{ bg: 'red.500' }}>
              Cancel
            </Button>
            <Button type="submit" bg={'green.400'} color={'white'} w="full" _hover={{ bg: 'green.500' }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
