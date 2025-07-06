
import { useState, useEffect } from "react";
import { Users, Eye } from "lucide-react";

interface ViewerCounterProps {
  icon?: "users" | "eye";
  className?: string;
  showLabel?: boolean;
}

const ViewerCounter = ({ icon = "users", className = "", showLabel = true }: ViewerCounterProps) => {
  const [viewerCount, setViewerCount] = useState(2347);

  useEffect(() => {
    const interval = setInterval(() => {
      // Gradually increase viewers with some randomness
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 15) + 1; // 1-15 increase
        const shouldIncrease = Math.random() > 0.2; // 80% chance to increase
        return shouldIncrease ? prev + change : Math.max(prev - Math.floor(change / 3), 2000);
      });
    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(interval);
  }, []);

  const IconComponent = icon === "users" ? Users : Eye;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconComponent size={16} className="text-cyan-400" />
      <span className="font-semibold">{viewerCount.toLocaleString('fa-IR')}</span>
      {showLabel && <span>نفر در حال تماشا</span>}
    </div>
  );
};

export default ViewerCounter;
