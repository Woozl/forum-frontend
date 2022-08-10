import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { VoteSection } from '../../components/VoteSection';
import { useDeletePostMutation, useMeQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import dateFormatOptions from '../../utils/dateFormatOptions';
import { useGetIntId } from '../../utils/useGetIntId';
import { useGetPostFromUrl } from '../../utils/useGetPostUrl';

const Post = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useGetPostFromUrl();
  const intId = useGetIntId();
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

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
      <Flex>
        <VoteSection post={data.post} size='small' />
        <Box width='100%'>
          <Heading>{data.post.title ?? ''}</Heading>
          <Flex textColor='gray.500' mt='2'>
            <Text color='blackAlpha.800' fontWeight='bold'>
              {data.post.creator.username}
            </Text>
            <Text pl='2' pr='2'>
              •
            </Text>
            <Text>
              {new Date(parseInt(data.post.createdAt)).toLocaleTimeString(
                'en-US',
                dateFormatOptions
              )}
            </Text>
            <Box ml='auto'>
              <NextLink
                href='/post/edit/[id]'
                as={`/post/edit/${data.post.id}`}
              >
                <IconButton
                  as={Link}
                  ml='2'
                  visibility={
                    data.post.creatorId === meData?.me?.id
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
                  data.post.creatorId === meData?.me?.id ? 'visible' : 'hidden'
                }
                onClick={async () => {
                  await deletePost({ postId: intId });
                  router.push('/');
                }}
                aria-label='Delete Post'
                icon={<DeleteIcon />}
                size='sm'
                colorScheme='red'
                variant='link'
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Divider mt='4' mb='4' borderTop='3px dashed gray' />
      <Text>{data.post.text ?? ''}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
