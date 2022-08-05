import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Flex, Text, IconButton } from '@chakra-ui/react';
import React from 'react';
import { PostSnippetFragment } from '../generated/graphql';

interface VoteSectionProps {
  post: PostSnippetFragment;
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr='4'>
      <IconButton
        size='sm'
        aria-label='upvote'
        colorScheme='blue'
        icon={<TriangleUpIcon />}
      />
      <Text fontSize='xl'>{post.points}</Text>
      <IconButton
        size='sm'
        aria-label='downvote'
        colorScheme='red'
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
