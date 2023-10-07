import { createContext, Dispatch, Reducer } from 'react';

import { Comment } from '../types';

// TODO remove the temp folder and implement api-connection when the backend is ready

export const CommentDispatchContext = createContext<Dispatch<CommentAction>>(null as unknown as Dispatch<CommentAction>);

type CommentAction = ReplyAction | AddAction | DeleteAction | FlagAction | CollapseAction;

interface CollapseAction {
  type: 'collapse';
  payload: {
    commentId: number;
    collapsed: boolean;
  };
}

interface ReplyAction {
  type: 'reply';
  payload: {
    parentId: number;
    comment: Comment;
  };
}

interface AddAction {
  type: 'add';
  payload: {
    comment: Comment;
  };
}

interface DeleteAction {
  type: 'delete';
  payload: {
    commentId: number;
  };
}

interface FlagAction {
  type: 'flag';
  payload: {
    commentId: number;
  };
}

export const tasksReducer: Reducer<Comment[], CommentAction> = (comments, action) => {
  switch (action.type) {
    case 'add':
      return [action.payload.comment, ...comments];
    case 'reply':
      if (parent) {
        comments[comments.findIndex((c) => c.id === action.payload.parentId)]?.children.unshift(action.payload.comment);
        return [...comments];
      }
      return comments;
    case 'delete':
      return comments.filter((c) => c.id !== action.payload.commentId) ?? comments;
    case 'flag':
      comments[comments.findIndex((c) => c.id === action.payload.commentId)].flagged = true;
      return [...comments];
    case 'collapse':
      return [...comments];
    default:
      return comments;
  }
};
