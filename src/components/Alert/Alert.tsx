type AlertProps = {
  children: React.ReactNode;
  color: 'danger' | 'success' | 'info' | 'warning';
  className?: string;
};

export default function Alert({ children, color, className }: AlertProps) {
  return (
    <div
      className={`p-4 mb-4 text-sm rounded-lg ${
        color === 'danger' ? 'bg-danger-100 text-danger-800' : ''
      } ${color === 'success' ? 'bg-success-100 text-success-800' : ''} ${
        color === 'info' ? 'bg-[#ddeafc] text-[#094298]' : ''
      } ${
        color === 'warning'
          ? 'bg-[#fcf9dd] text-[#40340E] dark:text-[#C3B27E] dark:bg-[#413921]'
          : ''
      } ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
