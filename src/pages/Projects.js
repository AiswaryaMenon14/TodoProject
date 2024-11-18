import React, { useState, useEffect } from 'react';
import { db } from '../firebase/Firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Firebase';
import { Navigate, useNavigate } from 'react-router-dom';

const ProjectsPage = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const navigate = useNavigate(); 

    const fetchProjects = async () => {
      if (!userId) return; 
      try {
        const projectsCollection = collection(db, `users/${userId}/projects`);
        const querySnapshot = await getDocs(projectsCollection);
        setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    useEffect(() => {
            fetchProjects();
          }, []);

  const addProject = async () => {
    if (newProject.trim() && userId) {
      try {
        const projectsCollection = collection(db, `users/${userId}/projects`);
        await addDoc(projectsCollection, {
          name: newProject,
          createdBy: userId,
          createdAt: new Date().toISOString(), 
        });
        setNewProject('');
        fetchProjects(); 
      } catch (error) {
        console.error('Error adding project:', error);
      }
    }
  };

    const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign Out');
        navigate('/');
      })
      .catch(error => console.error('Error signing out:', error));
  };

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      <input
        type="text"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        placeholder="New Project Name"
        className="p-2 border border-gray-300 rounded"
      />
      <button onClick={addProject} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Add Project
      </button>
      <ul>
         {projects.map((project) => (
          <li
            key={project.id}
            className="bg-white p-4 mb-2 rounded-lg shadow flex justify-between items-center"
          >
            {project.name}
            <button onClick={() => navigate(`/projects/${project.id}`)} className="text-blue-500 hover:underline">
  View
</button>
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
