const fs = require('fs')
	http = require('http')
	socketio = require('socket.io')

/////////////////////Global Variables////////////////
var board = []
var clients = []
var turns = {}
var rooms = {}
var states = {}
var won = {}
var games = 1
var tmpBoard = []
////////////////////FUNCTIONS///////////////////////
const readFile = file => new Promise((resolve, reject) =>
	fs.readFile(file, (err, data) => err ? reject(err) : resolve(data)))

const server = http.createServer(async (request, response) =>{
	try{
		resposne.end(await readFile(request.url.substr(1)))	
	}catch(err){
		response.end()
	}
})
const io = socketio(server)

const findRoom = (client) => {
	for(var key in rooms){
		temp = rooms[key]
		if(temp[0] == client || temp[1] == client){
			return key
		}
	}
}

const awaitPlayers = () => new Promise(resolve => {
	if((clients.length % 2 == 0) && clients.length !== 0){resolve()}
	clients[clients.length - 1].emit('client_msg', 'Waiting for Opponent')
})

const sendIdentity = (key) => {
	currClients = rooms[key]
	currClients[0].emit('iden', 'You are X')
	currClients[1].emit('iden', 'You are O')
}

const sendPlayerMsg = (key) => {
	currClients = rooms[key]
	currClients[0].emit('client_msg', 'You are X')
	currClients[1].emit('client_msg', 'You are O')
	if(turns[key] == 0){
		currClients[0].emit('client_msg', 'Your Turn!')
		currClients[1].emit('client_msg', 'Wait For Your Turn!')
	}
	else{
		currClients[1].emit('client_msg', 'Your Turn!')
		currClients[0].emit('client_msg', 'Wait For Your Turn!')
	}
}

const validateAndUpdate = (move, client, key, checking, currState, flag) => {
	currClients = rooms[key]
	//currState = states[key]
	row = findRow(move)
	col = findCol(move)
	symbol = findSymbol(client, key)
	directions = []
	s1 = ""
	s2 = ""
	if(turns[key] == 0 && currClients[0] == client){s1 = "O", s2 = "X"}
	else{s1 = "X", s2 = "O"}
	if(turns[key] == currClients.indexOf(client)){
		if(currState[row][col] == "..."){
			for(var i = col + 1; i <= 7;){
				if(currState[row][i] == s1){i = i + 1}
				else if(currState[row][i] == s2 && (Math.abs(col - i) > 1)){directions.push(3); break}	//3
				else{break}}

			for(var i = col - 1; i >= 0;){
				if(currState[row][i] == s1){i = i - 1}
				else if(currState[row][i] == s2 && (Math.abs(col - i) > 1)){directions.push(7); break} //7
				else{break}}

			for(var i = row + 1; i <= 7;){
				if(currState[i][col] == s1){i = i + 1}
				else if(currState[i][col] == s2 && (Math.abs(row - i) > 1)){directions.push(5); break} //5
				else{break}}

			for(var i = row - 1; i >= 0;){
				if(currState[i][col] == s1){i = i - 1}
				else if(currState[i][col] == s2 && (Math.abs(row - i) > 1)){directions.push(1); break} //1
				else{break}}

			for(var i = row - 1, j = col + 1; i >= 0 && j <= 7;){
				if(currState[i][j] == s1){i = i - 1, j = j + 1}
				else if(currState[i][j] == s2 && (Math.abs(row - i) > 1) && (Math.abs(col - j) > 1)){directions.push(2); break} //2
				else{break}}

			for(var i = row + 1, j = col + 1; i <= 7 && j <= 7;){
				if(currState[i][j] == s1){i = i + 1, j = j + 1}
				else if(currState[i][j] == s2 && (Math.abs(row - i) > 1) && (Math.abs(col - j) > 1)){directions.push(4); break} //4
				else{break}}

			for(var i = row + 1, j = col - 1; i <= 7 && j >= 0;){
				if(currState[i][j] == s1){i = i + 1, j = j - 1}
				else if(currState[i][j] == s2 && (Math.abs(row - i) > 1) && (Math.abs(col - j) > 1)){directions.push(6); break} //6
				else{break}}

			for(var i = row - 1, j = col - 1; i >= 0 && j >= 0;){
				if(currState[i][j] == s1){i = i - 1, j = j - 1}
				else if(currState[i][j] == s2 && (Math.abs(row - i) > 1) && (Math.abs(col - j) > 1)){directions.push(8); break} //8
				else{break}}

			if(directions.length > 0 && checking == 0){
				directions.forEach(dir => {
					if(dir == 1){
						for(var i = row - 1; i >= 0;){
							if(currState[i][col] == s1){currState[i][col] = s2, i = i - 1}
							else{break}}}
					if(dir == 2){
						for(var i = row - 1, j = col + 1; i >= 0 && j <= 7;){
							if(currState[i][j] == s1){currState[i][j] = s2, i = i - 1, j = j + 1}
							else{break}}}
					if(dir == 3){
						for(var i = col + 1; i <= 7;){
							if(currState[row][i] == s1){currState[row][i] = s2, i = i + 1}
							else{break}}}
					if(dir == 4){
						for(var i = row + 1, j = col + 1; i <= 7 && j <= 7;){
							if(currState[i][j] == s1){currState[i][j] = s2, i = i + 1, j = j + 1}
							else{break}}}
					if(dir == 5){
						for(var i = row + 1; i <= 7;){
							if(currState[i][col] == s1){currState[i][col] = s2, i = i + 1}
							else{break}}}
					if(dir == 6){
						for(var i = row + 1, j = col - 1; i <= 7 && j >= 0;){
							if(currState[i][j] == s1){currState[i][j] = s2, i = i + 1, j = j - 1}
							else{break}}}
					if(dir == 7){
						for(var i = col - 1; i >= 0;){
							if(currState[row][i] == s1){currState[row][i] = s2, i = i - 1}
							else{break}}}
					if(dir == 8){
						for(var i = row - 1, j = col - 1; i >= 0 && j >= 0;){
							if(currState[i][j] == s1){currState[i][j] = s2, i = i - 1, j = j - 1}
							else{break}}}
				})
				if(flag == 0){
					currState[row][col] = s2
					turns[key] = (turns[key] + 1) % 2
					states[key] = currState
				}
			}
		}
	}
	return directions.length
}

