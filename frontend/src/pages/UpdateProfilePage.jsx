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
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();

  useEffect(() => {
    setInputs({
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      password: '',
    });
  }, [user]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, 'error');
        setUpdating(false);
        return;
      }

      showToast('Success', 'Profile Updated Successfully', 'success');
      setUser(data);
      localStorage.setItem('user-threads', JSON.stringify(data));
    } catch (error) {
      showToast('Error', error.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'} my={6}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
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
            <Input placeholder="Full Name" value={inputs.name} onChange={handleChange} name="name" />
          </FormControl>

          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Username" value={inputs.username} onChange={handleChange} name="username" />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder="your-email@example.com" value={inputs.email} onChange={handleChange} name="email" />
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input placeholder="Your Bio" value={inputs.bio} onChange={handleChange} name="bio" />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input placeholder="password" value={inputs.password} onChange={handleChange} type="password" name="password" />
          </FormControl>

          <Stack spacing={6} direction={['column', 'row']}>
            <Button bg={'red.400'} color={'white'} w="full" _hover={{ bg: 'red.500' }}>
              Cancel
            </Button>
            <Button bg={'green.400'} color={'white'} w="full" _hover={{ bg: 'green.500' }} type="submit" isLoading={updating}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
