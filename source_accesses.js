$(document).ready(function(){
	//Инит кнопок элементов таблицы
	
	sourcesInit();		
	$('.card-body .transition-loader').css('display','none');
	//Открытие меню add New Source
	$('#addNewSource').on('click',function(){
		$('#modalSource .transition-loader').css('display','block');
		let title = `Add New Source`;
		$('#modalLabel').text(title);
		$('#source-name input, #token input').val('')
		$('#ip-list .input-wrapper').html(`
			<div class="input-group fade show">
                <input type="text" data-skip-name="true" name="ip[]" class="form-control"
                       placeholder="Enter IP"/>
                <div class="d-md-none mb-2"></div>
                <a href="javascript:;" id="deleteIp"
                   class="btn font-weight-bolder btn-light-danger disabled">
                    <i class="la la-trash-o"></i>Delete
                </a>
            </div>
		`);
		tokenGen();
		ipItemsInit();		
		$('#modalSource').attr('data-status','new').modal('show');
	});

	//Добавление поля IP
	$('#ip-list #addIp').on('click',function(){
		let template = `<div class="input-group fade">
	                        <input type="text" data-skip-name="true" name="ip[]" class="form-control"
	                               placeholder="Enter IP"/>
	                        <div class="d-md-none mb-2"></div>
	                        <a href="javascript:;" id="deleteIp"
	                           class="btn font-weight-bolder btn-light-danger">
	                            <i class="la la-trash-o"></i>Delete
	                        </a>
	                    </div>`;
	    $('#ip-list .input-wrapper').append(template);
    	ipItemsInit();	 
	    setTimeout(function(){
	    	$('#ip-list .input-wrapper .input-group.fade').addClass('show');
	    },50);
	});

	//Генерация TOKEN
	$('#token button').on('click',function(){
		tokenGen();
	});

	//Обработка формы
	//
	$('#modalSource form').on('submit',function(e){
		e.preventDefault();
		let formData = {
				title: $('#source-name input').val(),
				token: $('#token input').val(),
				ip: []
			},
			status = $(this).parent().parent().parent().attr('data-status');
		console.log(status);
		if(status == 'edit')
		{
			formData.id = parseInt($('#modalSource').attr('data-id'));
			console.log(formData);
		}
		if(formData.title.length > 0)
		{
			let ipList = $('#ip-list input');
			if(ipList.length > 0 && ipList[0].value.length > 0)
			{	
				processArray(ipList,formData,status);								
			}
		}
		
		
	});
});

function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}
/*
*@param input == iterator from FOR (func processArray), data == formData (event //Обработка формы => func processArray)
*/
async function delayedLog(input,data) {
  await delay();
  data.ip.push(input.value);
}
/*
*@param array == ip adress JQuery input list (event //Обработка формы), data == formData (event //Обработка формы)
*/
async function processArray(array, data,status) {
  for (const input of array) {
    await delayedLog(input,data);
  }
  postAddForm(data,status);
  console.log(data,'Done!');
}
/*
*@param formData (event //Обработка формы)
*/
function postAddForm(formData,status)
{	
	let url = '';
	if(status == 'new')
	{
		url = 'addNewAccess';
	}
	if(status == 'edit')
	{
		url = 'editAccess';
	}
	console.log(url);
	$.ajax({
		type:'POST',
		url:`${location.origin}/ajax/api-settings/${url}/`,
		data: formData,
		success: (result) => {
			$('#modalSource').modal('hide');	
			$('body').attr('style','overflow:visible');
			notif(result.title, result.text, result.status);
            location.reload();
        },
		error: (result) => {
			notif(result.title, result.text, result.status);
		}
	});
}
function tokenGen()
{
	$.ajax({
		type:'POST',
		url:`${location.origin}/ajax/api-settings/generateToken`,
		success: function (result) {			
            $('#token input').val(result);
			$('#modalSource .transition-loader').css('display','none');
        },
		error: (result) => {
			notif(result.title, result.text, result.status);
		}
	});
}
function ipItemsInit()
{
	//remove ip
	
	$('#ip-list #deleteIp').on('click',function(){
		$(this).parent().removeClass('show');
		setTimeout(()=>{
	    	$(this).parent().remove();
	    },100);
	});

	//ip mask for input
	
	$('#ip-list input').mask('099.099.099.099');
}
function sourcesInit()
{
	//Удаление элемента таблица
	
	$('html').on('click','#removeSource',function(){
		let id = parseInt($(this).parent().parent().find('#id').text()),
			title = $(this).parent().parent().find('#title').text();
		$('#modalRemoveSource .modal-body p span').text(title);
		$('body').attr('style','overflow:hidden!important');
		$('#modalRemoveSource').attr('data-id',id).modal('show');		
	});

	//Возврат скролла после скрытия модалки модалки
	$('.modal').on('hidden.bs.modal', function () {
		$('body').attr('style','overflow:visible');
	});

	//подтверждение удаления
	
	$('#modalRemoveSource .btn-primary').on('click',function(){
		let id = parseInt($('#modalRemoveSource').attr('data-id'));
		removeElement(id);
	});

	$('.modal .btn-secondary').on('click',function(){		
		$('body').attr('style','overflow:visible');
	});

	//Изменение элемента таблицы - Открытие меню edit Source
	
	$('html').on('click','#editSource',function(){
		let id = parseInt($(this).parent().parent().find('#id').text()),
			title = `Edit Source`;
		$('#modalLabel').text(title);			
		$('#modalSource .transition-loader').css('display','block');
		$.ajax({
			type:'GET',
			url:`${location.origin}/ajax/api-settings/getAccess`,
			data:{id: id},
			success: (result) => {
				console.log(result);
				$('#modalSource').attr('data-id',result.id);
                $('#source-name input').val(result.title);
				$('#token input').val(result.token);
				$('#ip-list .input-wrapper').empty();
				$(result.ip).each(function(index,item){
					let template = `<div class="input-group fade show">
	                        <input type="text" data-skip-name="true" name="ip[]" class="form-control"
	                               placeholder="Enter IP" value="${item}"/>
	                        <div class="d-md-none mb-2"></div>
	                        <a href="javascript:;" id="deleteIp"
	                           class="btn font-weight-bolder btn-light-danger ${index == 0 ? 'disabled' : ''}">
	                            <i class="la la-trash-o"></i>Delete
	                        </a>
	                    </div>`;
	    			$('#ip-list .input-wrapper').append(template);
				});
				$('#modalSource .transition-loader').css('display','none');
            },
			error: (result) => {
				notif(result.title, result.text, result.status);
			}
		});				
		ipItemsInit();
		$('#modalSource').attr('data-status','edit').modal('show');	
		$('body').attr('style','overflow:hidden!important');
	});
}
function removeElement(id)
{
	$.ajax({
		type:'POST',
		url:`${location.origin}/ajax/api-settings/delAccess/`,
		data:{id: id},
		success: (result) => {
			notif(result.title, result.text, result.status);
			$('#modalRemoveSource').modal('hide');
			$('body').attr('style','overflow:visible');
			location.reload();
		},
		error: (result) => {
			notif(result.title, result.text, result.status);
			$('#modalRemoveSource').modal('hide');	
			$('body').attr('style','overflow:visible');		
		}
	});
}
function notif(title = '', msg = '', type = '') {
    toastr.options = {
        "positionClass": "toast-top-center",
        "closeButton": false,
        "progressBar": false,
        "preventDuplicates": false,
    };
    toastr[type](msg, title);
}