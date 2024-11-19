A task management application built using React and Firebase, allowing users to create, view, update, and delete tasks for specific projects. The application also supports user authentication and task export functionality.
Features
•	Firebase Authentication for secure user login.
•	Task management with options to add, edit, delete, and mark tasks as completed or pending.
•	User-specific project and task storage.
•	Export tasks to a Markdown file for local storage.
•	Responsive UI built with Tailwind CSS
Setup Instructions
1.	Clone the Repository:
      https://github.com/AiswaryaMenon14/TodoProject.git
3.	Install Dependencies: Ensure you have Node.js installed. Then, run:
npm install
4.	Configure Firebase:
o	Go to Firebase Console, create a new project, and set up Firestore and Authentication.
5.	Initialize Firestore:
o	Set up Firestore collections:
1.	users (store user-specific data)
2.	projects (store project details)
3.	tasks (store task data under respective projects)

Run Instructions
1.	Start the Development Server:
npm start
The application will run on http://localhost:3000.
2.	Sign In: Use Google Authentication to log in and manage tasks.

How to Use the Application
Add a Project
1.	After signing in, navigate to the Projects Page.
2.	Enter a project name in the input field provided.
3.	Click Add Project to create a new project. This project will be associated with your user ID.
View Project Details
1.	On the Projects Page, you will see a list of your projects.
2.	Click the View button next to a project to navigate to its Details Page.
Manage Tasks
1.	On the Details Page, you can:
o	Add Tasks:
	Enter a task name in the input field and click Add Task.
	Each task will be stored under the specific project in Firestore, with its status set to Pending by default.
o	Toggle Task Status:
	Use the checkbox to mark tasks as Completed or revert them to Pending.
o	Edit Tasks:
	Click the Edit button next to a task and update the task name in the prompt that appears.
o	Delete Tasks:
	Click the Delete button to permanently remove a task.
Export Tasks as Gist
1.	On the Details Page, you will find an option to Export Tasks.
2.	Click the export button to save the list of tasks (in Markdown format) to your local system or upload it as a public/private Gist using GitHub’s API.
Note: Ensure that you have GitHub credentials and permissions configured if using the Gist export feature.

