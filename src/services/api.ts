import {
  CuratingType,
  CommentFormInput,
  CuratingFormInput,
  CuratingsSearchParams,
  StyleDetail,
  StyleFormInput,
  PaginationResponse,
  GalleryStylesSearchParams,
  GalleryStyle,
  RankingStylesSearchParams,
  RankingStyle,
  CommentDeleteFormInput,
  CuratingDeleteFormInput,
  StyleDeleteFormInput,
} from './types';
import fetch from './fetch';
import {
  CURATINGS_PAGE_SIZE,
  GALLERY_STYLES_PAGE_SIZE,
  RANKING_STYLES_PAGE_SIZE,
} from '@libs/shared/pagination/constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 공통 처리 함수
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API 요청 중 오류 발생');
  }
  return data;
};

// =========================
// COMMENT
// =========================

export const postComment = async (
  curationId: number,
  body: CommentFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await handleResponse(response);
  return { comment: data.comment };
};

export const putComment = async (commentId: number, body: CommentFormInput) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

export const deleteComment = async (
  commentId: number,
  body: CommentDeleteFormInput
) => {
  const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

// =========================
// CURATING
// =========================

export const postCurating = async (
  styleId: number,
  body: CuratingFormInput
) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}/curations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

export const getCuratings = async (
  styleId: number,
  params: CuratingsSearchParams
): Promise<PaginationResponse<CuratingType>> => {
  const urlParams = new URLSearchParams();
  urlParams.set('searchBy', params.searchBy);
  urlParams.set('keyword', params.keyword);
  urlParams.set('page', params.page.toString());
  urlParams.set('pageSize', CURATINGS_PAGE_SIZE.toString());

  const response = await fetch(
    `${BASE_URL}/styles/${styleId}/curations?${urlParams.toString()}`,
    { next: { tags: ['curatings'] } }
  );

  return await handleResponse(response);
};

export const putCurating = async (
  curationId: number,
  body: CuratingFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

export const deleteCurating = async (
  curationId: number,
  body: CuratingDeleteFormInput
) => {
  const response = await fetch(`${BASE_URL}/curations/${curationId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

// =========================
// IMAGE
// =========================

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BASE_URL}/images`, {
    method: 'POST',
    body: formData,
  });

  const data = await handleResponse(response);
  return { imageUrl: data.imageUrl };
};

// =========================
// STYLE
// =========================

export const postStyle = async (body: StyleFormInput): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

export const getStyle = async (styleId: number): Promise<StyleDetail> => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`);

  return await handleResponse(response);
};

export const putStyle = async (styleId: number, body: StyleFormInput) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await handleResponse(response);
};

export const deleteStyle = async (
  styleId: number,
  body: StyleDeleteFormInput
) => {
  const response = await fetch(`${BASE_URL}/styles/${styleId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await handleResponse(response);
  return { message: data.message };
};

// =========================
// GALLERY
// =========================

export const getGalleryStyles = async (
  params: GalleryStylesSearchParams
): Promise<PaginationResponse<GalleryStyle>> => {
  const urlParams = new URLSearchParams();
  urlParams.set('sortBy', params.sortBy);
  urlParams.set('searchBy', params.searchBy);
  urlParams.set('keyword', params.keyword);
  urlParams.set('tag', params.tag);
  urlParams.set('page', params.page?.toString() ?? '1');
  urlParams.set('pageSize', GALLERY_STYLES_PAGE_SIZE.toString());

  const response = await fetch(`${BASE_URL}/styles?${urlParams.toString()}`, {
    next: { tags: ['galleryStyles'] },
  });

  return await handleResponse(response);
};

export const getGalleryTags = async () => {
  const response = await fetch(`${BASE_URL}/tags`, {
    next: { tags: ['galleryTags'] },
  });

  const data = await handleResponse(response);
  return { tags: data.tags };
};

// =========================
// RANKING
// =========================

export const getRankingStyles = async (
  params: RankingStylesSearchParams
): Promise<PaginationResponse<RankingStyle>> => {
  const urlParams = new URLSearchParams();
  urlParams.set('rankBy', params.rankBy);
  urlParams.set('page', params.page.toString());
  urlParams.set('pageSize', RANKING_STYLES_PAGE_SIZE.toString());

  const response = await fetch(`${BASE_URL}/ranking?${urlParams.toString()}`, {
    next: { tags: ['rankingStyles'] },
  });

  return await handleResponse(response);
};
