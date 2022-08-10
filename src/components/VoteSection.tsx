import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Flex, Text, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteSectionProps {
  post: PostSnippetFragment;
  size?: 'regular' | 'small';
}

export const VoteSection: React.FC<VoteSectionProps> = ({
  post,
  size = 'regular'
}) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr='4'>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoadingState('upvote-loading');
          await vote({
            postId: post.id,
            value: 1
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'upvote-loading'}
        variant={post.voteStatus === 1 ? 'solid' : 'outline'}
        size={size === 'regular' ? 'sm' : 'xs'}
        aria-label='upvote'
        colorScheme='blue'
        icon={<TriangleUpIcon />}
      />
      <Text fontSize='xl'>{post.points}</Text>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoadingState('downvote-loading');
          await vote({
            postId: post.id,
            value: -1
          });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'downvote-loading'}
        variant={post.voteStatus === -1 ? 'solid' : 'outline'}
        size={size === 'regular' ? 'sm' : 'xs'}
        aria-label='downvote'
        colorScheme='red'
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
