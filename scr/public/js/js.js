var status = 'noSpecial';
var reqObj = {};
var newCommand = '';
var newPopUpWindow;
var input = '';



function sendToServer(queryObj) {
    console.log("lalala");
    $.ajaxSetup({
        async: false
    });
    $.post('/authProviders',queryObj,function(data) {
            $('#linie_principala').before('<div class="line">'+data+'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
        }).fail(function(data) {
            if (data.status === 412) {

                newPopUpWindow = window.open(window.location.href + data.responseText, "DescriptiveWindowName",
    "width=420,height=230,resizable,scrollbars=yes,status=1");
               /* if (newPopUpWindow.closed) {
                    console.log('window closed');
                } else {
                    console.log('window open');
                }*/

                var windowInterval = setInterval(checkIfWindowClosed,500);

                function checkIfWindowClosed() {
                    if(newPopUpWindow.closed) {
                        console.log('eventually closed');
                        sendToServer(queryObj);
                        clearInterval(windowInterval);
                    } else {
                        console.log('not closed yet');
                    }
                };
            }
        });
}

function enterPressed() {
    newCommand = input;
    input = '';
    console.log(newCommand);
    console.log('Status   ' + status);
    console.log(newCommand.trim().toString() === 'login');
    console.log(status != undefined);

    if (status == 'noSpecial' && newCommand.trim().toString() === 'login') {
        status = 'login';
        $('#linie_principala').before('<div class="line">'+ 'Please enter your username.' +'</div>');
        $("html, body").animate({ scrollTop: 10000000000 });
        return;
    }

    if (status === 'noSpecial' && newCommand.trim().toString() === 'register') {
        status = 'register';
        $('#linie_principala').before('<div class="line">'+ 'Please enter your username.' +'</div>');
        $("html, body").animate({ scrollTop: 10000000000 });
        return;
    }

    switch (status) {
        case 'noSpecial': console.log('noua comanda');sendToServer({cmd: newCommand}); break;
        case 'login': 
            reqObj = {cmd: 'login', un: newCommand}; 
            status = 'loginPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please enter your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            //$("#command").attr('type', 'password'); 
        break;
        case  'loginPassword': 
            status = 'noSpecial';
            reqObj.pw = newCommand; 
            $("#command").attr('type', 'text'); 
            sendToServer(reqObj); 
        break;
        case 'register':
            console.log('register!!!');
            reqObj = {cmd: 'register', un: newCommand};
            status = 'registerPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please enter your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            //$("#command").attr('type', 'password'); 
        break;
        case 'registerPassword':
            reqObj.pw = newCommand;
            status = 'registerVerifyPassword'; 
            $('#linie_principala').before('<div class="line">'+ 'Please retype your password.' +'</div>');
            $("html, body").animate({ scrollTop: 10000000000 });
            //$("#command").attr('type', 'password');
        break;
        case 'registerVerifyPassword':
            reqObj.vpw = newCommand;
            status = 'noSpecial';
            $("#command").attr('type', 'text');
            sendToServer(reqObj); 
        break;
    }
}
var input = '';

function addToHistory(line, htmlMode) {
    htmlMode = htmlMode || false;
    if (htmlMode) {
        $('#history').append($('<p>').html(line));
    } else {
        $('#history').append($('<p>').text(line));
    }
    while ($('#history').children().length >= bjs.MAX_HISTORY_LINE_COUNT) {
        $('#history p').first().remove();
    }
}

function renderInput() {
    if (status == 'loginPassword' || status == 'registerPassword' || status == 'registerVerifyPassword') {
        var replacedInput = '';
        for (var i = 0; i < input.length; i++) {
            replacedInput = replacedInput + '*';
        }
        $('#input').text(replacedInput);
    } else {
        $('#input').text(input);
    }
}

$(document).on('keypress', function(event) {
    switch (event.which) {
        case 8: input = input.substring(0, input.length - 1); break;
        case 13: enterPressed(); break;
        default: input = input + String.fromCharCode(event.which); break;
    }

    renderInput();
});

$('input').focus(function() {
    console.log('ceva ceva ceva');
    $('#cursor').addClass('blink');
});

$('input').blur(function() {
    $('#cursor').removeClass('blink');
});

$(document).on('click', function() {
    $('input').focus();
});