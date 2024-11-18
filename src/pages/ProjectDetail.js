import React, { useState, useEffect } from 'react';
import { db } from '../firebase/Firebase';
import { useParams } from 'react-router-dom';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const tasksCollection = collection(db, `projects/${projectId}/tasks`);
      const querySnapshot = await getDocs(tasksCollection);
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        await addDoc(collection(db, `projects/${projectId}/tasks`), {
          name: newTask,
          status: 'Pending',
        });
        setNewTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleStatus = async (taskId, currentStatus) => {
    try {
      const taskDoc = doc(db, `projects/${projectId}/tasks`, taskId);
      await updateDoc(taskDoc, {
        status: currentStatus === 'Pending' ? 'Completed' : 'Pending',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const editTask = async (taskId, newName) => {
    try {
      const taskDoc = doc(db, `projects/${projectId}/tasks`, taskId);
      await updateDoc(taskDoc, { name: newName });
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, `projects/${projectId}/tasks`, taskId);
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="project-detail">
      <h2 className="text-2xl font-bold mb-4">Project Tasks</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
          className="p-2 border border-gray-300 rounded"
        />
        <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
          Add Task
        </button>
      </div>

      <h3 className="text-xl font-bold mt-4">Pending Tasks</h3>
      <ul>
        {tasks
          .filter((task) => task.status === 'Pending')
          .map((task) => (
            <li key={task.id} className="mb-2 p-2 bg-white shadow rounded flex justify-between items-center">
              <span>{task.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleStatus(task.id, task.status)}
                  className="p-1 bg-green-500 text-white rounded"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => {
                    const newName = prompt('Edit Task Name:', task.name);
                    if (newName) editTask(task.id, newName);
                  }}
                  className="p-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>

      <h3 className="text-xl font-bold mt-4">Completed Tasks</h3>
      <ul>
        {tasks
          .filter((task) => task.status === 'Completed')
          .map((task) => (
            <li key={task.id} className="mb-2 p-2 bg-gray-100 shadow rounded flex justify-between items-center">
              <span>{task.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleStatus(task.id, task.status)}
                  className="p-1 bg-blue-500 text-white rounded"
                >
                  Mark as Pending
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProjectDetail;
