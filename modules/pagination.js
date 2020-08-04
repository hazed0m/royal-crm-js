function paginationInit(pagination)
{
    $('#pageStart').text(pagination.pageStart);
    $('#pageEnd').text(pagination.pageEnd);
    $('#total-leads').text(pagination.total);
	let currentPage = pagination.currentPage;
	$('#nextPag').data('page',pagination.lastPage);
	if(pagination.currentPage === pagination.lastPage)
	{        
        if(currentPage-2 >= 1)
        {
            $('#firstPag').text(currentPage-2).data('page',currentPage-2).css('display','flex');
        }
        else
        {
            $('#firstPag').css('display','none');
        }
        if(currentPage-1 >= 1)
        {
            $('#secondPag').text(currentPage-1).data('page',currentPage-1).css('display','flex');
        }
        else
        {
            $('#secondPag').css('display','none');
        }
		$('#thirdPag, #fourthPag').css('display','none');
		$('#currentPag').text(currentPage).data('page',currentPage);		
	}
	else
	{
		$('#currentPag').text(currentPage).data('page',currentPage);
		if(pagination.currentPage != 1)
		{
			if(currentPage-2 != 0)
			{
				$('#firstPag').text(currentPage-2).data('page',currentPage-2).css('display','flex');
			}
			else
			{
				$('#firstPag').css('display','none');
			}
			$('#secondPag').text(currentPage-1).data('page',currentPage-1).css('display','flex');
			$('#thirdPag').text(currentPage+1).data('page',currentPage+1).css('display','flex');
			$('#fourthPag').text(currentPage+2).data('page',currentPage+2).css('display','flex');
		}
		else
		{
            $('#firstPag, #secondPag').css('display','none');
            if(currentPage+1 <= pagination.lastPage)
            {
                $('#thirdPag').text(currentPage+1).data('page',currentPage+1).css('display','flex');
            }
            else
            {
                $('#thirdPag').css('display','none');
            }
            if(currentPage+2 <= pagination.lastPage)
            {
                $('#fourthPag').text(currentPage+2).data('page',currentPage+2).css('display','flex');
            }
            else
            {
                $('#fourthPag').css('display','none');
            }
		}
	}
}

