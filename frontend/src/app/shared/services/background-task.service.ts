import { Injectable, signal } from '@angular/core';
import { BackgroundTask } from '../models/background-task';

@Injectable({
  providedIn: 'root'
})
export class BackgroundTaskService {
  /**
   * A signal that holds an array of all current background tasks.
   * Components can subscribe to this to display task statuses in the UI.
   */
  tasks = signal<BackgroundTask[]>([]);

  /**
   * Adds a new task to the registry and returns its unique ID.
   * @param name A descriptive name for the task (e.g., the filename).
   * @returns The unique ID of the newly created task.
   */
  addTask(name: string): string {
    const newTask: BackgroundTask = {
      id: crypto.randomUUID(),
      name,
      status: 'uploading',
      progress: 0,
    };
    this.tasks.update(currentTasks => [...currentTasks, newTask]);
    return newTask.id;
  }

  /**
   * Updates the progress and status of a specific task.
   * @param id The ID of the task to update.
   * @param progress The new progress value (0-100).
   */
  updateTaskProgress(id: string, progress: number): void {
    this.tasks.update(tasks => tasks.map(task =>
      task.id === id ? { ...task, progress, status: progress < 100 ? 'processing' : task.status } : task
    ));
  }

  /**
   * Marks a task as completed and stores its result.
   * @param id The ID of the task to complete.
   * @param result The successful result of the task.
   */
  completeTask(id: string, result: any): void {
    this.tasks.update(tasks => tasks.map(task =>
      task.id === id ? { ...task, status: 'completed', progress: 100, result } : task
    ));
  }

  /**
   * Marks a task as failed and stores the error information.
   * @param id The ID of the task to fail.
   * @param error The error that caused the task to fail.
   */
  failTask(id: string, error: any): void {
    this.tasks.update(tasks => tasks.map(task =>
      task.id === id ? { ...task, status: 'failed', error } : task
    ));
  }
}
