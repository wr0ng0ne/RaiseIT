import { Button} from "@chakra-ui/react";
import {Container} from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";
import LogoutButton from "./components/LogoutButton.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
       <Route path="/" element={user? <HomePage/> : <Navigate to = 'auth'/>} /> 
       <Route path="/auth" element={!user? <AuthPage/> : <Navigate to= '/' />}/>
       <Route path="/:username" element={<UserPage /> }/> 
       <Route path="/:username/post/:pid" element={<PostPage/> }/> 
      </Routes>

      {user && <LogoutButton/> }
    </Container>
  );
}

export default App;
