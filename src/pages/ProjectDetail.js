import React, { useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
} from "firebase/firestore";
import Task from "../components/Task";
import { saveAs } from "file-saver";
import axios from "axios";

const ProjectDetail = ({ userId }) => {
  const { projectId} = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null); 
  const [projectName, setProjectName] = useState("");
  const [editingProjectName, setEditingProjectName] = useState(false);

  const fetchTasks = async () => {
    
    try {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("projectId", "==", projectId),
        where("userId", "==", userId)
        ,orderBy("createdAt",'desc')
      );
      const querySnapshot = await getDocs(tasksQuery);
      setTasks(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const fetchProjectName = async () => {
    try {
      const projectDocRef = doc(db, "projects", projectId);
      const projectDoc = await getDoc(projectDocRef);
      if (projectDoc.exists()) {
        setProjectName(projectDoc.data().name);

      }
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };
  const updateProjectName = async () => {
    if (projectName.trim()) {
      try {
        const projectDocRef = doc(db, "projects", projectId);
        await updateDoc(projectDocRef, {
          name: projectName,
        });
        setEditingProjectName(false); 
      } catch (error) {
        console.error("Error updating project name:", error);
      }
    }
  };
  useEffect(() => {
    if (projectId && userId) {
      fetchTasks();
      fetchProjectName(); 
    }
  }, [projectId, userId]);

  const addOrUpdateTask = async () => {
    if (newTask.trim()) {
      try {
        if (editingTaskId) {
         
          const taskDoc = doc(db, "tasks", editingTaskId);
          await updateDoc(taskDoc, {
            name: newTask,
          });
          setEditingTaskId(null); 
        } else {
       
          await addDoc(collection(db, "tasks"), {
            name: newTask,
            status: "Pending",
            projectId: projectId,
            userId: userId,
            createdAt: new Date().toISOString(),
          });
        }
        setNewTask(""); 
        fetchTasks();
      } catch (error) {
        console.error("Error adding/updating task:", error);
      }
    }
  };

  const toggleStatus = async (taskId, currentStatus) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, {
        status: currentStatus === "Pending" ? "Completed" : "Pending",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const editTask = (taskId, taskName) => {
    setEditingTaskId(taskId);
    setNewTask(taskName); 
  };

  const deleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  const generateMarkdown = () => {
    const completedTasks = tasks.filter((task) => task.status === "Completed");
    const pendingTasks = tasks.filter((task) => task.status === "Pending");

    return `
# ${projectName}

**Summary:** ${completedTasks.length}/${tasks.length} tasks completed.

## Pending Tasks
${pendingTasks.map((task) => `- [ ] ${task.name}`).join("\n")}

## Completed Tasks
${completedTasks.map((task) => `- [x] ${task.name}`).join("\n")}
`;
  };

  const downloadMarkdown = () => {
    const content = generateMarkdown();
    const blob = new Blob([content], { type: "text/markdown" });
    saveAs(blob, `${projectName.replace(/\s+/g, "_")}.md`);
  };

  const exportToGist = async () => {
    const content = generateMarkdown();

    const gistData = {
      files: {
        [`${projectName.replace(/\s+/g, "_")}.md`]: { content },
      },
      public: false, 
    };

    try {
      const resp = await axios('https://run.mocky.io/v3/2d6fdd72-2049-47d3-bb5e-20802e211827')
      if(!resp?.data?.key) alert('key is missing')
      const response = await axios.post(
        "https://api.github.com/gists",
        gistData,
        {
          headers: {
            Authorization: resp?.data?.key,
          },
        }
      );
      // alert(`Gist Created: ${response.data.html_url}`);
      window.open(response.data.html_url, '_blank');
    } catch (error) {
      console.error("Error exporting gist:", error);
    }
  };

  return (
    <div className="project-detail">
      <h2 className="text-2xl font-bold mb-4">{projectName} Tasks</h2>

      <div className="mb-4">
        {editingProjectName ? (
          <div>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
            <button
              onClick={updateProjectName}
              className="ml-2 p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingProjectName(false)}
              className="ml-2 p-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <span className="font-semibold">Project Name: </span>
            <span>{projectName}</span>
            <button
              onClick={() => setEditingProjectName(true)}
              className="ml-2 text-blue-500"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={addOrUpdateTask}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </div>

      <h3 className="text-xl font-bold mt-4">Pending Tasks</h3>
      <ul>
        {tasks
          .filter((task) => task.status === "Pending")
          .map((task) => (
          
          
            <Task task={task} toggleStatus={toggleStatus} deleteTask={deleteTask} editTask={editTask} />
          ))}
      </ul>

      <h3 className="text-xl font-bold mt-4">Completed Tasks</h3>
      <ul>
        {tasks
          .filter((task) => task.status === "Completed")
          .map((task) => (
            <Task task={task} toggleStatus={toggleStatus}  editTask={editTask} />
           
          ))}
      </ul>

      <button
        onClick={downloadMarkdown}
        className="p-2 bg-green-500 text-white rounded mt-4"
      >
        Download Markdown
      </button>

      <button
        onClick={exportToGist}
        className="p-2 bg-blue-500 text-white rounded mt-4 ml-2"
      >
        Export to Gist
      </button>
    </div>
  );
};

export default ProjectDetail;
