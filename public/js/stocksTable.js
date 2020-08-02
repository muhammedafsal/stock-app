const socket = io()


const dynamicResultTable = (data) => {

    // checks and remove if table already exist 
    var element = document.getElementById('initEmpTable');
    if(element) element.parentNode.removeChild(element);
    
    // Draw HTML table
    var perrow = 1, // 3 cells per row
        count = 0, // Flag for current cell
        table = document.createElement("table"),
        row = table.insertRow();
  
        table.setAttribute('class', 'table table-striped table-primary'); // add class
        table.setAttribute('id', 'initEmpTable');  // table id.

    for (var i of data) {
      var cell = row.insertCell();
      cell.innerHTML = i;
  
      // Break into next row
      count++;
      if (count%perrow==0) {
        row = table.insertRow();
      }
    }
  
    // Attach table to container
    document.getElementById("containerData").appendChild(table);
  }


  // dynamic table creation
  var arrHead = new Array();
  arrHead = ['', 'Company']; // table headers.


  window.onload = (event) => {

        event.preventDefault()

           
            // first create a TABLE structure by adding few headers.
            var empTable = document.createElement('table');
            empTable.setAttribute('id', 'empTable');  // table id.

            var tr = empTable.insertRow(-1);

            for (var h = 0; h < arrHead.length; h++) {
                var th = document.createElement('th'); // the header object.
                th.innerHTML = arrHead[h];
                tr.appendChild(th);
            }

            var div = document.getElementById('cont');
            div.appendChild(empTable);    // add table to a container.
        


        // initial data fetching, emitting from client to server with null data
        socket.emit('init', null)

        // Getting data from server
        socket.on('initResponse', (data) =>{
            console.log('initial data fetching', data)
            dynamicResultTable(data)
        })
  }




socket.on('message', (message) =>{
    console.log(message)
})


    
    // function to add new row.
    function addRow() {
        var empTab = document.getElementById('empTable');

        var rowCnt = empTab.rows.length;    // get the number of rows.
        var tr = empTab.insertRow(rowCnt); // table row.
        tr = empTab.insertRow(rowCnt);

        for (var c = 0; c < arrHead.length; c++) {
            var td = document.createElement('td');          // TABLE DEFINITION.
            td = tr.insertCell(c);

            if (c == 0) {   // if its the first column of the table.
                // add a button control.
                var button = document.createElement('input');

                // set the attributes.
                button.setAttribute('type', 'button');
                button.setAttribute('value', 'Remove');

                // add button's "onclick" event.
                button.setAttribute('onclick', 'removeRow(this)');

                td.appendChild(button);
            }
            else {
                // the 2nd column, will have textbox.
                var ele = document.createElement('input');
                ele.setAttribute('type', 'text');
                ele.setAttribute('value', '');

                td.appendChild(ele);
            }
        }
    }

    // function to delete a row.
    function removeRow(oButton) {
        var empTab = document.getElementById('empTable');
        empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); // buttton -> td -> tr
    }

    // function to extract and submit table data.
    function submit() {
        var myTab = document.getElementById('empTable');
        var arrValues = new Array();

        // loop through each row of the table.
        for (row = 1; row < myTab.rows.length - 1; row++) {
            // loop through each cell in a row.
            for (c = 0; c < myTab.rows[row].cells.length; c++) {
                var element = myTab.rows.item(row).cells[c];
                if (element.childNodes[0].getAttribute('type') == 'text') {
					arrValues.push(element.childNodes[0].value);
                }
            }
        }
        
        
		// pass the data to server through webSockets
        socket.emit('userStocksDataFromClient', arrValues)

        // data coming from server
        socket.on('userStocksDataFromServer', (data) => {
            console.log(' User stock data from Server', data)
            dynamicResultTable(data)
        })
    }



