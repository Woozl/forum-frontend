import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { List, ListItem } from '@chakra-ui/react';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      {data?.posts ? (
        <List>
          {data?.posts.map((post) => (
            <ListItem key={post.id}>{post.title}</ListItem>
          ))}
        </List>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
