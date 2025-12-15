export default function Skeleton({ variant = 'text', className = '' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    circle: 'rounded-full w-12 h-12',
    card: 'h-64 w-full rounded-lg',
    image: 'h-48 w-full rounded-lg',
  };

  return (
    <div className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`} />
  );
}
