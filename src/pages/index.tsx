import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { PostsDocument, usePostsQuery } from '../generated/graphql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null
  });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  if (!fetching && !data)
    return (
      <Text display='flex' fontSize='lg' width='min-content' mx='auto' my='8'>
        Something went wrong...
      </Text>
    );

  return (
    <Layout>
      {!fetching && data?.posts ? (
        <Stack spacing='4'>
          {data?.posts.posts.map((post) => (
            <Box key={post.id} p='5' shadow='md' borderWidth='1px'>
              <Flex>
                <Heading fontSize='xl'>{post.title}</Heading>
                <Text ml='auto' textColor='gray.500'>
                  {post.creator.username} |{' '}
                  {new Date(parseInt(post.createdAt)).toLocaleString('en-US')}
                </Text>
              </Flex>
              <Text mt='2'>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text display='flex' fontSize='lg' width='min-content' mx='auto' my='8'>
          Loading...
        </Text>
      )}

      {data?.posts.hasMore && (
        <Button
          isLoading={fetching}
          display='flex'
          my='8'
          mx='auto'
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            });
          }}
        >
          Load more...
        </Button>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
