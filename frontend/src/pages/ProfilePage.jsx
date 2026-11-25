import { useEffect, useState } from "react";


function ProfilePage() {
    const [profile, setProfile] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loggedOut, setLoggedOut] = useState(false);

    // Retrieve the user's profile when the page opens
    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("/api/profile", {
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        typeof data.detail === "string"
                            ? data.detail
                            : "Unable to load profile."
                    );
                }

                setProfile(data);
                setUsername(data.username);
                setEmail(data.email);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        const requestBody = {
            username: username.trim(),
            email: email.trim(),
            current_password: currentPassword,
        };

        if (newPassword) {
            requestBody.new_password = newPassword;
        }

        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Unable to update profile."
                );
            }

            setProfile(data.user);
            setUsername(data.user.username);
            setEmail(data.user.email);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setMessage(data.message);

            if (data.requires_login) {
                setLoggedOut(true);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <main className="profile-page">Loading profile...</main>;
    }

    if (loggedOut) {
        return (
            <main className="profile-page">
                <section className="profile-card">
                    <h1>Password Updated</h1>
                    <p>{message}</p>
                    <a href="/">Return to Login</a>
                </section>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <section className="profile-card">
                    <h1>My Profile</h1>
                    <p className="profile-error">{error}</p>
                    <a href="/">Return to Login</a>
                </section>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <section className="profile-card">

                <h1>My Profile</h1>
                <p className="profile-subtitle">
                    Manage your account information
                </p>

                <p className="profile-role">
                    Account Role: {profile.role}
                </p>

                <form onSubmit={handleSubmit}>

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        maxLength={50}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <h2>Change Password</h2>
                    <p className="profile-hint">
                        Leave these fields blank if you do not
                        want to change your password.
                    </p>

                    <label htmlFor="newPassword">New Password</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={12}
                        autoComplete="new-password"
                    />

                    <label htmlFor="confirmPassword">
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    <h2>Confirm Changes</h2>

                    <label htmlFor="currentPassword">
                        Current Password
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    {error && (
                        <p className="profile-error" role="alert">{error}</p>
                    )}

                    {message && (
                        <p className="profile-success" role="status">
                            {message}
                        </p>
                    )}

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </form>
            </section>
        </main>
    );
}

export default ProfilePage;
