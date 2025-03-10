import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Spinner, Flex } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, { signal: abortController.signal });
        const data = await res.json();
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast("Error", error.message || "Something went wrong", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();

    return () => abortController.abort();
  }, [username]);

  if (!user && loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <UserHeader user={user} />
      <UserPost likes={1200} replies={481} posImg="/post1.png" postTitle="Let's talk about threads." />
      <UserPost likes={451} replies={12} posImg="/post2.png" postTitle="Nice tutorial" />
      <UserPost likes={321} replies={989} posImg="/post3.png" postTitle="I love this guy" />
      <UserPost likes={212} replies={56} postTitle="This is my first thread" />
    </>
  );
};

export default UserPage;
