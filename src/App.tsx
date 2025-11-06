import { useState, useEffect } from 'react';
import HomeFeed from './components/HomeFeed';
import ListingDetailsPage from './components/ListingDetailsPage';
import GuestChat from './components/GuestChat';
import Router from './components/Router';
import Route from './components/Route';
import BottomNavBar from './components/BottomNavBar';
import MobileSearchBar from './components/MobileSearchBar';
import Login from './components/Login';
import { useNavigation } from './hooks/useNavigation';
import './index.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { pathname } = useNavigation();

  const showBottomNavBar = !pathname.startsWith('/listing/');

  useEffect(() => {
    const imagesToPreload = [
      '/bengaluru.png',
      '/chennai.png',
      '/goa.png',
      '/logo.png',
      '/mumbai.png',
      '/pondicherry.png',
    ];
    imagesToPreload.forEach((image) => {
      new Image().src = image;
    });
  }, []);

  return (
    <div className={`w-screen overflow-x-hidden ${showBottomNavBar ? 'pb-24' : ''}`}>
      <Router>
        <Route path="/" component={HomeFeed} />
        <Route path="/listing/:id" component={ListingDetailsPage} />
        <Route path="/messages" component={GuestChat} />
        <Route path="/messages/:id" component={GuestChat} />
      </Router>
      <BottomNavBar show={showBottomNavBar} onSearchClick={() => setIsSearchOpen(true)} openLogin={() => setIsLoginOpen(true)} />
      {isSearchOpen && <MobileSearchBar onClose={() => setIsSearchOpen(false)} />}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={() => setIsLoginOpen(false)} />}
    </div>
  )
}

export default App;
