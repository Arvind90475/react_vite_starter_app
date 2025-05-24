
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Code, Database } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Authentication',
      description: 'Secure user authentication with protected routes and role-based access.',
    },
    {
      icon: Code,
      title: 'Modular Architecture',
      description: 'Clean, pluggable architecture with separation of concerns and pure functions.',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Efficient data fetching with TanStack Query and optimistic updates.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Modern React App
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A production-ready React TypeScript application with modular architecture, 
          authentication, and clean code principles.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button size="lg" className="flex items-center space-x-2">
                <span>Go to Dashboard</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <Button size="lg" className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built with Best Practices
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to build scalable React applications
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to build something amazing?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Start with our production-ready foundation and focus on your features.
        </p>
        {!isAuthenticated && (
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
