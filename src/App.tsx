import React, { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import "./App.css";
import { Todo } from "./types";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async (newTodo: Omit<Todo, "id">) => {
    if (editingTodo) {
      const updatedTodo = { ...editingTodo, ...newTodo };
      await editTodo(updatedTodo);
      return;
    }

    const response = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
    const addedTodo = await response.json();
    setTodos((prevTodos) => [...prevTodos, addedTodo]);
  };

  const deleteTodo = async (id: string) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    // Agar oxirgi sahifada faqat 1 ta todo bo'lsa va u o'chirilsa, oldingi sahifaga o'tish
    if (
      currentPage > 1 &&
      updatedTodos.length <= (currentPage - 1) * todosPerPage
    ) {
      setCurrentPage(currentPage - 1);
    }

    setOpenConfirm(false);
  };

  const toggleComplete = async (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      completed: todo.completed === "❌" ? "✅" : "❌",
    };
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t))
    );
  };

  const editTodo = async (updatedTodo: Todo) => {
    await fetch(`http://localhost:3000/todos/${updatedTodo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
    setEditingTodo(null);
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleOpenConfirm = (id: string) => {
    setTodoToDelete(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setTodoToDelete(null);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      deleteTodo(todoToDelete);
    }
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      <AddTodo
        addTodo={addTodo}
        editingTodo={editingTodo}
        cancelEdit={() => setEditingTodo(null)}
      />
      <TodoList
        todos={currentTodos}
        deleteTodo={handleOpenConfirm}
        toggleComplete={toggleComplete}
        startEditing={startEditing}
      />
      <Pagination
        count={Math.ceil(todos.length / todosPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      />

      {/* Tasdiqlash oynasi */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{"Delete Todo"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this todo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteTodo} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
