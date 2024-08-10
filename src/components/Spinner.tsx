type SpinnerProps = {
  size: number;
};

const Spinner: React.FC<SpinnerProps> = ({ size }) => {
  return (
    <div
      className="text-surface inline-block animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
      role="status"
      style={{ width: size, height: size }}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;
