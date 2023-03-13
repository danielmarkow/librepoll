type ButtonProps = {
  children: string;
  className?: string;
  onClick?: () => void;
  large?: boolean;
  type?: "button" | "reset" | "submit" | undefined;
};

export default function Button({
  children,
  className: inputClassNames,
  onClick,
  large = false,
  type,
}: ButtonProps) {
  let buttonClassNames = large
    ? "mt-2 rounded bg-white py-2 px-8 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    : ("mt-2 rounded bg-white py-1 px-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" as string);

  if (inputClassNames !== undefined)
    buttonClassNames = buttonClassNames + " " + inputClassNames;

  return (
    <button type={type} className={buttonClassNames} onClick={onClick}>
      {children}
    </button>
  );
}
