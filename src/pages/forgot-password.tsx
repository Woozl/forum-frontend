import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';

interface LoginProps {}

const ForgotPassword: React.FC<LoginProps> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [{}, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (v) => {
          await forgotPassword(v);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with that email exists, we've sent it an email.
            </Box>
          ) : (
            <Form>
              <Box mt='4'>
                <InputField
                  name='email'
                  placeholder='example@email.com'
                  label='Email'
                  type='email'
                />
              </Box>
              <Button
                mt='6'
                type='submit'
                colorScheme='blue'
                isLoading={isSubmitting}
              >
                Send Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
