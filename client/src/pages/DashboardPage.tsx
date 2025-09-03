/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Plus, Edit, Trash2, Menu, X, User,
  //  Mail,
  LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import NotesAnimation from "../components/animations/NotesAnimation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  name: string;
  email: string;
  googleId?: string;
  provider: string;
}

// JWT Decoding Utility
const decodeJWT = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

const getUserFromToken = (token: string): UserData | null => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    name: decoded.name || 'User',
    email: decoded.email || 'user@example.com',
    googleId: decoded.googleId,
    provider: decoded.provider || 'local'
  };
};


export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();           // for getting token from URL for enabling Google OAuth login/signup


  // Check for token in URL parameters and store it
  useEffect(() => {
    const tokenFromURL = searchParams.get('token');
    if (tokenFromURL) {
      // Store the token from URL
      localStorage.setItem("token", tokenFromURL);

      // Clean up the URL - remove the token parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      toast.success("Successfully logged in!");

      // Refresh the page to load with the new token
      window.location.reload();
    }
  }, [searchParams]);


  // Check authentication and fetch user data
  useEffect(() => {

    // const token = localStorage.getItem("token");
    // if (!token) {
    //   toast.error("Please login to access dashboard");
    //   // navigate("/login");
    //   navigate("/");
    //   return;
    // }

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Check if we have a cookie-based auth
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              localStorage.setItem("token", data.token);
              if (data.user) {
                setUser(data.user);
              }
              fetchNotes();
              return;
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
        }

        toast.error("Please login to access dashboard");
        navigate("/");
        return;
      }

      // Extract user data from token first (faster, no API call needed)
      const userDataFromToken = getUserFromToken(token);
      if (userDataFromToken) {
        setUser(userDataFromToken);
      }


      // Then fetch detailed user data from API
      // Fetch user data from token (in a real app, you'd decode JWT or call an API)
      // const fetchUserFromToken = async () => {
      const fetchUserData = async () => {
        try {
          // In a real app, you might decode the JWT or call a /me endpoint
          // For demo, we'll simulate getting user data
          // const userData = {
          //   name: "Jonas Kahnwald",
          //   email: "jonas@example.com", // Real email
          //   provider: "local"
          // };
          // setUser(userData);

          const token = localStorage.getItem("token");
          // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              credentials: 'include'                    
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            toast.error("Session expired. Please login again.");
            navigate("/");
          } else {
            throw new Error("Failed to fetch user data");
          }

        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast.error("Failed to load user data");
        }
      };

      // fetchUserFromToken();
      fetchUserData();
      fetchNotes();
    };
    checkAuth();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/get`, {
      const response = await fetch(`${API_BASE_URL}/api/notes/get`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          credentials: 'include'                    // Adding this line for API calls that require authentication, make sure to include credentials
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        // navigate("/login");
        navigate("/");
      } else {
        throw new Error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/create`, {
      const response = await fetch(`${API_BASE_URL}/api/notes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          credentials: 'include'
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newNote = await response.json();
        toast.success("Note created successfully");
        reset();
        setIsCreating(false);
        // Add the new note to the list
        setNotes(prevNotes => [newNote, ...prevNotes]);
      } else {
        throw new Error("Failed to create note");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleUpdateNote = async (data: any) => {
    if (!isEditing) return;

    try {
      const token = localStorage.getItem("token");
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/update/${isEditing}`, {
      const response = await fetch(`${API_BASE_URL}/api/notes/update/${isEditing}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          credentials: 'include'
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        toast.success("Note updated successfully");
        reset();
        setIsEditing(null);
        // Update the note in the list
        setNotes(prevNotes =>
          prevNotes.map(note => note._id === isEditing ? updatedNote.note : note)
        );
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/delete/${id}`, {
      const response = await fetch(`${API_BASE_URL}/api/notes/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          credentials: 'include'
        },
      });

      if (response.ok) {
        toast.success("Note deleted successfully");
        // Remove the note from the list
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  const startEditing = (note: Note) => {
    setIsEditing(note._id);
    setValue("title", note.title);
    setValue("content", note.content);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    reset();
  };

  const cancelCreating = () => {
    setIsCreating(false);
    reset();
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   toast.success("Logged out successfully");
  //   // navigate("/login");
  //   navigate("/");
  // };

  const handleLogout = async () => {
    try {
      // Call backend logout to clear cookie
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear frontend storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const connectGoogle = () => {
    // Redirect to Google OAuth endpoint
    // window.location.href = `${import.meta.env.VITE_API_URL}/api/googleauth/google`;
    window.location.href = `${API_BASE_URL}/api/googleauth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <SidebarContent
              user={user}
              onClose={() => setIsSidebarOpen(false)}
              onLogout={handleLogout}
              onConnectGoogle={connectGoogle}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
        <SidebarContent
          user={user}
          isCollapsed={!isSidebarOpen}
          onLogout={handleLogout}
          onConnectGoogle={connectGoogle}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-8xl mx-auto">
            <div className="lg:flex gap-6">
              {/* Animation Section (Desktop only) - Only show when sidebar is closed */}
              {!isSidebarOpen && (
                <div className="hidden lg:flex flex-col w-1/3">
                  <div className="bg-white rounded-xl shadow-sm p-4 h-full">
                    <div className=" mt-10 h-90">
                      <NotesAnimation
                      // autoplay
                      // loop
                      // src="https://assets1.lottiefiles.com/packages/lf20_vyL7GL.json"
                      // style={{ height: '100%', width: '100%' }}
                      />
                    </div>
                    <div className="mt-40 text-center">
                      <h3 className="font-medium text-gray-800">Your Notes Space</h3>
                      <p className="text-sm text-gray-500 mt-1">Organize your thoughts and ideas</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Section - Adjust width based on sidebar state */}
              <div className={`${isSidebarOpen ? 'lg:w-full' : 'lg:w-2/3'}`}>
                {/* Welcome Header with real user data */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome, {user?.name || 'User'}!
                  </h1>
                  <p className="text-gray-600">
                    {user?.email ? `Email: ${user.email}` : 'Manage your notes and stay organized'}
                  </p>
                </div>

                {/* Create/Edit Note Form (only shown when creating or editing) */}
                {(isCreating || isEditing) && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {isEditing ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    <form onSubmit={handleSubmit(isEditing ? handleUpdateNote : handleCreateNote)}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            {...register("title", { required: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Note title"
                          />
                        </div>
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            id="content"
                            rows={4}
                            {...register("content", { required: true })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your note here..."
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {isEditing ? 'Update Note' : 'Create Note'}
                          </button>
                          <button
                            type="button"
                            onClick={isEditing ? cancelEditing : cancelCreating}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Notes List */}
                <div className="h-125 bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Your Notes</h2>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 relative group"
                      title="Create new note"
                    >
                      <Plus
                      // className="h-5 w-5" 
                      />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Create New Note
                      </span>
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading notes...</p>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any notes yet.</p>
                      <button
                        onClick={() => setIsCreating(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create Your First Note
                      </button>
                    </div>
                  ) : (
                    <div className={`grid gap-4 ${isSidebarOpen ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                      {notes.map((note) => (
                        <div key={note._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-gray-800 mb-2">{note.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap line-clamp-3">{note.content}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditing(note)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit note"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Delete note"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar Component
function SidebarContent({ user, isCollapsed, onClose, onLogout, onConnectGoogle, onToggle }: {
  user: UserData | null;
  isCollapsed?: boolean;
  onClose?: () => void;
  onLogout: () => void;
  onConnectGoogle: () => void;
  onToggle?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white text-gray-800 border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>}
        <div className="flex items-center">
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-gray-100 text-gray-600"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100 ml-2">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User className="h-6 w-6" />
          </div>
          {!isCollapsed && user && (
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          )}
        </div>

        {/* Provider Status */}
        {!isCollapsed && user && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Account Status</h3>

            {/* Error here, showed connected google account, even when not connected */}
            {/* <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Local Account</span>
              <span className="text-green-500 font-medium">Connected</span>
            </div> */}

            {/* Show local account status only if user has local account */}
            {(user.provider === 'local' || user.provider === 'both') && (
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Local Account</span>
                <span className="text-green-500 font-medium">Connected</span>
              </div>
            )}

            {!user.googleId ? (
              <button
                onClick={onConnectGoogle}
                className="w-full mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white"
              >
                Connect Google
              </button>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Google Account</span>
                <span className="text-green-500 font-medium">Connected</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {!isCollapsed && (
          <h3 className="text-sm font-medium text-gray-500 mb-3">MAIN NAVIGATION</h3>
        )}
        <ul className="space-y-1">
          <li>
            <a href="#" className={`flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-600 ${isCollapsed ? 'justify-center' : ''}`}>
              <span>{!isCollapsed && 'Notes'}</span>
            </a>
          </li>
          {/* <li>
            <a href="#" className={`flex items-center gap-2 p-2 rounded text-gray-600 hover:bg-gray-100 ${isCollapsed ? 'justify-center' : ''}`}>
              <span>{!isCollapsed && 'Settings'}</span>
            </a>
          </li> */}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`flex items-center gap-2 w-full rounded-md p-2 text-white bg-blue-600  ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut
            className="h-4 w-4"
          />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}