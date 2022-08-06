import { Divider, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      postId: intId
    }
  });

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
      <Heading>{data.post.title ?? ''}</Heading>
      <Divider mt='4' mb='4' borderTop='3px dashed gray' />
      <Text>{data.post.text ?? ''}</Text>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Post);
