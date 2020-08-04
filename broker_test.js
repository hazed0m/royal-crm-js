$(document).ready(function(){

	$('.transition-loader').css('display','none');

	$('#brokerTest').on('click',function(){

		$('#result').slideUp(800); 				

		$('#result .card-body').empty();

		let formDataCountry = $('#country').serializeArray(),

			formDataBroker = $('#broker').serializeArray(),

			formData = [];

		console.log(formDataCountry,formDataBroker);

		if(formDataCountry.length > 0 && formDataBroker.length > 0)

		{

			$(this).addClass('spinner spinner-white spinner-right');

			formData = [...formDataCountry,...formDataBroker];

			console.log(formData);		

			$.ajax({

				type:'POST',

				url:`${location.origin}/ajax/api-settings/test/sendTest`,

				data: formData,

				success: (result) => {
					$(result).each(function(index,item){					

						let status = ``;				

						if(item.response.status == 'error')

						{

		            		status = `<i class="far fa-times-circle" style="color:red;font-size:1.5rem;"></i>`;

						}

						if(item.response.status == 'success')

						{

							status = `<i class="far fa-check-circle" style="color:green;font-size:1.5rem;"></i>`;

						}

						let full_request = item.response.full_request,

							body = item.response.full_request.body,

							response = item.response.full_request.response,

							headers = item.response.full_request.headers,

							headersBody = ``,

							headersList = ``,

							tableHead = ``,

							tableBody = ``,

							fullTable = ``;

						for (header of headers)

						{

							headersBody += `<li>${header}</li>`;

						}

						headersList = `

							<ul>

							    ${headersBody}

							</ul>`;

						for (key in body)

						{						

							tableHead += `<th>${key}</th>`;

							if(key == 'from')

							{

								tableBody += `<th><a href="${body[key]}">${body[key]}</a></th>`;		

							}

							else

							{

								tableBody += `<th>${body[key]}</th>`;						

							}

						}

						fullTable = `

							<div class="table-responsive">

								<table class="table table-bordered table-hover text-nowrap">

								    <thead>

								        <tr>${tableHead}</tr>

								    </thead>

								    <tbody>

								        <tr>${tableBody}</tr>

								    </tbody>

								</table>

							</div>`;
						let tableTemplateBody = `
								<p>

									<span class="font-weight-bold">

										Body: 

									</span>

									${fullTable}

								</p>`;
						let template = `													

							${index > 0 ? '<p style="margin: 20px 0;"></p><hr class="mt-3 mb-3"/><hr class="mt-3 mb-3"/><hr class="mt-3 mb-3"/><p style="margin: 30px 0;"></p>': ''}	

							<div class="result-item">

								<div class="table-responsive">

									<table class="table table-bordered table-hover text-nowrap">

									    <thead>

									        <th>Status</th>

									        <th>Broker</th>

									        <th>Country</th>		

									        <th>Url</th>	

									        <th>Type</th>							        

									    </thead>

									    <tbody>

									        <th align="center">${status}</th>

									        <th>${item.broker}</th>

									        <th><img src="https://www.countryflags.io/${item.country_iso_code}/flat/24.png"/> ${item.country_iso_name}</th>

									    	<th>${full_request.url}</th>	

									        <th>${full_request.type}</th>	

									    </tbody>

									</table>

								</div>					

								<p>

									<span class="font-weight-bold">

										Headers: 					

									</span>

									${headersList}		

								</p>					

								<p>

									<span class="font-weight-bold">

										Response: 															

									</span>

									<div class="table-responsive" style="padding-bottom:0;">

										<table class="table table-bordered table-hover text-nowrap">

										    <thead>

											    <th>Response time</th>

											    <th>Protocol Version</th>

											    <th>Reason Phrase</th>

											    <th>Status Code</th>

										    </thead>

										    <tbody>

											    <th>${item.broker_response_time.toFixed(2)}s</th>

											    <th>${full_request.protocol_version}</th>

											    <th>${full_request.reason_phrase}</th>

											    <th>${full_request.status_code}</th>

										    </tbody>

										</table>

									</div>

								</p>
								<p>
									<span class="font-weight-bold">

										JSON: 															

									</span>
							

						`;

						$('#result .card-body').append(template);

						let data = { 
								'Body': item.response.full_request.body, 
								'Response': item.response.full_request.response
							},
							tree = jsonTree.create(data, $('#result .card-body')[0]);
						tree.collapse();
						$('#result .card-body').append(`</p></div>`);

					});

					$('#brokerTest').removeClass('spinner spinner-white spinner-right');

					$('#result').slideDown(800);

				},

				error: (result) => {

					console.log(result.status);

					$('#brokerTest').removeClass('spinner spinner-white spinner-right');

					$('#result .card-body').text(`${result.status}`);

					$('#result').slideDown(800);

				}



			});

		}

	});

});

								