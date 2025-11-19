'use server';

import { postStyle as postStyleApi } from '@services/api';
import { CategoryKey, CategoryValue, StyleFormInput } from '@services/types';
import { revalidatePath } from 'next/cache';

/**
 * 프론트에서 보내는 배열 형태:
 * [
 *   { type: 'TOP', name: '셔츠', brand: '지오다노', price: 30000 }
 * ]
 *
 * → 백엔드(superstruct) 요구 구조:
 * {
 *   TOP: { name: '셔츠', brand: '지오다노', price: 30000 }
 * }
 */
const convertCategoriesToObject = (
  arr: Array<{ type: string; name: string; brand: string; price: number }>
) => {
  const converted: Record<
    string,
    { name: string; brand: string; price: number }
  > = {};

  arr.forEach((item) => {
    if (!item.type) return;

    converted[item.type] = {
      name: item.name ?? '',
      brand: item.brand ?? '',
      price: Number(item.price ?? 0),
    };
  });

  return converted;
};

const postStyle = async (data: StyleFormInput) => {
  const {
    categories: categoriesObject,
    imageUrls,
    tags,
    title,
    nickname,
    content,
    password,
  } = data;

  // 현재 categoriesObject 는 "키 기반 객체" → 먼저 배열로 변환 필요
  const categoriesArray: any[] = [];

  const mapping: Record<string, string> = {
    top: 'TOP',
    bottom: 'BOTTOM',
    outer: 'OUTER',
    dress: 'DRESS',
    shoes: 'SHOES',
    bag: 'BAG',
    accessory: 'ACCESSORY',
  };

  Object.entries(categoriesObject).forEach(([key, value]) => {
    if (!value) return;

    const type = mapping[key];

    if (value.name || value.brand || value.price) {
      categoriesArray.push({
        type,
        name: value.name ?? '',
        brand: value.brand ?? '',
        price: Number(value.price ?? 0),
      });
    }
  });

  // 이제 배열 → superstruct 요구하는 객체로 변환
  const convertedCategories = convertCategoriesToObject(categoriesArray);

  // 최종 전송 데이터
  const body = {
    imageUrls,
    tags,
    title,
    nickname,
    content,
    password,
    categories: convertedCategories,
  };

  console.log('보내는 Body:', body);

  // API 요청
  const styleDetail = await postStyleApi(body);

  // 페이지 캐시 갱신
  revalidatePath('/');
  revalidatePath('/ranking');

  return styleDetail;
};

export default postStyle;
