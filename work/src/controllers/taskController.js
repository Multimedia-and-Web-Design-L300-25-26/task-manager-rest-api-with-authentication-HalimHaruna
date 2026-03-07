import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create task with owner from authenticated user
    const task = new Task({
      title,
      description,
      owner: req.user._id,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    // Return only tasks belonging to the authenticated user
    const tasks = await Task.find({ owner: req.user._id });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this task" });
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
