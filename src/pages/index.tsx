import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { VoteSection } from '../components/VoteSection';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery
} from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null
  });
  const [{ data: postsData, fetching, error }] = usePostsQuery({
    variables
  });
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (!fetching && !postsData)
    return (
      <>
        <Text display='flex' fontSize='lg' mx='auto' my='8'>
          Something went wrong...
        </Text>
        <Text>{error?.message}</Text>
      </>
    );

  return (
    <Layout>
      {!fetching && postsData?.posts ? (
        <Stack spacing='4'>
          {postsData?.posts.posts.map((post) =>
            !post ? null : (
              <Box
                key={post.id}
                p='5'
                shadow='md'
                borderWidth='1px'
                borderRadius='2xl'
              >
                <Flex>
                  <VoteSection post={post} />
                  <Box w='100%'>
                    <Flex align='center'>
                      <NextLink href='/post/[id]' as={`/post/${post.id}`}>
                        <Link>
                          <Heading fontSize='xl'>{post.title}</Heading>
                        </Link>
                      </NextLink>
                      <NextLink
                        href='/post/edit/[id]'
                        as={`/post/edit/${post.id}`}
                      >
                        <IconButton
                          as={Link}
                          ml='2'
                          visibility={
                            post.creatorId === meData?.me?.id
                              ? 'visible'
                              : 'hidden'
                          }
                          aria-label='Edit Post'
                          icon={<EditIcon />}
                          size='sm'
                          variant='link'
                        />
                      </NextLink>
                      <IconButton
                        visibility={
                          post.creatorId === meData?.me?.id
                            ? 'visible'
                            : 'hidden'
                        }
                        onClick={() => deletePost({ postId: post.id })}
                        aria-label='Delete Post'
                        icon={<DeleteIcon />}
                        size='sm'
                        colorScheme='red'
                        variant='link'
                      />
                      <Text ml='auto' textColor='gray.500'>
                        {post.creator.username} |{' '}
                        {new Date(parseInt(post.createdAt)).toLocaleString(
                          'en-US'
                        )}
                      </Text>
                    </Flex>

                    <Text mt='2'>{post.textSnippet}</Text>
                  </Box>
                </Flex>
              </Box>
            )
          )}
        </Stack>
      ) : (
        <Text display='flex' fontSize='lg' width='min-content' mx='auto' my='8'>
          Loading...
        </Text>
      )}

      {postsData?.posts.hasMore && (
        <Button
          isLoading={fetching}
          display='flex'
          my='8'
          mx='auto'
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor:
                postsData.posts.posts[postsData.posts.posts.length - 1]
                  .createdAt
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
