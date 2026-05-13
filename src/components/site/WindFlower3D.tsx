export default function WindFlower3D({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/windflower-product.png"
        alt="WindFlower energy sculpture"
        className="h-full w-full object-contain opacity-95 drop-shadow-[0_0_70px_rgba(255,197,96,0.28)]"
      />
    </div>
  );
}
