import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
    <UserHeader />
    <UserPost likes={1200} replies={481} posImg="/post1.png" postTitle="Let's talk about threads."/>
    <UserPost likes={451} replies={12} posImg="/post2.png" postTitle="Nice tutorial"/>
    <UserPost likes={321} replies={989} posImg="/post3.png" postTitle="I love this guy"/>
    <UserPost likes={212} replies={56} postTitle="his is my first thread"/>
    

    </>
  )
};

export default UserPage;
