$(document).ready(function(){
    getTable();
});

// Переход на страницу
$('html').on('click','#pagination a',function (e) {
    e.preventDefault();
    if(($(this).data('page') != $('#currentPag').data('page')))
    {
        getTable($(this).data('page'));
    }
});

// Кол-во на страницу

$('#perPage').change(function (e) {
    e.preventDefault();
    var currentPage = $('#pagination active').data('page');
    getTable(1);
});

 //Закрытие всплыв. изменения статуса
 $('#statuses-comparisons-table #change-status .btn-secondary').on('click',function(){
    $('body').css('overflow','visible');    
    $('#change-status').modal('hide');
});

//Возврат скролла после скрытия модалки модалки
$('.modal').on('hidden.bs.modal', function () {
    $('body').attr('style','overflow:visible');
});

function getTable(page)
{
    $.ajax({
        type:"GET",
        url:`${location.origin}/ajax/leads/statuses/comparisons/getTable`,
        data: {
            page: page,
            perPage: $('#perPage').val()
        },
        success:(result) => {
            initTable(result);
            paginationInit(result.pagination);
        }
    });
}
function initTable(result)
{    
    console.log(result);
    $('#statuses-comparisons-table tbody').empty();
    $('#kt_content .transition-loader').css('display','block');
    for (key in result)
    {
        let item = result[key];
        if(key != 'pagination')
        {
            let template = `
                        <tr data-lead-id="${item.id}">
                            <th>${item.id}</th>
                            <th data-id="status">
                                <span class='text-nowrap label label-inline'>${item.broker_status}</span>
                            </th>
                            <th data-id="our-status">
                                <span class='text-nowrap label ${item.our_status_class} label-inline'>${item.our_status_title}</span>
                            </th>
                        </tr>`;
            $('#statuses-comparisons-table table tbody').append(template);         
        }
    }
    statusChangeButton();
    $('#kt_content .transition-loader').css('display','none');
}

function statusChangeButton()
{
	// Изменение статуса подтвержденное

	$(`#statuses-comparisons-table th[data-id="our-status"]`).on('click',function(){
		let id = parseInt($(this).parent().data('lead-id'));
		$('body').attr('style','overflow:hidden!important');    
		$('#statuses-comparisons-table #change-status').attr('data-lead-id',id);
		$('#statuses-comparisons-table #change-status').modal('show'); 
	});
	$("#statuses-comparisons-table #change-status .btn-primary").on('click',function(){
		let id = parseInt($('#statuses-comparisons-table #change-status').attr('data-lead-id')),
			select = $('#statuses-comparisons-table #change-status select').serializeArray(),
			status_title = $(`#status-select option[data-id="${select[0].value}"]`).text(),
			status_class = $(`#status-select option[data-id="${select[0].value}"]`).data('class'),
			template = `<span class='text-nowrap label ${status_class} label-inline'>${status_title}</span>`;
		console.log(id,select[0].value,status_title,status_class);
		$(`#statuses-comparisons-table table tr[data-lead-id=${id}] th[data-id="our-status"]`).html(template);
	 	$('body').css('overflow','visible');    
        $('#change-status').modal('hide');
		$.ajax({
            type: 'POST',
            url: `${location.origin}/ajax/leads/statuses/comparisons/updateStatus`,
  			data:{
				id: id, 
  				status_id: select[0].value
  			},
            success: function (result) {
                console.log(result);
                getTable($('#currentPag').data('page'));
            },
        });
	});
}