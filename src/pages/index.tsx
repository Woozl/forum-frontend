import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      {data?.posts.map((post) => {
        return <div key={post.id}>{post.title}</div>;
      }) ?? <div>Loading!!!</div>}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
