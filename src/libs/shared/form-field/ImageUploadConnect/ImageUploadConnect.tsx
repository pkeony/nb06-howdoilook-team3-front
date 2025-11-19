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
import { useEffect, useRef, useState } from 'react';
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
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({ control, name });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  /**
   * 🔥 defaultValues.imageUrls 있을 경우 미리보기 초기화
   */
  useEffect(() => {
    if (Array.isArray(value) && previewUrls.length === 0) {
      setPreviewUrls(value);
    }
  }, [value]);

  /**
   * 파일 선택 → preview + 서버 업로드
   */
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // 1) 로컬 미리보기 먼저 추가
    const localPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...localPreviews]);

    // 2) 서버 업로드
    const uploaded = await Promise.all(files.map((file) => uploadImage(file)));

    // 업로드 실패한 경우 제외
    const serverUrls = uploaded.filter(
      (url) => typeof url === 'string'
    ) as string[];

    if (serverUrls.length === 0) return;

    // 3) react-hook-form 값 업데이트
    onChange([...(value || []), ...serverUrls]);

    // 4) 미리보기 로컬 URL → 서버 URL로 치환
    setPreviewUrls((prev) => {
      const previous = prev.slice(0, prev.length - localPreviews.length);
      return [...previous, ...serverUrls];
    });
  };

  /**
   * 이미지 삭제
   */
  const handleRemoveImage = (url: string) => {
    onChange(value.filter((v: string) => v !== url));
    setPreviewUrls((prev) => prev.filter((p) => p !== url));
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
        {previewUrls.map((url, idx) => (
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
              onClick={() => handleRemoveImage(url)}
              className={cx('button')}
            >
              <Icon name="cancel" width={40} height={40} alt="이미지 삭제" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadConnect;
