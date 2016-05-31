$('#command').keyup(function(e) {
	if (e.which==13)//enter 
		{
		$.post('users/command',{command:$('#command').val()},function(data) {
			$('#linie_principala').before('<div class="line">'+data+'</div>');
			$("html, body").animate({ scrollTop: 10000000000 });
		});
		}
});