import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useDeletePostMutation, useMeQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
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
        <Heading>{data.post.title ?? ''}</Heading>
        <Tooltip label='Edit post' placement='top'>
          <NextLink href='/post/edit/[id]' as={`/post/edit/${data.post.id}`}>
            <IconButton
              as={Link}
              ml='2'
              visibility={
                data.post.creatorId === meData?.me?.id ? 'visible' : 'hidden'
              }
              aria-label='Edit Post'
              icon={<EditIcon />}
              size='sm'
              variant='link'
            />
          </NextLink>
        </Tooltip>
        <Tooltip label='Delete post' placement='top'>
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
        </Tooltip>
      </Flex>
      <Divider mt='4' mb='4' borderTop='3px dashed gray' />
      <Text>{data.post.text ?? ''}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
