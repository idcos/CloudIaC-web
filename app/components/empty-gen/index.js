/* eslint-disable jsx-a11y/alt-text */
import styles from './styles.less';
import { formatImgUrl } from 'utils/util';

const EmptyGen = ({
  imgName,
  imgWidth = 220,
  imgHeight = 220,
  title,
  imgClickFn,
  description,
  linkText,
  linkUrl,
  ...restProps
}) => {
  return (
    <div className={styles.container} {...restProps}>
      <div className='content'>
        <div className='img-container' role='img'>
          <img
            width={imgWidth}
            height={imgHeight}
            src={formatImgUrl(`/assets/img/${imgName}`)}
            style={imgClickFn ? { cursor: 'pointer' } : {}}
            onClick={imgClickFn}
          />
        </div>
        <div className='title'>
          <span
            style={imgClickFn ? { cursor: 'pointer' } : {}}
            onClick={imgClickFn}
          >
            {title}
          </span>
        </div>
        <div className='description-container'>
          <span className='description'>{description}</span>
          {linkText ? (
            <a
              className='linkText'
              href={linkUrl}
              target='_blank'
              rel='noreferrer'
            >
              {linkText}
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyGen;
