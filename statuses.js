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

//Возврат скролла после скрытия модалки модалки
$('.modal').on('hidden.bs.modal', function () {
    $('body').attr('style','overflow:visible');
});

//Добавление статуса

$('#addNewStatus').on('click',function(){
    $('body').attr('style','overflow:hidden!important');    
    $('#edit-status').attr('data-type','add').modal('show');
    $('#edit-status #status input, #edit-status #description input').val('');
    $('#color .form-check-label').removeClass('active');
    $('#color .form-check-input:eq(0)').attr('checked',true);
    $('#color .form-check-label:eq(0)').addClass('active');
});

//Обработка формы на добавление
$('#edit-status').on('submit',function(e){
    e.preventDefault();
    
    let data = $('input, input:checked',this).serializeArray(),
        type = $(this).attr('data-type');

    if(type == 'add')
    {
        console.log(data);
        $.ajax({
            type:'POST',
            url:`${location.origin}/ajax/leads/statuses/addStatus`,
            data: data,
            success: function(result){
                console.log(result);
                getTable(1);
            }
        });
    }
    if(type == 'edit')
    {
        let id = $(this).attr('data-id');
        data.push({ name : 'id', value : id });
        console.log(data);
        $.ajax({
            type:'POST',
            url:`${location.origin}/ajax/leads/statuses/editStatus`,
            data: data,
            success: function(result){
                console.log(result);
                getTable($('#currentPag').data('page'));
            }
        });
    }    
    $('body').css('overflow','visible');    
    $('#edit-status').modal('hide');
});

//Изменение иконки при выборе radio 
$('#color .form-check-label').on('click',function(){
    //Очистка состояния
    $('#color .form-check-label').removeClass('active');

    $(this).prev().attr('checked',true);
    $(this).addClass('active');
});

function getTable(page)
{
    $.ajax({
        type:"GET",
        url:`${location.origin}/ajax/leads/statuses/getTable`,
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
    $('#statuses-table tbody').empty();
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
                            <span class='text-nowrap label ${item.our_status_class} label-inline'>${item.our_status_title}</span>
                            </th>
                            ${
                                item.description.length > 0 ? `
                                <th data-id="description">
                                    ${item.description}
                                </th>` : '<th></th>'
                            }
                            <th data-id="action" style="width:10px">
                                <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
                                    <i class="flaticon-edit"></i>
                                </a>
                            </th>
                        </tr>`;
            $('#statuses-table table tbody').append(template);         
        }
    }
    initEditButton();
    $('#kt_content .transition-loader').css('display','none');
}
function initEditButton()
{    
    //Изменение статуса

    $('th[data-id="action"] .edit').off().on('click',function(){
        let id = $(this).parent().parent().attr('data-lead-id');
        $.ajax({
            type:'GET',
            url:`${location.origin}/ajax/leads/statuses/getStatus`,
            data: { id : id },
            success: function(result){
                console.log(id,result);
                $('#edit-status #status input').val(result.title);
                $('#edit-status #description input').val(result.description);
                $('#color .form-check-label.active').removeClass('active');
                $(`#color .form-check[data-class="${result.class.replace(' ','')}"] .form-check-label`).addClass('active');
                $(`#color .form-check[data-class="${result.class.replace(' ','')}"] .form-check-input`).attr('checked',true);
            }
        });
        $('body').attr('style','overflow:hidden!important');    
        $('#edit-status').attr({'data-type':'edit','data-id':id}).modal('show');
    });
}