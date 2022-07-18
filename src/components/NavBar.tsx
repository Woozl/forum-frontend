import { Box, Button, ButtonGroup, Flex, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  return (
    <Box bg='blue.100' py='4' px='4'>
      <HStack spacing='10' justify='space-between'>
        <Flex justify='space-between' flex='1'>
          {/* <ButtonGroup variant='link' spacing='8'>
            <Button color='black'>Link 1</Button>
            <Button color='black'>Link 2</Button>
          </ButtonGroup> */}
          <HStack spacing='3' ml='auto'>
            <NextLink href='/login'>
              <Button variant='unstyled'>Log In</Button>
            </NextLink>
            <NextLink href='/register'>
              <Button variant='solid' colorScheme='blue'>
                Register
              </Button>
            </NextLink>
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
};

export default NavBar;
