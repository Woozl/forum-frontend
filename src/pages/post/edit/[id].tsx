import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Stack
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      postId: intId
    }
  });
  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <Layout>
        <Stack>
          <Skeleton height='3rem' width='40%' />
          <Divider />
          <Skeleton height='1.5rem' />
          <Skeleton height='1.5rem' />
          <Skeleton height='1.5rem' />
        </Stack>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading>Could not find that post...</Heading>
      </Layout>
    );
  }

  return (
    <Layout variant='regular'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (v) => {
          await updatePost({ ...v, updatePostId: intId });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex flexDir='column'>
              <Heading size='md'>Update Post</Heading>
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
                Update Post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
