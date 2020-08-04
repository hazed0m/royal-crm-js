$(document).ready(function() {
    initTable(1,0,200,'id','ASC')
    // Переход на страницу
    $('html').on('click','#pagination a',function (e) {
        e.preventDefault();
        if(($(this).data('page') != $('#currentPag').data('page')))
        {
        	initTable($(this).data('page'),0,0,'id','ASC');
        }
    });

    // Кол-во на страницу

    $('#perPage').change(function (e) {
        e.preventDefault();
        var currentPage = $('#pagination active').data('page');
        initTable(1,0,0,'id','ASC');
    });

    //Сортировка

    $('#coldleads-table thead th').on('click',function(){
        let sortBy = $(this).data('val'),
            templateUp = `<i class="icon-1x text-dark-50 flaticon2-up"></i>`,
            templateDown = `<i class="icon-1x text-dark-50 flaticon2-down"></i>`,
            sortDir = ``;
        if($(this).find('span.icon').is(':empty') || $(this).find('span.icon').attr('data-sort-id') == 'up')
        {
            $('#coldleads-table thead th span.icon').empty();
            $(this).find('span.icon').html(`<i class="icon-1x text-dark-50 flaticon2-down"></i>`);
            $(this).find('span.icon').attr('data-sort-id','down');
            sortDir = 'ASC';
            initTable(1, 0, 0, sortBy,sortDir);
        }
        else if($(this).find('span.icon').attr('data-sort-id') == 'down')
        {
            $('#coldleads-table thead th span.ico').empty();
            $(this).find('span.icon').html(`<i class="icon-1x text-dark-50 flaticon2-up"></i>`);
            $(this).find('span.icon').attr('data-sort-id','up');
            sortDir = 'DESC';
            initTable(1, 0, 0, sortBy,sortDir);
        }
    });

    //Загрузка файла

    $('#file-dwnld').on('click',function(){
        $('#coldleads-table #file-upload').modal('show');
        $('body').attr('style','overflow:hidden!important');
    });
    // Фильтрация

    $('#coldleads-filter').submit(function (e) {
        e.preventDefault();
        console.log('filter');
        initTable(1,0,0,'id','ASC');
    });

    //Сброс меню
    $('html').on('click',function(){
        $("#context-menu").css('display','none');
    });
    //Контекстное меню
    $('html').on('contextmenu','#coldleads-table tbody tr',function (e) {
        let left = e.pageX - $(this).offset().left,
            template = ` <div class="dropdown-menu dropdown-menu-sm p-0 m-0 dropdown-menu-right" id="context-menu">
                       <ul class="navi py-5">
                           <li class="navi-item">
                               <a href="/leads/detail/${$(this).data('lead-id')}" target="_blank" class="navi-link view-link">
                                   <span class="navi-icon"><i class="flaticon2-medical-records"></i></span>
                                   <span class="navi-text">More Info</span>
                               </a>
                           </li>
                           <li class="navi-item">
                               <a href="/leads/edit/${$(this).data('lead-id')}" target="_blank" class="navi-link edit-link">
                                   <span class="navi-icon"><i class="flaticon2-writing"></i></span>
                                   <span class="navi-text">Edit</span>
                               </a>
                           </li>
                           <li class="navi-item">
                               <a href class="navi-link remove-link">
                                   <span class="navi-icon"><i class="flaticon2-delete"></i></span>
                                   <span class="navi-text">Remove</span>
                               </a>
                           </li>
                       </ul>
                   </div>`;
        $('#coldleads-table #context-menu').remove();
        $(this).find('#id').append(template);
        if(left+175 >= parseInt($(this).css('width')))
        {
            left = parseInt($(this).css('width'))-175;
        }
        $('#coldleads-table #context-menu').css({'display':'flex','left':left});
        $('.navi-link.remove-link').data('name',$(this).data('name')).data('lastname',$(this).data('lastname'));
        $('.table-responsive').scrollTop($('.table-responsive').height());
        dropdownRemoveInit();
        return false; //blocks default Webbrowser right click menu
    });

    //Закрытие всплыв. окна удаления
    $('#coldleads-table #remove-element .btn-secondary').on('click',function(){
        $('body').css('overflow','visible');    
        $('#remove-element').modal('hide');
    });
    //Закрытие всплыв. изменения статуса
    $('#coldleads-table #change-status .btn-secondary').on('click',function(){
        $('body').css('overflow','visible');    
        $('#change-status').modal('hide');
    });

    //Кнопки во всплывающих окнах загрузки таблиц

    $('#coldleads-table .modal#file-upload .btn-secondary').on('click',function(){
        fileUploadHide();
    });

    //Возврат скролла после скрытия модалки модалки
	$('.modal').on('hidden.bs.modal', function () {
		$('body').attr('style','overflow:visible');
    });
    
    //Обработка формы загрузки

    $('#file-form').on('submit',function(e){
        e.preventDefault();
        let data = new FormData(this);
        $('#file-form .btn-primary').addClass('spinner spinner-white spinner-right');
        console.log(data);
        $.ajax({
            type:'POST',
            url:`${location.origin}/ajax/leads/cold/upload/`,
            contentType: false,
            processData: false,
            data: data,
            success: function(result)
            {
                $('#file-form .custom-file').addClass('success');
                $('#file-form .custom-file input').val();
                $('#file-form .custom-file label').text($('#file-form .custom-file label').attr('data-text'));
                $('#file-form .custom-file .info-wrap').html(`<i class="far fa-check-circle" style="color:green;font-size:1.5rem;margin-right:10px;"></i><span>${$('#file-form .custom-file .info-wrap').attr('data-success')}</span>`);
                $('#file-form .btn-primary').removeClass('spinner spinner-white spinner-right');
                setTimeout(function(){
                    $("#file-upload").modal('hide');
                    $('#file-form .custom-file').removeClass('success');
                },2500);
            },
            error: function(result)
            {
                $('#file-form .custom-file').addClass('error');
                $('#file-form .custom-file input').val();     
                $('#file-form .custom-file label').text($('#file-form .custom-file label').attr('data-text'));           
                $('#file-form .custom-file .info-wrap').html(`<i class="far fa-times-circle" style="color:red;font-size:1.5rem;margin-right:10px;"></i><span>${$('#file-form .custom-file .info-wrap').attr('data-error')}</span>`);
                $('#file-form .btn-primary').removeClass('spinner spinner-white spinner-right');
              setTimeout(function(){
                  $("#file-upload").modal('hide');
                  $('#file-form .custom-file').removeClass('error');                  
              },2500);
            }
        });
    });
});
function fileUploadHide()
{
    $('body').css('overflow','visible'); 
    $('#file-upload').modal('hide');
}
function dropdownRemoveInit()
{    
    //Удаление
    
    $('.navi-link.remove-link').on('click',function(e){
        e.preventDefault();
        $('#coldleads-table #remove-element .modal-body p span').text($(this).data('name') + ' ' + $(this).data('lastname'));
        $('#coldleads-table #remove-element').modal("show");
        $('body').attr('style','overflow:hidden!important'); 
    });
}
function statusChangeButton()
{
    // Изменение статуса подтвержденное

    $("#coldleads-table #status").on('click',function(){
        let id = parseInt($(this).parent().data('lead-id'));
        $('body').attr('style','overflow:hidden!important');    
        $('#coldleads-table #change-status').attr('data-lead-id',id);
        $('#coldleads-table #change-status').modal('show'); 
    });
    $("#coldleads-table #change-status .btn-primary").on('click',function(){
        let id = parseInt($('#coldleads-table #change-status').attr('data-lead-id')),
            select = $('#coldleads-table #change-status select').serializeArray(),
            status_title = $(`#status-select option[data-id="${select[0].value}"]`).text(),
            status_class = $(`#status-select option[data-id="${select[0].value}"]`).data('class'),
            template = `<span class='text-nowrap label ${status_class} label-inline'>${status_title}</span>`;
        $(`#coldleads-table tr[data-lead-id=${id}] #status`).html(template);
        $('body').css('overflow','visible');    
        $('#change-status').modal('hide');
        console.log(id,select,status_title,status_class);
        $.ajax({
            type: 'POST',
            url: `${location.origin}/ajax/leads/cold/status/`,
            data:{
                id: id, 
                status_id: select[0].value
            },
            success: function (result) {
                console.log(result);
            },
        });
    });
}
function initTable(page, download = false, firstInit = 0, sortBy = '', sortDir = '') {
    console.log(page,download, firstInit, sortBy, sortDir);
    if(!download) {

        $('.table-responsive').animate({opacity:0.4});

    }
    if(!download) {

        $('.table-responsive').animate({opacity:1});
        loaderInit('coldleads-table');
    }
    setTimeout(function(){
        let form = $('#coldleads-filter input, #coldleads-filter select').serializeArray();
        $.post(`${location.origin}/ajax/leads/cold/`, {
            page: page,
            perPage: $('#perPage').val(),
            filter: form,
            download: download,
            sortBy: sortBy,
            sortDir: sortDir
        }, function(response) {
            if(!download) {
                insertToTable(response);
            }
        });
    },firstInit);
}



