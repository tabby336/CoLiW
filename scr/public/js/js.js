var status = 'noSpecial';
var reqObj = {};
var newCommand = '';
var newPopUpWindow;
var inputLeft = '';
var inputRigth = '';

var blink = angular.module('blink', [])
    .directive('blink', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope, $element) {
            function showElement() {
                $element.css("display", "inline");
                $timeout(hideElement, 500);
            }

            function hideElement() {
                $element.css("display", "none");
                $timeout(showElement, 500);
            }
            showElement();
        },
        template: '<span ng-transclude></span>',
        replace: true
    };
});

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
    newCommand = inputLeft + inputRigth;
    inputLeft = '';
    inputRigth = '';
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

function linkPressed(cmd) {
    cmd = cmd.trim();
}

var input = '';

function replaceWithStars(input) {
    var replacedInput = '';
    for (var i = 0; i < input.length; i++) {
        replacedInput = replacedInput + '*';
    }   
    return replacedInput;
}

function printCommand() {
    if (status == 'loginPassword' || status == 'registerPassword' || status == 'registerVerifyPassword') {
        var replacedInputLeft = replaceWithStars(inputLeft);
        var replacedInputRigth = replaceWithStars(inputRigth);
        $('#inputLeft').text(replacedInputLeft);
        $('#inputRigth').text(replacedInputRigth);
    } else {
        $('#inputRigth').text(inputRigth);
        $('#inputLeft').text(inputLeft);
    }
}


$(document).on('keypress', function(event) {
    console.log(event);
    switch (event.which) {
        case 0: if (event.key == 'ArrowRight') {
                    if (inputLeft == undefined) {inputLeft = ''};
                    if (inputRigth.length > 0) {
                        inputLeft = inputLeft + inputRigth[0] ; 
                        inputRigth = inputRigth.substring(1, inputRigth.length);
                    }
                } else if (event.key == 'ArrowLeft') { 
                    if (inputRigth == undefined) {inputRigth = ''};
                    if (inputLeft.length > 0) {
                        inputRigth = inputLeft[inputLeft.length - 1] + inputRigth ; 
                        inputLeft = inputLeft.substring(0, inputLeft.length - 1);
                    }
                } break;
        case 8: inputLeft = inputLeft.substring(0, inputLeft.length - 1); break;
        case 13: enterPressed(); break;
        default: 
            if (!event.ctrlKey) {
                inputLeft = inputLeft + String.fromCharCode(event.which); 
            } break;
    }

    printCommand();
});

document.addEventListener("paste", function (e) {
    console.log(e.target.id);
    var pastedText = undefined;
    if (window.clipboardData && window.clipboardData.getData) { // IE
        inputLeft = inputLeft + window.clipboardData.getData('Text');
    } else if (e.clipboardData && e.clipboardData.getData) {
        inputLeft = inputLeft + e.clipboardData.getData('text/plain');
    }
    printCommand();
});

$(document).on('click', function() {
    $('input').focus();
});
