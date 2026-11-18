
import { useState } from "react";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  // Login remains the default page
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && (
        <>
          <Login
            onGoSignup={() => setPage("signup")}
          />

          {/* Temporary button to test the Profile page */}
          <button
            type="button"
            onClick={() => setPage("profile")}
          >
            My Profile
          </button>
        </>
      )}

      {page === "signup" && (
        <Signup
          onGoLogin={() => setPage("login")}
        />
      )}
{/* if page === "profile" display profilepage */}
      {page === "profile" && (
        <>
          <button
            type="button"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>

          <ProfilePage />
        </>
      )}
    </>
  );
}

export default App;
