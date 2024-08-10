import Spinner from "./Spinner";

type ButtonProps = {
  label?: string;
  className?: string;
  icon?: JSX.Element;
  loading?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  loading,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex gap-1 items-center bg-blue-700 text-white rounded-xl px-3 py-2 hover:brightness-90 transition-all ${className}`}
    >
      {loading ? <Spinner size={20} /> : icon}
      {label || ""}
    </button>
  );
};

export default Button;
