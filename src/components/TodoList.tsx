import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { Todo } from "../types";

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (id: string) => void;
  toggleComplete: (todo: Todo) => void;
  startEditing: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  deleteTodo,
  toggleComplete,
  startEditing,
}) => {
  return (
    <TableContainer
      component={Paper}
      style={{ maxWidth: "800px", margin: "auto", borderRadius: "12px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>№</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Completed</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo, index) => (
            <TableRow key={todo.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Typography variant="h6">{todo.title}</Typography>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color={todo.completed === "✅" ? "success" : "primary"}
                  onClick={() => toggleComplete(todo)}
                  style={{ borderRadius: "12px" }}
                >
                  {todo.completed}
                </Button>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => startEditing(todo)}
                    style={{ borderRadius: "12px" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteTodo(todo.id)}
                    style={{ borderRadius: "12px" }}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TodoList;
