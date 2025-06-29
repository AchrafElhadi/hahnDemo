import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<UserForm isEdit={false} />} />
          <Route path="/edit/:id" element={<UserForm isEdit={true} />} />
          <Route path="*" element={<UserList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
