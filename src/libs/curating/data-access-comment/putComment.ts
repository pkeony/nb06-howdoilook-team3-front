'use server';

import { putComment as putCommentApi } from '@services/api';
import { CommentFormInput } from '@services/types';
import { revalidateTag } from 'next/cache';

const putComment = async (commentId: number, body: CommentFormInput) => {
  try {
    const response = await putCommentApi(commentId, body);

    // 백엔드에서 ok가 false인 경우 throw 처리
    if (!response?.ok && response?.message) {
      throw new Error(response.message);
    }

    revalidateTag('curatings');

    return response;
  } catch (error) {
    console.error('[프론트] 댓글 수정 실패:', error);
    throw error;
  }
};

export default putComment;
