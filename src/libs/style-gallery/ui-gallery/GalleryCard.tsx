import classNames from 'classnames/bind';
import styles from './GalleryCard.module.scss';
import { GalleryStyle } from '@services/types';
import Image from 'next/image';
import Icon from '../../shared/icon/Icon';
import Link from 'next/link';
import { STYLE_CATEGORY_TITLE_MAP } from '../../shared/util-constants/constants';

const cx = classNames.bind(styles);

type GalleryCardProps = {
  card: GalleryStyle;
};

const GalleryCard = ({ card }: GalleryCardProps) => {
  const {
    id,
    thumbnail,
    tags,
    title,
    content,
    nickname,
    viewCount: viewsCount,
    curationCount: curationsCount,
    categories,
  } = card;

  return (
    <div className={cx('container')}>
      {/* 이미지 영역 - 고정 비율 박스 */}
      <div className={cx('imageWrapper')}>
        <Link href={`/styles/${id}`} className={cx('imageLink')}>
          <div className={cx('imageBox')}>
            <Image
              src={thumbnail}
              alt={title || '갤러리 카드 이미지'}
              fill
              className={cx('image')}
              sizes="(max-width: 768px) 100vw, 340px"
              priority
            />
          </div>
        </Link>
      </div>

      {/* 텍스트(메타) 영역 - 이미지와 완전히 분리 */}
      <div className={cx('body')}>
        {/* 카테고리(상/하의 등)를 텍스트 영역으로 이동 */}
        <div className={cx('categories')}>
          {Object.entries(categories)
            .slice(0, 4)
            .map(([key, category]) => (
              <div key={key} className={cx('category')}>
                <div className={cx('categoryNameContainer')}>
                  <Icon
                    name="arrow"
                    width={8}
                    height={8}
                    alt="카테고리 제목 글머리"
                  />
                  <h4>{STYLE_CATEGORY_TITLE_MAP[key]}</h4>
                </div>
                <p className={cx('categoryInfo')}>{`${category.name}, ${
                  category.brand
                }, ${category.price.toLocaleString()}원`}</p>
              </div>
            ))}
        </div>

        <div className={cx('titleContainer')}>
          <div className={cx('tagsContainer')}>
            {tags.map((tag) => (
              <span key={tag}>{`#${tag}`}</span>
            ))}
          </div>

          <h2 className={cx('title')}>
            <Link href={`/styles/${id}`}>{title}</Link>
          </h2>

          <h3 className={cx('nickname')}>{nickname}</h3>
        </div>

        <p className={cx('content')}>{content}</p>
      </div>

      <div className={cx('footer')}>
        <div className={cx('count')}>
          <Icon name="eye" height={16} width={16} alt="조회수 아이콘" />
          <span>{viewsCount}</span>
        </div>
        <div className={cx('count')}>
          <Icon name="chat" height={16} width={16} alt="큐레이팅수 아이콘" />
          <span>{curationsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
