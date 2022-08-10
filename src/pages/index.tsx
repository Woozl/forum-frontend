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
import dateFormatOptions from '../utils/dateFormatOptions';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null,
    clipLength: 300
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
                      <Flex ml='auto' textColor='gray.500'>
                        <Text color='blackAlpha.800' fontWeight='bold'>
                          {post.creator.username}
                        </Text>
                        <Text pl='2' pr='2'>
                          •
                        </Text>
                        <Text>
                          {new Date(
                            parseInt(post.createdAt)
                          ).toLocaleTimeString('en-US', dateFormatOptions)}
                        </Text>
                      </Flex>
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

      {postsData?.posts.hasMore ? (
        <Button
          isLoading={fetching}
          display='flex'
          my='8'
          mx='auto'
          onClick={() => {
            setVariables((prev) => {
              return {
                limit: variables.limit,
                cursor:
                  postsData.posts.posts[postsData.posts.posts.length - 1]
                    .createdAt,
                clipLength: prev.clipLength
              };
            });
          }}
        >
          Load more...
        </Button>
      ) : (
        <Text my='4' textAlign='center'>
          You've reached the end!
        </Text>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
