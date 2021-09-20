import React from 'react';

export default function App() {
    return (
		<ul>
			{
			  	new Array(3000).fill('').map((item, index) => <li key={index}>{index}</li>)
		    }
		</ul>
    );
}
