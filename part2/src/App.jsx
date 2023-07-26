import { useState, useEffect, useRef } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import Notification from './components/Notfication';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';
import Togglable from './components/Togglable';

const Footer = () => {
	const footerStyle = {
		color: 'green',
		fontStyle: 'italic',
		fontSize: 16,
	};
	return (
		<div style={footerStyle}>
			<br />
			<em>
				Note app, Department of Computer Science, University of Helsinki 2022
			</em>
		</div>
	);
};

const App = () => {
	const [notes, setNotes] = useState([]);
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [user, setUser] = useState(null);
	const [loginVisible, setLoginVisible] = useState(false);

	useEffect(() => {
		noteService.getAll().then((initialNotes) => {
			setNotes(initialNotes);
		});
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			noteService.setToken(user.token);
		}
	}, []);

	const addNote = (noteObject) => {
		noteFormRef.current.toggleVisibility();
		noteService.create(noteObject).then((returnedNote) => {
			setNotes(notes.concat(returnedNote));
		});
	};

	const toggleImportanceOf = (id) => {
		console.log(`importance of ${id} needs to be toggled`);
		const note = notes.find((n) => n.id === id);
		const changedNote = { ...note, important: !note.important };
		console.log(changedNote);
		noteService
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
			})
			.catch((error) => {
				console.log(error);
				setErrorMessage(
					`the note '${note.content}' was already deleted from server`
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
				setNotes(notes.filter((n) => n.id !== id));
			});
	};

	const notesToShow = showAll
		? notes
		: notes.filter((note) => note.important === true);

	const handleLogin = async (username, password) => {
		try {
			const user = await loginService.login({
				username,
				password,
			});

			window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user));
			noteService.setToken(user.token);
			setUser(user);
		} catch (exception) {
			setErrorMessage('Wrong credentials');
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem('loggedNoteappUser');
		setUser(null);
		setErrorMessage('Logged out');
		setTimeout(() => {
			setErrorMessage(null);
		}, 5000);
	};

	const loginForm = () => {
		const hideWhenVisible = { display: loginVisible ? 'none' : '' };
		const showWhenVisible = { display: loginVisible ? '' : 'none' };

		return (
			<div>
				<div style={hideWhenVisible}>
					<button onClick={() => setLoginVisible(true)}>log in</button>
				</div>
				<div style={showWhenVisible}>
					<LoginForm handleSubmit={handleLogin} />
					<button onClick={() => setLoginVisible(false)}>cancel</button>
				</div>
			</div>
		);
	};

	const noteFormRef = useRef();

	const noteForm = () => (
		<Togglable buttonLabel='new note' ref={noteFormRef}>
			<NoteForm createNote={addNote} />
		</Togglable>
	);

	return (
		<div>
			<h1>Notes</h1>

			<Notification message={errorMessage} />

			{user === null && loginForm()}
			{user && (
				<div>
					<p>{user.name} logged in</p>
					<button type='button' onClick={handleLogout}>
						logout
					</button>
					{noteForm()}
				</div>
			)}

			<h2>Notes</h2>

			<div>
				<button onClick={() => setShowAll(!showAll)}>
					show {showAll ? 'important' : 'all'}
				</button>
			</div>

			<ul>
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
					/>
				))}
			</ul>

			<Footer />
		</div>
	);
};

export default App;
