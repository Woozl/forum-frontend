import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (v, { setErrors }) => {
          const response = await login(v);

          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push('/');
            typeof router.query.next === 'string'
              ? router.push(router.query.next)
              : router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex flexDir='column'>
              <InputField
                name='usernameOrEmail'
                placeholder='Username or Email'
                label='Username or Email'
              />
              <Box mt='4'>
                <InputField
                  name='password'
                  placeholder='Password'
                  label='Password'
                  type='password'
                />
              </Box>
              <Button
                mt='6'
                type='submit'
                colorScheme='blue'
                isLoading={isSubmitting}
              >
                Log In
              </Button>
              <Link href='/forgot-password'>Forgot password.</Link>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
