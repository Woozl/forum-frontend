import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useLogOutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  const [{ data, fetching: meFetching }] = useMeQuery();
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
            onClick={async () => {
              await logout();
              router.reload();
            }}
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
          <ButtonGroup variant='link' spacing='4' alignItems='center'>
            <NextLink href='/'>
              <Button size='lg' color='blackAlpha.900'>
                Home
              </Button>
            </NextLink>
            <NextLink href='/create-post'>
              <IconButton
                size='sm'
                variant='solid'
                aria-label='downvote'
                colorScheme='blue'
                icon={<AddIcon />}
              />
            </NextLink>
          </ButtonGroup>
          <HStack spacing='3' ml='auto'>
            {body}
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
};

export default NavBar;
