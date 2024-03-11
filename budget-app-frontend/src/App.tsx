import React, { useState, useEffect } from 'react';
import { ExpenseItem } from './types/ExpenseItem';
import { fetchExpenseItems, createExpenseItem, updateExpenseItem, deleteExpenseItem } from './services/ExpenseItemService';
import ExpenseItemsList from './components/ExpenseItemsList';
import ExpenseItemForm from './components/ExpenseItemForm';
import Cookies from 'js-cookie';

const App: React.FC = () => {
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Cookies.get('userinfo')) {
      // We are here after a login
      const userInfoCookie = Cookies.get('userinfo');
      if (userInfoCookie) {
        sessionStorage.setItem("userInfo", userInfoCookie);
        var userInfo = JSON.parse(atob(userInfoCookie));
        setSignedIn(true);
        setUser(userInfo);
      }
      Cookies.remove('userinfo');
    } else if (sessionStorage.getItem("userInfo")) {
      // We have already logged in
      var userInfo = JSON.parse(atob(sessionStorage.getItem("userInfo")!));
      setSignedIn(true);
      setUser(userInfo);
    } else {
      console.log("User is not signed in");
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    loadExpenseItems();
  }, [signedIn]);

  const loadExpenseItems = async () => {
    if (signedIn) {
      setIsLoading(true); // Start loading
      try {
        const items = await fetchExpenseItems();
        setExpenseItems(items);
      } catch (error) {
        console.error("Failed to fetch expense items:", error);
        // Handle error (e.g., set an error state here)
      } finally {
        setIsLoading(false); // End loading
      }
      // const items = await fetchExpenseItems();
      // setExpenseItems(items);
    } else {
      setExpenseItems([]); // Clear the items if not signed in
    }
  };

  const handleSaveExpenseItem = async (item: ExpenseItem) => {
    if (item.id) {
      await updateExpenseItem(item.id, item);
    } else {
      await createExpenseItem(item);
    }
    loadExpenseItems();
    setEditingItem(null); // Reset editing item after saving
  };

  const handleEditExpenseItem = (item: ExpenseItem) => {
    setEditingItem(item);
  };

  const handleDeleteExpenseItem = async (id: string) => {
    await deleteExpenseItem(id);
    loadExpenseItems();
  };

  const handleAddNew = () => {
    setEditingItem({ id: '', description: '', amount: 0, date: '', categoryId: '' }); // Reset form for new entry
  };

  const handleLogout = async () => {
    // Clear local user session indicators
    setSignedIn(false);
    setUser(null);
    // setIsAuthLoading(true);
    sessionStorage.removeItem("userInfo");

    // Clear the session_hint cookie immediately after retrieval for security
    const sessionHint = Cookies.get('session_hint');
    Cookies.remove('session_hint');

    // Redirect for logout
    window.location.href = `/auth/logout?session_hint=${sessionHint}`;
  };

  if (isAuthLoading) {
    return <div>Loading authentication status...</div>;
  }

  // if (!signedIn) {
  //   return (
  //     <button
  //       className="float-right bg-black bg-opacity-20 p-2 rounded-md text-sm my-3 font-medium text-white"
  //       onClick={() => { window.location.href = "/auth/login" }}
  //     >
  //       Login
  //     </button>
  //   );
  // }

  if (!signedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="card shadow-lg" style={{ width: "400px" }}>
          <div className="card-body">
            <h2 className="card-title text-center">BudgetApp Login</h2>
            <p className="text-center">Welcome back! Please login to your account.</p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => { window.location.href = "/auth/login"; }}
              >
                Sign in
              </button>
              {/* Optionally, add more OAuth provider buttons here */}
            </div>
          </div>
          <div className="card-footer text-muted text-center">
            Need an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Expense Tracker</h1>
      <button className="btn btn-primary m-1" onClick={handleAddNew}>Add New Expense</button>
      <button className="btn btn-danger pull-right" onClick={handleLogout}>Logout</button>
      {editingItem && <ExpenseItemForm onSave={handleSaveExpenseItem} itemToEdit={editingItem} />}
      <ExpenseItemsList items={expenseItems} onDelete={handleDeleteExpenseItem} onEdit={handleEditExpenseItem} isLoading={isLoading} />
    </div>
  );
};

export default App;
