import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, UserIcon, LockIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup if coming from logout
    if (sessionStorage.getItem('loggedOut') === 'true') {
      setShowPopup(true);
      sessionStorage.removeItem('loggedOut');
      setTimeout(() => setShowPopup(false), 3000);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const res = await fetch('https://ivms.local/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      const data = await res.json();
      if (res.ok) {
      // You can store user in localStorage or context
        localStorage.setItem('role', data.user.role);
        sessionStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100 p-4">
      {showPopup && (
        <div className="absolute top-4 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
          Successfully Signed Out
        </div>
      )}
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="relative overflow-hidden bg-teal-600 p-8">
          <div className="absolute -top-24 -right-24 h-40 w-40 rounded-full bg-teal-500 opacity-50"></div>
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-teal-500 opacity-30"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-teal-100">Log in to your admin account</p>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                required
                className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              {/* <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                Forgot password?
              </a> */}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg bg-teal-600 py-3 px-4 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;