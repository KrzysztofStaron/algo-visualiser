const SpeedModulator = ({ speed, setSpeed }: { speed: number; setSpeed: CallableFunction }) => {
  return (
    <div className="flex items-center">
      <div className="w-48">
        <input
          type="range"
          className="range range-md"
          min={100}
          max={400}
          value={speed}
          onChange={e => setSpeed(parseInt(e.target.value))}
          step={50}
        />
        <div className="flex w-full justify-between px-2 text-xs">
          {Array.from({ length: (400 - 100) / 50 + 1 }).map((_, index) => (
            <span key={index}>|</span>
          ))}
        </div>
      </div>
      <span className="px-2">{speed}ms</span>
    </div>
  );
};

export default SpeedModulator;
