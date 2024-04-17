type AlertProps = {
  children: React.ReactNode;
  color: 'danger' | 'success' | 'info';
  className?: string;
};

export default function Alert({ children, color, className }: AlertProps) {
  return (
    <div
      className={`p-4 mb-4 text-sm rounded-lg ${
        color === 'danger' ? 'bg-danger-100 text-danger-800' : ''
      } ${color === 'success' ? 'bg-success-100 text-success-800' : ''} ${
        color === 'info' ? 'bg-[#ddeafc] text-[#094298]' : ''
      } ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