function insertToTable(data) {
    console.log(data);
    $('#coldleads-table tbody').empty();
    for (key in data)
    {
        let item = data[key];
        if(key != 'pagination' && key != 'xlsFile')
        {
            let template = `
            <tr ${item.resended === 1 ? 'style="background-color: #e2e14f2e;"': ''} data-lead-id="${item.id}" data-name="${item.first_name}" data-lastname="${item.last_name}">
                <th id="id">${item.id} </th>
                <th>${item.copy === 1 ? '<i style="color: #ff000073" class="fas fa-copy"></i>':''}</th>
                <th>${item.first_name}</th>
                <th>${item.last_name}</th>
                <th>
                    ${item.phone}
                </th>
                <th>${item.email}</th>
                <th>${item.source}</th>
                <th>${item.broker}</th>
                <th>
                    ${item.country_iso} <img src='https://www.countryflags.io/${item.country_iso}/flat/24.png'/>
                </th>
                <th>${item.first_broker_status != '' ? item.first_broker_status : ''}</th>
                <th id="status">
                    <span class='text-nowrap label ${item.status_class} label-inline'>${item.status_title}</span>
                </th>
                <th>${item.broker_status != '' ? item.broker_status : ''}</th>
                <th>${item.reg_time}</th>
                <th>${item.send_time}</th>
                <th><a target="_blank" href="${item.funnel_url}">${item.funnel_url.replace(/^.*:\/\//i, '')}</a></th>
            </tr>`;
            $('#coldleads-table tbody').append(template);
        }            
    }
    paginationInit(data.pagination);
    statusChangeButton();
    if(data.file) {
        window.open(data.file , '_blank');
    }
    $('#kt_content .transition-loader').css('display','none');
}

function loaderInit(key)
{    
    if(key == 'coldleads-table')
    {   
        $(`#coldleads-table .transition-loader`)
        .css('display','inline-block');
    }
    if(key == 'coldleads-filter')
    {   
        $(`#leads-filter .transition-loader`)
        .css('display','inline-block');
    }
}