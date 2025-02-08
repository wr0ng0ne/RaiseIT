import { Flex } from "@chakra-ui/react";

const Actions = ({ liked, setLiked }) => {
  return (
    <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
      {/* Like Button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill={liked ? "red" : "none"}  // Fill red when liked
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={(e) => {
          e.stopPropagation(); // Prevent link navigation
          setLiked((prev) => !prev); // Toggle like state
        }}
        style={{ cursor: "pointer" }} // Show clickable cursor
      >
        <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6z"></path>
      </svg>

      {/* Comment Button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-3.3 6.7c-1.3 1-3 1.8-4.7 2H12l-3.5 2 .5-3.5H7a8.5 8.5 0 1 1 14-7.2z"></path>
      </svg>

      {/* Repost Button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 1l4 4-4 4"></path>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
        <path d="M7 23l-4-4 4-4"></path>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
      </svg>
    </Flex>
  );
};

export default Actions;
