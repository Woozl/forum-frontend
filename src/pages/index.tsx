import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
      textSnippetLength: 220
    }
  });
  return (
    <Layout>
      {data?.posts ? (
        <Stack spacing='4'>
          {data?.posts.map((post) => (
            <Box key={post.id} p='5' shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{post.title}</Heading>
              <Text mt='2'>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
