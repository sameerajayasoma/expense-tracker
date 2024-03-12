import React, { useState, useEffect } from 'react';
import { ExpenseItem } from '../types/ExpenseItem';
import { ExpenseCategory } from '../types/ExpenseCategory';
import { fetchExpenseCategories } from '../services/ExpenseCategoryService';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ExpenseItemsListProps {
  items: ExpenseItem[];
  onDelete: (id: string) => void;
  onEdit: (item: ExpenseItem) => void;
  isLoading: boolean;
}

const ExpenseItemsList: React.FC<ExpenseItemsListProps> = ({ items, onDelete, onEdit, isLoading }) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentComment, setCurrentComment] = useState('');

  // TODO Can we load categories only once during the app load?
  useEffect(() => {
    fetchExpenseCategories().then(setCategories);
  }, []);

  const categoryMap = new Map(categories.map(category => [category.id, category]));

  const handleShowCommentClick = (comment: string): void => {
    setCurrentComment(comment);
    setShowCommentModal(true);
  };

  const bgClasses = ['bg-light', 'bg-light'];

  if (isLoading) {
    return (
      <div>
        <h2 className="mt-3">Expense Items</h2>
        <table className="table table-striped mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>
        <div>Loading expenses...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Expense Items</h2>
      <div className="d-none d-md-block"> {/* Table shown only on md screens and up */}
        <div className="table-responsive">
          <table className="table table-striped mt-3">
            <thead className="thead-dark">
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td>{item.amount.toFixed(2)}</td>
                  <td>{item.date}</td>
                  <td>{categoryMap.get(item.categoryId)?.name || 'No Category'}</td>
                  <td>
                    <button className="btn btn--outline-info btn-sm m-1" onClick={() => handleShowCommentClick(item.comment || 'No comment available')}>Show Comment</button>
                  </td>
                  <td>
                    <button className="btn btn-outline-warning m-1" onClick={() => onEdit(item)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => onDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p>No expense items found.</p>}
        </div>
      </div>
      <div className="d-md-none"> {/* Cards shown on screens smaller than md */}
        {items.map((item, index) => (
          <div key={item.id} className={`card mb-3 ${bgClasses[index % bgClasses.length]} text-dark`}>
            <div className="card-body">
              <h5 className="card-title">{item.description}</h5>
              <p className="card-text">Amount: {item.amount.toFixed(2)}</p>
              <p className="card-text">Date: {item.date}</p>
              <p className="card-text">Category: {categoryMap.get(item.categoryId)?.name || 'No Category'}</p>
              <button className="btn btn-outline-info btn-sm mb-2" onClick={() => handleShowCommentClick(item.comment || 'No comment available')}>
                Show Comment
              </button>
              <div>
                <button className="btn btn-outline-warning m-1" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn btn-outline-danger" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentComment}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenseItemsList;
