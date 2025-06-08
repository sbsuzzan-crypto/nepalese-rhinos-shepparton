
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: Record<string, string> = {
    'about': 'About',
    'teams': 'Teams',
    'fixtures': 'Fixtures',
    'gallery': 'Gallery',
    'all-gallery': 'All Gallery',
    'gallery-page': 'Gallery Page',
    'join-us': 'Join Us',
    'contact': 'Contact',
    'news': 'News',
    'all-news': 'All News',
    'admin': 'Admin Panel'
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="bg-gray-50 py-3 border-b">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              to="/" 
              className="flex items-center text-rhino-blue hover:text-rhino-red transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

            return (
              <li key={name} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-rhino-gray mx-2" />
                {isLast ? (
                  <span className="text-rhino-gray font-medium">{displayName}</span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-rhino-blue hover:text-rhino-red transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
