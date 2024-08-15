import React, { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { Todo } from "../types";

interface AddTodoProps {
  addTodo: (newTodo: { title: string; completed: string }) => void;
  editingTodo: Todo | null;
  cancelEdit: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({
  addTodo,
  editingTodo,
  cancelEdit,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
    } else {
      setTitle("");
    }
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    addTodo({ title, completed: editingTodo ? editingTodo.completed : "❌" });
    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ textAlign: "center", marginBottom: "20px" }}
    >
      <Stack direction="row" spacing={2} justifyContent="center">
        <TextField
          label="Todo"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "350px" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ borderRadius: "12px" }}
        >
          {editingTodo ? "Update" : "Add"}
        </Button>
        {editingTodo && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={cancelEdit}
            style={{ borderRadius: "12px" }}
          >
            Cancel
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default AddTodo;
