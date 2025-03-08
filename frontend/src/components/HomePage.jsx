import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
const HomePage = () => {
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Failed to fetch posts", error.message, "error");
            } finally {
                setLoading(false);
            }
        };

        getFeedPosts();
    }, [showToast]);

    return (
        <>
            {!loading && posts.length === 0 && (
                <Text fontSize="xl" textAlign="center" mt={10}>
                    Follow some users to see the feed
                </Text>
            )}
            {loading && (
                <Flex justifyContent="center" mt={10}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default HomePage;