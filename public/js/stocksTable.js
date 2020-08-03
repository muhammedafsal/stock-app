const socket = io()


socket.on('message', (message) => {
    console.log(message)
})


const deleteStock = () => {

    const companyName = document.getElementById('deleteStock').value
    // pass data to server to delete
    socket.emit('deleteDataFromClient', companyName)
    // force reloads the page to get server data by router
    location.reload(true)
    }


const addStock = () => {

    const companyName = document.getElementById('addStock').value
    // pass data to server to delete
    socket.emit('userStocksDataFromClient', companyName)
    // force reloads the page to get server data by router
    location.reload(true)
    }

    