const createBoard = () => {
	board = new Array(8).join(".").split(".").map(element => new Array(8)).map(element => element.fill("..."))
	board[3][4] = "X"
	board[4][3] = "X"
	board[3][3] = "O"
	board[4][4] = "O"
}

const sendState = (key) => {rooms[key].forEach(currClient => currClient.emit('state', states[key]))}

const findRow = (num) => {
	if(num % 8 == 0) {return (num/8) - 1}
	return Math.floor(num / 8)
}

const findCol = (num) => {
	if(num % 8 == 0){return 7}
	return (num % 8) - 1
}

const findSymbol = (client, key) => {
	currClients = rooms[key]
	if (currClients[1] == client) {return "O"}
	return "X"
}

const addRoomsStates = () => {
	numOfClients = clients.length
	key = games
	toAdd = [clients[numOfClients - 2], clients[numOfClients - 1]] 
	rooms[key] = toAdd
	states[key] = board
	turns[key] = 0
	won[key] = 0
	games = games + 1
}

const checkHasValid = (client, key) => {
	currClients = rooms[key]
	if(turns[key] == currClients.indexOf(client)){
		yn = -1
		for(var  i = 1; i <= 64; i++){
			tmp = validateAndUpdate(i, client, key, 1, states[key], 1)
			if(tmp > yn){yn = tmp}
		}
		if(yn <= 0){
			turns[key] = (turns[key] + 1) % 2
			return false
		}
		return true
	}
}

const checkWinning = (key) => {
	currClients = rooms[key]
	currState = states[key]
	countX = 0
	countO = 0
	for(var i = 0; i <= 7; i++){
		for(var j = 0; j <= 7; j++){
			if(currState[i][j] == "X"){countX = countX + 1}
			if(currState[i][j] == "O"){countO = countO + 1}
		}
	}

	if((checkHasValid(currClients[0], key) == false && checkHasValid(currClients[1], key) == false) || (countO + countX == 64)){
		won[key] = 1
		if(countX > countO){
			currClients[0].emit('client_msg', "You Win!")
			currClients[1].emit('client_msg', "You Loose!")
		}
		else if(countX < countO){
			currClients[1].emit('client_msg', "You Win!")
			currClients[0].emit('client_msg', "You Loose!")
		}
		else{
			currClients[0].emit('client_msg', "Game Draw!")
			currClients[1].emit('client_msg', "Game Draw!")
		}
	}
}
////////////////////////////////////////////////////
io.sockets.on('connection', async socket => {
	clients = [...clients, socket]
	await awaitPlayers()
	createBoard()
	addRoomsStates()
	sendState(findRoom(socket))
	sendIdentity(findRoom(socket))
	sendPlayerMsg(findRoom(socket))
	clients.forEach(client => client.on('to_server', move => {
		key = findRoom(client)
		if(won[key] == 0){
			checkHasValid(client, key)
			validateAndUpdate(move, client, key, 0, states[key], 0)
			sendState(key)
			sendPlayerMsg(key)
		}
		checkWinning(key)
	}))
	clients.forEach(client => client.on('mouseOver', id => {
		key = findRoom(client)
		var copyArr = []
		for (var i = 0; i < states[key].length; i++)
    		copyArr[i] = states[key][i].slice()
    	tmp = validateAndUpdate(id, client, key, 0, copyArr, 1)
    	if(tmp > 0){
	    	copyArr[findRow(id)][findCol(id)] = findSymbol(client, key)
	 		client.emit('temp', copyArr)
 		}
	}))
})

server.listen(8000)