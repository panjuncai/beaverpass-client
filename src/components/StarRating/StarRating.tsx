
// 单个星星组件，fill 的取值范围是 0 ~ 1，表示填充百分比
const Star = ({ fill = 0, size = 24 }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      {/* 灰色空星 */}
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="#ccc"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {/* 黄色填充星，通过调整宽度实现部分填充效果 */}
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="#facc15"
        stroke="#facc15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${fill * 100}%`,
          overflow: 'hidden'
        }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </div>
  );
};

// 评分控件组件，rating 的取值范围是 0 ~ totalStars（通常是 5），可以是小数
const StarRating = ({ rating = 0, totalStars = 5, size = 24 }) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: totalStars }, (_, i) => {
        // 对于每颗星，计算填充比例，公式：clamp(rating - i, 0, 1)
        const fill = Math.min(Math.max(rating - i, 0), 1);
        return <Star key={i} fill={fill} size={size} />;
      })}
    </div>
  );
};

export default StarRating;
