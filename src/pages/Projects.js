import React, { useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { Link, useNavigate } from "react-router-dom";

const ProjectsPage = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");
  const navigate = useNavigate();

 
  const fetchProjects = async () => {
    if (!userId) return;
    try {
      const projectsRef = collection(db, "projects");
      const userProjectsQuery = query(
        projectsRef,
        where("createdBy", "==", userId)
      );
      const querySnapshot = await getDocs(userProjectsQuery);
      setProjects(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (newProject.trim() && userId) {
      try {
        const projectsRef = collection(db, "projects");
        await addDoc(projectsRef, {
          name: newProject,
          userId: userId,
          createdAt: new Date().toISOString(),
        });
        setNewProject("");
        fetchProjects();
      } catch (error) {
        console.error("Error adding project:", error);
      }
    }
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold">Projects</h1>
      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="New Project Name"
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={addProject}
        className="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Add Project
      </button>
      <ul className="mt-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="bg-white p-4 mb-2 rounded-lg shadow flex justify-between items-center"
          >
            {project.name}

            <Link
              to={`/${project.id}`}
              className="text-blue-500 hover:underline"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSignOut}
        className="mt-5 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProjectsPage;
