'use server';

import { deleteComment as deleteCommentApi } from '@services/api';
import { CommentDeleteFormInput } from '@services/types';
import { revalidateTag } from 'next/cache';

const deleteComment = async (
  commentId: number,
  body: CommentDeleteFormInput
) => {
  const response = await deleteCommentApi(commentId, body);

  // 백엔드 응답이 { message: "..."} 형식이라 success 값 없음 → 기본값 true 처리
  return {
    success: response?.success ?? true,
    message: response?.message ?? '삭제가 완료되었습니다.',
  };
};

export default deleteComment;
