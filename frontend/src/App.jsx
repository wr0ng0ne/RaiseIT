import { Button} from "@chakra-ui/react";
import {Container} from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";

function App() {

  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
       <Route path="/:username" element={<UserPage /> }/> 
       <Route path="/:username/post/:pid" element={<PostPage/> }/> 
      </Routes>
    </Container>
  );
}

export default App;
