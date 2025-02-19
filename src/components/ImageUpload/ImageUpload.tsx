export default function ImageUpload() {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* 1. Front View (已上传) */}
      <div className="flex items-start gap-4">
        {/* 左侧：图片预览 */}
        <div className="relative w-40 h-28 bg-gray-200 overflow-hidden rounded">
          {/* 已上传的图片预览示例 */}
          <img
            src="https://gw.alicdn.com/imgextra/i1/420966826/O1CN01axInJG20IMXD9ceN3_!!420966826.jpg"
            alt="Front View"
            className="object-cover w-full h-full"
          />
          {/* 覆盖文字 */}
          <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs py-1">
            FRONT VIEW
          </div>
        </div>

        {/* 右侧：上传进度 + 按钮 */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm text-gray-600">1/4</span>
          <div className="flex items-center gap-2">
            {/* 打勾按钮（已上传可用） */}
            <button className="btn btn-circle btn-success btn-sm text-white">
              {/* 这里使用 Heroicons 的对勾图标为例，你也可用其他 SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>

            {/* 加号按钮（上传/重新上传） */}
            <button className="btn btn-circle btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Side View (未上传) */}
      <div className="flex items-start gap-4">
        {/* 左侧：占位方块 + 文本 */}
        <div className="relative w-40 h-28 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center">
          {/* 你可在此放一个 “X” 形状、图片占位符或别的图标 */}
          <div className="absolute text-xs text-gray-500">SIDE VIEW</div>
        </div>

        {/* 右侧：上传进度 + 按钮 */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm text-gray-600">0/4</span>
          <div className="flex items-center gap-2">
            {/* 打勾按钮（未上传可设为禁用/灰色） */}
            <button className="btn btn-circle btn-success btn-sm btn-disabled">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>

            {/* 加号按钮（点击可选择文件） */}
            <button className="btn btn-circle btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Back View (未上传) */}
      <div className="flex items-start gap-4">
        {/* 左侧：占位方块 + 文本 */}
        <div className="relative w-40 h-28 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <div className="absolute text-xs text-gray-500">BACK VIEW</div>
        </div>

        {/* 右侧：上传进度 + 按钮 */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm text-gray-600">0/4</span>
          <div className="flex items-center gap-2">
            {/* 打勾按钮（未上传可设为禁用/灰色） */}
            <button className="btn btn-circle btn-success btn-sm btn-disabled">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>

            {/* 加号按钮 */}
            <button className="btn btn-circle btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Damage View (未上传) */}
      <div className="flex items-start gap-4">
        {/* 左侧：占位方块 + 文本 */}
        <div className="relative w-40 h-28 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center">
          <div className="absolute text-xs text-gray-500">DAMAGE VIEW</div>
        </div>

        {/* 右侧：上传进度 + 按钮 */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm text-gray-600">0/4</span>
          <div className="flex items-center gap-2">
            {/* 打勾按钮（未上传可设为禁用/灰色） */}
            <button className="btn btn-circle btn-success btn-sm btn-disabled">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>

            {/* 加号按钮 */}
            <button className="btn btn-circle btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
