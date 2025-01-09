"use client";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: IButtonProps) {
  return (
    <button className="bg-slate-900 rounded-xl p-5" {...props}>
      {children}
    </button>
  );
}
