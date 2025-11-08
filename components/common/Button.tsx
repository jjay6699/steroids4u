import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-[15px]';

  const variantStyles = {
    primary: 'bg-white text-dark-text border border-gray-300 hover:bg-accent hover:text-dark-text hover:border-accent disabled:bg-gray-100',
    secondary: 'bg-white text-dark-text border border-border hover:bg-gray-50 disabled:bg-gray-100',
    outline: 'bg-white border border-gray-300 text-dark-text hover:bg-accent hover:text-dark-text hover:border-accent disabled:border-gray-400 disabled:text-gray-400',
  };

  const sizeStyles = {
    sm: 'px-6 py-3',
    md: 'px-8 py-4',
    lg: 'px-10 py-5',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

