import React from 'react';

const LazyLoadData = ({ data, renderItem }) => {
  return (
    <ul>
      {data.map(item => renderItem(item))}
    </ul>
  );
};

export default LazyLoadData;
