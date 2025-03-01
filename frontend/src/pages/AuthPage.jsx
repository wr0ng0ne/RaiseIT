import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);
    
    useEffect(() => {
        console.log(authScreenState);
    }, [authScreenState]);

    return <> {authScreenState === "login" ? <LoginCard/> : <SignupCard/>}</>;
};
export default AuthPage;

