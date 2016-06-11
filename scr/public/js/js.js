var status = 'noSpecial';
var reqObj = {};

function sendToServer(queryObj) {
    $.ajaxSetup(
    {
        async: false
    });
    $.post('/authProviders',queryObj,function(data) {
//                    console.log(data);
            $('#linie_principala').before('<div class="line">'+data+'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        });
}

$(function(){ // this will be called when the DOM is ready
    $('#command').keyup(function(e) {
    console.log('enter');
    if (e.which==13) {
        var newCommand = $('#command').val();
        console.log(newCommand);
        console.log('Status   ' + status);
        console.log(newCommand.trim().toString() === 'login');
        console.log(status != undefined);

        if (status == 'noSpecial' && newCommand.trim().toString() === 'login') {
            status = 'login';
            console.log('tb sa afisam ceva');
            $('#linie_principala').before('<div class="line">'+ 'Please enter your username.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            return;
        }

        if (status === undefined && newCommand.split(' ').legth == 1 && newCommand.replace(/[ ]/g, '') === 'register') {
            status = 'register';
            return;
        }

        switch (status) {
            case 'noSpecial': console.log('noua comanda');sendToServer({cmd: newCommand}); break;
            case 'login': 
                reqObj = {cmd: 'login', un: newCommand}; 
                status = 'loginPassword'; 
                $('#linie_principala').before('<div class="line">'+ 'Please enter your password.' +'</div>');
                $("html, body").animate({ scrollTop: 10000000000 });
                $("#command").attr('type', 'password'); 
            break;
            case  'loginPassword': 
                status = 'noSpecial';
                reqObj.pw = newCommand; 
                $("#command").attr('type', 'text'); 
                sendToServer(reqObj); 
            break;
        }
        
    }  
    });    
});