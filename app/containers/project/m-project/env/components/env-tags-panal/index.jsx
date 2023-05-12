import React from 'react';
import styled from 'styled-components';

const TagsPanel = styled.div`
  width: 100%;
  .container {
    border-bottom: 1px solid #e1e4e8;
    width: 100%;
    display: flex;
    padding: 6px 0;
  }
  .container-left {
    width: 60px;
    height: 100%;
    padding-top: 3px;

    .title {
      font-weight: 600;
      color: #24292f;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .container-right {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .tag {
      padding: 3px 4px;
      .tag-content {
        height: 20px;
        background: #f4f4f5;
        border-radius: 2px;
        padding: 0 10px;
        display: flex;
        align-items: center;
      }
      .tag-key {
        font-weight: 400;
        color: #536178;
        font-size: 12px;
      }
      .tag-value {
        margin-left: 5px;
        font-weight: 500;
        color: #174079;
        font-size: 12px;
      }
    }
  }
`;

const EnvTagsPanal = params => {
  const { tags = [], title } = params;

  return (
    <div>
      <TagsPanel>
        <div className='container'>
          <div className='container-left'>
            <div className='title'>{title}</div>
          </div>
          <div className='container-right'>
            {tags.map(tag => (
              <div className='tag'>
                <div className='tag-content'>
                  <div className='tag-key'>{`${tag.key}:`}</div>
                  <div className='tag-value'>{tag.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TagsPanel>
    </div>
  );
};

export default EnvTagsPanal;
