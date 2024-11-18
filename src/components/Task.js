import React from 'react'

function Task({task,toggleStatus, deleteTask,editTask}) {
  const createdAt = new Date(task.createdAt);
  const formattedDate = createdAt.toLocaleDateString('en-US', {
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
  });
  return (
 
  <li
  key={task.id}
  className="mb-2 p-2 bg-white shadow rounded flex justify-between items-center"
>
  <input
    type="checkbox"
    checked={task.status === "Completed"}
    onChange={() => toggleStatus(task.id, task.status)}
    className="h-4 w-50 text-green-500 rounded focus:ring focus:ring-green-300"
  />
  <span className="w-50">{task.name}</span>
  <span className="text-gray-500 text-sm">{formattedDate}</span>
  <div className="flex space-x-2">
    <button
      onClick={() => editTask(task.id, task.name)} 
      className="p-1 bg-yellow-500 text-white rounded"
    >
      Edit
    </button>
    {task.status === "Completed"?'':
    <button
      onClick={() => deleteTask(task.id)}
      className="p-1 bg-red-500 text-white rounded"
    >
      Delete
    </button>}
  </div>
</li>
  )
}

export default Task