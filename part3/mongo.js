const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fsoTest:${password}@cluster0.3jguwkk.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// const note = new Note({
// 	content: 'HTML is Easy',
// 	important: true,
// });

// note.save().then((result) => {
// 	console.log('note saved!');
// 	mongoose.connection.close();
// });

// Note.find({}).then((result) => {
// 	result.forEach((note) => {
// 		console.log(note);
// 	});
// 	mongoose.connection.close();
// });

if (process.argv.length === 3) {
	Note.find({}).then((result) => {
		result.forEach((note) => {
			console.log(note);
		});
		mongoose.connection.close();
	});
} else if (process.argv.length >= 4) {
	const note = new Note({
		content: process.argv[3],
		important: process.argv[4] || false,
	});

	note.save().then((result) => {
		console.log('note saved!');
		mongoose.connection.close();
	});
}
