
import { useState } from "react";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import InstructorAnalysis from "./pages/instructors_analysis.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import InstructorDashboard from "./pages/InstructorDashboard.jsx";

function App() {
  // Login remains the default page
  const [page, setPage] = useState("login");

  // Store the logged-in user's information
  const [user, setUser] = useState(null);

  // Called after successful login
  function handleLoginSuccess(userData) {
    setUser(userData);

    if (userData.role === "instructor") {
      setPage("instructor");
    } else {
      setPage("learner");
    }
  }

  // Log out and return to the login page
  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      setUser(null);
      setPage("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      {/* Login Page */}
      {page === "login" && (
        <Login
          onGoSignup={() => setPage("signup")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Signup Page */}
      {page === "signup" && (
        <Signup
          onGoLogin={() => setPage("login")}
        />
      )}

      {/* Instructor Dashboard */}
      {page === "instructor" && user && (
        <>
          <button onClick={() => setPage("profile")}>
            My Profile
          </button>

          <InstructorDashboard
            userName={user.username}
            onLogout={handleLogout}
            onOpenStudentAnalysis={() => setPage("analysis")}
          />
        </>
      )}

      {/* Instructor Analysis Page */}
      {page === "analysis" && user && (
        <InstructorAnalysis
          onBackToDashboard={() => setPage("instructor")}
        />
      )}

      {/* Student Dashboard */}
      {page === "learner" && user && (
        <>
          <button onClick={() => setPage("profile")}>
            My Profile
          </button>

          <StudentDashboard
            userName={user.username}
            onLogout={handleLogout}
          />
        </>
      )}

      {/* Profile Page */}
      {page === "profile" && user && (
        <>
          <button
            onClick={() =>
              setPage(
                user.role === "instructor"
                  ? "instructor"
                  : "learner"
              )
            }
          >
            Back to Dashboard
          </button>

          <ProfilePage />
        </>
      )}
    </>
  );
}

export default App;
