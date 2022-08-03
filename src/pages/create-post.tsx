import { Flex, Button, Box, Textarea, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();
  useIsAuth();

  return (
    <Layout variant='small'>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (v) => {
          console.log(v);
          const { error } = await createPost({ input: v });
          if (!error) router.push('/');
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex flexDir='column'>
              <Heading size='md'>Create Post</Heading>
              <InputField name='title' placeholder='Post Title' label='' />
              <Box mt='4'>
                <InputField
                  name='text'
                  placeholder='Enter post text here...'
                  isTextArea={true}
                  label=''
                />
              </Box>
              <Button
                mt='6'
                type='submit'
                colorScheme='blue'
                isLoading={isSubmitting}
              >
                Submit Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
