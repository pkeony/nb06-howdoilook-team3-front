'use client';

import Hint from '@libs/shared/input/Hint/Hint';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import classNames from 'classnames/bind';
import styles from './ImageUploadConnect.module.scss';
import Button from '@libs/shared/button/Button';
import { useRef, useState } from 'react';
import uploadImage from './uploadImage';
import Icon from '@libs/shared/icon/Icon';
import Image from 'next/image';

const cx = classNames.bind(styles);

type ImageUploadConnectProps<F extends FieldValues, N extends FieldPath<F>> = {
  name: N;
  rules?: ControllerProps<F, N>['rules'];
};

const ImageUploadConnect = <F extends FieldValues, N extends FieldPath<F>>({
  name,
  rules,
}: ImageUploadConnectProps<F, N>) => {
  const { setValue, control } = useFormContext();

  // TODO-3: 타입 문제 해결. 단언으로 임시 해결 중
  const {
    fieldState: { error },
    field: { value },
  } = useController({ control, name });
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(value as string[]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return;

    const files = Array.from(e.target.files);

    // 1) 로컬 미리보기 먼저 화면에 표시
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...previewUrls]);

    // 2) 서버 업로드
    const uploadUrls = (
      await Promise.all(files.map((file) => uploadImage(file)))
    ).filter(Boolean) as string[];

    if (uploadUrls.length > 0) {
      // 폼에도 넣고
      setValue(name as string, [...(value || []), ...uploadUrls], {
        shouldValidate: true,
      });

      // 🔥 state에도 서버 URL로 교체
      setImageUrls((prev) => {
        // prev: 로컬 미리보기 포함
        // previewUrls.length 만큼 마지막에 붙은 로컬이미지를 서버 URL로 교체
        const prevWithoutNew = prev.slice(0, prev.length - previewUrls.length);
        return [...prevWithoutNew, ...uploadUrls];
      });
    }
  };
  const handleRemoveImage = (url: string) => {
    setValue(
      name as string,
      imageUrls.filter((imageUrl) => imageUrl !== url)
    );
    setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
  };

  return (
    <div className={cx('container')}>
      <div className={cx('labelContainer')}>
        <div className={cx('label')}>사진 업로드</div>
        <Controller
          name={name}
          rules={rules}
          render={() => (
            <label>
              <input
                type="file"
                onChange={handleUploadImage}
                multiple
                accept="image/*"
                hidden
                ref={inputRef}
              />
              <Button type="button" onClick={() => inputRef.current?.click()}>
                파일 찾기
              </Button>
            </label>
          )}
        />
      </div>
      {error?.message && <Hint message={error.message} />}
      <div className={cx('previewContainer')}>
        {imageUrls.map((url, idx) => (
          <div key={idx} className={cx('imageContainer')}>
            <div className={cx('imageWrapper')}>
              <Image
                src={url}
                alt="미리보기 이미지"
                width={200}
                height={300}
                className={cx('image')}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                handleRemoveImage(url);
              }}
              className={cx('button')}
            >
              <Icon
                name="cancel"
                alt="이미지 삭제 아이콘"
                width={40}
                height={40}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadConnect;
