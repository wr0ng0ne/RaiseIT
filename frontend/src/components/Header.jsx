import { Flex, useColorMode, Image, Link, IconButton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex as="nav" justifyContent="space-between" align="center" mt={6} mb="12">
      {user && (
        <Link as={RouterLink} to="/" aria-label="Home">
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        fallbackSrc="/default-logo.svg"
      />

      <IconButton
        aria-label="Toggle Dark Mode"
        icon={colorMode === "dark" ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        onClick={toggleColorMode}
        size="sm"
        variant="ghost"
      />

      {user?.username && (
        <Link as={RouterLink} to={`/${user.username}`} aria-label="Profile">
          <RxAvatar size={24} />
        </Link>
      )}
    </Flex>
  );
};
export default Header;