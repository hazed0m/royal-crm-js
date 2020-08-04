$(document).ready(function(){
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})
	getDataList('country');
	getDataList('source');
	getDataList('funnel');
	
	//init select 
	
	$('.modal select').select2();

	//add Country button
	$('.add-settings').on('click',function(){
		let id = this.id,
			wrapper = $(this).attr('data-wrapper');
		getNewModal(wrapper);
	});

	//Подтверждение формы удаления
	$(`#remove-element .btn-primary`).on('click',function(){
		let data = $('#remove-element').attr('data-request'),
			wrapper = $('#remove-element').attr('data-wrapper');
		$.ajax({
		    url: `${location.origin}/ajax/${wrapper}-rules/delete/`,
		    type: 'POST',
		    data: JSON.parse(data),
		    success: function(result) {
		        console.log(result);
				$('#remove-element').modal('hide');
				getDataList(wrapper,result);
		    }
		});
	});

	//Подтверждение формы modal add - edit

	$(`.modal`).on('submit',function(e){
		e.preventDefault();
		let wrapper = this.id.replace('modal-',''),
			data = $(this).find('select, input').removeAttr('disabled').serializeArray(),
			action = $(this).attr('data-action');
		console.log(data);
		$.ajax({
			type: 'POST',
			url: `${location.origin}/ajax/${wrapper}-rules/${action}/`,
			data: data,
			success: (result) => {
				console.log(result,wrapper);
				$(`#modal-${wrapper}`).modal('hide');
				getDataList(wrapper,result);
			}
		});
	});

	//Возврат скролла после скрытия модалки модалки
	$('.modal').on('hidden.bs.modal', function () {
		$('body').attr('style','overflow:visible');
	});
});
/*
*@param
*/
function getDataList(wrapper,container = '')
{
	if(container == null)
	{
		container = '';
	}
	//Показ прелоадера
	$(`#${wrapper}Table .transition-loader`).css('display','block');

	//Запрос на получение списка таблицы wrapper
	$.ajax({
		type:'GET',
		url:`${location.origin}/ajax/${wrapper}-rules/list`,
		success: (result) => {
			console.log(wrapper,result);
			pushTablesTemplate(wrapper, result, container);
		}
	})
}
/*
*@param
*/
function pushTablesTemplate(wrapper, result, container)
{
	if(container != '')
	{
		$(`#${wrapper}-table .dropDownWrapper[data-name="${container}"]`).empty();
		if(wrapper == 'country')
		{	     
			$(result[container]).each(function(index,item){
				let brokersList = ``;
				$(item.broker).each(function(brokerIndex,brokerItem){
					brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
				});
				let	template = `
						<tr>
					        ${index == 0 ? `<td rowspan="${result[container].length}"></td>` : `` }
					        <td>
					           ${brokersList}
					        </td>
					        <td>${item.leads_limit}</td>
					        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-type="country" data-country-id="${item.country.id}">
					            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
	                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
	                            </a>
	                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-edit"></i>
	                            </a>                                
	                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-delete"></i>
	                            </a>
					        </td>
					    </tr>`;
				$(`#country-table .dropDownWrapper[data-name="${container}"]`).append(template);		
			});
		}
		if(wrapper == 'source')
		{					
			$(`#${wrapper}-table .dropDownWrapper[data-name="${result[container][0].source.title}"]`).empty(); 
			let sortedArr = result[container].sort((a, b) => a.country_id > b.country_id ? 1 : -1);       
			$(sortedArr).each(function(index,item){
				let brokersList = ``;
				$(item.broker).each(function(brokerIndex,brokerItem){
					brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
				});
				let length = $(`#source-table .dropDownWrapper[data-name="${item.source.title}"] tr[name="${item.country.iso_name}"]`).length,
					template = `
						<tr name="${item.country.iso_name}">
					        ${index == 0 ? `<td rowspan="${result[container].length}"></td>` : `` }
					        <td>
					            ${length == 0 ? `<img src="https://www.countryflags.io/${item.country.iso_code}/flat/24.png"> ${item.country.iso_name}` : ''}
					        </td>
					        <td>
					           ${brokersList}
					        </td>
					        <td>${item.leads_limit}</td>
					        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-country-id="${item.country.id}" data-type="source" data-source-id="${item.source.id}" >
					        	${length == 0 ? `<a href="javascript:;" class="add btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon2-add-1"></i>
	                            </a>` : ``}
					            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
	                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
	                            </a>
	                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-edit"></i>
	                            </a>                                
	                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-delete"></i>
	                            </a>
					        </td>
					    </tr>`;
				$(`#source-table .dropDownWrapper[data-name="${item.source.title}"]`).append(template);		
			});
		}
		if(wrapper == 'funnel')
		{	 
			$(result[container]).each(function(index,item){
				let brokersList = ``;
				$(item.broker).each(function(brokerIndex,brokerItem){
					brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
				});
				let	template = `
						<tr>
					        ${index == 0 ? `<td rowspan="${result[container].length}"></td>` : `` }
					        <td>
					           ${brokersList}
					        </td>
					        <td>${item.leads_limit}</td>
					        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-type="funnel" data-funnel-id="${item.funnel_id}" >
					            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
	                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
	                            </a>
	                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-edit"></i>
	                            </a>                                
	                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
	                                <i class="flaticon-delete"></i>
	                            </a>
					        </td>
					    </tr>`;
				$(`#funnel-table .dropDownWrapper[data-name="${container}"]`).append(template);		
			});
		}
	}
	else
	{
		$(`#${wrapper}-table`).empty();
		if(wrapper == 'country')
		{		
			$('#country-table').append(`
				<thead>
	                <tr>
	                    <th scope="col">Country</th>
	                    <th scope="col">Brokers</th>
	                    <th scope="col">Limit</th>
	                    <th scope="col" style="width: 120px;text-align:center;">Action</th>
	                </tr>
	            </thead>`);
			for (key in result)
			{		
				let dropElem = `
							<tbody>
								<tr>
									<td colspan="3" class="dropDownButton" data-name="${key}">
							            <img src="https://www.countryflags.io/${result[key][0].country.iso_code}/flat/24.png"> ${result[key][0].country.iso_name}
							        </td>
							        <td style="width: 120px;text-align:right;" data-country-id="${result[key][0].country.id}" data-type="country">
			                            <a href="javascript:;" class="add btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon2-add-1"></i>
			                            </a>
			                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon-delete"></i>
			                            </a>
							        </td>
						        </tr>
					        </tbody>
					        <tbody class="dropDownWrapper" data-name="${key}" style="display:none"></tbody>`;
				$('#country-table').append(dropElem);	        
				$(result[key]).each(function(index,item){
					let brokersList = ``;
					$(item.broker).each(function(brokerIndex,brokerItem){
						brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
					});
					let	template = `
							<tr>
						       ${index == 0 ? `<td rowspan="${result[key].length}"></td>` : `` }
						        <td>
						           ${brokersList}
						        </td>
						        <td>${item.leads_limit}</td>
						        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-type="country" data-country-id="${item.country.id}">
						            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
		                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
		                            </a>
		                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-edit"></i>
		                            </a>                                
		                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-delete"></i>
		                            </a>
						        </td>
						    </tr>`;
					$(`#country-table .dropDownWrapper[data-name="${key}"]`).append(template);		
				});
			}
		}
		if(wrapper == 'source')
		{		
			$('#source-table').append(`
				<thead>
	                <tr>
	                    <th scope="col">Source</th>
	                    <th scope="col">Country</th>
	                    <th scope="col">Brokers</th>
	                    <th scope="col">Limit</th>
	                    <th scope="col">Action</th>
	                </tr>
	            </thead>`);
			for (key in result)
			{		
				let dropElem = `
							<tbody>
								<tr>
									<td colspan="4" class="dropDownButton" data-name="${result[key][0].source.title}">
							            ${result[key][0].source.title}
							        </td>
							        <td style="width: 120px;text-align:right;" data-source-id="${result[key][0].source.id}" data-type="source">
			                            <a href="javascript:;" class="add btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon2-add-1"></i>
			                            </a>
			                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon-delete"></i>
			                            </a>
							        </td>
						        </tr>
					        </tbody>
					        <tbody class="dropDownWrapper" data-name="${result[key][0].source.title}" style="display:none"></tbody>`;
				$('#source-table').append(dropElem);	    
				let sortedArr = result[key].sort((a, b) => a.country_id > b.country_id ? 1 : -1);
				$(sortedArr).each(function(index,item){
					let brokersList = ``;
					$(item.broker).each(function(brokerIndex,brokerItem){
						brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
					});
					let length = $(`#source-table .dropDownWrapper[data-name="${item.source.title}"] tr[name="${item.country.iso_name}"]`).length,
						template = `
							<tr name="${item.country.iso_name}">
						        ${index == 0 ? `<td rowspan="${result[key].length}"></td>` : `` }					        
					            ${length == 0 ? `<td rowspan="1" class="country-group"><img src="https://www.countryflags.io/${item.country.iso_code}/flat/24.png"> ${item.country.iso_name}</td>` : ''}						        
						        <td>
						           ${brokersList}
						        </td>
						        <td>${item.leads_limit}</td>
						        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-country-id="${item.country.id}" data-type="source" data-source-id="${item.source.id}" >
							        ${length == 0 ? `<a href="javascript:;" class="add btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon2-add-1"></i>
		                            </a>` : ``}
						            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
		                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
		                            </a>
		                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-edit"></i>
		                            </a>                                
		                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-delete"></i>
		                            </a>
						        </td>
						    </tr>`;
					$(`#source-table .dropDownWrapper[data-name="${item.source.title}"]`).append(template);	
					length = $(`#source-table .dropDownWrapper[data-name="${item.source.title}"] tr[name="${item.country.iso_name}"]`).length;
					console.log(item.country.iso_name, length);
					$(`#source-table .dropDownWrapper[data-name="${item.source.title}"] tr[name="${item.country.iso_name}"] .country-group`).attr('rowspan',length);	
				});
			}
		}
		if(wrapper == 'funnel')
		{		
			$('#funnel-table').append(`
				<thead>
	                <tr>
	                    <th scope="col">Funnel</th>
	                    <th scope="col">Brokers</th>
	                    <th scope="col">Limit</th>
	                    <th scope="col" style="width: 120px;text-align:center;">Action</th>
	                </tr>
	            </thead>`);
			for (key in result)
			{		
				let dropElem = `
							<tbody>
								<tr>
									<td colspan="3" class="dropDownButton" data-name="${key}">
							            <a href="${result[key][0].funnel.url}" data-toggle="tooltip" data-placement="bottom" target="_blank" title="${result[key][0].funnel.url}">${result[key][0].funnel.title}</a>
							        </td>
							        <td style="width: 120px;text-align:right;" data-funnel-id="${result[key][0].funnel_id}" data-type="funnel">
			                            <a href="javascript:;" class="add btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon2-add-1"></i>
			                            </a>
			                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
			                                <i class="flaticon-delete"></i>
			                            </a>
							        </td>
						        </tr>
					        </tbody>
					        <tbody class="dropDownWrapper" data-name="${key}" style="display:none"></tbody>`;
				$('#funnel-table').append(dropElem);	        
				$(result[key]).each(function(index,item){
					let brokersList = ``;
					$(item.broker).each(function(brokerIndex,brokerItem){
						brokersList += `<a href="javascript:void(0)" class="badge ${item.type == 0 ? 'badge-info' : 'badge-success'}">${brokerItem.title}</a>`;
					});
					let	template = `
							<tr>
						        ${index == 0 ? `<td rowspan="${result[key].length}"></td>` : `` }
						        <td>
						           ${brokersList}
						        </td>
						        <td>${item.leads_limit}</td>
						        <td style="width: 120px;text-align:right;" data-id="${item.id}" data-type="funnel" data-funnel-id="${item.funnel_id}" >
						            <a href="javascript:;" class="toggle btn btn-sm btn-hover-primary btn-icon ${item.active == 1? 'btn-bg-light btn-text-primary' : 'btn-bg-dark'}">
		                                <i class="flaticon-light ${item.active == 1? '' : 'text-light'}"></i>
		                            </a>
		                            <a href="javascript:;" class="edit btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-edit"></i>
		                            </a>                                
		                            <a href="javascript:;" class="delete btn btn-sm btn-icon btn-bg-light btn-text-primary btn-hover-primary">
		                                <i class="flaticon-delete"></i>
		                            </a>
						        </td>
						    </tr>`;
					$(`#funnel-table .dropDownWrapper[data-name="${key}"]`).append(template);		
				});
			}
		}
	}
	initTables(wrapper);
}
/*
*@param
*/
function initTables(wrapper)
{
	console.log('init',wrapper);
	//Скрытие прелоадера
	$(`#${wrapper}Table .transition-loader`).css('display','none');

	//Раскрытие списков
	$(`#${wrapper}Table .dropDownButton`).off().on('click',function(){
		let name = $(this).attr('data-name'),
			wrapper = $(`.dropDownWrapper[data-name='${name}']`);
		console.log('dropdown');
		if(!wrapper.is(':visible'))
		{
			$(`.dropDownWrapper[data-name='${name}']`).css('display','table-row-group');
		}
		else
		{
			$(`.dropDownWrapper[data-name='${name}']`).css('display','none');
		}		
	});

	//добавление элементов внутрь категории
	$(`#${wrapper}Table a.add`).off().on('click',function(e){
		let	wrapper = $(this).parent().attr('data-type'),
		 	id = $(this).parent().attr(`data-${wrapper}-id`),
		 	item_id = $(this).parent().attr(`data-country-id`);
		console.log('id',item_id);
		pushAppendModal(wrapper,id,item_id);
	});

	//Включение - выключение элементов
	$(`#${wrapper}Table a.toggle`).off().on('click',function(e){
		let	wrapper = $(this).parent().attr('data-type'),
		 	id = $(this).parent().attr(`data-${wrapper}-id`);
		console.log(wrapper,id);
	});

	//Удаление элементов
	$(`#${wrapper}Table a.delete`).off().on('click',function(e){
		let	wrapper = $(this).parent().attr('data-type'),
		 	parentId = $(this).parent().attr(`data-${wrapper}-id`),
		 	elementId = $(this).parent().attr(`data-id`),
		 	request = {};
		if(elementId !== undefined)
		{
			request.element_id = elementId;
		}
		else
		{
			request.parent_id = parentId
		}
		$('#remove-element .modal-body span').text(`this ${wrapper}`);
		$('#remove-element').attr({'data-request':JSON.stringify(request),'data-wrapper':wrapper}).modal('show');
	});

	//Переключение состояния элементов
	$(`#${wrapper}Table a.toggle`).off().on('click',function(e){
		let	wrapper = $(this).parent().attr('data-type'),
		 	parentId = $(this).parent().attr(`data-${wrapper}-id`),
		 	elementId = $(this).parent().attr(`data-id`),
		 	request = {};
		if(elementId !== undefined)
		{
			request.element_id = elementId;
		}
		else
		{
			request.parent_id = parentId
		}
		console.log(request);
		$.ajax({
		    url: `${location.origin}/ajax/${wrapper}-rules/toggle/`,
		    type: 'POST',
		    data: request,
		    success: function(result) {
				getDataList(wrapper,result);
		    }
		});
	});

	//Изменение элементов
	$(`#${wrapper}Table a.edit`).off().on('click',function(e){
		let id = $(this).parent().attr('data-id'),
			wrapper = $(this).parent().attr('data-type');
		$.ajax({
			type:'GET',
			url:`${location.origin}/ajax/${wrapper}-rules/get/`,
			data: { id: id },
			success: (result) => {
				console.log(wrapper,result);
				pushEditModal(result,wrapper);
			}
		});
	});
}
/*
*@param
*/
function getNewModal(wrapper)
{
	let title = ``;
	$(`#modal-${wrapper} #limit input`).val('');
	if(wrapper == 'country')
	{		
		title = `Add Country Settings`;	
		$(`#modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).val(''); 
		
		$(`#modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).attr('multiple','multiple').removeAttr('disabled').select2();
	}
	if(wrapper == 'source')
	{
		title = `Add Source Settings`;
		$(`#modal-${wrapper} #source .select2-int,
		   #modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).val(''); 
		
		$(`#modal-${wrapper} #source .select2-int,
		   #modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).attr('multiple','multiple').removeAttr('disabled').select2();
	}
	if(wrapper == 'funnel')
	{
		title = `Add Funnel Settings`;
		$(`#modal-${wrapper} #funnel .select2-int,
		   #modal-${wrapper} #broker .select2-int`).val(''); 
		
		$(`#modal-${wrapper} #funnel .select2-int,
		   #modal-${wrapper} #broker .select2-int`).attr('multiple','multiple').removeAttr('disabled').select2();
	}	
	$(`#modal-${wrapper} #modalLabel`).text(title);
	$(`#modal-${wrapper}`).attr('data-action','add').modal('show').attr('data-type',wrapper);
	$('body').attr('style','overflow:hidden!important');
	$(`#modal-${wrapper} .transition-loader`).css('display','none');
}
/*
*@param
*/
function pushEditModal(result,wrapper)
{
	let title = ``;
	if(wrapper == 'country')
	{
		title = `Edit Country Settings`;	
		$(`#modal-${wrapper} #country .select2-int`).val(result.country_id).trigger('change'); 
		$(`#modal-${wrapper} #broker .select2-int`).val(result.broker_id).trigger('change');
		//Убрать множ. выбор в селектах
		$(`#modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).select2("enable", false); 
	}
	if(wrapper == 'source')
	{
		title = `Edit Source Settings`;
		$(`#modal-${wrapper} #source .select2-int`).val(result.source_id).trigger('change'); 
		$(`#modal-${wrapper} #country .select2-int`).val(result.country_id).trigger('change'); 
		$(`#modal-${wrapper} #broker .select2-int`).val(result.broker_id).trigger('change'); 
		//Убрать множ. выбор в селектах
		$(`#modal-${wrapper} #source .select2-int,
		   #modal-${wrapper} #country .select2-int,
		   #modal-${wrapper} #broker .select2-int`).select2("enable", false); 
	}
	if(wrapper == 'funnel')
	{
		title = `Edit Funnel Settings`;
		$(`#modal-${wrapper} #funnel .select2-int`).val(result.funnel_id).trigger('change'); 
		$(`#modal-${wrapper} #broker .select2-int`).val(result.broker_id).trigger('change'); 
		//Убрать множ. выбор в селектах
		$(`#modal-${wrapper} #funnel .select2-int,
		   #modal-${wrapper} #broker .select2-int`).select2("enable", false); 
	}

	$(`#modal-${wrapper} #limit input`).val(result.leads_limit);
	$(`#modal-${wrapper} #modalLabel`).text(title);	
	$(`#modal-${wrapper}`).attr('data-action','edit').modal('show').attr('data-type',wrapper);
	$(`#modal-${wrapper} .transition-loader`).css('display','none');	
}
/*
*@param
*/
function pushAppendModal(wrapper,id,item_id)
{
	let title = ``;
	if(wrapper == 'country')
	{
		title = `Add New Settings To Country`;
	}
	if(wrapper == 'source')
	{
		title = `Add New Settings To Source`;
	}
	if(wrapper == 'funnel')
	{
		title = `Add New Settings To Funnel`;
	}
	$(`#modal-${wrapper} .select2-int`).attr('multiple','multiple').removeAttr('disabled').select2();
	
	$(`#modal-${wrapper} .select2-int,
	   #modal-${wrapper} #limit input`).val('').trigger('change'); 	

	$(`#modal-${wrapper} #${wrapper} .select2-int`).val(id).trigger('change');	
	
	if(item_id != undefined)
	{
		$(`#modal-${wrapper} #country .select2-int`).val(item_id).trigger('change');	
		$(`#modal-${wrapper} #country .select2-int`).select2("enable", false); 
	}
	$(`#modal-${wrapper} #${wrapper} .select2-int`).select2("enable", false); 

	$(`#modal-${wrapper} #modalLabel`).text(title);	
	$(`#modal-${wrapper}`).attr('data-action','add').modal('show').attr('data-type',wrapper);
	$(`#modal-${wrapper} .transition-loader`).css('display','none');
}