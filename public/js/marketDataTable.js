setInterval(() => { 

    // Dynamically creating table for Market data
    $.get("/company", (data, status) => {
    var tbody = $('#marketDataTable tbody');

    tbody.html('');
    for (var h = 0; h < data.length; h++) {

        var tableRow = document.createElement('tr'),
            tdName = document.createElement('td'),
            tdLtp = document.createElement('td'),
            tdVolume = document.createElement('td'),
            tdValue = document.createElement('td');

        tdName.innerHTML = data[h].name;
        tdLtp.innerHTML = data[h].ltp ? (data[h].ltp).toFixed(2) : '';
        tdLtp.classList.add('color-animation');
        tdVolume.innerHTML = data[h].volume;
        tdValue.innerHTML = data[h].value;
        tableRow.appendChild(tdName);
        tableRow.appendChild(tdLtp);
        tableRow.appendChild(tdVolume);
        tableRow.appendChild(tdValue);
        tbody.append(tableRow); 
    }
});

    // Dynamically creating table for User stocks data
    $.get("/company/user", (data, status) => {
        var tbody = $('#myStocksDataTable tbody');

        tbody.html('');
        for (var h = 0; h < data.length; h++) {

            var tableRow = document.createElement('tr'),
                tdName = document.createElement('td'),
                tdLtp = document.createElement('td'),
                tdVolume = document.createElement('td'),
                tdValue = document.createElement('td');

            tdName.innerHTML = data[h].name;
            tdLtp.innerHTML = data[h].ltp ? (data[h].ltp).toFixed(2) : '';
            tdLtp.classList.add('color-animation');
            tdVolume.innerHTML = data[h].volume;
            tdValue.innerHTML = data[h].value;
            tableRow.appendChild(tdName);
            tableRow.appendChild(tdLtp);
            tableRow.appendChild(tdVolume);
            tableRow.appendChild(tdValue);
            tbody.append(tableRow); 
        }
    });


}, 3000);