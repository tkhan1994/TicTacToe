const socket = io('http://localhost:8000').connect()
let client_msg = ""
let identity = ""
let state = []
let tmpState = []

socket.on('iden', data => identity = data)

socket.on('client_msg', data => {
	client_msg = data
	redraw(state)
})
socket.on('state', data => {
	state = data
	redraw(state)
})

socket.on('temp', data => {
	redraw(data)
})

const handleClick = e => {
    e.preventDefault();
    socket.emit('to_server', e.target.id)
}

const handleOver = e => {
	e.preventDefault()
	socket.emit('mouseOver', e.target.id)
}

const handleOut = e => {
	e.preventDefault()
	redraw(state)
}

function createButtons(board){
	let myId = 0
	temp_state = board.map(ls => ls.map(ele => {
		myId = myId + 1
		return React.createElement('button', {id: myId, onClick: handleClick, onMouseOver: handleOver, onMouseOut: handleOut}, ele)
	}))
	temp_state.map(ls => ls.push(React.createElement('br',null)))
	return temp_state
}
	


function redraw(board) {
	ReactDOM.render(
	    React.createElement('div', null, createButtons(board),
	        React.createElement('h2', null, identity,
	        React.createElement('h2', null, client_msg)))
	    ,document.getElementById('root'))
}
