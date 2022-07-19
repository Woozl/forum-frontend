import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useLogOutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  // useEffect only runs in the browser, so just set state, which will rerender the page
  const [isServer, setIsServer] = useState(true);
  useEffect(() => setIsServer(false), []);

  const [{ data, fetching: meFetching }] = useMeQuery({ pause: isServer });
  const [{ fetching: LogOutFetching }, logout] = useLogOutMutation();
  let body = null;

  if (meFetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/login'>
          <Button variant='unstyled'>Log In</Button>
        </NextLink>
        <NextLink href='/register'>
          <Button variant='solid' colorScheme='blue'>
            Register
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <Box>{data.me.username}</Box>
        <NextLink href='/'>
          <Button
            variant='solid'
            colorScheme='red'
            isLoading={LogOutFetching}
            onClick={() => logout()}
          >
            Log Out
          </Button>
        </NextLink>
      </>
    );
  }

  return (
    <Box bg='blue.100' py='4' px='4'>
      <HStack spacing='10' justify='space-between'>
        <Flex justify='space-between' flex='1'>
          {/* <ButtonGroup variant='link' spacing='8'>
            <Button color='black'>Link 1</Button>
            <Button color='black'>Link 2</Button>
          </ButtonGroup> */}
          <HStack spacing='3' ml='auto'>
            {body}
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
};

export default NavBar;
