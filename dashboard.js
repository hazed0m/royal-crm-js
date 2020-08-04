let fromDate = $('#from_date'),
    toDate = $('#to_date');
jQuery(document).ready(function() {
    $('#custom-range-picker').daterangepicker({
        buttonClasses: 'btn',
        applyClass: 'btn-primary',
        cancelClass: 'btn-secondary',
        opens: "left",
        locale: {
            format: 'YYYY-MM-DD HH:mm:ss'
        }
    }, function(start, end, label) {
        fromDate.val(start.startOf('day').format('YYYY-MM-DD HH:mm:ss'));
        toDate.val(end.endOf('day').format('YYYY-MM-DD HH:mm:ss'));
    });
    $('#custom-range-picker').click(function () {
        $('#kt_daterangepicker_2').toggle();
    });

    $('#dashboard-dateselect a').click(function (e) {
        let daterng = $('#kt_daterangepicker_2');

        switch ($(this).data('day')) {
            case 'custom':
                daterng.show();
                break;
            case 'today':
                fromDate.val(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'));
                toDate.val(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
                sendDashboardFilter();
                break;
            case 'yesterday':
                fromDate.val(moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
                toDate.val(moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'));
                sendDashboardFilter();
                break;
            case 'week':
                fromDate.val(moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'));
                toDate.val(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
                sendDashboardFilter();
                break;
            case 'this':
                fromDate.val(moment(1, "DD").startOf('day').format('YYYY-MM-DD HH:mm:ss'));
                toDate.val(moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'));
                sendDashboardFilter();
                break;
            case 'last':
                fromDate.val(moment().subtract(1, 'months').startOf('day').startOf('month').format('YYYY-MM-DD HH:mm:ss'));
                toDate.val(moment().subtract(1, 'months').endOf('day').endOf('month').format('YYYY-MM-DD HH:mm:ss'));
                sendDashboardFilter();
                break;
        }

    });
    // 2020-04-10 17:50:11

    $('#custom-range-picker').on('apply.daterangepicker', function(ev, picker) {
        console.log(ev,picker);
        fromDate.val(picker.startDate.format('YYYY-MM-DD HH:mm:ss'));
        toDate.val(picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
        sendDashboardFilter();
    });

    getDashboardData('simple-stats');
    getDashboardData('country-stats');

    $('#filter-btn').click(function (e) {
        e.preventDefault();
        getDashboardData('country-stats');
    });
});


function getDashboardData(key) {    
    loaderInit(key);
    console.log(fromDate.val());
    console.log(toDate.val());
    $.post(`${location.origin}/ajax/dashboard/${key}`, {
        start: fromDate.val(),
        end: toDate.val(),
        broker_filter: $('#broker-filter').val(),
        source_filter: $('#source-filter').val(),
    }, function(response) {
        if(key == 'country-stats')
        {
            countryTableInit(response);
        }
        if(key == 'simple-stats')
        {
            simpleStatisticsInit(response.simpleStatistics);
            statusTableInit(response.statusTable);        
            brokersSourcesTableInit(response.brokersTable,'#by_broker_table');
            brokersSourcesTableInit(response.sourcesTable,'#by_source_table');
        }       
    });
}

function sendDashboardFilter() {
    getDashboardData('simple-stats');
    getDashboardData('country-stats');
};
/**
     * @param var object [ajax data] from function getDashboardData
 */
function simpleStatisticsInit(data)
{
    $('#simple-statistics #leads .total').text(data.total);
    $('#simple-statistics #ftd .total').text(data.ftd.count);
    $('#simple-statistics #ftd .percent').text(data.ftd.percent.toFixed(2));
    $('#simple-statistics #callbacks .total').text(data.cb.count);
    $('#simple-statistics #callbacks .percent').text(data.cb.percent.toFixed(2));
    $('#simple-statistics .transition-loader').css('display','none');
    $('#simple-statistics .data-block').fadeIn();
}
function countryTableInit(data)
{
    $('#country-table').empty();
    let length = Object.keys(data).length;
    if(length > 0)
    {
        for (key in data)
        {
            let item = data[key];
            if (item.count > 0)
            {
                let template = `
                    <tr>
                        <td><img src="https://www.countryflags.io/${item.iso_code}/flat/24.png"> ${key}</td>
                        <td>${item.count}</td>
                        <td>${item.ftd}</td>
                        <td>${item.cr.toFixed(2)}%</td>
                        <td>${item.na}</td>
                        <td>${item.na_rate.toFixed(2)}%</td>
                        <td>${item.cb}</td>
                        <td>${item.cb_rate.toFixed(2)}%</td>
                    </tr>
                `;
                $('#country-table').append(template);
            }
            else
            {
                let template = `
                    <tr>
                        <td colspan="8" class="text-center">No data</td>
                    </tr>`;
                $('#country-table').append(template);
            }
        }    
    }    
    else
    {
        let template = `
            <tr>
                <td colspan="8" class="text-center">No data</td>
            </tr>`;
        $('#country-table').append(template);
    }
    $('#countryTable .transition-loader').css('display','none');
}
function statusTableInit(data)
{
    $('#by_status_table').empty();
    let length = Object.keys(data).length;
    if(length > 0)
    {
        for (key in data)
        {
            let item = data[key],
                template = `
                    <tr>
                        <td>
                            <span class="label label-inline ${item.class} font-weight-bold">
                                ${key}
                            </span>
                       </td>
                        <td>${item.count}</td>
                    </tr>`;
            $('#by_status_table').append(template);
        }
    }
    else
    {
        let template = `
            <tr>
              <td colspan="2" class="text-center">No data</td>
            </tr>`;
        $('#by_status_table').append(template);
    }
}
function brokersSourcesTableInit(data,trigger)
{
    $(trigger).empty();
    let length = Object.keys(data).length;
    if(length > 0)
    {
        for (key in data)
        {
            let item = data[key],
                template = `
                <tr>
                    <td>
                        ${key}
                    </td>
                    <td>${item}</td>
                </tr>`;
            $(trigger).append(template);
        }
    }
    else
    {
        let template = `
             <tr>
                <td colspan="2" class="text-center">No data</td>
            </tr>`;
        $(trigger).append(template);
    }
    $('#inform-table .transition-loader').css('display','none');
}
function loaderInit(key)
{    
    if(key == 'country-stats')
    {   
        $(`#countryTable .transition-loader`)
        .css('display','inline-block');
    }
    if(key == 'simple-stats')
    {
        $('#simple-statistics .data-block').css('display','none');
        $(`#simple-statistics .transition-loader,
           #inform-table .transition-loader
        `)
        .css('display','inline-block');
    }
}