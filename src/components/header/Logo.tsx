
import { Link } from "react-router-dom";

interface LogoProps {
  isScrolled: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled }) => {
  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <img 
        src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
        alt="Nepalese Rhinos FC" 
        className={`transition-all duration-300 group-hover:scale-105 ${
          isScrolled ? 'h-10 w-10' : 'h-12 w-12'
        }`}
      />
      <div className="transition-all duration-300">
        <h1 className={`font-bold text-rhino-blue transition-all duration-300 ${
          isScrolled ? 'text-lg' : 'text-xl'
        }`}>
          Nepalese Rhinos FC
        </h1>
        <p className={`text-rhino-gray transition-all duration-300 ${
          isScrolled ? 'text-xs' : 'text-sm'
        }`}>
          Est. 2023
        </p>
      </div>
    </Link>
  );
};

export default Logo;
