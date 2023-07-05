import { useState } from 'react';
import './App.css';

const Hello = ({ name, age }) => {
	const bornYear = () => new Date().getFullYear() - age;

	return (
		<div>
			<p>
				Hello, {name}. You are {age} years old.
			</p>
			<p>You were probably born in {bornYear()}</p>
		</div>
	);
};

const Display = ({ counter }) => {
	return <h4>Counter: {counter}</h4>;
};
const Button = ({ text, handleClick }) => {
	return <button onClick={handleClick}>{text}</button>;
};

const History = ({ allClicks }) => {
	if (allClicks.length === 0) {
		return <div>the app is used by pressing the buttons</div>;
	}
	return <div>button press history: {allClicks.join(' ')}</div>;
};

function App() {
	const name = 'Jake';
	const age = 10;

	const [counter, setCounter] = useState(0);

	const [left, setLeft] = useState(0);
	const [right, setRight] = useState(0);
	const [allClicks, setAllClicks] = useState([]);
	const [total, setTotal] = useState(0);

	// setTimeout(() => setCounter(counter + 1), 1000);
	const increaseByOne = () => setCounter(counter + 1);
	const decreaseByOne = () => setCounter(counter - 1);

	const setToZero = () => setCounter(0);

	const handleLeftClick = () => {
		const updatedLeft = left + 1;
		setLeft(updatedLeft);
		setAllClicks(allClicks.concat('L'));
		setTotal(updatedLeft + right);
	};
	const handleRightClick = () => {
		const updatedRight = right + 1;
		setRight(updatedRight);
		setAllClicks(allClicks.concat('R'));
		setTotal(left + updatedRight);
	};

	return (
		<>
			<h1>Greetings</h1>
			<Hello name={name} age={age} />
			<Display counter={counter} />
			<Button text={'plus'} handleClick={increaseByOne} />
			<Button text={'zero'} handleClick={setToZero} />
			<Button text={'minus'} handleClick={decreaseByOne} />
			<h4>
				{left} |||| {right}
			</h4>
			{/* <button onClick={handleLeftClick}>left</button>
			<button onClick={handleRightClick}>right</button> */}
			<Button text={'left'} handleClick={handleLeftClick} />
			<Button text={'right'} handleClick={handleRightClick} />
			{/* <p>{allClicks.join(' ')}</p> */}
			<p>total: {total}</p>
			<History allClicks={allClicks} />
		</>
	);
}

export default App;
