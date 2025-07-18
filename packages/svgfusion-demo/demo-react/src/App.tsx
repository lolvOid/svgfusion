import { useState } from 'react';
import {
  DemoGoldPersonIcon,
  DemoGradientIconIcon,
  DemoMagicTypeFilledColorSecondaryIcon,
  DemoBackCardColorIcon,
  DemoBrowserifyIconIcon,
  DemoGooglePlusCircleIcon,
  DemoSodaWaterIcon,
  DemoHeartLineIcon,
} from './components/icons';

function App() {
  const [size, setSize] = useState<string>('48');
  const [width, setWidth] = useState<string | undefined>('');
  const [height, setHeight] = useState<string | undefined>('');
  const [strokeWidth, setStrokeWidth] = useState<string>('1.5');
  const [color, setColor] = useState('#3498db');
  const [color2, setColor2] = useState('#e74c3c');
  const [isFixedStrokeWidth, setIsFixedStrokeWidth] = useState(false);

  const icons = [
    { Component: DemoGoldPersonIcon, name: 'Gold Person' },
    { Component: DemoGradientIconIcon, name: 'Gradient Icon' },
    { Component: DemoMagicTypeFilledColorSecondaryIcon, name: 'Magic Icon' },
    { Component: DemoBackCardColorIcon, name: 'Back Card' },
    { Component: DemoBrowserifyIconIcon, name: 'Browserify' },
    { Component: DemoGooglePlusCircleIcon, name: 'Google Plus' },
    { Component: DemoSodaWaterIcon, name: 'Soda Water' },
    { Component: DemoHeartLineIcon, name: 'HeartLine' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            SVGFusion React Demo
          </h1>
          <p className="text-gray-600">
            Generated React components from SVG files
          </p>
        </header>

        <main className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">Size</label>
                <input
                  type="number"
                  min="16"
                  max="128"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border rounded text-center"
                  placeholder="24"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">Width</label>
                <input
                  type="number"
                  min="0"
                  value={width || ''}
                  onChange={e => setWidth(e.target.value || undefined)}
                  className="w-20 px-2 py-1 text-sm border rounded text-center"
                  placeholder="auto"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">Height</label>
                <input
                  type="number"
                  min="0"
                  value={height || ''}
                  onChange={e => setHeight(e.target.value || undefined)}
                  className="w-20 px-2 py-1 text-sm border rounded text-center"
                  placeholder="auto"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">Stroke Width</label>
                <input
                  type="number"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={strokeWidth}
                  onChange={e => setStrokeWidth(e.target.value)}
                  className="w-20 px-2 py-1 text-sm border rounded text-center"
                  placeholder="1.5"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-12 h-10 border-none rounded cursor-pointer"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={color2}
                  onChange={e => setColor2(e.target.value)}
                  className="w-12 h-10 border-none rounded cursor-pointer"
                />
              </div>

              <div className="flex flex-col items-center space-y-2">
                <label className="font-semibold text-gray-700">
                  Fixed Stroke Width
                </label>
                <button
                  onClick={() => setIsFixedStrokeWidth(!isFixedStrokeWidth)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                    isFixedStrokeWidth ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 absolute top-0.5 ${
                      isFixedStrokeWidth ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-xs text-gray-500">
                  {isFixedStrokeWidth ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {icons.map(({ Component, name }) => (
              <div
                key={name}
                className="bg-white p-6 rounded-lg shadow-sm border hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col items-center space-y-4">
                  <Component
                    size={size}
                    width={width}
                    height={height}
                    color={color}
                    color2={color2}
                    strokeWidth={strokeWidth}
                    title={name}
                    isFixedStrokeWidth={isFixedStrokeWidth}
                  />
                  <span className="text-sm text-gray-600 font-medium">
                    {name}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Size Variations
            </h2>
            <div className="flex gap-8 justify-center items-end flex-wrap">
              {[16, 24, 32, 48, 64].map(iconSize => (
                <div
                  key={iconSize}
                  className="flex flex-col items-center space-y-2"
                >
                  <DemoGradientIconIcon size={iconSize.toString()} />
                  <span className="text-xs text-gray-500">{iconSize}px</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Generated by SVGFusion • TypeScript • ForwardRef • Memo
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
