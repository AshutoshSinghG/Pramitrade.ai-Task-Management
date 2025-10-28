import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

export async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) {
    next(err);
  }
}

export async function getTasks(req, res, next) {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, message: 'Tasks fetched', data: tasks });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, message: 'Task fetched', data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { title, description, status } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    await task.save();
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}


