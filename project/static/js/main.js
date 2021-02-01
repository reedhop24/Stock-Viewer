$(document).ready(() => {
    $('#stock-tick-button').on('click', (ev) => {
        ev.preventDefault();
        $('#search-error').empty();

        const dateFrom = new Date($('#date-input-from').val());
        dayFrom = dateFrom.getUTCDate() > 9 ? dateFrom.getUTCDate() : '0' + dateFrom.getUTCDate();
        monthFrom = dateFrom.getUTCMonth()+1 > 9 ? dateFrom.getUTCMonth()+1: '0' + (dateFrom.getUTCMonth()+1);
        yearFrom = dateFrom.getUTCFullYear();

        const dateTo = new Date($('#date-input-to').val());
        dayTo = dateTo.getUTCDate() > 9 ? dateTo.getUTCDate() : '0' + dateTo.getUTCDate();
        monthTo = dateTo.getUTCMonth()+1 > 9 ? dateTo.getUTCMonth()+1: '0' + (dateTo.getUTCMonth()+1);
        yearTo = dateTo.getUTCFullYear();

        const stockTick = $('#stock-tick').val();
        const breakdown = $('#breakdown').val();

        if(dateFrom > dateTo) {
            $('#search-error').append('<h6>From Date must be less than To Date</h6>')
        } else if(isNaN(dayTo) || isNaN(monthTo) || isNaN(yearTo) || isNaN(dayFrom) || isNaN(monthFrom) || isNaN(yearFrom)) {
            $('#search-error').append('<h6>Invalid Date</h6>')
        } else {
            $.ajax({
                url:`http://127.0.0.1:5000/search?&stock-ticker=${stockTick}&date-from=${[yearFrom,monthFrom,dayFrom].join('-')}&date-to=${[yearTo,monthTo,dayTo].join('-')}&breakdown=${breakdown}`,
                type:'GET',
                contentType: 'application/json;charset=utf-8',
            }).then((res) => {
                if(res.status === 'error') {
                    $("#modal").modal('show');
                    $('.modal-body').empty();
                    $('.modal-body').append(`<p>${res.error_message}<p>`)
                } else {
                    window.localStorage.removeItem('graphData');
                    const title = `${res.stock_name}: ${[monthFrom,dayFrom,yearFrom].join('/')} - ${[monthTo,dayTo,yearTo].join('/')}`

                    $('#chart-container').empty();
                    $('#chart-container').append(`<div class="chart-inner"><h4 id="stock-name">${title}</h4>\n
                    <canvas id="myChart" height="100" width="400"></canvas><button id="add-view" class="btn">Add to Collection</button><div>`);
                    
                    let ctx = document.getElementById('myChart').getContext('2d');
                    let dateData = [{
                        label: 'Price Open',
                        data: [],
                        backgroundColor: []
                    }, {
                        label: 'Price Closed',
                        data: [],
                        backgroundColor: []
                    }, {
                        label: 'Price High',
                        data: [],
                        backgroundColor: []
                    }, {
                        label: 'Price Low',
                        data: [],
                        backgroundColor: []
                    }];

                    let color1 = randomColor();
                    let color2 = randomColor();
                    let color3 = randomColor();
                    let color4 = randomColor();
                    let label = [];

                    for(let i = 0; i < res.results.length; i++) {
                        dateData[0].data.push(res.results[i].o);
                        dateData[0].backgroundColor.push(color1);

                        dateData[1].data.push(res.results[i].c);
                        dateData[1].backgroundColor.push(color2);

                        dateData[2].data.push(res.results[i].h);
                        dateData[2].backgroundColor.push(color3);

                        dateData[3].data.push(res.results[i].l);
                        dateData[3].backgroundColor.push(color4);

                        let currDate = new Date(res.results[i].t)

                        if(breakdown === 'day') {
                            currDate.setDate(currDate.getDate()+1)
                            label.push([currDate.getDate(), months[currDate.getMonth()], currDate.getFullYear()].join(' '));
                        } else if(breakdown === 'month') {
                            currDate.setDate(currDate.getDate()+1)
                            label.push([months[currDate.getMonth()], currDate.getFullYear()].join(' '));
                        }
                    }

                    const barData = {
                        data_title: title,
                        data_label: label,
                        data_date: dateData
                    }

                    window.localStorage.setItem('graphData', JSON.stringify(barData))

                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                          labels: label,
                          datasets: dateData
                        },
                        options: {
                          scales: {
                            yAxes: [{
                              ticks: {
                                beginAtZero: true
                              }
                            }],
                            xAxes: [{
                              ticks: {
                                beginAtZero: true
                              }
                            }]
                          }
                        }
                    });
                }
            })
        }
    });

    $(document).on('click', (ev) => {
        if(ev.target.id === 'add-view') {
            const graphData = window.localStorage.getItem('graphData');
            $.ajax({
                url:'http://127.0.0.1:5000/save_collection',
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                data: graphData
            }).then((res) => {
                if(res.status == "success") {
                    $('#modal').modal('show');
                    $('.modal-body').empty();
                    $('.modal-body').append('<p>Succesfully added graph to your Collection</p>')
                }
            })
        }

        if(ev.target.id === 'log-out-btn') {
            location.href = '/login';
        }

        if(ev.target.className === 'delete-graph btn') {
            let parent = ev.target.parentElement;
            for(let i = 0; i < parent.children.length; i++) {
                if(parent.children[i].tagName === 'CANVAS') {
                    $.ajax({
                        url:'http://127.0.0.1:5000/delete_graph',
                        type:'POST',
                        contentType: 'application/json;charset=utf-8',
                        data: JSON.stringify({'user_id': parent.children[i].id})
                    }).then((res) => {
                        $("#modal").modal('show');
                        $('.modal-body').empty();
                        $('.modal-body').append('<p>Successfully Deleted Graph</p>')
                    });
                }
            }
        }
    });

    if($('#graph-data').data()) {
        const graphs = $('#graph-data').data().name;
        for(let i = 0; i < graphs.length; i++) {
            $('#collection-container').append(`<div class="chart-inner"><div class="deleted-graph" id="${graphs[i].id}-deleted"></div><h4 id="stock-name">${graphs[i].data_title}</h4>\n
                    <canvas id="${graphs[i].id}" height="100" width="400"></canvas><button class="delete-graph btn">Delete Graph</button><div>`);
            
            let ctx = document.getElementById(`${graphs[i].id}`).getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: graphs[i].data_label,
                  datasets: graphs[i].data_date
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }],
                    xAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
            });
        }
    }
});

// Month Helper
const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8:'Sep',
    9:'Oct',
    10: 'Nov',
    11: 'Dec'
}